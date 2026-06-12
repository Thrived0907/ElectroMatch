# System Architecture

```
┌─────────────┐      ┌────────────────────────────┐
│  Browser    │◄────►│ Next.js 15 (Vercel Edge)   │
│  React 19   │      │  - App Router (RSC)        │
└─────────────┘      │  - Clerk auth              │
                     │  - Shadcn UI               │
                     └────────────┬───────────────┘
                                  │ REST + JWT
                                  ▼
                     ┌────────────────────────────┐
                     │ Express API (Railway)      │
                     │  - Controllers/Services/   │
                     │    Repositories            │
                     │  - Zod validation          │
                     │  - Helmet + Rate limit     │
                     └─┬───────┬───────┬──────────┘
                       │       │       │
              ┌────────┘  ┌────┘  ┌────┴─────┐
              ▼           ▼       ▼          ▼
        ┌──────────┐ ┌────────┐ ┌──────┐ ┌────────────┐
        │ Postgres │ │ Redis  │ │  ES  │ │  OpenAI    │
        │ Prisma   │ │ cache  │ │ srch │ │ GPT-4o-mini│
        └──────────┘ └────────┘ └──────┘ └────────────┘
                                              ▲
                                              │
                     ┌────────────────────────┴───┐
                     │ Cron (BullMQ on Redis)     │
                     │  - Price scraper           │
                     │  - Trending recompute      │
                     │  - Alert dispatcher        │
                     └────────────────────────────┘
```

## Recommendation Engine — 3 Layers

1. **Rule-based filter** — `WHERE price BETWEEN min AND max AND category=...`
2. **AI ranker** — score = 0.4·specMatch + 0.25·reviewScore + 0.2·priceValue + 0.15·brandTrust. Personalization boost from user history (collaborative signal).
3. **AI explainer** — GPT-4o-mini, deterministic prompt, returns 2-line rationale per product.

## Search Strategy
- Keyword & filters → Postgres
- Semantic ("best for video editing") → Elasticsearch BM25 + custom analyzers on spec text
- Vector option → embed product summaries with `text-embedding-3-small`, store in `pgvector`

## Observability
Sentry (errors), PostHog (product analytics), pino (structured logs).
