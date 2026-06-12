# ElectroMatch AI

AI-powered Electronics Recommendation Platform for the Indian market (₹).
Helps users discover the best laptops, smartphones, tablets, smartwatches, headphones, monitors, keyboards, mice and more — based on budget, usage, and preferences.

## Monorepo Layout

```
electromatch-ai/
├── apps/
│   ├── web/         # Next.js 15 App Router + React 19 + Tailwind + Shadcn
│   └── api/         # Express + TypeScript + Prisma + OpenAI + Redis + Elasticsearch
├── packages/
│   └── shared/      # Shared Zod schemas + TS types
├── docs/            # PRD, architecture, deployment, CI/CD
├── docker-compose.yml
└── README.md
```

## Quick Start

```bash
# 1. Install
cd apps/web && pnpm install
cd ../api && pnpm install

# 2. Start infra (Postgres + Redis + Elasticsearch)
docker compose up -d

# 3. Configure env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# 4. DB
cd apps/api && pnpm prisma migrate dev && pnpm seed:scrape

# 5. Run
cd apps/api && pnpm dev   # http://localhost:4000
cd apps/web && pnpm dev   # http://localhost:3000
```

## Docs
- [Product Requirements (PRD)](docs/PRD.md)
- [System Architecture](docs/ARCHITECTURE.md)
- [Database Design](docs/DATABASE.md)
- [API Reference](docs/API.md)
- [Deployment](docs/DEPLOYMENT.md)
- [CI/CD](docs/CICD.md)
- [Future Enhancements](docs/ROADMAP.md)

## Stack
Frontend: Next.js 15, React 19, TS, Tailwind, Shadcn/UI, RHF + Zod, Recharts, Framer Motion, Clerk
Backend: Node + Express + TS, Prisma + PostgreSQL, Redis, Elasticsearch, OpenAI, Cloudinary
Infra: Vercel (web) + Railway/Render (api), Sentry, PostHog

## License
MIT
