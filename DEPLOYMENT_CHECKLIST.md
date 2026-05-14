# Pulse — Deployment Checklist

Run through each item before and after deploying to Vercel.

## Pre-deployment (local)

- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] `npm run build` passes with zero errors
- [ ] `npx tsx scripts/test-ai-provider.ts` — all tests pass
- [ ] `npx tsx scripts/smoke-test-core-loop.ts` — all tests pass
- [ ] `.env` exists with local `DATABASE_URL` and `AI_PROVIDER=mock`
- [ ] `.env.example` is committed and up to date
- [ ] `.env` is listed in `.gitignore` (NOT committed)
- [ ] `prisma generate` runs successfully (or `npm install` which triggers postinstall)
- [ ] `prisma db push` succeeds against local SQLite

## Database — production

- [ ] Postgres database provisioned (Neon / Supabase / Vercel Postgres)
- [ ] Connection string copied (format: `postgresql://user:pass@host:5432/db?sslmode=require`)
- [ ] `prisma/schema.prisma` provider changed from `sqlite` to `postgresql`
- [ ] Prisma client regenerated locally: `npx prisma generate`
- [ ] Schema pushed to production database: `npx prisma db push`
  - Or: `npx prisma migrate dev --name init` + `npx prisma migrate deploy`

## Vercel environment variables

Set these in **Vercel dashboard → Settings → Environment Variables** (or via `vercel env add`):

| Key | Value | Environment |
|-----|-------|-------------|
| `DATABASE_URL` | Postgres connection string | Production, Preview |
| `AI_PROVIDER` | `mock` | Production, Preview |

Optional (if using real OpenAI later):

| Key | Value | Environment |
|-----|-------|-------------|
| `OPENAI_API_KEY` | `sk-...` | Production, Preview |

## Vercel deploy

- [ ] Code pushed to GitHub repository
- [ ] GitHub repo imported into Vercel
- [ ] Framework preset: **Next.js**
- [ ] Build command: `npm run build` (default)
- [ ] Output directory: `.next` (default)
- [ ] Install command: `npm install` (default, triggers `postinstall` → `prisma generate`)
- [ ] Environment variables confirmed in Vercel dashboard
- [ ] Deploy triggered

## Post-deployment smoke test

After deploy completes, verify on the production URL:

- [ ] Landing page loads at production URL
- [ ] `/onboarding` loads and can complete onboarding
- [ ] `/dashboard` loads and shows empty state (or WAI counter)
- [ ] `/tasks/new` — can create a task
- [ ] Task appears on dashboard with "I'm stuck" button
- [ ] Click "I'm stuck" → stuck mode loads
- [ ] Generate step → AI returns a tiny next action
- [ ] Click "Start" → intervention logged
- [ ] `/interventions` — shows the logged intervention
- [ ] `/summary` — shows weekly stats
- [ ] `/settings` — loads and can save changes
- [ ] No console errors on any page
- [ ] API routes return valid JSON (check Network tab)

## Known production limitations

- **Single mock user** — no auth. Multiple real users would share the same `mock-user-001` record. Production use requires adding an auth system.
- **Mock AI only** — `AI_PROVIDER=mock` returns deterministic responses. Set `AI_PROVIDER=openai` and `OPENAI_API_KEY` for real AI.
- **No HTTPS enforcement for API routes** — Vercel provides HTTPS automatically.
- **No rate limiting** — API routes have no rate limiting. Add if exposed publicly.
- **No monitoring or error tracking** — add Sentry, Logtail, or Vercel Analytics for production.
- **SQLite-specific Prisma features** — some queries or migrations may behave differently on Postgres. Test locally with Postgres before deploying.
- **Cold starts** — serverless functions on free tier may have 1–2 second cold starts.

## Rollback

If something breaks after deploy:

1. **Revert the Prisma provider** back to `sqlite` in `prisma/schema.prisma`
2. **Revert `DATABASE_URL`** back to `file:./dev.db`
3. Redeploy the previous commit, or use Vercel's instant rollback
4. Local dev environment is fully self-contained and unaffected
