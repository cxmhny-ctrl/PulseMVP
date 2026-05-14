# Pulse MVP Scope

## MVP Objective
Prove that Pulse can repeatedly convert stuck moments into action starts for ADHD users.

The MVP is successful if users repeatedly say or demonstrate:

```text
I was stuck, Pulse reached me, and I started one small action.
```

## MVP Included Features

### 1. Onboarding

Required onboarding steps:

- choose support style
- choose preferred nudge channels
- set quiet hours
- set default sensitivity
- enable notifications
- configure SMS if user opts in
- create first task by voice or tap
- install/configure widget if applicable

### 2. Task Capture

MVP supports simple task creation only.

Inputs:

- voice
- tap/select templates
- optional text fallback

Task fields:

- title
- optional scheduled window
- energy level
- preferred channel
- current tiny next step

No projects, subtasks, tags, priorities, or complex hierarchies in MVP.

### 3. Stuck Mode

Stuck Mode must:

- accept one tap, voice, or SMS reply trigger
- ask at most one question at a time
- classify friction type
- generate one next physical action
- keep the next action under two minutes
- offer an easier version
- record whether the user engaged

### 4. Interventions

MVP channels:

- widget pulse / widget card concept
- local push notifications
- SMS reply/deep-link flow
- in-app Stuck Mode session

### 5. Detection

MVP detection should be explicit and contextual.

Allowed MVP triggers:

- task window starts
- task window passes without engagement
- user taps “I’m stuck”
- user replies to SMS
- user taps notification action
- user repeatedly snoozes or dismisses a task nudge

Avoid full passive behavioral monitoring in MVP.

### 6. Weekly Flow Summary

Show:

- number of interventions
- number of successful starts
- most common friction type
- best-performing channel
- simple encouragement
- one suggested adjustment

### 7. Analytics

Track:

- Weekly Active Interventions
- intervention sent
- intervention dismissed
- intervention engaged
- Stuck Mode started
- first step generated
- first step accepted
- first step completed or started
- false positive feedback
- channel performance

## MVP Exclusions

Do not build in MVP:

- therapist dashboard
- family dashboard
- full passive phone monitoring
- app usage tracking
- smart speaker integrations
- complex task hierarchy
- gamification/streak systems
- full offline LLM
- API integrations
- humor/GIF library
- advanced billing complexity
- clinical reporting

## MVP User Stories

### User Story 1
As a user, I can create a task by voice so that I do not need to type or organize anything.

### User Story 2
As a user, I can receive a gentle nudge when a task window passes so that I can start without remembering to open the app.

### User Story 3
As a user, I can tap a widget or notification and get one tiny next step.

### User Story 4
As a user, I can reply to an SMS and get a smaller version of my task.

### User Story 5
As a user, I can dismiss a nudge without shame or penalty.

### User Story 6
As a user, I can adjust sensitivity so Pulse does not bother me too often.

### User Story 7
As a user, I can see a weekly summary focused on wins, not failures.

## MVP Success Criteria

The MVP should be considered promising if beta users show:

- repeated use across multiple weeks
- at least 2 successful interventions per week among active users
- low false-positive annoyance
- preference for Pulse over normal reminders
- qualitative trust in the product tone
- clear channel preference data

## Suggested MVP Build Order

1. Local task model
2. Onboarding
3. Notification scheduling
4. Stuck Mode conversation screen
5. AI task breakdown endpoint
6. Local fallback templates
7. Widget surface
8. SMS integration
9. Analytics events
10. Weekly summary
11. Sensitivity controls
12. Beta instrumentation
