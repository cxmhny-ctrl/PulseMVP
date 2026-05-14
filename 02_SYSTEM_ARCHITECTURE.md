# Pulse System Architecture

## Architecture Summary
Pulse should be built as a local-first mobile system with optional backend sync and cloud AI fallback.

The product has five major systems:

1. Ambient Trigger System
2. Intervention System
3. Stuck Mode AI System
4. Personalization System
5. Trust, Privacy, and Sharing System

## High-Level System Diagram

```text
┌──────────────────────────────────────────────┐
│                User Channels                 │
│ Widget • Notifications • SMS • Voice • App   │
└──────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────┐
│             Intervention Engine              │
│ Channel selection • Timing • Escalation      │
└──────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────┐
│              Stuck Detection Layer           │
│ Task windows • Explicit triggers • Context   │
└──────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────┐
│              Stuck Mode AI Layer             │
│ Voice intake • Friction type • Next action   │
└──────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────┐
│             Personalization Layer            │
│ Sensitivity • Tone • Best channel • Patterns │
└──────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────┐
│                 Data Layer                   │
│ Local DB • Optional sync • Analytics events  │
└──────────────────────────────────────────────┘
```

## Client Architecture

### Mobile App Responsibilities

The app is for:

- onboarding
- permissions
- settings
- task capture
- widget configuration
- Stuck Mode session UI
- weekly summaries
- privacy controls
- family/professional management in later phases

The app should not be required for most day-to-day interventions.

### Mobile Components

```text
Mobile Client
├── Onboarding Module
├── Task Capture Module
├── Local Notification Scheduler
├── Widget Extension / Widget Surface
├── Stuck Mode UI
├── Voice Input Layer
├── Local Rules Engine
├── Local SQLite/Realm Store
├── Sync Client
├── Privacy Controls
└── Analytics Event Queue
```

## Backend Architecture

### Backend Responsibilities

The backend supports, but should not be required for, the basic stuck-breaking loop.

Responsibilities:

- auth
- profile sync
- task sync
- SMS gateway
- push delivery
- AI orchestration
- family sharing
- therapist dashboard, later
- analytics aggregation
- entitlements/billing

### Backend Services

```text
Backend
├── API Gateway
├── Auth Service
├── User/Profile Service
├── Task Service
├── Intervention Service
├── AI Orchestration Service
├── SMS Service
├── Push Notification Service
├── Sharing Service
├── Therapist Dashboard Service
├── Analytics Service
└── Billing/Entitlement Service
```

## Recommended Stack

| Layer | Recommendation |
|---|---|
| Mobile MVP | React Native with native widget support, or native Swift/Kotlin |
| iOS widget | WidgetKit native extension |
| Android widget | Jetpack Glance |
| Local DB | SQLite, Realm, or WatermelonDB |
| Backend API | FastAPI or NestJS |
| Main DB | Postgres |
| Queue | Redis/BullMQ, Cloud Tasks, or equivalent |
| SMS | Twilio |
| Push | APNs + FCM |
| Auth | Clerk, Supabase Auth, Firebase Auth, or custom JWT |
| AI | Provider abstraction for OpenAI/Anthropic/local fallback |
| Analytics | PostHog or custom event pipeline |
| Hosting | Render, Fly.io, AWS, or GCP |

## Platform Constraints

### iOS
Do not assume always-on passive monitoring. Build MVP detection around:

- scheduled task windows
- local notifications
- widgets
- App Intents
- Shortcuts
- user-triggered voice
- SMS links/replies

### Android
Android can support more optional behavioral detection, but keep it user-controlled. Foreground services should be explicit and visible.

## Offline-First Strategy

Core stuck-breaking should work without network access when possible.

Offline-capable:

- existing tasks
- local notifications
- local widget display
- basic stuck mode templates
- previous next-step patterns
- local event logging

Cloud-required or cloud-enhanced:

- complex AI conversations
- SMS delivery
- cross-device sync
- therapist dashboard
- family sharing
- long-term analytics aggregation

## Core Runtime Loop

```text
1. Task window begins.
2. Local engine evaluates context.
3. If stuck probability crosses threshold, intervention engine selects a channel.
4. User engages through widget, notification, SMS, or voice.
5. Stuck Mode creates one tiny next action.
6. User confirms/starts/dismisses.
7. Event is recorded locally.
8. Optional sync/analytics occurs later.
```
