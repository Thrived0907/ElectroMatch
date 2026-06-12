import { Router } from "express";
import { CompareInput } from "@electromatch/shared";
import { comparisonService } from "../services/comparisonService";


const r = Router();
r.post("/", async (req, res, next) => {
  try {
    const { productIds } = CompareInput.parse(req.body);
    
    res.json(await comparisonService.compare(productIds));
  } catch (e) { next(e); }
});
export default r;
