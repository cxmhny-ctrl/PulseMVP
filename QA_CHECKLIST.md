# Pulse QA Checklist — Phase 1 Web MVP

Run through each item manually after `npm run dev`. Check the box when verified.

## Setup

- [ ] `npm install` completes without errors
- [ ] `npx prisma generate` succeeds
- [ ] `npx prisma db push` creates dev.db
- [ ] `npm run dev` starts on http://localhost:3000
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] `npm run build` passes with zero errors

## Landing page

- [ ] Opens at http://localhost:3000
- [ ] Shows "Pulse" heading
- [ ] Shows tagline: "No complex planning. No shame. The next tiny step."
- [ ] "Set up Pulse" button links to /onboarding
- [ ] "Dashboard" button links to /dashboard
- [ ] Medical disclaimer visible at bottom

## Onboarding

- [ ] Step 1: Welcome message and disclaimer
- [ ] Step 2: Support style picker (gentle/direct/funny/ultra-minimal)
- [ ] Step 3: Stuck sensitivity picker (low/medium/high)
- [ ] Step 4: Quiet hours start/end time inputs
- [ ] Step 5: First task title input with placeholder
- [ ] "Next" advances through steps
- [ ] "Back" returns to previous step
- [ ] Progress dots update correctly
- [ ] "Set up Pulse" saves settings and creates first task
- [ ] Redirects to /dashboard after completion

## Task creation

- [ ] Navigate to /tasks/new via nav or dashboard
- [ ] Title input visible with placeholder
- [ ] Energy level dropdown (low/medium/high)
- [ ] Scheduled start/end datetime inputs (optional)
- [ ] Channel info text visible
- [ ] "Create task" saves and redirects to /dashboard
- [ ] "Cancel" returns to dashboard
- [ ] Empty title shows validation error

## Dashboard

- [ ] Shows heading "Dashboard"
- [ ] Shows WAI count ("X interventions this week")
- [ ] "+ New task" button links to /tasks/new
- [ ] Active tasks listed in cards
- [ ] Each card shows: title, energy badge, next step (if set)
- [ ] Each card has "I'm stuck" button
- [ ] Empty state shows when no tasks (with "Create a task" link)

## Stuck Mode — start path

- [ ] Click "I'm stuck" on a task → navigates to /stuck/[taskId]
- [ ] Shows task title below heading
- [ ] "What feels stuck?" prompt visible
- [ ] Text input for stuck description (optional)
- [ ] Friction type dropdown with all 10 types
- [ ] "Find my next step" button triggers generation
- [ ] Loading spinner shown during generation
- [ ] Result shows: "Next step" label + generated step text
- [ ] Shows estimated minutes
- [ ] Shows friction type
- [ ] "Start" button visible
- [ ] "Easier version" button visible
- [ ] "Not now" button visible
- [ ] Click "Start" → shows "Starting a 2-minute pulse."
- [ ] Shows "Stop when the timer ends."
- [ ] "Back to dashboard" button returns to /dashboard

## Stuck Mode — easier version path

- [ ] Click "Easier version" on result screen
- [ ] Step text changes to easier version
- [ ] "Start easier version" button appears
- [ ] Click "Start easier version" → intervention logged with easier_version outcome
- [ ] "Go back" returns to original step

## Stuck Mode — not now path

- [ ] Click "Not now" on result screen
- [ ] Redirects to /dashboard
- [ ] Intervention logged as dismissed

## Intervention history

- [ ] Navigate to /interventions via nav
- [ ] Shows "Intervention history" heading
- [ ] Each intervention shows: task name, message, status badge, date
- [ ] Started interventions show green "Started" badge
- [ ] Dismissed interventions show gray "Dismissed" badge
- [ ] Empty state shows when no interventions exist
- [ ] Interventions listed newest first

## Weekly summary

- [ ] Navigate to /summary via nav
- [ ] Shows "Weekly summary" heading
- [ ] Shows week date range
- [ ] Shows intervention count in green card
- [ ] Shows start count in blue card
- [ ] Shows top friction type (if any)
- [ ] Shows best channel (if any)
- [ ] Shows dismissal count
- [ ] Summary text paragraph visible
- [ ] Suggestion text visible (if applicable)

## Settings

- [ ] Navigate to /settings via nav
- [ ] Pre-filled with current settings (from /api/me)
- [ ] Support style dropdown works
- [ ] Stuck sensitivity dropdown works
- [ ] Quiet hours inputs work
- [ ] "Save settings" updates and shows "Settings saved."
- [ ] "Back" returns to dashboard
- [ ] Disclaimer visible at bottom

## Empty states

- [ ] Dashboard without tasks: empty state with "Create a task" link
- [ ] Interventions without history: "No interventions yet"
- [ ] Summary with zero interventions: shows zero counts

## Error states

- [ ] Each screen shows error message if API fails
- [ ] Retry button available on dashboard, interventions, summary
- [ ] Loading spinners shown during data fetches

## Technical checks

- [ ] `npx tsc --noEmit` — zero errors
- [ ] `npm run build` — completes successfully
- [ ] `npx tsx scripts/test-ai-provider.ts` — all tests pass
- [ ] `npx tsx scripts/smoke-test-core-loop.ts` — all tests pass
- [ ] `npx tsx scripts/reset-demo-data.ts` — resets cleanly

## Tone checks

- [ ] No "just" language in user-facing copy
- [ ] No "should" language in nudge/step copy
- [ ] No shame or guilt language
- [ ] No motivational clichés
- [ ] Steps are concrete and physical
- [ ] Steps are under 2 minutes
- [ ] Easier version always available
- [ ] Medical disclaimer present on landing and settings
