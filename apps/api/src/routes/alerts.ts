import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { PriceAlertInput } from "@electromatch/shared";
import { prisma } from "../config/prisma";

const r = Router();
r.use(requireAuth);

r.get("/", async (req, res, next) => {
  try {
    res.json({ items: await prisma.priceAlert.findMany({ where: { userId: (req as any).user.id, active: true }, include: { product: true } }) });
  } catch (e) { next(e); }
});

r.post("/", async (req, res, next) => {
  try {
    const input = PriceAlertInput.parse(req.body);
    res.json(await prisma.priceAlert.create({ data: { ...input, userId: (req as any).user.id } }));
  } catch (e) { next(e); }
});

r.delete("/:id", async (req, res, next) => {
  try {
    await prisma.priceAlert.updateMany({ where: { id: req.params.id, userId: (req as any).user.id }, data: { active: false } });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default r;
