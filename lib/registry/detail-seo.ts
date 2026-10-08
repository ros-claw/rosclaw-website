import { sourceDescription, type RegistryKind } from "./discovery";
import { registryPath } from "./pagination";
import type { SkillDetail, McpPackageDetail } from "./types";

const site = "https://www.rosclaw.io";

export function detailMetadata(kind: RegistryKind, identifier: string, item: SkillDetail | McpPackageDetail | null | undefined) {
  const name = item && "displayName" in item ? item.displayName || item.name : item?.name || identifier;
  const title = `${name} | ${kind === "skills" ? "Skill Registry" : "Hardware MCP Registry"} | ROSClaw`;
  const description = sourceDescription(item?.description, `Inspect source documentation, declared requirements, and integration guidance for ${name} on ROSClaw.`);
  const path = `/hub/${kind}/${registryPath(item?.name || identifier)}`;
  return { title, description, alternates: { canonical: path }, robots: { index: Boolean(item), follow: true },
    openGraph: { title, description, url: path }, twitter: { title, description } };
}

export function detailStructuredData(kind: RegistryKind, item: SkillDetail | McpPackageDetail) {
  const name = "displayName" in item ? item.displayName || item.name : item.name;
  const url = `${site}/hub/${kind}/${registryPath(item.name)}`;
  return [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ROSClaw", item: site },
      { "@type": "ListItem", position: 2, name: "Hub", item: `${site}/hub` },
      { "@type": "ListItem", position: 3, name: kind === "skills" ? "Skills" : "MCPs", item: `${site}/hub/${kind}` },
      { "@type": "ListItem", position: 4, name, item: url },
    ] },
    { "@context": "https://schema.org", "@type": "WebPage", name, url, description: sourceDescription(item.description, item.name),
      mainEntity: { "@type": "SoftwareSourceCode", name, description: item.description, codeRepository: item.githubRepoUrl, version: item.version,
        author: { "@type": "Organization", name: item.authorName || "Community publisher" },
        keywords: item.tags?.join(", ") } },
  ];
}
