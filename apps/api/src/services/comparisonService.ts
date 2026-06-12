import { openai, MODEL } from "../config/openai";
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
      'You are an electronics comparison expert. Compare these products and return JSON: {winnerOverall, bestValue, bestPerformance, bestBattery, bestCamera, bestDisplay, bestLongTerm, pros: {productId: [..]}, cons: {productId: [..]}, verdict: "1-paragraph summary"}.';

    const user = products
      .map(
        (p) =>
          `Product ${p.id}: ${p.brand.name} ${p.name} (₹${p.price}) — ${p.specs
            .map((s) => `${s.key}:${s.value}`)
            .join("; ")}`
      )
      .join("\n\n");

    const resp = await openai.chat.completions.create({
      model: MODEL,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user },
      ],
    });

    const ai = JSON.parse(
      resp.choices[0]?.message?.content ?? "{}"
    );

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