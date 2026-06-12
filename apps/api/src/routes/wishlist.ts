import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { WishlistInput } from "@electromatch/shared";
import { prisma } from "../config/prisma";

const r = Router();
r.use(requireAuth);

r.get("/", async (req, res, next) => {
  try {
    const items = await prisma.wishlist.findMany({
      where: { userId: (req as any).user.id },
      include: { product: { include: { brand: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({ items });
  } catch (e) { next(e); }
});

r.post("/", async (req, res, next) => {
  try {
    const { productId } = WishlistInput.parse(req.body);
    const item = await prisma.wishlist.upsert({
      where: { userId_productId: { userId: (req as any).user.id, productId } },
      create: { userId: (req as any).user.id, productId }, update: {},
    });
    res.json(item);
  } catch (e) { next(e); }
});

r.delete("/:productId", async (req, res, next) => {
  try {
    await prisma.wishlist.deleteMany({ where: { userId: (req as any).user.id, productId: req.params.productId } });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default r;
