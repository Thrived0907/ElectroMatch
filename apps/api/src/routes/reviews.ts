import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { ReviewInput } from "@electromatch/shared";
import { prisma } from "../config/prisma";

const r = Router();

r.get("/product/:productId", async (req, res, next) => {
  try {
    const items = await prisma.review.findMany({ where: { productId: req.params.productId, approved: true }, orderBy: { createdAt: "desc" }, take: 50 });
    res.json({ items });
  } catch (e) { next(e); }
});

r.post("/", requireAuth, async (req, res, next) => {
  try {
    const input = ReviewInput.parse(req.body);
    const review = await prisma.review.upsert({
      where: { userId_productId: { userId: (req as any).user.id, productId: input.productId } },
      create: { ...input, userId: (req as any).user.id }, update: { rating: input.rating, body: input.body },
    });
    // Recompute aggregate
    const agg = await prisma.review.aggregate({ _avg: { rating: true }, _count: true, where: { productId: input.productId, approved: true } });
    await prisma.product.update({ where: { id: input.productId }, data: { rating: agg._avg.rating ?? 0, ratingCount: agg._count } });
    res.json(review);
  } catch (e) { next(e); }
});

export default r;
