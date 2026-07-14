# GitHub Registry Sync on Vercel

The production cron keeps MCP and Skill records synchronized with their GitHub repositories.

## Schedule

Vercel calls `/api/cron/github-sync` every day at 03:15 Asia/Shanghai (19:15 UTC). The endpoint only selects records whose `last_synced_at` is missing or in the five-day due window. A 30-minute schedule grace prevents a run that completed shortly after 19:15 from slipping to day six. This avoids the uneven month-boundary intervals produced by a `*/5` day-of-month cron expression while preserving a five-day refresh cadence.

Failed repositories remain due and are retried by the next daily invocation. Each run processes up to 600 registry records with eight concurrent GitHub requests by default.

Repository-root MCP entries synchronize their README. Skill entries that point at a GitHub subdirectory synchronize that directory's `SKILL.md` (with README fallbacks) from the current default branch, including entries originally imported with a pinned commit URL.

## Required Vercel environment variables

| Variable | Purpose |
| --- | --- |
| `CRON_SECRET` | Protects the cron route; Vercel sends it as a Bearer token. |
| `GITHUB_TOKEN` | GitHub API token used for repository metadata and README requests. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key used to update registry records. |

`BAILIAN_API_KEY` is optional. When configured, changed MCP READMEs are re-analyzed so the cached tool list can follow documentation changes. Without it, README, version, stars, forks, and source timestamps still synchronize.

Optional tuning variables:

- `GITHUB_SYNC_MAX_ITEMS` (default `600`, maximum `1000`)
- `GITHUB_SYNC_CONCURRENCY` (default `8`, maximum `20`)

## Manual verification

Run a normal due-only sync:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://www.rosclaw.io/api/cron/github-sync
```

Force a full eligible batch for deployment verification:

```bash
curl -H "x-api-key: $ADMIN_API_KEY" \
  "https://www.rosclaw.io/api/cron/github-sync?force=1"
```

The response includes due, succeeded, failed, skipped, and repository counts. Failure details are capped at 25 entries.
