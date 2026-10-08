import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/content/shared";
import { loadMcpPackages, loadSkills } from "@/lib/registry/server";
import { matchesRegistryCategory, rankedRegistryItems, registryCategories, sourceDescription, type RegistryKind } from "@/lib/registry/discovery";
import { parseRegistryPage, registryPageUrl, registryPath, REGISTRY_PAGE_SIZE } from "@/lib/registry/pagination";
import { SkillRegistryClient } from "./skill-registry-client";
import { McpRegistryClient } from "./mcp-registry-client";
import { RegistryJsonLd } from "./registry-jsonld";

export type BrowseQuery = { page?: string | string[] };

const loadBrowse = cache(async (kind: RegistryKind, slug?: string) => {
  const category = slug ? registryCategories.find((item) => item.slug === slug) : undefined;
  if (slug && !category) notFound();
  const registry = kind === "skills" ? await loadSkills() : await loadMcpPackages();
  const items = slug ? registry.items.filter((item) => matchesRegistryCategory(item, slug)) : registry.items;
  const basePath = `/hub/${kind}${slug ? `/category/${slug}` : ""}`;
  return { items, available: registry.available, category, basePath };
});

export async function registryBrowseMetadata(kind: RegistryKind, query: BrowseQuery, slug?: string): Promise<Metadata> {
  const { available, category, basePath } = await loadBrowse(kind, slug);
  const page = parseRegistryPage(query.page);
  const title = `${category ? `${category.title} — ` : ""}${kind === "skills" ? "Skill Registry" : "Hardware MCP Registry"}${page > 1 ? ` — Page ${page}` : ""} | ROSClaw`;
  const description = sourceDescription(category?.description, kind === "skills"
    ? "Teach Once. Embody Anywhere. Find reusable Skills by task, hardware, and dependencies. Inspect source documentation and declared body compatibility."
    : "Find robotics MCP servers by hardware and use case. Compare tools, source documentation, and declared interfaces for embodied AI agents.");
  return { title, description, alternates: { canonical: registryPageUrl(basePath, page) },
    robots: { index: available, follow: true },
    openGraph: { title, description, url: registryPageUrl(basePath, page) }, twitter: { title, description } };
}

export async function RegistryBrowsePage({ kind, query, slug }: { kind: RegistryKind; query: BrowseQuery; slug?: string }) {
  const { items, available, category, basePath } = await loadBrowse(kind, slug);
  const page = parseRegistryPage(query.page);
  if (available && ((slug && !items.length) || page > Math.max(1, Math.ceil(items.length / REGISTRY_PAGE_SIZE)))) notFound();
  const visible = rankedRegistryItems(items).slice((page - 1) * REGISTRY_PAGE_SIZE, page * REGISTRY_PAGE_SIZE);
  const title = category ? `${category.title} — ${kind === "skills" ? "Skills" : "MCPs"}` : kind === "skills" ? "Skills" : "Hardware MCPs";
  const crumbs = [{ name: "ROSClaw", url: SITE_URL }, { name: "Hub", url: `${SITE_URL}/hub` }, { name: kind === "skills" ? "Skills" : "MCPs", url: `${SITE_URL}/hub/${kind}` }];
  if (category) crumbs.push({ name: category.title, url: `${SITE_URL}${basePath}` });
  const schema = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: item.url })) },
    { "@context": "https://schema.org", "@type": "CollectionPage", name: title, url: `${SITE_URL}${registryPageUrl(basePath, page)}`, description: category?.description, mainEntity: { "@type": "ItemList", numberOfItems: visible.length, itemListElement: visible.map((item, i) => ({ "@type": "ListItem", position: (page - 1) * REGISTRY_PAGE_SIZE + i + 1, name: "displayName" in item ? item.displayName || item.name : item.name, url: `${SITE_URL}/hub/${kind}/${registryPath(item.name)}` })) } },
  ];
  return <>
    {available && <RegistryJsonLd data={schema} />}
    {kind === "skills"
      ? <SkillRegistryClient initialSkills={items as Awaited<ReturnType<typeof loadSkills>>["items"]} initialLoadError={!available} initialPage={page} basePath={basePath} heading={title} introduction={category?.description} />
      : <McpRegistryClient initialPackages={items as Awaited<ReturnType<typeof loadMcpPackages>>["items"]} initialLoadError={!available} initialPage={page} basePath={basePath} heading={title} introduction={category?.description} />}
  </>;
}
