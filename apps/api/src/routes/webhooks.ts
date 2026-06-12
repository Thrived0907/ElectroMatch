import { Router } from "express";
import { Webhook } from "svix";
import { prisma } from "../config/prisma";
import express from "express";

const r = Router();
// Raw body needed for Svix signature
r.post("/clerk", express.raw({ type: "application/json" }), async (req, res) => {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) return res.status(500).end();
  try {
    const wh = new Webhook(secret);
    const evt = wh.verify(req.body as Buffer, req.headers as any) as any;
    if (evt.type === "user.created" || evt.type === "user.updated") {
      const u = evt.data;
      await prisma.user.upsert({
        where: { clerkId: u.id },
        create: { clerkId: u.id, email: u.email_addresses?.[0]?.email_address ?? `${u.id}@placeholder.local`, name: u.first_name },
        update: { email: u.email_addresses?.[0]?.email_address, name: u.first_name },
      });
    }
    if (evt.type === "user.deleted") await prisma.user.deleteMany({ where: { clerkId: evt.data.id } });
    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: "Invalid signature" });
  }
});
export default r;
