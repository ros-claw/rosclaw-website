# Registry Manifest Attestation

Registry approval and Manifest validation are separate operations.

- `status = approved` makes discovery metadata public.
- `is_verified = true` is accepted only when `manifest_validated_at` and
  `manifest_validation_evidence` are also present.
- Manifest validation does not imply CI, simulation, hardware, or Agent
  verification.

## Prerequisites

Apply these migrations in order:

1. `supabase/migrations/007_manifest_validation_evidence.sql`
2. `supabase/migrations/008_registry_trust_guards.sql`

Migration 008 prevents direct authenticated Supabase clients from changing
moderation, attestation, or metric fields. Author edits to semantic package or
Skill metadata return the record to `pending`; MCP edits also revoke any prior
Manifest attestation.

Configure these server-side Vercel variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ROSCLAW_ADMIN_EMAILS
```

`ROSCLAW_ADMIN_EMAILS` is a comma-separated allowlist. Never expose an
administrator secret through a `NEXT_PUBLIC_*` variable. `ADMIN_API_KEY` is
reserved for non-browser automation.

User-scoped API keys create pending records. Only `ADMIN_API_KEY` automation or
an allowlisted administrator can bypass the review queue.

## Recording Evidence

1. Sign in through `/login` with an allowlisted email.
2. Open `/admin`, select an approved MCP package, and enter the evidence URL.
3. Record the attestation only after the referenced validator result has been
   reviewed.

The server accepts only a public HTTPS URL and writes the validation timestamp
itself. Suitable evidence is an immutable CI run, signed attestation, or
content-addressed validation record that identifies the source revision and
Manifest validator. A README claim, mutable branch page, screenshot, or package
approval is not validation evidence.

Revocation atomically clears the boolean, timestamp, and evidence reference.
Rejecting an MCP package also clears any previous Manifest attestation. Source,
version, entry point, tool schema, documentation, or other semantic metadata
changes revoke stale evidence automatically and author edits return the record
to review. The modified package must be approved and validated again.

## Public Contract

Validated MCP API records include:

```json
{
  "manifestValidated": true,
  "manifestValidatedAt": "2026-07-22T00:00:00.000Z",
  "manifestValidationEvidence": "https://github.com/.../actions/runs/...",
  "manifestValidationEvidenceUrl": "https://github.com/.../actions/runs/..."
}
```

Manifest validation does not make the legacy website index installable. The
public Hub bundle/catalog protocol is not deployed, so Registry records do not
expose install commands. They remain discovery metadata until that protocol and
its signed assets are available end to end.

## Verification

```bash
npm test
npm run build
npm run test:live
```

`test:live` checks that unauthenticated Registry administration is denied,
validation badges always have timestamped evidence, and legacy discovery
records do not expose install commands.
