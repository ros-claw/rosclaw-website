-- A legacy generic verification flag is not evidence of manifest validation.
-- Existing attestations must be re-established under this explicit contract.
update public.mcp_packages
set is_verified = false
where is_verified = true;

alter table public.mcp_packages
  add column if not exists manifest_validated_at timestamptz,
  add column if not exists manifest_validation_evidence text;

alter table public.mcp_packages
  add constraint mcp_packages_manifest_validation_evidence
  check (
    not is_verified
    or (
      manifest_validated_at is not null
      and nullif(btrim(manifest_validation_evidence), '') is not null
    )
  );

comment on column public.mcp_packages.is_verified is
  'True only when the package manifest was validated and timestamped evidence is recorded.';
comment on column public.mcp_packages.manifest_validation_evidence is
  'Durable reference to the validator output, CI run, or signed evidence record.';
