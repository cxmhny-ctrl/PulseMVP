# Pulse API Contracts

## API Design Principles

- Mobile client should work offline for core stuck-breaking.
- Backend should be used for sync, SMS, cloud AI, and shared dashboards.
- All endpoints should be authenticated unless marked public.
- Avoid sending raw sensitive behavioral data unless the user has opted in.

## Auth

### POST `/auth/session`
Create or refresh an authenticated session.

Request:

```json
{
  "provider": "email",
  "token": "provider_token"
}
```

Response:

```json
{
  "access_token": "jwt",
  "refresh_token": "refresh_token",
  "user_id": "user_123"
}
```

## User Profile

### GET `/me`
Returns user profile, preferences, channel settings, and privacy settings.

Response:

```json
{
  "user": {},
  "preferences": {},
  "channel_settings": {},
  "privacy_settings": {}
}
```

### PATCH `/me/preferences`
Updates user preferences.

Request:

```json
{
  "support_style": "gentle",
  "stuck_sensitivity": "medium",
  "preferred_channels": ["widget", "sms"],
  "quiet_hours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

## Tasks

### POST `/tasks`
Creates a task.

Request:

```json
{
  "title": "Clean kitchen",
  "source": "voice",
  "scheduled_window": {
    "start": "2026-05-13T16:00:00-05:00",
    "end": "2026-05-13T17:00:00-05:00"
  },
  "energy_required": "low",
  "preferred_channel": "widget"
}
```

Response:

```json
{
  "id": "task_001",
  "title": "Clean kitchen",
  "status": "active",
  "current_next_step": null
}
```

### GET `/tasks`
Returns active and recent tasks.

Query params:

- `status`
- `updated_after`
- `limit`

### PATCH `/tasks/{task_id}`
Updates a task.

Request:

```json
{
  "title": "Clean the kitchen",
  "status": "active",
  "current_next_step": "Put 3 dishes in the sink"
}
```

## Interventions

### POST `/interventions`
Records or creates an intervention.

Request:

```json
{
  "task_id": "task_001",
  "trigger_type": "missed_task_window",
  "channel": "widget",
  "message": "Just put 3 dishes in the sink.",
  "stuck_probability": 0.67
}
```

Response:

```json
{
  "id": "intervention_001",
  "status": "sent"
}
```

### PATCH `/interventions/{intervention_id}`
Updates engagement state.

Request:

```json
{
  "status": "engaged",
  "engaged_at": "2026-05-13T16:16:00Z"
}
```

## Stuck Mode

### POST `/stuck-sessions`
Starts a stuck session.

Request:

```json
{
  "task_id": "task_001",
  "intervention_id": "intervention_001",
  "input_channel": "widget",
  "user_state": "everything feels like too much"
}
```

Response:

```json
{
  "id": "stuck_session_001",
  "next_prompt": "What part feels most annoying?"
}
```

### POST `/stuck-sessions/{session_id}/generate-step`
Generates one tiny next action.

Request:

```json
{
  "task_title": "Clean kitchen",
  "user_state": "everything feels like too much",
  "energy_level": "low",
  "time_available_minutes": 5,
  "support_style": "gentle"
}
```

Response:

```json
{
  "friction_type": "overwhelm",
  "first_step": "Put 3 dishes in the sink.",
  "easier_version": "Put one dish in the sink.",
  "followup": "Start with the easier version if needed."
}
```

### PATCH `/stuck-sessions/{session_id}`
Updates session outcome.

Request:

```json
{
  "accepted_first_step": true,
  "started": true,
  "completed": null,
  "self_reported_helpful": true
}
```

## AI

### POST `/ai/breakdown-task`
Cloud AI fallback for task breakdown.

Request:

```json
{
  "task": "Clean my room",
  "user_state": "I don't know where to start",
  "energy_level": "low",
  "support_style": "ultra_minimal",
  "constraints": {
    "max_words": 20,
    "max_minutes": 2,
    "no_typing": true
  }
}
```

Response:

```json
{
  "friction_type": "too_large",
  "next_step": "Pick up 3 things from the floor.",
  "easier_version": "Pick up 1 thing.",
  "confidence": 0.86
}
```

## SMS

### POST `/sms/send-nudge`
Sends an SMS nudge if SMS is enabled.

Request:

```json
{
  "user_id": "user_123",
  "task_id": "task_001",
  "message": "Want help starting laundry? Reply 1 to make it tiny, 2 to change it, 3 for not now."
}
```

### POST `/webhooks/sms/inbound`
Receives SMS replies from provider.

Request:

```json
{
  "from": "+15555555555",
  "body": "1",
  "provider_message_id": "sms_123"
}
```

Expected behavior:

- resolve user by phone number
- find latest open SMS intervention
- process reply
- create or update stuck session
- return SMS response message

## Weekly Summary

### GET `/summaries/weekly/current`
Returns current weekly summary.

Response:

```json
{
  "week_start": "2026-05-11",
  "weekly_active_interventions": 12,
  "successful_transitions": 7,
  "top_friction_type": "overwhelm",
  "best_channel": "sms",
  "summary_text": "You started 7 times this week. SMS helped most."
}
```

## Analytics

### POST `/analytics/events`
Batch records analytics events.

Request:

```json
{
  "events": [
    {
      "event_name": "intervention_engaged",
      "properties": {
        "channel": "widget",
        "trigger_type": "missed_task_window"
      },
      "created_at": "2026-05-13T16:16:00Z"
    }
  ]
}
```

## Error Format

All API errors should follow:

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Task title is required.",
    "details": {}
  }
}
```
