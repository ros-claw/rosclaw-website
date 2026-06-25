-- Add entry_point column to mcp_packages so the registry can return the
-- correct server script path instead of always defaulting to server.py.

alter table public.mcp_packages
add column if not exists entry_point text default 'server.py';

comment on column public.mcp_packages.entry_point
  is 'Relative path to the MCP server entry point script (e.g. src/mcp_server.py)';

-- Update the Vicon package to match its repository layout and version.
update public.mcp_packages
set entry_point = 'src/mcp_server.py',
    version = '1.0.0',
    updated_at = now()
where name = 'ros-claw/vicon-datastream-mcp';
