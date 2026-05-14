# Pulse Privacy and Security Requirements

## Privacy Positioning
Pulse is an ADHD support tool that may handle sensitive behavioral, task, family, and professional data. Trust is core to the product.

Privacy must be designed into the architecture from the start.

## Privacy Principles

1. Local-first by default
2. No hidden monitoring
3. Every detection signal must be explainable
4. Every detection signal must be optional
5. Raw behavioral logs should not leave the device by default
6. Voice transcripts should not be stored in cloud unless explicitly enabled
7. Family/professional sharing must require explicit consent
8. Users must be able to delete/export their data
9. Avoid creepy language
10. No selling behavioral or ADHD-related data

## Data Sensitivity Classes

| Class | Examples | Storage Recommendation |
|---|---|---|
| Low | UI preferences, support style | local + optional sync |
| Medium | task titles, intervention events | local-first + optional sync |
| High | voice transcripts, ADHD-related notes | local by default |
| Very High | family/therapist sharing, behavioral signals | encrypted, explicit opt-in |

## Local Storage

Required:

- encrypted local database
- encrypted secrets storage
- local event queue
- ability to wipe all local data

Suggested mobile storage:

- iOS Keychain for secrets
- Android Keystore for secrets
- SQLCipher, Realm encryption, or equivalent for local DB

## Cloud Storage

Cloud data should be limited to:

- account profile
- synced tasks if enabled
- SMS delivery metadata
- AI requests where needed
- anonymized analytics if enabled
- family/professional sharing if enabled

## Data That Should Stay Local by Default

- raw voice transcripts
- raw detection signals
- phone behavior logs
- detailed intervention history
- private task titles if sync disabled
- personalization patterns

## User Controls

Users must be able to:

- disable each nudge channel
- disable each detection source
- change sensitivity
- delete task history
- delete account
- export data
- disable analytics
- disable cloud sync
- revoke family/professional access

## Detection Signal Disclosure

Each signal should have a clear explanation.

Example:

```text
Missed task window

Pulse can notice when a task window starts and you have not engaged with the task.

Used for:
- sending a gentle check-in

Not used for:
- judging productivity
- sharing with family or therapists unless you allow it
```

## Language Guidelines

Avoid:

```text
We noticed you have been inactive for 47 minutes.
```

Prefer:

```text
Want a smaller first step?
```

Avoid:

```text
You ignored your task again.
```

Prefer:

```text
Still want help starting this?
```

## Family Sharing Consent

Family sharing must be explicit.

User should control:

- who can see summaries
- what they can see
- whether real-time updates are allowed
- whether encouragement prompts are allowed
- whether task titles are visible

## Therapist Sharing Consent

Therapist/client sharing must be explicit and revocable.

Do not share:

- raw transcripts by default
- private task titles unless enabled
- behavioral detection logs by default
- crisis/medical interpretations

## Security Requirements

Minimum requirements:

- TLS for all network traffic
- encrypted secrets
- hashed passwords if custom auth
- least-privilege backend access
- audit logs for professional access
- rate limits on auth and AI endpoints
- secure webhook validation for SMS
- PII minimization in logs

## Compliance Note
Pulse should avoid positioning itself as a medical device, diagnostic tool, or treatment tool unless the company intentionally pursues that path.

Suggested disclaimer:

```text
Pulse is a support and reflection tool. It is not a diagnostic, treatment, crisis, or medical decision-making product.
```
