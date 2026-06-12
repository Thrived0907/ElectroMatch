import { Router } from "express";
import { searchService } from "../services/searchService";
import { prisma } from "../config/prisma";

const r = Router();

r.get("/", async (req, res, next) => {
  try {
    const q = (req.query.q as string) ?? "";

    const filters = {
      category: req.query.category as string | undefined,
      brand: req.query.brand as string | undefined,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    };

    const items = await searchService.search(q, filters);

    prisma.searchHistory.create({
      data: {
        query: q,
        filters: filters as any,
      },
    }).catch(() => {});

    res.json({ items });
  } catch (e) {
    next(e);
  }
});

export default r;