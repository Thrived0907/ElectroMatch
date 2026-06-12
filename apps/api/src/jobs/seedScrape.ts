/**
 * Seed catalog via scraping. V1: deterministic seed of well-known SKUs.
 * Replace `seedData` with real scrapers per retailer using Playwright/Cheerio.
 */
import { prisma } from "../config/prisma";
import { seedData } from "./seedData";

async function main() {
  for (const brandName of new Set(seedData.map(p => p.brand))) {
    await prisma.brand.upsert({ where: { name: brandName }, update: {}, create: { name: brandName } });
  }
  for (const p of seedData) {
    const brand = await prisma.brand.findUnique({ where: { name: p.brand } });
    if (!brand) continue;
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: { price: p.price, imageUrl: p.imageUrl, description: p.description },
      create: {
        name: p.name, slug: p.slug, brandId: brand.id, category: p.category as any,
        price: p.price, imageUrl: p.imageUrl, description: p.description,
        rating: p.rating ?? 4.2, ratingCount: 50,
        valueScore: 0.8, futureProofScore: 0.7,
      },
    });
    await prisma.specification.deleteMany({ where: { productId: product.id } });
    await prisma.specification.createMany({
      data: Object.entries(p.specs).map(([key, value]) => ({ productId: product.id, key, value: String(value) })),
    });
    await prisma.priceHistory.create({ data: { productId: product.id, price: p.price, source: "seed" } });
  }
  console.log("Seed complete:", seedData.length, "products");
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
