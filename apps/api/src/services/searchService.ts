import { es, PRODUCT_INDEX } from "../config/elastic";
import { prisma } from "../config/prisma";

export const searchService = {
  async ensureIndex() {
    const exists = await es.indices.exists({ index: PRODUCT_INDEX });
    if (!exists) {
      await es.indices.create({
        index: PRODUCT_INDEX,
        mappings: {
          properties: {
            name: { type: "text" },
            brand: { type: "keyword" },
            category: { type: "keyword" },
            price: { type: "integer" },
            description: { type: "text" },
            specs: { type: "text" },
            rating: { type: "float" },
          },
        },
      });
    }
  },
  async indexAll() {
    await this.ensureIndex();
    const products = await prisma.product.findMany({ include: { brand: true, specs: true } });
    const body = products.flatMap((p) => [
      { index: { _index: PRODUCT_INDEX, _id: p.id } },
      {
        name: p.name, brand: p.brand.name, category: p.category, price: p.price,
        description: p.description, rating: p.rating,
        specs: p.specs.map(s => `${s.key}: ${s.value}`).join(". "),
      },
    ]);
    if (body.length) await es.bulk({ refresh: true, operations: body });
  },
  async search(q: string, filters: { category?: string; minPrice?: number; maxPrice?: number; brand?: string } = {}) {
    await this.ensureIndex();
    const must: any[] = [];
    if (q) must.push({ multi_match: { query: q, fields: ["name^3", "description", "specs", "brand^2"] } });
    const filter: any[] = [];
    if (filters.category) filter.push({ term: { category: filters.category } });
    if (filters.brand) filter.push({ term: { brand: filters.brand } });
    if (filters.minPrice || filters.maxPrice) filter.push({ range: { price: { gte: filters.minPrice ?? 0, lte: filters.maxPrice ?? 99_99_999 } } });

    const res = await es.search({
      index: PRODUCT_INDEX,
      query: { bool: { must, filter } },
      size: 50,
    });
    return res.hits.hits.map((h) => ({ id: h._id, score: h._score, ...(h._source as object) }));
  },
};
