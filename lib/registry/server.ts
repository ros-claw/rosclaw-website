import "server-only";

import { createClient } from "@supabase/supabase-js";
import type {
  McpPackageSummary,
  RegistryLoad,
  SkillSummary,
} from "@/lib/registry/types";
import { hasManifestValidationEvidence } from "@/lib/registry/verification";

type RegistryRow = Record<string, unknown>;

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function numberValue(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function stringList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

export async function loadMcpPackages(): Promise<RegistryLoad<McpPackageSummary>> {
  const supabase = client();
  if (!supabase) return { items: [], available: false };
  const { data, error } = await supabase
    .from("mcp_packages")
    .select("*")
    .eq("status", "approved")
    .order("downloads_count", { ascending: false });
  if (error) {
    console.error("MCP registry SSR load failed:", error.message);
    return { items: [], available: false };
  }
  const items = ((data ?? []) as RegistryRow[]).map((row) => ({
    id: String(row.id ?? row.name ?? ""),
    name: String(row.name ?? ""),
    description: String(row.description ?? ""),
    authorName: String(row.author_name ?? ""),
    githubRepoUrl: optionalString(row.github_repo_url),
    manifestValidated: hasManifestValidationEvidence(row),
    category: optionalString(row.category),
    robotType: optionalString(row.robot_type),
    version: optionalString(row.version),
    githubStars: numberValue(row.github_stars),
    viewsCount: numberValue(row.views_count),
    tags: stringList(row.tags),
    tools: Array.isArray(row.tools)
      ? row.tools
          .filter((tool): tool is RegistryRow => typeof tool === "object" && tool !== null)
          .map((tool) => ({
            name: String(tool.name ?? ""),
            description: String(tool.description ?? ""),
          }))
      : [],
  }));
  return { items, available: true };
}

export async function loadSkills(): Promise<RegistryLoad<SkillSummary>> {
  const supabase = client();
  if (!supabase) return { items: [], available: false };
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("status", "approved")
    .order("downloads_count", { ascending: false });
  if (error) {
    console.error("Skill registry SSR load failed:", error.message);
    return { items: [], available: false };
  }
  const items = ((data ?? []) as RegistryRow[]).map((row) => ({
    id: String(row.id ?? row.name ?? ""),
    name: String(row.name ?? ""),
    displayName: optionalString(row.display_name),
    description: String(row.description ?? ""),
    authorName: String(row.author_name ?? ""),
    githubRepoUrl: optionalString(row.github_repo_url),
    category: optionalString(row.category),
    version: optionalString(row.version),
    githubStars: numberValue(row.github_stars),
    viewsCount: numberValue(row.views_count),
    rating: numberValue(row.rating),
    robotTypes: stringList(row.robot_types),
    tags: stringList(row.tags),
    dependencies: stringList(row.dependencies),
  }));
  return { items, available: true };
}
