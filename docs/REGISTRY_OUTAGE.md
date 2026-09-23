# MCP / Skill registry outage runbook

The public MCP and Skill indexes use the same Supabase project. Vercel Cron
refreshes GitHub metadata **inside that database**; it does not replace it.

## Symptom and scope

- `/api/mcp-packages` and `/api/skills` return `503` with a safe
  `reason` (`configuration`, `timeout`, `network`, or `upstream`).
- Hub pages and item pages distinguish registry downtime from an empty catalog
  or a genuinely missing item. Counts are shown as unknown, not zero.
- On 2026-09-24, both public table reads timed out and the project's Auth
  health request returned a 504 Gateway Timeout. The public client bundle
  points at project `ptzizfbreytzetyelxiv`, so this is not an obsolete URL.
  This does not by itself prove whether the project is paused, overloaded,
  or experiencing a provider incident.

## Recovery

1. Open [the Supabase project dashboard](https://supabase.com/dashboard/project/ptzizfbreytzetyelxiv).
   Confirm its project state and the Database / Auth / REST service health.
2. If it is **Paused**, use the dashboard's **Resume project** action.
   Vercel Pro does not prevent a Supabase Free project from pausing.
3. If it is **Active but unhealthy**, inspect Postgres and API logs, database
   resource/connection metrics, and any billing or service notices. Follow
   Supabase's unhealthy-services guidance before changing capacity or
   restarting the database.
4. If the project URL or keys changed, update
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
   `SUPABASE_SERVICE_ROLE_KEY` in Vercel for the production environment,
   then redeploy. Never put the service-role key in a public response.
5. Confirm both API lists return **200 with arrays**, item pages show their
   source links, and `npm run test:live` passes. Only then run the protected
   GitHub sync endpoint if the last sync is overdue; keep `CRON_SECRET` and
   `ADMIN_API_KEY` private.

The code bounds registry reads to eight seconds and responds with 503 during
outages. This prevents an unavailable database from being represented as an
empty or missing registry, but it cannot restore the Supabase project itself.
