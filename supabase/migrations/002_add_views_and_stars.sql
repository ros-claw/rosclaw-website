-- Add views_count and github_stars columns to mcp_packages
alter table public.mcp_packages
add column if not exists views_count integer not null default 0,
add column if not exists github_stars integer default 0;

-- Add views_count and github_stars to skills table
alter table public.skills
add column if not exists views_count integer not null default 0,
add column if not exists github_stars integer default 0;

-- Migrate existing data: copy downloads_count to views_count as starting point
update public.mcp_packages set views_count = downloads_count where views_count = 0;
update public.skills set views_count = downloads_count where views_count = 0;
