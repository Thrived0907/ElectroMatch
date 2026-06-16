import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import * as Sentry from "@sentry/node";
import { clerkMiddleware } from "@clerk/express";
import { logger } from "./config/logger";
import { errorHandler } from "./middlewares/errorHandler";
import { routes } from "./routes";

if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
}

const app = express();

app.use(helmet());
app.use(compression());

app.use(
  cors({
    origin: process.env.WEB_ORIGIN?.split(",") ?? true,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

app.use(
  rateLimit({
    windowMs: 60_000,
    max: 120,
    standardHeaders: true,
  })
);

app.use(clerkMiddleware());

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    ts: Date.now(),
  });
});

app.use("/v1", routes);

app.use(errorHandler);

const port = Number(process.env.PORT ?? 4000);

app.listen(port, () => {
  logger.info({ port }, "API listening");
});