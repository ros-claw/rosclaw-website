import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { itemCategories, sourceGuidance, type RegistryKind, type RegistrySummary } from "@/lib/registry/discovery";
import { registryPath } from "@/lib/registry/pagination";
import { resolveGitHubMarkdownUrl } from "@/lib/github/source-url";
import type { SkillDetail, McpPackageDetail } from "@/lib/registry/types";

export function RegistryIntegrationGuide({ kind, item, related }: { kind: RegistryKind; item: SkillDetail | McpPackageDetail; related: { kind: RegistryKind; item: RegistrySummary }[] }) {
  const categories = itemCategories(item);
  const excerpts = sourceGuidance(item.readmeContent || item.longDescription || "");
  const targets = "robotTypes" in item ? [...(item.robotTypes || []), ...("compatibleRobots" in item ? item.compatibleRobots || [] : [])] : "robotType" in item ? [item.robotType].filter(Boolean) : [];
  const dependencies = "dependencies" in item ? item.dependencies || [] : [];
  const tools = "tools" in item ? item.tools || [] : [];
  return <section aria-labelledby="integration-guide-heading" className="min-w-0">
    <div className="border-b border-white/10 pb-4">
      <p className="runtime-label">Source-based integration guide</p>
      <h2 id="integration-guide-heading" className="mt-3 text-2xl font-semibold tracking-tight text-white">Plan your integration</h2>
      <p className="mt-3 text-sm leading-relaxed text-white/50">Use the recorded requirements and publisher documentation below to assess {"displayName" in item ? item.displayName || item.name : item.name} for your agent and body.</p>
    </div>
    <div className="mt-5 grid gap-px bg-white/10 sm:grid-cols-2">
      <div className="bg-[#080b0c] p-5">
        <h3 className="font-medium text-white">Match the environment</h3>
        <p className="mt-3 text-sm leading-relaxed text-white/50">{targets.length ? `Declared targets: ${Array.from(new Set(targets)).join(", ")}. Confirm the exact device model and required capabilities in the source.` : "The publisher has not recorded a target body here. Check the source for device models and runtime requirements before choosing a binding."}</p>
        {dependencies.length > 0 && <p className="mt-3 break-words text-sm text-white/50">Recorded dependencies: {dependencies.join(", ")}.</p>}
      </div>
      <div className="bg-[#080b0c] p-5">
        <h3 className="font-medium text-white">Review the execution path</h3>
        <p className="mt-3 text-sm leading-relaxed text-white/50">{tools.length ? `Inspect the inputs, outputs, and authority needed by ${tools.slice(0, 3).map((tool) => tool.name).join(", ")}${tools.length > 3 ? ` and the other ${tools.length - 3} indexed tools` : ""}.` : "Read the source procedure and identify which steps observe the environment and which can change physical state."} Match required capabilities to your body binding, then test the workflow in a sandbox before granting hardware access.</p>
        <Link href="/evidence" className="focus-ring mt-3 inline-block text-sm text-cognitive-cyan">Understand ROSClaw evidence levels →</Link>
      </div>
    </div>
    {excerpts.length > 0 && <div className="mt-6 space-y-5">
      <p className="text-xs text-white/40">The following excerpts come from the publisher&apos;s source documentation. They describe upstream setup and usage, not an attested ROSClaw install artifact.</p>
      {excerpts.map((section, index) => <details key={`${index}/${section.heading}`} className="min-w-0 border border-white/10 bg-[#080b0c] p-5">
        <summary className="focus-ring cursor-pointer text-sm font-medium text-white">{section.heading} — publisher excerpt</summary>
        <div className="markdown-body mt-4 text-sm"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: ({ href, children }) => <a href={resolveGitHubMarkdownUrl(item.githubRepoUrl, href)} rel="noopener noreferrer" target="_blank">{children}</a>, img: () => null }}>{section.text}</ReactMarkdown></div>
      </details>)}
      {item.githubRepoUrl && <a href={item.githubRepoUrl} target="_blank" rel="noopener noreferrer" className="focus-ring inline-block text-sm text-cognitive-cyan">Read complete setup and examples at the source →</a>}
    </div>}
    {categories.length > 0 && <nav aria-label="Related topic collections" className="mt-6 flex flex-wrap gap-2">{categories.map((category) => <Link prefetch={false} key={category.slug} href={`/hub/${kind}/category/${category.slug}`} className="focus-ring border border-white/15 px-3 py-2 text-xs text-white/60 hover:text-white">More {category.title.toLowerCase()} {kind === "skills" ? "Skills" : "MCPs"} →</Link>)}</nav>}
    {related.length > 0 && <div className="mt-7">
      <h3 className="text-base font-medium text-white">Explore related packages</h3>
      <p className="mt-2 text-xs text-white/40">Grouped by shared topics and declared metadata. These suggestions do not establish compatibility.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">{related.map(({ kind: relatedKind, item: candidate }) => <Link prefetch={false} key={`${relatedKind}/${candidate.id}`} href={`/hub/${relatedKind}/${registryPath(candidate.name)}`} className="focus-ring min-w-0 border border-white/10 bg-[#080b0c] p-4 hover:border-cognitive-cyan/40">
        <span className="runtime-label">{relatedKind === "skills" ? "Skill" : "MCP"}</span>
        <h4 className="mt-2 break-words text-sm font-medium text-white">{"displayName" in candidate ? candidate.displayName || candidate.name : candidate.name}</h4>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/45">{candidate.description}</p>
      </Link>)}</div>
    </div>}
  </section>;
}
