import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/shared";
import { loadMcpPackages, loadSkills } from "@/lib/registry/server";
import { releaseManifest } from "@/content/release-manifest";
import { matchesRegistryCategory, registryCategories } from "@/lib/registry/discovery";
import { REGISTRY_PAGE_SIZE, registryPageUrl } from "@/lib/registry/pagination";

export const dynamic = "force-dynamic";

function registryPath(name: string) {
  return name.split("/").map(encodeURIComponent).join("/");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const releaseDate = new Date(releaseManifest.main.published_at);
  const staticPages = [
    ["", "weekly", 1.0],
    ["/zh", "weekly", 0.9],
    ["/start", "weekly", 1.0],
    ["/native-agent", "weekly", 1.0],
    ["/safety", "weekly", 0.9],
    ["/integrations", "weekly", 0.9],
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
      lastModified: releaseDate,
      changeFrequency,
      priority,
    }),
  );

  const [mcpLoad, skillLoad] = await Promise.all([
    loadMcpPackages(),
    loadSkills(),
  ]);
  // An outage must not publish a seemingly complete sitemap missing its catalog.
  if (!mcpLoad.available || !skillLoad.available) throw new Error("Registry sitemap is temporarily unavailable");
  for (const pkg of mcpLoad.items) {
    entries.push({
      url: `${SITE_URL}/hub/mcps/${registryPath(pkg.name)}`,
      changeFrequency: "weekly",
      priority: 0.7,
      lastModified: pkg.githubUpdatedAt ? new Date(pkg.githubUpdatedAt) : undefined,
    });
  }
  for (const skill of skillLoad.items) {
    entries.push({
      url: `${SITE_URL}/hub/skills/${registryPath(skill.name)}`,
      changeFrequency: "weekly",
      priority: 0.7,
      lastModified: skill.githubUpdatedAt ? new Date(skill.githubUpdatedAt) : undefined,
    });
  }
  for (const [kind, items] of [["mcps", mcpLoad.items], ["skills", skillLoad.items]] as const) {
    const basePath = `/hub/${kind}`;
    for (let page = 2; page <= Math.ceil(items.length / REGISTRY_PAGE_SIZE); page++) {
      entries.push({ url: `${SITE_URL}${registryPageUrl(basePath, page)}`, changeFrequency: "weekly", priority: 0.5 });
    }
    for (const category of registryCategories) {
      const collection = items.filter((item) => matchesRegistryCategory(item, category.slug));
      if (!collection.length) continue;
      const dates = collection.map((item) => Date.parse(item.githubUpdatedAt || "")).filter(Number.isFinite);
      for (let page = 1; page <= Math.ceil(collection.length / REGISTRY_PAGE_SIZE); page++) {
        entries.push({ url: `${SITE_URL}${registryPageUrl(`${basePath}/category/${category.slug}`, page)}`,
          lastModified: dates.length ? new Date(Math.max(...dates)) : undefined, changeFrequency: "weekly", priority: page === 1 ? 0.8 : 0.5 });
      }
    }
  }
  return entries;
}
