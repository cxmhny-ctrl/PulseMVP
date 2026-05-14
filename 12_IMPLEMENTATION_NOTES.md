# Pulse Implementation Notes

## Important Engineering Notes

### Do Not Overbuild the Task System
The task model should stay simple. Avoid projects, labels, dependencies, task nesting, and dashboards in MVP.

### Build Detection as a Replaceable Engine
The stuck detection layer should be modular.

Suggested interface:

```ts
interface StuckSignal {
  type: string;
  weight: number;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

interface StuckScoreResult {
  stuckProbability: number;
  confidence: 'low' | 'medium' | 'high';
  recommendedIntervention: 'none' | 'widget' | 'notification' | 'sms' | 'voice';
  detectedSignals: StuckSignal[];
}
```

### Build Channels as Adapters
Each channel should implement a common interface.

```ts
interface InterventionChannel {
  name: 'widget' | 'notification' | 'sms' | 'voice';
  isEnabled(userId: string): Promise<boolean>;
  canSend(context: InterventionContext): Promise<boolean>;
  send(intervention: Intervention): Promise<InterventionSendResult>;
}
```

### Keep AI Provider Abstracted
Avoid hard-coding a single AI vendor throughout the app.

```ts
interface TaskBreakdownProvider {
  generateTinyStep(input: TinyStepInput): Promise<TinyStepOutput>;
  classifyFriction(input: FrictionInput): Promise<FrictionOutput>;
}
```

### Local Fallback Is Required
If cloud AI fails, Pulse must still produce a generic tiny step.

Example fallback hierarchy:

1. use current_next_step if available
2. use task category template
3. use friction type template
4. use generic fallback: “Touch the first thing related to the task.”

## Suggested Repository Structure

```text
pulse/
├── apps/
│   ├── mobile/
│   └── api/
├── packages/
│   ├── shared-types/
│   ├── ai-prompts/
│   ├── detection-engine/
│   ├── intervention-engine/
│   └── privacy-utils/
├── docs/
│   └── handoff-md-files
├── infra/
└── README.md
```

## Suggested Mobile Modules

```text
mobile/src/
├── onboarding/
├── tasks/
├── stuck-mode/
├── interventions/
├── notifications/
├── sms/
├── widgets/
├── privacy/
├── summaries/
├── analytics/
├── storage/
└── sync/
```

## Suggested Backend Modules

```text
api/src/
├── auth/
├── users/
├── tasks/
├── interventions/
├── stuck-sessions/
├── ai/
├── sms/
├── analytics/
├── summaries/
├── entitlements/
└── webhooks/
```

## First Sprint Recommendation

Sprint 1 should build a working vertical slice:

```text
Create task → schedule notification → tap notification → Stuck Mode → AI generates next step → record started
```

Do not start with account systems, dashboards, or advanced detection.

## Second Sprint Recommendation

Add:

- SMS reply loop
- widget surface
- weekly summary
- privacy settings
- WAI analytics

## Third Sprint Recommendation

Add:

- support style personalization
- false-positive feedback
- sensitivity tuning
- local fallback templates
- beta instrumentation dashboard
