-- =============================================================================
-- ROSClaw Platform Schema: 006_add_user_api_keys.sql
-- =============================================================================
-- Maps Wiki/CLI API keys (hashed) to website user accounts so that key-based
-- mutations can be scoped to the key owner's resources.
-- =============================================================================

create table public.user_api_keys (
  api_key_hash text primary key,
  user_id uuid
    references public.profiles(id)
    on delete cascade
    not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.user_api_keys
  is 'Maps hashed external API keys to website user accounts for ownership enforcement';

-- Index for fast user-to-key lookups
create index idx_user_api_keys_user_id on public.user_api_keys(user_id);

create trigger trg_user_api_keys_updated_at
  before update on public.user_api_keys
  for each row
  execute function public.set_updated_at();

-- RLS
alter table public.user_api_keys enable row level security;

-- Users can read/insert/update/delete their own mapping
-- (service_role bypasses these for the OAuth callback)
create policy "user_api_keys_own_select" on public.user_api_keys
  for select
  using (auth.uid() = user_id);

create policy "user_api_keys_own_insert" on public.user_api_keys
  for insert
  with check (auth.uid() = user_id);

create policy "user_api_keys_own_update" on public.user_api_keys
  for update
  using (auth.uid() = user_id);

create policy "user_api_keys_own_delete" on public.user_api_keys
  for delete
  using (auth.uid() = user_id);
