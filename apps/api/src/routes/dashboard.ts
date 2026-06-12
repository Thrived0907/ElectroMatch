import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { prisma } from "../config/prisma";

const r = Router();
r.use(requireAuth);

r.get("/", async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    const [wishlist, recs, comparisons, alerts, searches] = await Promise.all([
      prisma.wishlist.findMany({ where: { userId }, include: { product: true }, take: 20 }),
      prisma.recommendation.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 10 }),
      prisma.comparison.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 10 }),
      prisma.priceAlert.findMany({ where: { userId, active: true }, include: { product: true } }),
      prisma.searchHistory.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20 }),
    ]);
    res.json({ wishlist, recs, comparisons, alerts, searches });
  } catch (e) { next(e); }
});

export default r;
