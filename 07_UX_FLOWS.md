# Pulse UX Flows

## UX Principles

1. Proactive, not reactive
2. One-step engage
3. No typing required
4. App is setup only where possible
5. No shame mechanics
6. Respect autonomy
7. Smallest action wins

## Onboarding Flow

```text
Welcome
  ↓
Choose support style
  ↓
Choose channels
  ↓
Set quiet hours
  ↓
Set sensitivity
  ↓
Enable notifications
  ↓
Optional: enable SMS
  ↓
Create first task by voice/select
  ↓
Configure widget
  ↓
Done
```

## Onboarding Screens

### Screen 1: Welcome

Message:

```text
Pulse helps you start when you get stuck.
No complex planning. No shame. Just the next tiny step.
```

Primary CTA:

```text
Set up Pulse
```

### Screen 2: Support Style

Options:

- Gentle
- Direct
- Funny
- Ultra-minimal

### Screen 3: Channels

Options:

- Widget
- Notifications
- SMS
- Voice

### Screen 4: Quiet Hours

Default:

```text
10:00 PM – 8:00 AM
```

### Screen 5: Sensitivity

Options:

- Low: fewer nudges
- Medium: balanced
- High: more check-ins

### Screen 6: First Task

Prompt:

```text
Say one thing you tend to get stuck starting.
```

Fallback buttons:

- cleaning
- homework
- admin task
- work project
- self-care

## Daily Task Flow

```text
User creates task
  ↓
Pulse schedules task window
  ↓
Window begins
  ↓
Pulse waits briefly
  ↓
No engagement
  ↓
Widget pulse / notification / SMS
  ↓
User engages
  ↓
Stuck Mode generates first step
  ↓
User starts or dismisses
  ↓
Pulse records outcome
```

## Widget UX

The widget should be small, calm, and action-focused.

Example widget state:

```text
Clean kitchen
Start with: put 3 dishes in the sink.

[Start] [Smaller] [Not now]
```

Widget states:

- idle
- upcoming task
- task window active
- possible stuck moment
- first step active
- completed/started

## Notification UX

Notifications should be direct and low-pressure.

Examples:

```text
Want a smaller first step for “laundry”?
```

```text
Just open the document. Stop there.
```

Actions:

- Start
- Make smaller
- Not now

## SMS UX

SMS should work without the app.

Example:

```text
Pulse: Want help starting “clean kitchen”?
Reply:
1 = make it tiny
2 = change task
3 = not now
```

Follow-up:

```text
Start with this: put 3 dishes in the sink.
Reply D when done, S for smaller.
```

## Stuck Mode UX

Stuck Mode should feel like a short assist, not a chat session.

```text
Pulse: What feels stuck?
User: My room is a disaster.
Pulse: Don’t clean the room. Pick up 3 pieces of trash.
User: Start
Pulse: Starting a 2-minute pulse.
```

## Stuck Mode Rules

- Ask one question maximum at a time.
- Prefer giving a next step over asking more questions.
- Always allow smaller.
- Always allow dismiss.
- Never force completion.

## Weekly Flow Summary UX

Tone should celebrate starts.

Example:

```text
You started 7 times this week.
SMS helped most when tasks felt overwhelming.
Try shorter evening prompts next week.
```

Avoid:

```text
You failed to complete 5 tasks.
```

## Settings UX

Important settings:

- support style
- nudge sensitivity
- quiet hours
- enabled channels
- SMS number
- data/privacy controls
- delete data
- export data
- disable detection signal

## Privacy Explanation UX

Use plain language.

Example:

```text
Pulse can use missed task windows to guess when you might be stuck.

Used for:
- sending a gentle check-in

Not used for:
- judging productivity
- sharing with anyone
- reading your messages
```

## Empty State UX

```text
No tasks right now.
Say one thing you want help starting later.
```

## Error State UX

Cloud AI unavailable:

```text
Offline mode. Try this tiny step: touch the first item related to the task.
```

SMS unavailable:

```text
SMS is unavailable right now. Widget and notifications still work.
```
