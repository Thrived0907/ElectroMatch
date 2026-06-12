import { Router } from "express";
import { requireAuth, requireAdmin } from "../middlewares/requireAuth";
import { prisma } from "../config/prisma";

const r = Router();
r.use(requireAuth, requireAdmin);

r.get("/stats", async (_req, res, next) => {
  try {
    const [users, products, recs, comps, reviewsPending] = await Promise.all([
      prisma.user.count(), prisma.product.count(), prisma.recommendation.count(),
      prisma.comparison.count(), prisma.review.count({ where: { approved: false } }),
    ]);
    res.json({ users, products, recs, comps, reviewsPending });
  } catch (e) { next(e); }
});

// Products CRUD
r.get("/products", async (_req, res, next) => {
  try { res.json({ items: await prisma.product.findMany({ include: { brand: true }, take: 200 }) }); } catch (e) { next(e); }
});
r.post("/products", async (req, res, next) => {
  try { res.json(await prisma.product.create({ data: req.body })); } catch (e) { next(e); }
});
r.patch("/products/:id", async (req, res, next) => {
  try { res.json(await prisma.product.update({ where: { id: req.params.id }, data: req.body })); } catch (e) { next(e); }
});
r.delete("/products/:id", async (req, res, next) => {
  try { await prisma.product.delete({ where: { id: req.params.id } }); res.json({ ok: true }); } catch (e) { next(e); }
});

// Review moderation
r.post("/reviews/:id/moderate", async (req, res, next) => {
  try {
    const { approved } = req.body as { approved: boolean };
    res.json(await prisma.review.update({ where: { id: req.params.id }, data: { approved } }));
  } catch (e) { next(e); }
});

export default r;
