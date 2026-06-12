# Deployment

## Web → Vercel
1. Import `apps/web` to Vercel
2. Env: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_POSTHOG_KEY`, `SENTRY_DSN`
3. Build: `pnpm build`  Output: `.next`

## API → Railway (or Render)
1. New service from `apps/api`
2. Add Postgres, Redis, Elasticsearch plugins (or external)
3. Env: see `apps/api/.env.example`
4. Run on push: `pnpm prisma migrate deploy && node dist/index.js`

## DNS
- `electromatch.ai` → Vercel
- `api.electromatch.ai` → Railway
