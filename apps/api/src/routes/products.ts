import { Router } from "express";
import { productRepo } from "../repositories/productRepo";
import { prisma } from "../config/prisma";
import { Category } from "@prisma/client";

const r = Router();
r.get("/", async (req, res, next) => {
  try {
    const items = await productRepo.list({
      category: req.query.category as Category | undefined,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      brand: req.query.brand as string | undefined,
      page: req.query.page ? Number(req.query.page) : 1,
    });
    res.json({ items });
  } catch (e) { next(e); }
});

r.get("/:id", async (req, res, next) => {
  try {
    const p = await productRepo.byId(req.params.id);
    if (!p) return res.status(404).json({ error: "Not found" });
    // Track view (best-effort)
    prisma.productView.create({ data: { productId: p.id } }).catch(() => {});
    res.json(p);
  } catch (e) { next(e); }
});

r.get("/:id/similar", async (req, res, next) => {
  try { res.json({ items: await productRepo.similar(req.params.id) }); } catch (e) { next(e); }
});

r.get("/:id/price-history", async (req, res, next) => {
  try {
    const items = await prisma.priceHistory.findMany({
      where: { productId: req.params.id }, orderBy: { recordedAt: "asc" }, take: 180,
    });
    res.json({ items });
  } catch (e) { next(e); }
});

export default r;
