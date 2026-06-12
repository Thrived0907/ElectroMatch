# CI/CD — GitHub Actions

`.github/workflows/ci.yml` runs on every PR:
1. Install (pnpm, cache)
2. Typecheck both apps
3. Lint
4. Unit tests (vitest)
5. E2E (playwright, web only)
6. Prisma migrate dry-run

`.github/workflows/deploy.yml` on `main`:
1. Deploy web → Vercel (vercel CLI)
2. Deploy api → Railway (railway CLI)
3. Run `prisma migrate deploy`
4. Smoke test `/health`
