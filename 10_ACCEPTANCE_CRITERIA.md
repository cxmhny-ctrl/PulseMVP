# Pulse Acceptance Criteria

## Product Acceptance Criteria

### Core Loop

A user must be able to:

- create a task quickly
- receive an intervention without opening the app
- engage with one tap/reply/voice command
- get one tiny next action
- start or dismiss without shame
- have the outcome recorded

### Stuck Mode

Stuck Mode is acceptable when:

- it asks no more than one question at a time
- it generates one action, not a plan
- the action takes under two minutes
- the action is physical and concrete where possible
- it includes an easier version
- it avoids shame language
- it works with voice or tap/select

### Intervention System

Interventions are acceptable when:

- they respect quiet hours
- they respect channel preferences
- they can be dismissed easily
- they do not escalate aggressively
- they record engagement/dismissal
- they avoid creepy surveillance wording

### Privacy

Privacy is acceptable when:

- sensitive data is local-first
- analytics can be disabled
- cloud sync can be disabled
- SMS opt-in is explicit
- each detection signal has a clear explanation
- family/professional sharing is opt-in and revocable
- users can delete/export data

### Weekly Summary

Weekly summary is acceptable when:

- it celebrates starts
- it does not shame missed tasks
- it shows successful interventions
- it shows best channel
- it shows top friction type
- it gives one adjustment suggestion

## Technical Acceptance Criteria

### Offline Behavior

The app should still support:

- viewing current task
- receiving local notifications
- launching local Stuck Mode fallback
- recording local events
- syncing later

### API Behavior

APIs should:

- return consistent error shapes
- validate inputs
- require auth
- avoid logging sensitive fields
- handle idempotency for analytics/intervention events where possible

### AI Behavior

AI output must be validated for:

- word count
- single-step format
- no shame language
- no diagnosis/medical claims
- no multi-step plans
- concrete action quality

### Analytics

Track at minimum:

- task created
- intervention sent
- intervention dismissed
- intervention engaged
- stuck mode started
- first step generated
- first step accepted
- first step started
- false positive reported
- weekly active interventions

## Beta Readiness Checklist

- [ ] Onboarding complete
- [ ] Notification permission flow complete
- [ ] SMS opt-in flow complete
- [ ] Task creation works
- [ ] Widget or widget-equivalent surface works
- [ ] Stuck Mode works
- [ ] AI fallback works
- [ ] Local fallback templates work
- [ ] Weekly summary works
- [ ] Analytics event logging works
- [ ] Privacy settings exist
- [ ] Delete/export data path exists or is documented
- [ ] App has clear non-medical disclaimer
- [ ] False-positive feedback exists
- [ ] Quiet hours work
- [ ] Sensitivity setting works

## Definition of Done for MVP

The MVP is done when a beta user can complete this full flow:

```text
Install → onboard → create task → receive nudge → tap/reply → get tiny step → start → see weekly summary
```
