# Debugging — Dashboard "Could not load dashboard."

## Issue

After deploying to Vercel with Neon Postgres, the `/dashboard` page showed
"Could not load dashboard." immediately after onboarding.

## Root cause

Two issues combined:

### 1. Missing user-creation guard in weekly summary route

`GET /api/summaries/weekly/current` tried to create a `WeeklySummary` record
linked to `MOCK_USER_ID` without first calling `getOrCreateMockUser()`.
On SQLite (local dev), foreign keys are off by default so this silently
succeeded. On Postgres (production), the foreign key constraint on
`weekly_summaries.user_id → users.id` rejected the insert with a
foreign key violation.

### 2. All-or-nothing dashboard fetch

The dashboard used `Promise.all` for its two API calls. If either
`GET /api/tasks` or `GET /api/summaries/weekly/current` returned a
non-OK response, the entire dashboard showed the error. The actual
error was also swallowed — no stack trace was logged.

## What was fixed

| File | Change |
|------|--------|
| `src/app/api/summaries/weekly/current/route.ts` | Added `getOrCreateMockUser()` call before queries — ensures user exists before creating weekly summary |
| `src/app/(main)/dashboard/page.tsx` | Switched from `Promise.all` (all-or-nothing) to `Promise.allSettled` (graceful degradation) — failed tasks still show empty list; failed summary still shows dashboard without WAI counter |
| `src/app/api/summaries/weekly/current/route.ts` | Added `console.error` on caught exceptions |
| `src/app/api/tasks/route.ts` | Added `console.error` on caught exceptions |
| `src/app/api/me/route.ts` | Added `console.error` on caught exceptions |
| `src/lib/mock-user.ts` | Added `console.error` on user creation failure |

## Dashboard dependencies

The `/dashboard` page calls two API routes in parallel:

| Route | Purpose | Failure mode |
|-------|---------|-------------|
| `GET /api/tasks` | Lists active tasks | Shows empty task list |
| `GET /api/summaries/weekly/current` | Calculates WAI counter | Shows dashboard without WAI count |

After the fix, each route can fail independently. Both must fail for the
error state to appear.

## Verifying after redeploy

1. Redeploy to Vercel
2. Open the production URL
3. Run through onboarding → check that dashboard loads with tasks + WAI
4. Check Vercel Functions logs for any `console.error` output
5. If "Could not load dashboard." still appears, check logs for the
   specific route that failed (will be prefixed with the route path)

## Related

- `.env.example` — required environment variables
- `DEPLOYMENT_CHECKLIST.md` — full deployment steps
- `README.md` — setup and demo flow
