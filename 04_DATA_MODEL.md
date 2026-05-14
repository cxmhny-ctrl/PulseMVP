# Pulse Data Model

## Data Architecture Principle
Pulse should be local-first. Sensitive user data should stay on-device by default. Cloud sync should be optional or limited to features that require it.

## Entity Overview

```text
User
├── Preferences
├── Tasks
│   └── Current Next Step
├── Interventions
├── Stuck Sessions
├── Weekly Flow Summaries
├── Channel Settings
├── Privacy Settings
└── Optional Sharing Relationships
```

## User

```json
{
  "id": "user_123",
  "email": "user@example.com",
  "name": "Caleb",
  "profile_type": "individual",
  "timezone": "America/Chicago",
  "created_at": "2026-05-13T16:00:00Z",
  "updated_at": "2026-05-13T16:00:00Z"
}
```

## User Preferences

```json
{
  "user_id": "user_123",
  "support_style": "gentle",
  "stuck_sensitivity": "medium",
  "preferred_channels": ["widget", "notification", "sms"],
  "quiet_hours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  },
  "voice_enabled": true,
  "sms_enabled": true,
  "weekly_summary_enabled": true,
  "created_at": "2026-05-13T16:00:00Z",
  "updated_at": "2026-05-13T16:00:00Z"
}
```

## Channel Settings

```json
{
  "user_id": "user_123",
  "widget_enabled": true,
  "notifications_enabled": true,
  "sms_enabled": true,
  "voice_enabled": true,
  "sms_phone_number": "+15555555555",
  "notification_permission_status": "granted",
  "last_permission_check_at": "2026-05-13T16:00:00Z"
}
```

## Privacy Settings

```json
{
  "user_id": "user_123",
  "cloud_sync_enabled": false,
  "analytics_enabled": true,
  "share_anonymized_events": true,
  "raw_voice_transcripts_cloud_enabled": false,
  "family_sharing_enabled": false,
  "therapist_sharing_enabled": false,
  "behavioral_detection_enabled": false,
  "created_at": "2026-05-13T16:00:00Z",
  "updated_at": "2026-05-13T16:00:00Z"
}
```

## Task

```json
{
  "id": "task_001",
  "user_id": "user_123",
  "title": "Clean kitchen",
  "status": "active",
  "source": "voice",
  "scheduled_window": {
    "start": "2026-05-13T16:00:00-05:00",
    "end": "2026-05-13T17:00:00-05:00"
  },
  "current_next_step": "Put 3 dishes in the sink",
  "energy_required": "low",
  "preferred_channel": "widget",
  "created_at": "2026-05-13T15:00:00Z",
  "updated_at": "2026-05-13T15:00:00Z"
}
```

## Intervention

```json
{
  "id": "intervention_001",
  "user_id": "user_123",
  "task_id": "task_001",
  "trigger_type": "missed_task_window",
  "channel": "widget",
  "message": "Just put 3 dishes in the sink.",
  "status": "engaged",
  "stuck_probability": 0.67,
  "created_at": "2026-05-13T16:15:00Z",
  "engaged_at": "2026-05-13T16:16:00Z",
  "dismissed_at": null
}
```

## Stuck Session

```json
{
  "id": "stuck_session_001",
  "user_id": "user_123",
  "task_id": "task_001",
  "intervention_id": "intervention_001",
  "input_channel": "widget",
  "friction_type": "overwhelm",
  "user_state": "everything feels like too much",
  "generated_first_step": "Put 3 dishes in the sink",
  "accepted_first_step": true,
  "started": true,
  "completed": null,
  "duration_seconds": 142,
  "self_reported_helpful": true,
  "created_at": "2026-05-13T16:16:00Z",
  "ended_at": "2026-05-13T16:18:22Z"
}
```

## Weekly Flow Summary

```json
{
  "id": "summary_001",
  "user_id": "user_123",
  "week_start": "2026-05-11",
  "week_end": "2026-05-17",
  "weekly_active_interventions": 12,
  "successful_transitions": 7,
  "dismissals": 3,
  "false_positive_reports": 1,
  "top_friction_type": "overwhelm",
  "best_channel": "sms",
  "recommended_adjustment": "Use shorter evening prompts",
  "summary_text": "You started 7 times this week. SMS worked best when tasks felt overwhelming.",
  "created_at": "2026-05-18T08:00:00Z"
}
```

## Analytics Event

```json
{
  "id": "event_001",
  "user_id": "user_123",
  "event_name": "intervention_engaged",
  "properties": {
    "channel": "widget",
    "trigger_type": "missed_task_window",
    "task_id": "task_001",
    "stuck_probability": 0.67
  },
  "privacy_level": "analytics_safe",
  "created_at": "2026-05-13T16:16:00Z"
}
```

## Sharing Relationship — Later Phase

```json
{
  "id": "relationship_001",
  "owner_user_id": "user_123",
  "viewer_user_id": "supporter_456",
  "relationship_type": "family_supporter",
  "permissions": [
    "view_weekly_summary",
    "send_encouragement"
  ],
  "status": "active",
  "created_at": "2026-05-13T16:00:00Z"
}
```

## Therapist Client Relationship — Later Phase

```json
{
  "id": "therapist_client_001",
  "therapist_user_id": "therapist_001",
  "client_user_id": "user_123",
  "permissions": [
    "view_weekly_summary",
    "view_friction_patterns",
    "recommend_settings"
  ],
  "client_consent_status": "accepted",
  "created_at": "2026-05-13T16:00:00Z"
}
```
