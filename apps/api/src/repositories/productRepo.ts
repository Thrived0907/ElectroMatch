import { prisma } from "../config/prisma";
import { Category } from "@prisma/client";

export const productRepo = {
  list(opts: { category?: Category; minPrice?: number; maxPrice?: number; brand?: string; page?: number; pageSize?: number }) {
    const page = opts.page ?? 1; const size = opts.pageSize ?? 24;
    return prisma.product.findMany({
      where: {
        category: opts.category,
        price: { gte: opts.minPrice ?? 0, lte: opts.maxPrice ?? 99_99_999 },
        brand: opts.brand ? { name: { equals: opts.brand, mode: "insensitive" } } : undefined,
      },
      include: { brand: true, specs: true },
      skip: (page - 1) * size, take: size,
      orderBy: [{ rating: "desc" }],
    });
  },
  byId(id: string) {
    return prisma.product.findUnique({ where: { id }, include: { brand: true, specs: true, priceHistory: { orderBy: { recordedAt: "desc" }, take: 60 } } });
  },
  byIds(ids: string[]) {
    return prisma.product.findMany({ where: { id: { in: ids } }, include: { brand: true, specs: true } });
  },
  similar(id: string, take = 6) {
    return prisma.$queryRawUnsafe(`
      SELECT p.* FROM "Product" p
      WHERE p."category" = (SELECT "category" FROM "Product" WHERE id = $1)
        AND p.id <> $1
      ORDER BY ABS(p.price - (SELECT price FROM "Product" WHERE id = $1)) ASC
      LIMIT ${take}`, id);
  },
};
