import { Router } from "express";
import { RecommendInput, NlpRecommendInput } from "@electromatch/shared";
import { recommendationService } from "../services/recommendationService";

const r = Router();

r.post("/", async (req, res, next) => {
  try {
    const input = RecommendInput.parse(req.body);
    const result = await recommendationService.run(input);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

r.post("/nlp", async (req, res, next) => {
  try {
    const { query } = NlpRecommendInput.parse(req.body);
    const parsed = await recommendationService.parseNlp(query);
    const input = RecommendInput.parse(parsed);

    const result = await recommendationService.run(input);

    res.json({
      ...result,
      parsedQuery: parsed,
    });
  } catch (e) {
    next(e);
  }
});

r.get("/history", async (_req, res) => {
  res.json({ items: [] });
});

export default r;