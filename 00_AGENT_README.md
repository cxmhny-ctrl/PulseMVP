# Pulse Build Handoff — Agent README

## Purpose
This folder contains the full product, technical, UX, AI, privacy, and implementation context needed to build **Pulse**, an ambient ADHD stuck-to-action companion.

Pulse is not a traditional task manager. The core product is an **ambient intervention system** that detects likely moments of task paralysis, reaches the user through the lowest-friction channel, and converts stuckness into one tiny next action.

## Build Mandate
Build around this loop:

```text
Detect likely stuckness → intervene gently → launch Stuck Mode → produce one tiny action → measure stuck-to-action transition
```

## Non-Negotiable Product Principles

1. **Invisible app**: the app is mostly for setup, settings, and summaries.
2. **One-step engage**: every live interaction should require one tap, one reply, or one voice command.
3. **No typing required**: voice, tap, or select should be the default input model.
4. **No shame mechanics**: no streak punishment, leaderboards, failure scores, or guilt language.
5. **Local-first privacy**: sensitive data should stay local unless the user opts into sync/sharing.
6. **Proactive but respectful**: Pulse suggests; it does not command.
7. **MVP detection should be explicit/contextual first**, not invasive passive surveillance.

## Recommended Implementation Order

1. Read `01_PRODUCT_BRIEF.md`.
2. Read `02_SYSTEM_ARCHITECTURE.md`.
3. Build against `03_MVP_SCOPE.md`.
4. Use `04_DATA_MODEL.md` for local/backend entities.
5. Use `05_API_CONTRACTS.md` for backend endpoints.
6. Use `06_AI_ARCHITECTURE_AND_PROMPTS.md` for Stuck Mode behavior.
7. Use `07_UX_FLOWS.md` for screens and flows.
8. Use `08_PRIVACY_SECURITY.md` before adding detection or sharing features.
9. Use `09_ROADMAP.md` for post-MVP sequencing.
10. Use `10_ACCEPTANCE_CRITERIA.md` to verify build quality.

## MVP Definition
The MVP should prove that Pulse can create repeated successful **stuck → action transitions** better than ordinary reminders or a generic chatbot.

MVP includes:

- onboarding
- voice-created task
- one-tap stuck mode
- interactive widget concept
- notification nudges
- SMS reply/deep-link flow
- cloud AI task breakdown
- local fallback task breakdown templates
- local task/intervention history
- weekly flow summary
- sensitivity controls
- Weekly Active Interventions tracking

MVP excludes:

- full passive monitoring
- therapist dashboard
- family dashboard
- smart speaker integrations
- complex task hierarchy
- full offline AI
- gamification
- app usage tracking

## North Star Metric

```text
Weekly Active Interventions (WAI): successful stuck-to-action transitions per user per week.
```

## Core Warning
The AI chatbot is not the moat. The moat is the ambient intervention loop: widget/SMS/notification/voice reaching the user before they need to remember to ask for help.
