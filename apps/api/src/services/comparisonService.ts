import { groq, MODEL } from "../config/openai";
import { productRepo } from "../repositories/productRepo";
import { prisma } from "../config/prisma";

export const comparisonService = {
  async compare(productIds: string[], userId?: string) {
    const products = await productRepo.byIds(productIds);

    if (products.length < 2) {
      throw Object.assign(new Error("Need 2+ products"), {
        status: 400,
      });
    }

    const sys =
      'You are an electronics comparison expert. Compare these products and return ONLY valid JSON with this shape: {"winnerOverall":"","bestValue":"","bestPerformance":"","bestBattery":"","bestCamera":"","bestDisplay":"","bestLongTerm":"","pros":{},"cons":{},"verdict":""}';

    const user = products
      .map(
        (p) =>
          `Product ${p.id}: ${p.brand.name} ${p.name} (₹${p.price}) — ${p.specs
            .map((s) => `${s.key}:${s.value}`)
            .join("; ")}`
      )
      .join("\n\n");

    const resp = await groq.chat.completions.create({
      model: MODEL,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: sys,
        },
        {
          role: "user",
          content: user,
        },
      ],
    });

    let ai: any = {};

    try {
      ai = JSON.parse(
        resp.choices[0]?.message?.content ?? "{}"
      );
    } catch {
      ai = {
        verdict:
          resp.choices[0]?.message?.content ??
          "Comparison generated.",
      };
    }

    await prisma.comparison.create({
      data: {
        userId,
        productIds,
        summary: ai.verdict ?? null,
      },
    });

    return {
      products,
      ai,
    };
  },
};