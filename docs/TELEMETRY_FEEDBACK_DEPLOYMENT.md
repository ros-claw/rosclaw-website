# ROSClaw Feedback & Telemetry — Deployment Guide

This document explains how to configure Vercel, Supabase, and local development for the Feedback & Telemetry module.

## Overview

After the website code is deployed, you must complete three external configuration steps:

1. Configure Vercel environment variables.
2. Apply the Supabase migration.
3. Create the two private Supabase Storage buckets.

## 1. Vercel Environment Variables

Add the following variables in **Vercel Project Settings → Environment Variables** (or use the Vercel CLI).

### Supabase

| Variable | Value | Should be secret? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<project>.supabase.co` | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `<anon-key>` | No |
| `SUPABASE_SERVICE_ROLE_KEY` | `<service-role-key>` | **Yes** |

**Important**: `SUPABASE_SERVICE_ROLE_KEY` must never be prefixed with `NEXT_PUBLIC_` and must never be exposed to the browser.

### Telemetry / Feedback settings

| Variable | Suggested value | Purpose |
|---|---|---|
| `NEXT_PUBLIC_TELEMETRY_NOTICE_ENABLED` | `true` | Show telemetry notice banner |
| `ROSCLAW_TELEMETRY_MAX_EVENT_BYTES` | `16384` | Max telemetry event payload size |
| `ROSCLAW_TELEMETRY_RATE_LIMIT_ENABLED` | `true` | Enable per-anon-ID / per-IP rate limits |
| `ROSCLAW_FEEDBACK_REQUIRE_REDACT` | `true` | Reject feedback uploads unless `redacted=true` |
| `ROSCLAW_FEEDBACK_MAX_BUNDLE_MB` | `25` | Max feedback bundle size in MB |

### Admin access

| Variable | Value |
|---|---|
| `ROSCLAW_ADMIN_EMAILS` | `shaoxiang007@gmail.com` |

Use a comma-separated list for multiple admins. These emails must match the Google/GitHub OAuth email used to log in.

### Vercel CLI commands (optional)

If you have the Vercel CLI authenticated:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add ROSCLAW_ADMIN_EMAILS production
vercel env add ROSCLAW_TELEMETRY_MAX_EVENT_BYTES production
vercel env add ROSCLAW_TELEMETRY_RATE_LIMIT_ENABLED production
vercel env add ROSCLAW_FEEDBACK_REQUIRE_REDACT production
vercel env add ROSCLAW_FEEDBACK_MAX_BUNDLE_MB production
```

## 2. Supabase Migration

The migration file is at:

```text
supabase/migrations/004_telemetry_feedback_schema.sql
```

### Option A: Supabase CLI (recommended)

```bash
# Make sure you are logged in and linked to the project
supabase login
supabase link --project-ref <project-ref>

# Apply the migration
supabase db push

# Or reset the local database (destroys local data)
supabase db reset
```

### Option B: Supabase Dashboard SQL Editor

1. Open your project in Supabase Dashboard.
2. Go to **SQL Editor → New query**.
3. Paste the full contents of `supabase/migrations/004_telemetry_feedback_schema.sql`.
4. Click **Run**.

### What the migration creates

| Table | Purpose |
|---|---|
| `telemetry_installations` | Anonymous installation deduplication |
| `telemetry_events` | Raw telemetry events |
| `telemetry_daily_aggregates` | Hourly aggregated metrics |
| `feedback_batches` | Uploaded feedback bundle metadata |
| `feedback_events` | Structured events from bundles |
| `feedback_attachments` | Attachment metadata |
| `feedback_delete_requests` | User deletion requests |

All tables have RLS enabled and only allow the `service_role` role.

## 3. Supabase Storage Buckets

Create two **private** buckets. Do not enable public URLs.

| Bucket | Purpose |
|---|---|
| `feedback-bundles` | Uploaded `.tar.gz` feedback bundles |
| `feedback-attachments` | Media, MCAP summaries, trace summaries |

### Option A: Supabase Dashboard

1. Go to **Storage → New bucket**.
2. Name: `feedback-bundles`.
3. Toggle **Public bucket** to OFF.
4. Repeat for `feedback-attachments`.

### Option B: Supabase CLI

```bash
supabase storage bucket create feedback-bundles --private
supabase storage bucket create feedback-attachments --private
```

### Option C: SQL in Dashboard

```sql
insert into storage.buckets (id, name, public)
values
  ('feedback-bundles', 'feedback-bundles', false),
  ('feedback-attachments', 'feedback-attachments', false);
```

## 4. Vercel Cron

`vercel.json` already contains:

```json
{
  "crons": [
    {
      "path": "/api/admin/telemetry/aggregate",
      "schedule": "0 * * * *"
    }
  ]
}
```

Vercel Pro/Enterprise accounts can use Cron. If you are on Hobby, the Cron tab will show the job but it may not run automatically. You can manually trigger aggregation via:

```bash
curl -X POST https://www.rosclaw.io/api/admin/telemetry/aggregate
```

## 5. Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start Supabase locally
supabase start
supabase db reset

# 3. Create local storage buckets
supabase storage bucket create feedback-bundles --private
supabase storage bucket create feedback-attachments --private

# 4. Copy env vars
cp .env.example .env.local
# Then fill in your local Supabase URL, anon key, and service role key.

# 5. Run dev server
npm run dev
```

## 6. Testing

### Test telemetry event

```bash
curl -X POST http://localhost:3000/api/telemetry/event \
  -H "Content-Type: application/json" \
  -d '{
    "schema_version": "rosclaw.telemetry.event.v1",
    "event_type": "command_completed",
    "anonymous_installation_id": "rci_00000000000000000000000000000000",
    "created_at": "2026-06-24T18:00:00Z",
    "rosclaw_version": "1.0.3",
    "command_name": "doctor",
    "command_status": "success",
    "duration_bucket": "1s-5s"
  }'
```

Expected response:

```json
{ "ok": true, "request_id": "tel_<uuid>" }
```

### Test forbidden field rejection

```bash
curl -X POST http://localhost:3000/api/telemetry/event \
  -H "Content-Type: application/json" \
  -d '{
    "schema_version": "rosclaw.telemetry.event.v1",
    "event_type": "command_completed",
    "anonymous_installation_id": "rci_00000000000000000000000000000000",
    "created_at": "2026-06-24T18:00:00Z",
    "prompt": "this should be rejected"
  }'
```

Expected response:

```json
{ "ok": false, "error": "forbidden_field", "field": "prompt" }
```

### Test heartbeat

```bash
curl -X POST http://localhost:3000/api/telemetry/heartbeat \
  -H "Content-Type: application/json" \
  -d '{
    "schema_version": "rosclaw.telemetry.heartbeat.v1",
    "event_type": "heartbeat",
    "anonymous_installation_id": "rci_00000000000000000000000000000000",
    "created_at": "2026-06-24T18:00:00Z",
    "rosclaw_version": "1.0.3"
  }'
```

### Test feedback upload

```bash
curl -X POST http://localhost:3000/api/feedback/upload \
  -F "bundle=@feedback_bundle.tar.gz" \
  -F "schema_version=rosclaw.feedback.upload.v1" \
  -F "anonymous_installation_id=rci_00000000000000000000000000000000" \
  -F "client_version=1.0.3" \
  -F "redacted=true" \
  -F "media_count=0" \
  -F "days=7"
```

Expected response:

```json
{ "ok": true, "request_id": "fb_<uuid>", "batch_id": "<uuid>" }
```

## 7. Admin Access

1. Go to `https://www.rosclaw.io/login` and sign in with Google or GitHub.
2. The email you use must be in `ROSCLAW_ADMIN_EMAILS`.
3. Visit `https://www.rosclaw.io/admin/telemetry` or `https://www.rosclaw.io/admin/feedback`.

If you are not an admin, you will be redirected to `/login`.

## 8. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| CLI ping returns `ok` but DB has no data | API used anon key instead of service role | Check `SUPABASE_SERVICE_ROLE_KEY` |
| `forbidden_field` error | Request contains hostname/username/prompt/etc. | Update CLI to latest version |
| `bundle_too_large` | Bundle exceeds `ROSCLAW_FEEDBACK_MAX_BUNDLE_MB` | Reduce `--days` or exclude media |
| Dashboard shows no data | Aggregation not run | Manually call `/api/admin/telemetry/aggregate` |
| Admin page redirects to login | User email not in `ROSCLAW_ADMIN_EMAILS` | Add email to env vars and redeploy |
| Storage upload fails | Buckets do not exist or are public | Create private buckets `feedback-bundles` and `feedback-attachments` |

## 9. Next Steps

- Add Vitest tests if you want automated coverage (currently manual curl tests only).
- Migrate rate limiting from in-memory to Redis/Vercel KV before high traffic.
- Set up staging environment for E2E testing with the CLI.
