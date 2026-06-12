import { describe, it, expect } from "vitest";
import { RecommendInput } from "@electromatch/shared";

describe("RecommendInput", () => {
  it("validates", () => {
    const r = RecommendInput.safeParse({ category: "LAPTOP", budgetMin: 0, budgetMax: 80000, usage: ["Programming"] });
    expect(r.success).toBe(true);
  });
});
