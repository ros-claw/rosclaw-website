import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/shared";
import { loadMcpPackages, loadSkills } from "@/lib/registry/server";

export const revalidate = 300;

function registryPath(name: string) {
  return name.split("/").map(encodeURIComponent).join("/");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const generatedAt = new Date();
  const staticPages = [
    ["", "weekly", 1.0],
    ["/start", "weekly", 1.0],
    ["/robots", "weekly", 0.9],
    ["/apps", "weekly", 0.9],
    ["/evidence", "weekly", 0.8],
    ["/status", "weekly", 0.9],
    ["/hub", "weekly", 0.9],
    ["/hub/mcps", "daily", 0.8],
    ["/hub/skills", "daily", 0.8],
    ["/hub/twins", "weekly", 0.7],
    ["/hub/wiki", "weekly", 0.6],
    ["/flywheel", "weekly", 0.8],
    ["/runtime", "weekly", 0.9],
    ["/docs", "weekly", 0.8],
    ["/mcp-hub/publish", "monthly", 0.6],
    ["/skills/publish", "monthly", 0.6],
    ["/privacy/telemetry", "yearly", 0.3],
  ] as const;
  const entries: MetadataRoute.Sitemap = staticPages.map(
    ([path, changeFrequency, priority]) => ({
      url: `${SITE_URL}${path}`,
      lastModified: generatedAt,
      changeFrequency,
      priority,
    }),
  );

  const [mcpLoad, skillLoad] = await Promise.all([
    loadMcpPackages(),
    loadSkills(),
  ]);
  for (const pkg of mcpLoad.items) {
    entries.push({
      url: `${SITE_URL}/hub/mcps/${registryPath(pkg.name)}`,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }
  for (const skill of skillLoad.items) {
    entries.push({
      url: `${SITE_URL}/hub/skills/${registryPath(skill.name)}`,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }
  return entries;
}
