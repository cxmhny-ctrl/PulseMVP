# Pulse — Web MVP

ADHD stuck-to-action companion. No complex planning. No shame. The next tiny step.

**Build status:** Phase 1 Web MVP

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database (dev) | SQLite via Prisma |
| Database (prod) | PostgreSQL (Neon / Supabase / Vercel Postgres) |
| Styling | Tailwind CSS |
| AI | Mock provider + template fallback (no API keys required) |

## Local setup

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)**.

## Useful scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build |
| `npx tsc --noEmit` | TypeScript type check |
| `npx tsx scripts/test-ai-provider.ts` | Run AI provider unit tests |
| `npx tsx scripts/smoke-test-core-loop.ts` | Run full vertical slice test |
| `npx tsx scripts/reset-demo-data.ts` | Clear and reseed demo data |
| `npx tsx scripts/capture-screenshots.ts` | Capture design-review screenshots |

## Design screenshot capture

1. Run `npm run dev` in one terminal
2. In another terminal run `npx tsx scripts/capture-screenshots.ts`
3. Open the `screenshots/` folder

Screenshots are captured at 1440x1000 viewport for:
- `/` (landing page)
- `/dashboard`
- `/tasks/new`
- `/stuck/[taskId]` (auto-creates a task if needed)
- `/summary`
- `/interventions`
- `/settings`

Requires `@playwright/test` and Chromium browser (`npx playwright install chromium`).

## Demo flow

1. Open landing page → click **Set up Pulse**
2. Complete 5-step onboarding (style, sensitivity, quiet hours, first task)
3. Arrive at dashboard → see your task with **I'm stuck** button
4. Click **I'm stuck** → enter stuck description or pick friction type
5. Click **Find my next step** → AI generates a tiny next action
6. Click **Start** → intervention logged, "Starting a 2-minute pulse."
7. Click **Back to dashboard**
8. Nav to **History** → see logged intervention
9. Nav to **Summary** → see weekly stats (WAI, top friction, best channel)

## Acceptance criteria

- [x] User opens app and sees landing page
- [x] User completes onboarding
- [x] User creates a task
- [x] User sees task on dashboard with "I'm stuck" button
- [x] User triggers Stuck Mode
- [x] System generates one tiny next action (under 2 minutes)
- [x] User can mark action as started
- [x] System logs a successful intervention
- [x] Weekly Active Interventions updates correctly
- [x] User can view intervention history
- [x] User can view weekly summary
- [x] User can edit settings
- [x] App runs locally from `npm run dev`

## Project structure

```
pulse/
├── prisma/
│   └── schema.prisma          # 6 models: User, Task, Intervention, StuckSession, WeeklySummary, UserSettings
├── scripts/
│   ├── test-ai-provider.ts    # AI provider unit tests
│   ├── smoke-test-core-loop.ts # Full vertical slice test
│   └── reset-demo-data.ts     # Reset and reseed demo data
├── src/
│   ├── app/
│   │   ├── (main)/            # AppShell-wrapped pages
│   │   │   ├── dashboard/
│   │   │   ├── interventions/
│   │   │   ├── settings/
│   │   │   ├── stuck/[taskId]/
│   │   │   ├── summary/
│   │   │   └── tasks/new/
│   │   ├── api/               # REST API routes
│   │   ├── onboarding/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── ui/                # Shared UI primitives
│   │   ├── AppShell.tsx
│   │   └── Nav.tsx
│   ├── lib/
│   │   ├── ai/                # AI provider layer
│   │   ├── api-response.ts
│   │   ├── mock-user.ts
│   │   └── prisma.ts
│   └── types/
│       └── index.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Deployment

### Why not SQLite in production?

SQLite stores data in a local file (`prisma/dev.db`). On Vercel and similar serverless platforms, the filesystem is **ephemeral** — data written during one request is gone on the next. SQLite is only suitable for local development.

### Recommended production database

**Neon Postgres** (lowest friction for Vercel + Prisma):

- Free tier includes 0.5 GB storage
- Serverless Postgres with connection pooling
- One-click integration with Vercel
- Works with Prisma with zero config changes beyond the connection string

Alternatives: Supabase Postgres, Vercel Postgres.

### Environment variables

See `.env.example` for the full list. Required:

| Variable | Local (SQLite) | Production (Postgres) |
|----------|---------------|----------------------|
| `DATABASE_URL` | `file:./dev.db` | `postgresql://user:pass@host/db` |
| `AI_PROVIDER` | `mock` | `mock` (or `openai`) |

### Vercel deployment steps

1. **Provision a Postgres database** (Neon, Supabase, or Vercel Postgres)
2. **Switch Prisma to Postgres** — in `prisma/schema.prisma`, change:
   ```diff
   - provider = "sqlite"
   + provider = "postgresql"
   ```
3. **Set environment variables** in Vercel dashboard:
   - `DATABASE_URL` = your Postgres connection string
   - `AI_PROVIDER` = `mock` (or `openai` with `OPENAI_API_KEY`)
4. **Deploy** — push to GitHub and import into Vercel, or use `vercel` CLI:
   ```bash
   npx vercel --prod
   ```
5. **Push schema to production database** (run once after first deploy):
   ```bash
   npx prisma db push
   ```
   Or for production: `npx prisma migrate deploy`

The `postinstall` script runs `prisma generate` automatically during Vercel builds — no manual step needed.

### Prisma migration notes

| Command | When to use |
|---------|------------|
| `npx prisma db push` | Quick prototyping, local dev, initial production push |
| `npx prisma migrate dev` | Local development with migration history |
| `npx prisma migrate deploy` | Production deployments (applies pending migrations) |

## Known limitations

- **Single mock user only** — no auth system, one local demo user
- **Web-only** — no iOS, Android, widgets, SMS, voice, or push notifications
- **Mock AI** — deterministic keyword-based responses, no real LLM
- **No offline sync** — everything stored in local SQLite
- **No real-time updates** — pages need manual refresh if data changes
- **No email/password reset, no multi-device, no billing**

## Next phases

| Phase | Description |
|-------|------------|
| Phase 6 | Real OpenAI integration behind the AIProvider interface |
| Phase 7 | Auth system (Clerk, NextAuth, or Supabase) |
| Phase 8 | React Native mobile app |
| Phase 9 | Push notifications + SMS (Twilio) |
| Phase 10 | Widget surface, voice input, passive detection |
