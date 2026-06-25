-- ROSClaw Feedback & Telemetry Schema (v1)
-- Tables: telemetry_installations, telemetry_events, telemetry_daily_aggregates
--          feedback_batches, feedback_events, feedback_attachments, feedback_delete_requests
-- RLS: service_role only

-- 1. telemetry_installations
create table if not exists public.telemetry_installations (
  id uuid default gen_random_uuid() primary key,
  anonymous_installation_id text unique not null,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  first_rosclaw_version text,
  latest_rosclaw_version text,
  os_family text,
  arch text,
  python_major_minor text,
  install_channel text,
  deployment_mode text,
  telemetry_status text not null default 'enabled'
);

create index if not exists idx_telemetry_installations_last_seen
  on public.telemetry_installations(last_seen_at);
create index if not exists idx_telemetry_installations_version
  on public.telemetry_installations(latest_rosclaw_version);
create index if not exists idx_telemetry_installations_os
  on public.telemetry_installations(os_family);

-- 2. telemetry_events
create table if not exists public.telemetry_events (
  id uuid default gen_random_uuid() primary key,
  anonymous_installation_id text not null,
  schema_version text not null,
  event_type text not null,
  command_name text,
  command_status text,
  module_name text,
  rosclaw_version text,
  cli_version text,
  os_family text,
  arch text,
  python_major_minor text,
  install_channel text,
  deployment_mode text,
  duration_bucket text,
  error_class_bucket text,
  created_at timestamptz not null,
  received_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb
);

create index if not exists idx_telemetry_events_installation
  on public.telemetry_events(anonymous_installation_id);
create index if not exists idx_telemetry_events_type
  on public.telemetry_events(event_type);
create index if not exists idx_telemetry_events_command
  on public.telemetry_events(command_name);
create index if not exists idx_telemetry_events_module
  on public.telemetry_events(module_name);
create index if not exists idx_telemetry_events_received_at
  on public.telemetry_events(received_at);

-- 3. telemetry_daily_aggregates
create table if not exists public.telemetry_daily_aggregates (
  id uuid default gen_random_uuid() primary key,
  day date not null,
  metric_name text not null,
  dimension jsonb not null default '{}'::jsonb,
  value numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(day, metric_name, dimension)
);

create index if not exists idx_telemetry_daily_metric
  on public.telemetry_daily_aggregates(metric_name);
create index if not exists idx_telemetry_daily_day
  on public.telemetry_daily_aggregates(day);

-- 4. feedback_batches
create table if not exists public.feedback_batches (
  id uuid default gen_random_uuid() primary key,
  anonymous_installation_id text not null,
  schema_version text not null,
  event_count integer not null default 0,
  attachment_count integer not null default 0,
  redacted boolean not null default true,
  client_version text,
  created_at timestamptz not null default now(),
  received_at timestamptz not null default now(),
  status text not null default 'received',
  privacy_level text not null default 'L0',
  redaction_report jsonb not null default '{}'::jsonb
);

create index if not exists idx_feedback_batches_anon
  on public.feedback_batches(anonymous_installation_id);
create index if not exists idx_feedback_batches_received_at
  on public.feedback_batches(received_at);

-- 5. feedback_events
create table if not exists public.feedback_events (
  id uuid default gen_random_uuid() primary key,
  batch_id uuid references public.feedback_batches(id) on delete cascade,
  event_id text not null,
  anonymous_installation_id text not null,
  schema_version text not null,
  category text not null,
  module text not null,
  severity text not null default 'info',
  rosclaw_version text,
  robot_type text,
  skill_id text,
  task_id text,
  provider_type text,
  created_at timestamptz not null,
  received_at timestamptz not null default now(),
  privacy_level text not null default 'L0',
  redacted boolean not null default true,
  payload jsonb not null default '{}'::jsonb
);

create index if not exists idx_feedback_events_batch
  on public.feedback_events(batch_id);
create index if not exists idx_feedback_events_category
  on public.feedback_events(category);
create index if not exists idx_feedback_events_module
  on public.feedback_events(module);
create index if not exists idx_feedback_events_received_at
  on public.feedback_events(received_at);

-- 6. feedback_attachments
create table if not exists public.feedback_attachments (
  id uuid default gen_random_uuid() primary key,
  batch_id uuid references public.feedback_batches(id) on delete cascade,
  anonymous_installation_id text not null,
  storage_bucket text not null,
  storage_path text not null,
  file_name text not null,
  mime_type text not null,
  size_bytes bigint not null,
  sha256 text not null,
  redacted boolean not null default true,
  attachment_type text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_feedback_attachments_batch
  on public.feedback_attachments(batch_id);

-- 7. feedback_delete_requests
create table if not exists public.feedback_delete_requests (
  id uuid default gen_random_uuid() primary key,
  anonymous_installation_id text not null,
  status text not null default 'pending',
  reason text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists idx_feedback_delete_requests_anon
  on public.feedback_delete_requests(anonymous_installation_id);
create index if not exists idx_feedback_delete_requests_status
  on public.feedback_delete_requests(status);

-- RLS: enable on all tables
alter table public.telemetry_installations enable row level security;
alter table public.telemetry_events enable row level security;
alter table public.telemetry_daily_aggregates enable row level security;
alter table public.feedback_batches enable row level security;
alter table public.feedback_events enable row level security;
alter table public.feedback_attachments enable row level security;
alter table public.feedback_delete_requests enable row level security;

-- RLS: service_role only policies
create policy "service_role_only_telemetry_installations"
  on public.telemetry_installations for all to service_role using (true) with check (true);

create policy "service_role_only_telemetry_events"
  on public.telemetry_events for all to service_role using (true) with check (true);

create policy "service_role_only_telemetry_daily_aggregates"
  on public.telemetry_daily_aggregates for all to service_role using (true) with check (true);

create policy "service_role_only_feedback_batches"
  on public.feedback_batches for all to service_role using (true) with check (true);

create policy "service_role_only_feedback_events"
  on public.feedback_events for all to service_role using (true) with check (true);

create policy "service_role_only_feedback_attachments"
  on public.feedback_attachments for all to service_role using (true) with check (true);

create policy "service_role_only_feedback_delete_requests"
  on public.feedback_delete_requests for all to service_role using (true) with check (true);

-- Helper: upsert telemetry installation while preserving first_seen_at / first_rosclaw_version
create or replace function public.upsert_telemetry_installation(
  p_anonymous_installation_id text,
  p_first_seen_at timestamptz,
  p_last_seen_at timestamptz,
  p_first_rosclaw_version text,
  p_latest_rosclaw_version text,
  p_os_family text,
  p_arch text,
  p_python_major_minor text,
  p_install_channel text,
  p_deployment_mode text,
  p_telemetry_status text
) returns void
language plpgsql
security definer
as $$
begin
  insert into public.telemetry_installations (
    anonymous_installation_id,
    first_seen_at,
    last_seen_at,
    first_rosclaw_version,
    latest_rosclaw_version,
    os_family,
    arch,
    python_major_minor,
    install_channel,
    deployment_mode,
    telemetry_status
  ) values (
    p_anonymous_installation_id,
    p_first_seen_at,
    p_last_seen_at,
    p_first_rosclaw_version,
    p_latest_rosclaw_version,
    p_os_family,
    p_arch,
    p_python_major_minor,
    p_install_channel,
    p_deployment_mode,
    p_telemetry_status
  )
  on conflict (anonymous_installation_id) do update set
    last_seen_at = excluded.last_seen_at,
    latest_rosclaw_version = excluded.latest_rosclaw_version,
    os_family = excluded.os_family,
    arch = excluded.arch,
    python_major_minor = excluded.python_major_minor,
    install_channel = excluded.install_channel,
    deployment_mode = excluded.deployment_mode,
    telemetry_status = excluded.telemetry_status;
end;
$$;
