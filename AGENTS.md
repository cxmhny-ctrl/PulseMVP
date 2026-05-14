# AGENTS.md — Pulse Handoff

## Repo nature
This is a **spec-only repository**. No code exists yet. All 13 numbered markdown files (`00_`–`12_`) are design documents for **Pulse**, an ambient ADHD stuck-to-action companion app.

## Entry point
Start with `00_AGENT_README.md` — it defines the build mandate, non-negotiable principles, and recommended reading order. Every agent should read it first.

## Document map (read order)
| File | What it contains |
|---|---|
| `00_AGENT_README.md` | Build mandate, principles, MVP definition, north-star metric |
| `01_PRODUCT_BRIEF.md` | Product positioning, audience, anti-patterns |
| `02_SYSTEM_ARCHITECTURE.md` | Client/backend architecture, recommended stack, runtime loop |
| `03_MVP_SCOPE.md` | Exact MVP features, exclusions, user stories, build order |
| `04_DATA_MODEL.md` | Entity schemas (User, Task, Intervention, Stuck Session, etc.) |
| `05_API_CONTRACTS.md` | Backend endpoint specs |
| `06_AI_ARCHITECTURE_AND_PROMPTS.md` | AI system prompt, friction classification, fallback templates |
| `07_UX_FLOWS.md` | Step-by-step flows for onboarding, Stuck Mode, SMS loop, weekly summary |
| `08_PRIVACY_SECURITY.md` | Data sensitivity classes, encryption requirements, opt-in rules |
| `09_ROADMAP.md` | Phase 0–3 roadmap with milestones |
| `10_ACCEPTANCE_CRITERIA.md` | Verifiable pass/fail criteria per subsystem |
| `11_RESEARCH_CONTEXT.md` | How the idea was validated (market research, roasting, swarm prediction) |
| `12_IMPLEMENTATION_NOTES.md` | Engineering notes: interfaces, repo structure, sprint recommendations |

## Key architectural constraints (non-obvious)

- **Local-first**: Core stuck-breaking loop must work offline. Cloud is for sync, SMS, AI, dashboards — never a hard dependency for basic interventions.
- **Invisible app**: The mobile app is primarily for onboarding, settings, and summaries. Day-to-day interventions happen via widget, notification, SMS, or voice — not by opening the app.
- **Simple task model**: No projects, subtags, priorities, hierarchies, or dependencies in MVP. Tasks have title, optional window, energy level, preferred channel, and current next step only.
- **Replaceable detection engine**: Detection must be a modular interface (`StuckScoreResult`). MVP detection is explicit/contextual (task windows, user taps, SMS replies) — not passive behavioral monitoring.
- **Channel adapter pattern**: Each delivery channel (widget, notification, SMS, voice) implements `InterventionChannel`. Channels are independently enable/disable-able.
- **AI provider abstracted**: `TaskBreakdownProvider` interface. Never hard-code a single vendor. Must have local fallback templates (generic tiny steps) when cloud AI is unreachable.
- **Privacy classes**: Voice transcripts and behavioral logs are high-sensitivity — local by default. Cloud sync is opt-in per data class. Every detection signal must be explainable and optional.
- **Tone**: Pulse speaks in brief, calm, direct, non-shaming language. Responses under 20 words. Never ask more than one question at a time. Always offer an "easier version."

## What NOT to build (MVP exclusions)
Full passive monitoring, therapist dashboard, family dashboard, smart speaker integrations, complex task hierarchy, gamification/streaks, full offline LLM, app usage tracking.

## Recommended first sprint (vertical slice)
```
Create task → schedule notification → tap notification → Stuck Mode → AI generates next step → record started
```
Do not start with auth, dashboards, or advanced detection.
