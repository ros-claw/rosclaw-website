-- Keep moderation and Manifest attestations server-controlled even when an
-- authenticated author writes directly through the Supabase REST API.

create or replace function public.guard_mcp_package_trust()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  request_role text := coalesce(auth.role(), '');
  semantic_change boolean := false;
begin
  if request_role in ('anon', 'authenticated') then
    if tg_op = 'INSERT' then
      if new.author_user_id is distinct from auth.uid() then
        raise exception 'MCP package author must match the authenticated user'
          using errcode = '42501';
      end if;

      new.status := 'pending';
      new.is_verified := false;
      new.manifest_validated_at := null;
      new.manifest_validation_evidence := null;
      new.downloads_count := 0;
      new.rating := 0;
      new.review_count := 0;
      new.views_count := 0;
      new.github_stars := 0;
      new.github_forks := 0;
      new.github_updated_at := null;
      new.last_synced_at := null;
      new.install_command := null;
    elsif
      new.author_user_id is distinct from old.author_user_id
      or new.status is distinct from old.status
      or new.is_verified is distinct from old.is_verified
      or new.manifest_validated_at is distinct from old.manifest_validated_at
      or new.manifest_validation_evidence is distinct from old.manifest_validation_evidence
      or new.downloads_count is distinct from old.downloads_count
      or new.rating is distinct from old.rating
      or new.review_count is distinct from old.review_count
      or new.views_count is distinct from old.views_count
      or new.github_stars is distinct from old.github_stars
      or new.github_forks is distinct from old.github_forks
      or new.github_updated_at is distinct from old.github_updated_at
      or new.last_synced_at is distinct from old.last_synced_at
      or new.install_command is distinct from old.install_command
      or new.created_at is distinct from old.created_at
      or new.updated_at is distinct from old.updated_at
    then
      raise exception 'MCP moderation, attestation, and metric fields are server controlled'
        using errcode = '42501';
    end if;
  end if;

  if tg_op = 'UPDATE' then
    semantic_change := (
      new.name is distinct from old.name
      or new.display_name is distinct from old.display_name
      or new.description is distinct from old.description
      or new.long_description is distinct from old.long_description
      or new.category is distinct from old.category
      or new.version is distinct from old.version
      or new.author_name is distinct from old.author_name
      or new.github_repo_url is distinct from old.github_repo_url
      or new.ros_version is distinct from old.ros_version
      or new.safety_cert is distinct from old.safety_cert
      or new.python_version is distinct from old.python_version
      or new.robot_type is distinct from old.robot_type
      or new.tags is distinct from old.tags
      or new.install_command is distinct from old.install_command
      or new.tools is distinct from old.tools
      or new.readme_content is distinct from old.readme_content
      or new.entry_point is distinct from old.entry_point
    );

    if semantic_change then
      new.is_verified := false;
      new.manifest_validated_at := null;
      new.manifest_validation_evidence := null;
      if request_role in ('anon', 'authenticated') then
        new.status := 'pending';
      end if;
    end if;
  end if;

  if new.status <> 'approved' then
    new.is_verified := false;
    new.manifest_validated_at := null;
    new.manifest_validation_evidence := null;
  end if;

  return new;
end;
$$;

create or replace function public.guard_skill_moderation()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  request_role text := coalesce(auth.role(), '');
  semantic_change boolean := false;
begin
  if request_role in ('anon', 'authenticated') then
    if tg_op = 'INSERT' then
      if new.author_user_id is distinct from auth.uid() then
        raise exception 'Skill author must match the authenticated user'
          using errcode = '42501';
      end if;

      new.status := 'pending';
      new.downloads_count := 0;
      new.rating := 0;
      new.review_count := 0;
      new.views_count := 0;
      new.github_stars := 0;
      new.github_forks := 0;
      new.github_updated_at := null;
      new.last_synced_at := null;
      new.install_command := null;
    elsif
      new.author_user_id is distinct from old.author_user_id
      or new.status is distinct from old.status
      or new.downloads_count is distinct from old.downloads_count
      or new.rating is distinct from old.rating
      or new.review_count is distinct from old.review_count
      or new.views_count is distinct from old.views_count
      or new.github_stars is distinct from old.github_stars
      or new.github_forks is distinct from old.github_forks
      or new.github_updated_at is distinct from old.github_updated_at
      or new.last_synced_at is distinct from old.last_synced_at
      or new.install_command is distinct from old.install_command
      or new.created_at is distinct from old.created_at
      or new.updated_at is distinct from old.updated_at
    then
      raise exception 'Skill moderation and metric fields are server controlled'
        using errcode = '42501';
    end if;
  end if;

  if tg_op = 'UPDATE' then
    semantic_change := (
      new.name is distinct from old.name
      or new.display_name is distinct from old.display_name
      or new.description is distinct from old.description
      or new.long_description is distinct from old.long_description
      or new.category is distinct from old.category
      or new.version is distinct from old.version
      or new.author_name is distinct from old.author_name
      or new.author_url is distinct from old.author_url
      or new.github_repo_url is distinct from old.github_repo_url
      or new.icon_url is distinct from old.icon_url
      or new.robot_types is distinct from old.robot_types
      or new.tags is distinct from old.tags
      or new.compatible_robots is distinct from old.compatible_robots
      or new.dependencies is distinct from old.dependencies
      or new.readme_content is distinct from old.readme_content
    );

    if semantic_change and request_role in ('anon', 'authenticated') then
      new.status := 'pending';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_mcp_package_trust_guard on public.mcp_packages;
create trigger trg_mcp_package_trust_guard
  before insert or update on public.mcp_packages
  for each row execute function public.guard_mcp_package_trust();

drop trigger if exists trg_skill_moderation_guard on public.skills;
create trigger trg_skill_moderation_guard
  before insert or update on public.skills
  for each row execute function public.guard_skill_moderation();

drop policy if exists "mcp_packages_authenticated_create" on public.mcp_packages;
create policy "mcp_packages_authenticated_create" on public.mcp_packages
  for insert to authenticated
  with check (auth.uid() = author_user_id);

drop policy if exists "mcp_packages_owner_update" on public.mcp_packages;
create policy "mcp_packages_owner_update" on public.mcp_packages
  for update to authenticated
  using (auth.uid() = author_user_id)
  with check (auth.uid() = author_user_id);

drop policy if exists "skills_authenticated_create" on public.skills;
create policy "skills_authenticated_create" on public.skills
  for insert to authenticated
  with check (auth.uid() = author_user_id);

drop policy if exists "skills_owner_update" on public.skills;
create policy "skills_owner_update" on public.skills
  for update to authenticated
  using (auth.uid() = author_user_id)
  with check (auth.uid() = author_user_id);

alter table public.mcp_packages
  drop constraint if exists mcp_packages_manifest_validation_requires_approval;

alter table public.mcp_packages
  add constraint mcp_packages_manifest_validation_requires_approval
  check (
    not is_verified
    or (
      status = 'approved'
      and manifest_validation_evidence ~* '^https://'
    )
  );

comment on function public.guard_mcp_package_trust() is
  'Protects server fields, re-moderates author edits, and revokes stale Manifest evidence.';
comment on function public.guard_skill_moderation() is
  'Protects server fields and re-moderates author edits made through direct database writes.';
