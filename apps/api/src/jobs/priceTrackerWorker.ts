/**
 * Cron worker: refresh prices, write PriceHistory, dispatch alerts.
 * Run via: tsx src/jobs/priceTrackerWorker.ts  (or schedule with BullMQ)
 */
import { prisma } from "../config/prisma";
import nodemailer from "nodemailer";

async function refreshOnce() {
  const products = await prisma.product.findMany({ select: { id: true, price: true, name: true } });
  for (const p of products) {
    // TODO: replace with real scraper per source (Amazon/Flipkart/Croma)
    const newPrice = p.price; // no change in this stub
    await prisma.priceHistory.create({ data: { productId: p.id, price: newPrice, source: "stub" } });
    const alerts = await prisma.priceAlert.findMany({
      where: { productId: p.id, active: true, threshold: { gte: newPrice } },
      include: { user: true },
    });
    if (alerts.length && process.env.SMTP_URL) {
      const tx = nodemailer.createTransport(process.env.SMTP_URL);
      for (const a of alerts) {
        await tx.sendMail({
          from: "alerts@electromatch.ai",
          to: a.user.email,
          subject: `Price drop: ${p.name} now ₹${newPrice}`,
          text: `Your alert at ₹${a.threshold} for ${p.name} hit. Current price: ₹${newPrice}.`,
        });
        await prisma.priceAlert.update({ where: { id: a.id }, data: { active: false } });
      }
    }
  }
}
refreshOnce().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
