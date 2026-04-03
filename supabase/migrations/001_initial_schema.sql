-- =============================================================================
-- ROSClaw Platform Schema: 001_initial_schema.sql
-- =============================================================================
-- Tables:        profiles, skills, mcp_packages, changelog_entries, downloads
-- Indexes:       search-friendly and relationship indexes
-- Functions:     auto-updated_at triggers, updated_at triggers
-- RLS Policies:  row-level security across all tables
-- =============================================================================

-- Enable UUID generation (usually enabled by default via Supabase)
create extension if not exists "uuid-ossp";

-- =============================================================================
-- 1. PROFILES TABLE
-- =============================================================================
-- User profiles linked to auth.users
create table public.profiles (
  id uuid
    references auth.users(id)
    on delete cascade
    primary key,
  username text unique,
  full_name text,
  avatar_url text,
  github_username text unique,
  -- NOTE: github_access_token should be stored encrypted in production
  github_access_token text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.profiles.github_access_token
  is 'Encrypted GitHub Personal Access Token - rotate regularly';

-- =============================================================================
-- 2. SKILLS TABLE
-- =============================================================================
-- Skill Market entries (SKILL.md style entries)
create table public.skills (
  id uuid
    default gen_random_uuid()
    primary key,
  name text unique not null,
  display_name text not null,
  description text,
  long_description text,
  category text,
  version text not null default '1.0.0',
  author_user_id uuid
    references public.profiles(id)
    on delete set null,
  author_name text not null,
  author_url text,
  github_repo_url text,
  downloads_count integer not null default 0,
  rating numeric(3,2) not null default 0 check (rating between 0 and 5),
  review_count integer not null default 0 check (review_count >= 0),
  icon_url text,
  -- Status: pending | approved | rejected
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  robot_types text[],
  tags text[],
  compatible_robots text[],
  dependencies text[],
  install_command text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =============================================================================
-- 3. MCP_PACKAGES TABLE
-- =============================================================================
-- MCP Hub package entries
create table public.mcp_packages (
  id uuid
    default gen_random_uuid()
    primary key,
  name text unique not null,
  display_name text,
  description text,
  long_description text,
  category text,
  version text not null default '1.0.0',
  author_user_id uuid
    references public.profiles(id)
    on delete set null,
  author_name text not null,
  is_verified boolean not null default false,
  github_repo_url text,
  downloads_count integer not null default 0,
  rating numeric(3,2) not null default 0 check (rating between 0 and 5),
  review_count integer not null default 0 check (review_count >= 0),
  ros_version text,
  safety_cert text,
  python_version text,
  -- Status: pending | approved | rejected
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  robot_type text,
  tags text[],
  install_command text,
  -- Array of tools {name, description}
  tools jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Validate tools JSONB shape via check constraint
comment on column public.mcp_packages.tools
  is 'Array of tool objects: [{ "name": string, "description": string }]';

-- =============================================================================
-- 4. CHANGELOG_ENTRIES TABLE
-- =============================================================================
-- Version history for skills and mcp_packages
create table public.changelog_entries (
  id uuid
    default gen_random_uuid()
    primary key,
  parent_type text not null
    check (parent_type in ('skill', 'mcp_package')),
  parent_id uuid not null,
  version text not null,
  changes jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

comment on column public.changelog_entries.changes
  is 'Array of change objects: [{ "type": "added"|"changed"|"removed"|"fixed", "description": string }]';

-- =============================================================================
-- 5. DOWNLOADS TABLE
-- =============================================================================
-- Download / usage tracking
create table public.downloads (
  id uuid
    default gen_random_uuid()
    primary key,
  parent_type text not null
    check (parent_type in ('skill', 'mcp_package')),
  parent_id uuid not null,
  user_id uuid
    references public.profiles(id)
    on delete set null,
  created_at timestamptz not null default now()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- profiles
create index idx_profiles_username on public.profiles(username);
create index idx_profiles_github_username on public.profiles(github_username);

-- skills
create index idx_skills_status on public.skills(status);
create index idx_skills_category on public.skills(category);
create index idx_skills_author on public.skills(author_user_id);
create index idx_skills_tags on public.skills using gin(tags);
create index idx_skills_name_ci on public.skills(upper(name));

-- mcp_packages
create index idx_mcp_packages_status on public.mcp_packages(status);
create index idx_mcp_packages_category on public.mcp_packages(category);
create index idx_mcp_packages_author on public.mcp_packages(author_user_id);
create index idx_mcp_packages_verified on public.mcp_packages(is_verified);
create index idx_mcp_packages_tags on public.mcp_packages using gin(tags);
create index idx_mcp_packages_name_ci on public.mcp_packages(upper(name));

-- changelog_entries
create index idx_changelog_parent on public.changelog_entries(parent_type, parent_id);
create index idx_changelog_version on public.changelog_entries(version);

-- downloads
create index idx_downloads_parent on public.downloads(parent_type, parent_id);
create index idx_downloads_user on public.downloads(user_id);
create index idx_downloads_created_at on public.downloads(created_at);

-- =============================================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================================

-- Set updated_at automatically on UPDATE
create or replace function public.set_updated_at()
returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Increment downloads_count after a download record is inserted
create or replace function public.increment_downloads_count()
returns trigger
language plpgsql as $$
begin
  if new.parent_type = 'skill' then
    update public.skills
    set downloads_count = downloads_count + 1
    where id = new.parent_id;
  elsif new.parent_type = 'mcp_package' then
    update public.mcp_packages
    set downloads_count = downloads_count + 1
    where id = new.parent_id;
  end if;
  return new;
end;
$$;

-- Triggers for updated_at
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

create trigger trg_skills_updated_at
  before update on public.skills
  for each row
  execute function public.set_updated_at();

create trigger trg_mcp_packages_updated_at
  before update on public.mcp_packages
  for each row
  execute function public.set_updated_at();

-- Trigger to auto-increment download counts
create trigger trg_downloads_increment_count
  after insert on public.downloads
  for each row
  execute function public.increment_downloads_count();

-- Auto-create profile on new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on every table
alter table public.profiles           enable row level security;
alter table public.skills             enable row level security;
alter table public.mcp_packages       enable row level security;
alter table public.changelog_entries  enable row level security;
alter table public.downloads          enable row level security;

-- ---------------------------------------------------------------------------
-- PROFILES policies
-- ---------------------------------------------------------------------------

-- Anyone can read profiles
create policy "profiles_public_read" on public.profiles
  for select
  using (true);

-- Users can update their own profile
create policy "profiles_own_update" on public.profiles
  for update
  using (auth.uid() = id);

-- Users can insert their own profile on signup
create policy "profiles_own_insert" on public.profiles
  for insert
  with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- SKILLS policies
-- ---------------------------------------------------------------------------

-- Public read for approved skills only
create policy "skills_public_read_approved" on public.skills
  for select
  using (status = 'approved');

-- Authors can read their own skills regardless of status
create policy "skills_author_read_all" on public.skills
  for select
  using (auth.uid() = author_user_id);

-- Authenticated users can create skills
create policy "skills_authenticated_create" on public.skills
  for insert
  with check (auth.role() = 'authenticated');

-- Authors can update their own skills
create policy "skills_owner_update" on public.skills
  for update
  using (auth.uid() = author_user_id);

-- ---------------------------------------------------------------------------
-- MCP_PACKAGES policies
-- ---------------------------------------------------------------------------

-- Public read for approved packages only
create policy "mcp_packages_public_read_approved" on public.mcp_packages
  for select
  using (status = 'approved');

-- Authors can read their own packages regardless of status
create policy "mcp_packages_author_read_all" on public.mcp_packages
  for select
  using (auth.uid() = author_user_id);

-- Authenticated users can create packages
create policy "mcp_packages_authenticated_create" on public.mcp_packages
  for insert
  with check (auth.role() = 'authenticated');

-- Authors can update their own packages
create policy "mcp_packages_owner_update" on public.mcp_packages
  for update
  using (auth.uid() = author_user_id);

-- ---------------------------------------------------------------------------
-- CHANGELOG_ENTRIES policies
-- ---------------------------------------------------------------------------

-- Public read
create policy "changelog_public_read" on public.changelog_entries
  for select
  using (true);

-- Authenticated users can create changelog entries for skills or packages they authored
create policy "changelog_owner_parent_create" on public.changelog_entries
  for insert
  with check (
    auth.role() = 'authenticated'
    and (
      (parent_type = 'skill' and exists (
        select 1 from public.skills s
        where s.id = changelog_entries.parent_id
        and s.author_user_id = auth.uid()
      ))
      or
      (parent_type = 'mcp_package' and exists (
        select 1 from public.mcp_packages m
        where m.id = changelog_entries.parent_id
        and m.author_user_id = auth.uid()
      ))
    )
  );

-- ---------------------------------------------------------------------------
-- DOWNLOADS policies
-- ---------------------------------------------------------------------------
-- Authenticated users can insert their own download records
create policy "downloads_authenticated_insert" on public.downloads
  for insert
  with check (auth.role() = 'authenticated');

-- Public read (allows aggregate queries and audit)
create policy "downloads_public_read" on public.downloads
  for select
  using (true);

-- =============================================================================
-- VIEWS (useful helpers)
-- =============================================================================

-- Popular skills by download count
create or replace view public.popular_skills as
select
  id, name, display_name, description, category, version,
  author_name, downloads_count, rating, icon_url
from public.skills
where status = 'approved'
order by downloads_count desc, rating desc;

-- Popular MCP packages by download count
create or replace view public.popular_mcp_packages as
select
  id, name, display_name, description, category, version,
  author_name, is_verified, downloads_count, rating
from public.mcp_packages
where status = 'approved'
order by downloads_count desc, rating desc;

-- Recent changelog entries for a parent
create or replace view public.latest_changelogs as
select distinct on (parent_type, parent_id)
  id, parent_type, parent_id, version, changes, created_at
from public.changelog_entries
order by parent_type, parent_id, created_at desc;

-- Download aggregate summary by parent
create or replace view public.download_summary as
select
  parent_type,
  parent_id,
  count(*) as download_count,
  count(distinct user_id) as unique_users,
  min(created_at) as first_downloaded_at,
  max(created_at) as last_downloaded_at
from public.downloads
group by parent_type, parent_id;

-- =============================================================================
-- END OF MIGRATION
-- =============================================================================
