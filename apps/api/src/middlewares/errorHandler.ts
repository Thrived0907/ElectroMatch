import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../config/logger";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: "ValidationError", details: err.flatten() });
  }
  const e = err as { status?: number; message?: string };
  logger.error({ err: e }, "unhandled");
  res.status(e.status ?? 500).json({ error: e.message ?? "InternalServerError" });
}
