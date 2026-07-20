"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  FileCode2,
  Github,
  Loader2,
  ShieldCheck,
  Terminal,
  Wrench,
} from "lucide-react";
import { CopyCommand } from "@/components/hub/copy-command";

interface McpTool {
  name: string;
  description?: string;
}

interface McpPackage {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  readmeContent?: string;
  authorName: string;
  githubRepoUrl?: string;
  verified?: boolean;
  category?: string;
  robotType?: string;
  version?: string;
  viewsCount?: number;
  githubStars?: number;
  tags?: string[];
  tools?: McpTool[];
  status?: string;
}

interface McpPackageClientProps {
  id: string;
}

function encodedPath(id: string) {
  return id.split("/").map(encodeURIComponent).join("/");
}

async function fetchPackage(id: string): Promise<McpPackage | null> {
  try {
    const response = await fetch(`/api/mcp-packages/${encodedPath(id)}`);
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

async function incrementViews(id: string) {
  try {
    await fetch(`/api/mcp-packages/${encodedPath(id)}?action=view`, { method: "POST" });
  } catch {
    // A view counter must never block package content.
  }
}

function formatNumber(value = 0) {
  return new Intl.NumberFormat("en", { notation: value >= 1_000 ? "compact" : "standard", maximumFractionDigits: 1 }).format(value);
}

export function McpPackageClient({ id }: McpPackageClientProps) {
  const [packageData, setPackageData] = useState<McpPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);

    fetchPackage(id).then((pkg) => {
      if (!active) return;
      if (!pkg) {
        setNotFound(true);
      } else {
        setPackageData(pkg);
        incrementViews(id);
      }
      setLoading(false);
    });

    return () => { active = false; };
  }, [id]);

  if (loading) return <DetailLoading />;
  if (notFound || !packageData) return <DetailNotFound id={id} />;

  const tools = packageData.tools || [];
  const tags = packageData.tags || [];
  const docs = packageData.readmeContent || packageData.longDescription || "";
  const installCommand = `rosclaw install mcp ${packageData.name}`;
  const registryVerified = packageData.verified === true;

  return (
    <main className="min-h-screen bg-background pb-20 pt-24">
      <header className="runtime-grid border-b border-white/[0.08] px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link href="/hub/mcps" className="focus-ring inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Hardware MCPs
          </Link>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-cognitive-cyan">Physical interface</span>
                {registryVerified && (
                  <span className="inline-flex items-center gap-1.5 border border-cognitive-cyan/25 bg-cognitive-cyan/[0.05] px-2 py-1 font-mono text-[8px] uppercase tracking-wider text-cognitive-cyan">
                    <CheckCircle2 className="h-3 w-3" /> Registry verified
                  </span>
                )}
              </div>
              <h1 className="mt-4 break-words text-balance font-mono text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl md:text-5xl">{packageData.name}</h1>
              <p className="mt-5 max-w-3xl text-pretty text-base leading-relaxed text-white/52 md:text-lg">{packageData.description}</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/35">
                <span className="inline-flex items-center gap-2"><Github className="h-4 w-4" /> {packageData.authorName}</span>
                <span className="font-mono text-xs">v{packageData.version || "—"}</span>
                {packageData.category && <span>{packageData.category}</span>}
              </div>
            </div>

            <div className="grid grid-cols-3 border border-white/10 bg-[#050708] lg:min-w-[330px]">
              {[
                ["Tools", tools.length.toLocaleString()],
                ["Stars", formatNumber(packageData.githubStars)],
                ["Views", formatNumber(packageData.viewsCount)],
              ].map(([label, value], index) => (
                <div key={label} className={`p-4 text-center ${index < 2 ? "border-r border-white/10" : ""}`}>
                  <div className="runtime-label">{label}</div>
                  <div className="mt-2 font-mono text-base text-white">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {tags.map((tag) => <span key={tag} className="border border-white/10 bg-white/[0.025] px-2.5 py-1 text-xs text-white/38">{tag}</span>)}
            </div>
          )}
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_330px] lg:px-8 lg:py-14">
        <div className="min-w-0 space-y-14">
          <section aria-labelledby="contract-heading">
            <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="section-kicker">Interface contract</p>
                <h2 id="contract-heading" className="mt-3 text-2xl font-semibold tracking-[-0.025em] text-white">What the agent can call</h2>
              </div>
              <span className="hidden font-mono text-[9px] uppercase tracking-[0.14em] text-white/25 sm:block">{tools.length} typed tools</span>
            </div>

            {tools.length > 0 ? (
              <div className="grid min-w-0 gap-px bg-white/10 sm:grid-cols-2">
                {tools.map((tool, index) => (
                  <article key={`${tool.name}-${index}`} className="min-w-0 bg-[#080b0c] p-5 sm:p-6">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 font-mono text-[9px] text-cognitive-cyan">{String(index + 1).padStart(2, "0")}</span>
                      <div className="min-w-0">
                        <h3 className="[overflow-wrap:anywhere] font-mono text-sm font-medium text-white">{tool.name}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-white/42">{tool.description || "No tool description declared."}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="border-x border-b border-white/10 bg-[#080b0c] p-8">
                <Wrench className="h-5 w-5 text-cognitive-cyan" />
                <h3 className="mt-4 text-base font-medium text-white">No tool schema indexed</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/40">Review the source repository before install; this package has not declared callable tools in the registry.</p>
              </div>
            )}
          </section>

          <section aria-labelledby="docs-heading">
            <div className="border-b border-white/10 pb-4">
              <p className="section-kicker">Package documentation</p>
              <h2 id="docs-heading" className="mt-3 text-2xl font-semibold tracking-[-0.025em] text-white">README</h2>
            </div>
            {docs ? (
              <div className="markdown-body mt-8 min-w-0">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
                    let finalHref = href || "";
                    if (href && !href.startsWith("http") && !href.startsWith("#") && packageData.githubRepoUrl) {
                      finalHref = `${packageData.githubRepoUrl.replace(/\/+$/, "")}/blob/main/${href}`;
                    }
                    return <a href={finalHref} target="_blank" rel="noopener noreferrer">{children}</a>;
                  },
                  img: ({ src, alt }: { src?: string; alt?: string }) => {
                    let finalSrc = src || "";
                    if (src && !src.startsWith("http") && packageData.githubRepoUrl) {
                      finalSrc = `${packageData.githubRepoUrl.replace(/\/+$/, "")}/raw/main/${src}`;
                    }
                    // eslint-disable-next-line @next/next/no-img-element
                    return <img src={finalSrc} alt={alt || "Package documentation"} loading="lazy" />;
                  },
                  }}
                >
                  {docs}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="mt-8 border border-white/10 bg-[#080b0c] p-8 text-sm text-white/42">
                No README has been indexed for this package. Use the source link to inspect its implementation and setup instructions.
              </div>
            )}
          </section>
        </div>

        <aside className="min-w-0 space-y-5 lg:sticky lg:top-28 lg:self-start">
          <section className="industrial-panel p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <Terminal className="h-5 w-5 text-cognitive-cyan" />
              <h2 className="text-base font-medium text-white">Install into runtime</h2>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-white/38">Pin the package version in production after validating its interface contract.</p>
            <div className="mt-5"><CopyCommand command={installCommand} /></div>
          </section>

          <section className="border border-white/10 bg-[#080b0c] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-cognitive-cyan" />
              <h2 className="text-base font-medium text-white">Execution boundary</h2>
            </div>
            <ul className="mt-5 space-y-4 text-xs leading-relaxed text-white/42">
              <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-none text-cognitive-cyan" /> Inspect tool inputs and outputs.</li>
              <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-none text-cognitive-cyan" /> Test against a sandbox or twin first.</li>
              <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-none text-cognitive-cyan" /> Grant the smallest hardware scope.</li>
            </ul>
          </section>

          <section className="border border-white/10 bg-[#080b0c] p-5 sm:p-6">
            <p className="runtime-label">Package facts</p>
            <dl className="mt-5 space-y-3 text-xs">
              {[
                ["Publisher", packageData.authorName || "—"],
                ["Target", packageData.robotType || "Not declared"],
                ["Category", packageData.category || "Not declared"],
                ["Version", packageData.version || "—"],
                [
                  "Registry verification",
                  registryVerified ? "Verified" : "Not attested",
                ],
                ["Hardware evidence", "Not represented by this flag"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4 border-b border-white/[0.06] pb-3 last:border-0 last:pb-0">
                  <dt className="text-white/28">{label}</dt>
                  <dd className="max-w-[60%] text-right text-white/60">{value}</dd>
                </div>
              ))}
            </dl>
            {packageData.githubRepoUrl && (
              <a href={packageData.githubRepoUrl} target="_blank" rel="noopener noreferrer" className="focus-ring mt-6 flex items-center justify-between border-t border-white/[0.08] pt-4 text-sm text-white/50 transition-colors hover:text-cognitive-cyan">
                <span className="inline-flex items-center gap-2"><Github className="h-4 w-4" /> Source repository</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </section>

          <Link href="/hub/skills" className="focus-ring group block border border-physical-orange/25 bg-physical-orange/[0.035] p-5 transition-colors hover:bg-physical-orange/[0.07] sm:p-6">
            <div className="flex items-center gap-3 text-physical-orange"><Cpu className="h-5 w-5" /><span className="font-mono text-[9px] uppercase tracking-[0.14em]">Next layer</span></div>
            <h2 className="mt-4 text-base font-medium text-white">Find a Skill for this body</h2>
            <p className="mt-2 text-xs leading-relaxed text-white/38">Combine physical access with a versioned task policy.</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm text-physical-orange">Browse Skills <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
          </Link>
        </aside>
      </div>
    </main>
  );
}

function DetailLoading() {
  return (
    <main className="min-h-screen bg-background px-4 pb-20 pt-36 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Loader2 className="h-6 w-6 animate-spin text-cognitive-cyan" />
        <div className="mt-8 h-12 max-w-2xl animate-pulse bg-white/[0.06]" />
        <div className="mt-4 h-5 max-w-xl animate-pulse bg-white/[0.04]" />
      </div>
    </main>
  );
}

function DetailNotFound({ id }: { id: string }) {
  return (
    <main className="runtime-grid min-h-screen px-4 pb-20 pt-36 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl border border-white/10 bg-[#080b0c] p-8 sm:p-12">
        <FileCode2 className="h-8 w-8 text-cognitive-cyan" />
        <p className="section-kicker mt-8">404 / Interface not indexed</p>
        <h1 className="mt-4 break-words text-3xl font-semibold text-white">{id}</h1>
        <p className="mt-4 text-sm leading-relaxed text-white/45">This MCP package is unavailable, unapproved, or has moved to a different registry path.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/hub/mcps" className="focus-ring inline-flex items-center justify-center gap-2 bg-cognitive-cyan px-5 py-3 text-sm font-semibold text-[#021012]">Browse Hardware MCPs <ArrowRight className="h-4 w-4" /></Link>
          <Link href="/mcp-hub/publish" className="focus-ring inline-flex items-center justify-center gap-2 border border-white/15 px-5 py-3 text-sm text-white/60">Publish an interface <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </main>
  );
}
