# Pulse Phase 1 — Web MVP Build Scope

## Goal

Build a working web MVP that proves the Pulse stuck-to-action loop.

## Core Loop

User creates a task.
User enters Stuck Mode.
AI breaks the task into one tiny next action.
User accepts or changes the next action.
System logs an intervention.
Weekly summary shows successful stuck-to-action transitions.

## Stack

- Next.js
- TypeScript
- Prisma
- SQLite for local development
- Tailwind CSS
- API routes or server actions
- Mock AI provider first
- OpenAI-compatible provider abstraction

## Required Screens

1. Landing / login placeholder
2. Onboarding
3. Dashboard
4. Task creation
5. Stuck Mode
6. Intervention history
7. Weekly summary
8. Settings

## Required Models

- User
- Task
- Intervention
- StuckSession
- WeeklySummary
- UserSettings

## Required Features

- Create task
- Start stuck session
- Classify friction type
- Generate tiny next action
- Accept next action
- Mark action started
- Log intervention
- Calculate Weekly Active Interventions
- Show weekly summary
- Store user preferences

## AI Layer

Implement:

- `AIProvider` interface
- `MockAIProvider`
- `TemplateFallbackProvider`
- `OpenAIProviderStub`

Do not require real API keys to run locally.

## Do Not Build Yet

- iOS app
- Android app
- widgets
- SMS
- voice assistant integrations
- therapist dashboard
- family accounts
- offline-first sync
- billing
- app store deployment

## Acceptance Criteria

The app is done when:

1. A new user can complete onboarding.
2. A user can create a task.
3. A user can trigger Stuck Mode.
4. The system generates one tiny next action.
5. The user can mark the action as started.
6. The system logs a successful intervention.
7. Weekly Active Interventions updates correctly.
8. The app can run locally from a README.