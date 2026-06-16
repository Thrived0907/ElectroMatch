import crypto from "crypto";
import { prisma } from "../config/prisma";
import { groq, MODEL } from "../config/openai";
import { redis } from "../config/redis";
import { RecommendInput } from "@electromatch/shared";
import type { Category, Product, Specification, Brand } from "@prisma/client";

type ProductWithRel = Product & {
  specs: Specification[];
  brand: Brand;
};

const WEIGHTS = {
  spec: 0.4,
  review: 0.25,
  price: 0.2,
  brand: 0.15,
};

const TRUSTED_BRANDS = new Set([
  "Apple",
  "Dell",
  "Lenovo",
  "HP",
  "Asus",
  "Samsung",
  "Sony",
  "Bose",
  "OnePlus",
  "Google",
  "Microsoft",
]);

export class RecommendationService {
  async run(input: RecommendInput, userId?: string) {
    const cacheKey = `rec:${JSON.stringify(input)}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const candidates = await prisma.product.findMany({
      where: {
        category: input.category as Category,
        price: {
          gte: input.budgetMin,
          lte: input.budgetMax,
        },
      },
      include: {
        specs: true,
        brand: true,
      },
      take: 80,
    });

    const scored = candidates
      .map((p) => {
        const specMatch = this.specMatchScore(
          p,
          input.usage,
          input.preferences
        );

        const reviewScore = (p.rating || 0) / 5;

        const priceValue =
          1 -
          (p.price - input.budgetMin) /
            Math.max(1, input.budgetMax - input.budgetMin);

        const brandTrust = TRUSTED_BRANDS.has(p.brand.name) ? 1 : 0.6;

        const score =
          WEIGHTS.spec * specMatch +
          WEIGHTS.review * reviewScore +
          WEIGHTS.price * priceValue +
          WEIGHTS.brand * brandTrust;

        return {
          product: p,
          score,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    const explanations = await this.explain(
      scored.map((s) => s.product),
      input
    );

    const result = {
      runId: crypto.randomUUID(),
      products: scored.map((s, i) => ({
        id: s.product.id,
        name: s.product.name,
        brand: s.product.brand.name,
        category: s.product.category,
        price: s.product.price,
        imageUrl: s.product.imageUrl,
        matchScore: Math.round(s.score * 100),
        aiExplanation: explanations[i],
        specs: Object.fromEntries(
          s.product.specs.map((sp) => [sp.key, sp.value])
        ),
      })),
    };

    await prisma.recommendation.create({
      data: {
        userId,
        input: input as any,
        outputIds: result.products.map((p) => p.id),
        scores: scored.map((s) => s.score) as any,
      },
    });

    await redis.setex(cacheKey, 600, JSON.stringify(result));

    return result;
  }

  private specMatchScore(
    p: ProductWithRel,
    usage: string[],
    prefs: string[]
  ) {
    const text = (
      p.description +
      " " +
      p.specs.map((s) => `${s.key}:${s.value}`).join(" ")
    ).toLowerCase();

    const tokens = [...usage, ...prefs].map((t) => t.toLowerCase());

    const hits = tokens.filter((t) => text.includes(t)).length;

    return Math.min(1, hits / Math.max(1, tokens.length));
  }

  private async explain(
    products: ProductWithRel[],
    input: RecommendInput
  ): Promise<string[]> {
    const sys =
      "You are an electronics buying advisor for Indian consumers. Give a 2-sentence explanation in plain English why each product fits the user. Mention 1 spec and 1 use-case. Return ONLY valid JSON.";

    const productList = products
      .map(
        (p, i) =>
          `${i + 1}. ${p.brand.name} ${p.name} (₹${p.price}) — ${p.specs
            .slice(0, 5)
            .map((s) => `${s.key}:${s.value}`)
            .join(", ")}`
      )
      .join("\n");

    const user = `User needs:
category=${input.category}
budget=₹${input.budgetMin}-${input.budgetMax}
usage=${input.usage.join(", ")}
prefs=${input.preferences.join(", ")}

Products:
${productList}

Return ONLY:
{"explanations":["...","..."]}`;

    try {
      const resp = await groq.chat.completions.create({
        model: MODEL,
        temperature: 0.3,
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

      const content =
        resp.choices[0]?.message?.content ?? "{}";

      const json = JSON.parse(content);

      return (
        json.explanations ??
        products.map(() => "Good match for your needs.")
      );
    } catch {
      return products.map(
        () => "Strong fit based on your specs and budget."
      );
    }
  }

  async parseNlp(query: string) {
    const sys =
      'Extract structured electronics shopping intent. Return ONLY JSON: {"category":"","budgetMin":0,"budgetMax":0,"usage":[],"preferences":[]}. Category must be one of LAPTOP,SMARTPHONE,TABLET,SMARTWATCH,HEADPHONES,MONITOR,KEYBOARD,MOUSE,OTHER. Budget in INR.';

    const resp = await groq.chat.completions.create({
      model: MODEL,
      temperature: 0,
      messages: [
        {
          role: "system",
          content: sys,
        },
        {
          role: "user",
          content: query,
        },
      ],
    });

    const content =
      resp.choices[0]?.message?.content ?? "{}";

    return JSON.parse(content);
  }
}

export const recommendationService =
  new RecommendationService();