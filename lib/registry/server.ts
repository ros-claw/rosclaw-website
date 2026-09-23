import "server-only";

import { cache } from "react";
import { createPublicRegistryClient, withRegistryTimeout } from "@/lib/registry/public-client";
import type {
  McpPackageDetail,
  McpPackageSummary,
  RegistryLoad,
  SkillDetail,
  SkillSummary,
} from "@/lib/registry/types";
import { getManifestValidationMetadata } from "@/lib/registry/verification";
import { normalizePublicHttpsUrl } from "@/lib/security/public-url";
import { canonicalRegistrySourceUrl } from "@/lib/github/source-url";

type RegistryRow = Record<string, unknown>;

function client() {
  try { return createPublicRegistryClient(); }
  catch { console.error("Registry configuration is missing"); return null; }
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

function toolList(value: unknown): { name: string; description: string }[] {
  return Array.isArray(value)
    ? value
        .filter((tool): tool is RegistryRow => typeof tool === "object" && tool !== null)
        .map((tool) => ({
          name: String(tool.name ?? ""),
          description: String(tool.description ?? ""),
        }))
    : [];
}

function isOfficialPublisher(repoUrl: string | undefined, authorName: string) {
  if (authorName.toLowerCase() === "ros-claw" || authorName.toLowerCase() === "rosclaw") return true;
  if (!repoUrl) return false;
  try {
    const owner = new URL(repoUrl).pathname.split("/").filter(Boolean)[0]?.toLowerCase();
    return owner === "ros-claw" || owner === "rosclaw";
  } catch {
    return false;
  }
}

function mcpSummary(row: RegistryRow): McpPackageSummary {
  const validation = getManifestValidationMetadata(row);
  const rawGithubRepoUrl = normalizePublicHttpsUrl(row.github_repo_url);
  const name = String(row.name ?? "");
  const githubRepoUrl = rawGithubRepoUrl
    ? canonicalRegistrySourceUrl(rawGithubRepoUrl, name, "mcp")
    : undefined;
  const authorName = String(row.author_name ?? "");
  return {
    id: String(row.id ?? row.name ?? ""),
    name,
    description: String(row.description ?? ""),
    authorName,
    githubRepoUrl,
    githubUpdatedAt: optionalString(row.github_updated_at),
    lastSyncedAt: optionalString(row.last_synced_at),
    officialPublisher: isOfficialPublisher(githubRepoUrl, authorName),
    manifestValidated: validation !== null,
    manifestValidatedAt: validation?.validatedAt,
    manifestValidationEvidence: validation?.evidence,
    manifestValidationEvidenceUrl: validation?.evidenceUrl,
    category: optionalString(row.category),
    robotType: optionalString(row.robot_type),
    version: optionalString(row.version),
    githubStars: numberValue(row.github_stars),
    viewsCount: numberValue(row.views_count),
    tags: stringList(row.tags),
    tools: toolList(row.tools),
  };
}

function skillSummary(row: RegistryRow): SkillSummary {
  const rawGithubRepoUrl = normalizePublicHttpsUrl(row.github_repo_url);
  const name = String(row.name ?? "");
  const githubRepoUrl = rawGithubRepoUrl
    ? canonicalRegistrySourceUrl(rawGithubRepoUrl, name, "skill")
    : undefined;
  const authorName = String(row.author_name ?? "");
  return {
    id: String(row.id ?? row.name ?? ""),
    name,
    displayName: optionalString(row.display_name),
    description: String(row.description ?? ""),
    authorName,
    githubRepoUrl,
    githubUpdatedAt: optionalString(row.github_updated_at),
    lastSyncedAt: optionalString(row.last_synced_at),
    officialPublisher: isOfficialPublisher(githubRepoUrl, authorName),
    category: optionalString(row.category),
    version: optionalString(row.version),
    githubStars: numberValue(row.github_stars),
    viewsCount: numberValue(row.views_count),
    rating: numberValue(row.rating),
    robotTypes: stringList(row.robot_types),
    tags: stringList(row.tags),
    dependencies: stringList(row.dependencies),
  };
}

export async function loadMcpPackages(): Promise<RegistryLoad<McpPackageSummary>> {
  const supabase = client();
  if (!supabase) return { items: [], available: false };
  const { data, error } = await withRegistryTimeout(supabase
    .from("mcp_packages")
    .select("*")
    .eq("status", "approved")
    .order("downloads_count", { ascending: false })).catch((error) => ({ data: null, error }));
  if (error) {
    console.error("MCP registry SSR load failed:", error.message);
    return { items: [], available: false };
  }
  const items = ((data ?? []) as RegistryRow[]).map(mcpSummary);
  return { items, available: true };
}

export async function loadSkills(): Promise<RegistryLoad<SkillSummary>> {
  const supabase = client();
  if (!supabase) return { items: [], available: false };
  const { data, error } = await withRegistryTimeout(supabase
    .from("skills")
    .select("*")
    .eq("status", "approved")
    .order("downloads_count", { ascending: false })).catch((error) => ({ data: null, error }));
  if (error) {
    console.error("Skill registry SSR load failed:", error.message);
    return { items: [], available: false };
  }
  const items = ((data ?? []) as RegistryRow[]).map(skillSummary);
  return { items, available: true };
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const loadMcpPackage = cache(
  async (identifier: string): Promise<McpPackageDetail | null | undefined> => {
    const supabase = client();
    if (!supabase) return undefined;
    let result = await withRegistryTimeout(supabase
      .from("mcp_packages")
      .select("*")
      .eq("status", "approved")
      .eq("name", identifier)
      .maybeSingle()).catch((error) => ({ data: null, error }));
    if (!result.data && UUID_PATTERN.test(identifier)) {
      result = await withRegistryTimeout(supabase
        .from("mcp_packages")
        .select("*")
        .eq("status", "approved")
        .eq("id", identifier)
        .maybeSingle()).catch((error) => ({ data: null, error }));
    }
    if (result.error) {
      console.error("MCP package SSR load failed:", result.error.message);
      return undefined;
    }
    if (!result.data) return null;
    const row = result.data as RegistryRow;
    return {
      ...mcpSummary(row),
      longDescription: optionalString(row.long_description),
      readmeContent: optionalString(row.readme_content),
      status: optionalString(row.status),
    };
  },
);

export const loadSkill = cache(
  async (identifier: string): Promise<SkillDetail | null | undefined> => {
    const supabase = client();
    if (!supabase) return undefined;
    const names = [identifier];
    const slashName = identifier.replace(/^([^-]+)-(.+)$/, "$1/$2");
    if (slashName !== identifier) names.push(slashName);

    let row: RegistryRow | null = null;
    for (const name of names) {
      const result = await withRegistryTimeout(supabase
        .from("skills")
        .select("*")
        .eq("status", "approved")
        .eq("name", name)
        .maybeSingle()).catch((error) => ({ data: null, error }));
      if (result.error) {
        console.error("Skill SSR load failed:", result.error.message);
        return undefined;
      }
      if (result.data) {
        row = result.data as RegistryRow;
        break;
      }
    }
    if (!row && UUID_PATTERN.test(identifier)) {
      const result = await withRegistryTimeout(supabase
        .from("skills")
        .select("*")
        .eq("status", "approved")
        .eq("id", identifier)
        .maybeSingle()).catch((error) => ({ data: null, error }));
      if (result.error) {
        console.error("Skill SSR load failed:", result.error.message);
        return undefined;
      }
      row = result.data as RegistryRow | null;
    }
    if (!row) return null;
    return {
      ...skillSummary(row),
      longDescription: optionalString(row.long_description),
      readmeContent: optionalString(row.readme_content),
      authorUrl: normalizePublicHttpsUrl(row.author_url),
      compatibleRobots: stringList(row.compatible_robots),
      status: optionalString(row.status),
    };
  },
);
