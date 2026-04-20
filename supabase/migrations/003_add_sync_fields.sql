-- Add sync-related fields to mcp_packages and skills tables
-- These fields are used for caching README content and tracking sync status

-- Add fields to mcp_packages table
alter table public.mcp_packages
add column if not exists readme_content text,
add column if not exists last_synced_at timestamp with time zone,
add column if not exists github_forks integer default 0,
add column if not exists github_updated_at timestamp with time zone;

-- Add fields to skills table
alter table public.skills
add column if not exists readme_content text,
add column if not exists last_synced_at timestamp with time zone,
add column if not exists github_forks integer default 0,
add column if not exists github_updated_at timestamp with time zone;

-- Add index for faster sync queries
create index if not exists idx_mcp_packages_last_synced_at on public.mcp_packages(last_synced_at);
create index if not exists idx_skills_last_synced_at on public.skills(last_synced_at);

-- Add comment for documentation
comment on column public.mcp_packages.readme_content is 'Cached README content from GitHub';
comment on column public.mcp_packages.last_synced_at is 'Last time this package was synced with GitHub';
comment on column public.skills.readme_content is 'Cached README content from GitHub';
comment on column public.skills.last_synced_at is 'Last time this skill was synced with GitHub';
