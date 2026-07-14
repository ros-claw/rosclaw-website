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
  FileCode2,
  Github,
  GitBranch,
  Loader2,
  Plug,
  ShieldCheck,
  Terminal,
  Workflow,
} from "lucide-react";
import { CopyCommand } from "@/components/hub/copy-command";

interface Skill {
  id: string;
  name: string;
  displayName?: string;
  description: string;
  longDescription?: string;
  readmeContent?: string;
  authorName: string;
  authorUrl?: string;
  githubRepoUrl?: string;
  viewsCount?: number;
  githubStars?: number;
  rating?: number;
  reviewCount?: number;
  version?: string;
  category?: string;
  tags?: string[];
  robotTypes?: string[];
  compatibleRobots?: string[];
  dependencies?: string[];
  status?: string;
}

interface SkillDetailClientProps {
  id: string;
}

function encodedPath(id: string) {
  return id.split("/").map(encodeURIComponent).join("/");
}

async function fetchSkill(id: string): Promise<Skill | null> {
  try {
    const response = await fetch(`/api/skills/${encodedPath(id)}`);
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

async function incrementViews(id: string) {
  try {
    await fetch(`/api/skills/${encodedPath(id)}?action=view`, { method: "POST" });
  } catch {
    // A view counter must never block package content.
  }
}

function formatNumber(value = 0) {
  return new Intl.NumberFormat("en", { notation: value >= 1_000 ? "compact" : "standard", maximumFractionDigits: 1 }).format(value);
}

export function SkillDetailClient({ id }: SkillDetailClientProps) {
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);

    fetchSkill(id).then((skillData) => {
      if (!active) return;
      if (!skillData) {
        setNotFound(true);
      } else {
        setSkill(skillData);
        incrementViews(id);
      }
      setLoading(false);
    });

    return () => { active = false; };
  }, [id]);

  if (loading) return <DetailLoading />;
  if (notFound || !skill) return <DetailNotFound id={id} />;

  const tags = skill.tags || [];
  const bodyProfiles = Array.from(new Set([...(skill.compatibleRobots || []), ...(skill.robotTypes || [])].filter(Boolean)));
  const dependencies = skill.dependencies || [];
  const docs = skill.readmeContent || skill.longDescription || "";
  const installCommand = `rosclaw install skill ${skill.name}`;

  return (
    <main className="min-h-screen bg-background pb-20 pt-24">
      <header className="runtime-grid border-b border-white/[0.08] px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link href="/hub/skills" className="focus-ring inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Skills
          </Link>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-physical-orange">Behavior package</span>
                {skill.category && (
                  <span className="border border-physical-orange/25 bg-physical-orange/[0.05] px-2 py-1 font-mono text-[8px] uppercase tracking-wider text-physical-orange">{skill.category}</span>
                )}
              </div>
              <h1 className="mt-4 break-words text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl md:text-5xl">{skill.displayName || skill.name}</h1>
              {skill.displayName && skill.displayName !== skill.name && <p className="mt-2 break-words font-mono text-xs text-white/28">{skill.name}</p>}
              <p className="mt-5 max-w-3xl text-pretty text-base leading-relaxed text-white/52 md:text-lg">{skill.description}</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/35">
                <span className="inline-flex items-center gap-2"><Github className="h-4 w-4" /> {skill.authorName}</span>
                <span className="font-mono text-xs">v{skill.version || "—"}</span>
                <span>{bodyProfiles.length ? `${bodyProfiles.length} declared body profile${bodyProfiles.length === 1 ? "" : "s"}` : "Body profile not declared"}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 border border-white/10 bg-[#050708] lg:min-w-[330px]">
              {[
                ["Bodies", bodyProfiles.length.toLocaleString()],
                ["Stars", formatNumber(skill.githubStars)],
                ["Views", formatNumber(skill.viewsCount)],
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
          <section aria-labelledby="deployment-heading">
            <div className="border-b border-white/10 pb-4">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.17em] text-physical-orange">Deployment contract</p>
              <h2 id="deployment-heading" className="mt-3 text-2xl font-semibold tracking-[-0.025em] text-white">What this behavior expects</h2>
            </div>

            <div className="grid gap-px bg-white/10 md:grid-cols-2">
              <article className="bg-[#080b0c] p-6 sm:p-7">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-physical-orange" />
                  <h3 className="text-base font-medium text-white">Compatible bodies</h3>
                </div>
                {bodyProfiles.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {bodyProfiles.map((body) => <span key={body} className="border border-physical-orange/20 bg-physical-orange/[0.04] px-2.5 py-1.5 text-xs text-physical-orange">{body}</span>)}
                  </div>
                ) : (
                  <p className="mt-5 text-sm leading-relaxed text-white/40">No body compatibility is declared. Verify the required capabilities manually before execution.</p>
                )}
              </article>

              <article className="bg-[#080b0c] p-6 sm:p-7">
                <div className="flex items-center gap-3">
                  <GitBranch className="h-5 w-5 text-physical-orange" />
                  <h3 className="text-base font-medium text-white">Dependencies</h3>
                </div>
                {dependencies.length > 0 ? (
                  <ul className="mt-5 space-y-2">
                    {dependencies.map((dependency) => <li key={dependency} className="break-words border-l border-physical-orange/35 pl-3 font-mono text-xs text-white/48">{dependency}</li>)}
                  </ul>
                ) : (
                  <p className="mt-5 text-sm leading-relaxed text-white/40">No package dependencies are declared in the registry.</p>
                )}
              </article>
            </div>
          </section>

          <section aria-labelledby="docs-heading">
            <div className="border-b border-white/10 pb-4">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.17em] text-physical-orange">Package documentation</p>
              <h2 id="docs-heading" className="mt-3 text-2xl font-semibold tracking-[-0.025em] text-white">README</h2>
            </div>
            {docs ? (
              <div className="markdown-body markdown-body--skill mt-8 min-w-0">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
                    let finalHref = href || "";
                    if (href && !href.startsWith("http") && !href.startsWith("#") && skill.githubRepoUrl) {
                      finalHref = `${skill.githubRepoUrl.replace(/\/+$/, "")}/blob/main/${href}`;
                    }
                    return <a href={finalHref} target="_blank" rel="noopener noreferrer">{children}</a>;
                  },
                  img: ({ src, alt }: { src?: string; alt?: string }) => {
                    let finalSrc = src || "";
                    if (src && !src.startsWith("http") && skill.githubRepoUrl) {
                      finalSrc = `${skill.githubRepoUrl.replace(/\/+$/, "")}/raw/main/${src}`;
                    }
                    // eslint-disable-next-line @next/next/no-img-element
                    return <img src={finalSrc} alt={alt || "Skill documentation"} loading="lazy" />;
                  },
                  }}
                >
                  {docs}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="mt-8 border border-white/10 bg-[#080b0c] p-8 text-sm text-white/42">
                No README has been indexed for this skill. Use the source link to inspect its behavior, parameters, and setup instructions.
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <section className="industrial-panel p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <Terminal className="h-5 w-5 text-physical-orange" />
              <h2 className="text-base font-medium text-white">Install behavior</h2>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-white/38">Pin the version after validating its dependencies and body contract.</p>
            <div className="mt-5"><CopyCommand command={installCommand} tone="orange" /></div>
          </section>

          <section className="border border-white/10 bg-[#080b0c] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <Workflow className="h-5 w-5 text-physical-orange" />
              <h2 className="text-base font-medium text-white">Before execution</h2>
            </div>
            <ul className="mt-5 space-y-4 text-xs leading-relaxed text-white/42">
              <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-none text-physical-orange" /> Match required capabilities to an MCP.</li>
              <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-none text-physical-orange" /> Run the task in a sandbox or twin.</li>
              <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-none text-physical-orange" /> Inspect traces before promotion.</li>
            </ul>
          </section>

          <section className="border border-white/10 bg-[#080b0c] p-5 sm:p-6">
            <p className="runtime-label">Package facts</p>
            <dl className="mt-5 space-y-3 text-xs">
              {[
                ["Publisher", skill.authorName || "—"],
                ["Category", skill.category || "Not declared"],
                ["Version", skill.version || "—"],
                ["Bodies", bodyProfiles.length ? bodyProfiles.length.toLocaleString() : "Not declared"],
                ["Dependencies", dependencies.length.toLocaleString()],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4 border-b border-white/[0.06] pb-3 last:border-0 last:pb-0">
                  <dt className="text-white/28">{label}</dt>
                  <dd className="max-w-[60%] text-right text-white/60">{value}</dd>
                </div>
              ))}
            </dl>
            {skill.githubRepoUrl && (
              <a href={skill.githubRepoUrl} target="_blank" rel="noopener noreferrer" className="focus-ring mt-6 flex items-center justify-between border-t border-white/[0.08] pt-4 text-sm text-white/50 transition-colors hover:text-physical-orange">
                <span className="inline-flex items-center gap-2"><Github className="h-4 w-4" /> Source repository</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </section>

          <Link href="/hub/mcps" className="focus-ring group block border border-cognitive-cyan/25 bg-cognitive-cyan/[0.035] p-5 transition-colors hover:bg-cognitive-cyan/[0.07] sm:p-6">
            <div className="flex items-center gap-3 text-cognitive-cyan"><Plug className="h-5 w-5" /><span className="font-mono text-[9px] uppercase tracking-[0.14em]">Required layer</span></div>
            <h2 className="mt-4 text-base font-medium text-white">Connect a compatible body</h2>
            <p className="mt-2 text-xs leading-relaxed text-white/38">Find an MCP that exposes this skill&apos;s required capabilities.</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm text-cognitive-cyan">Browse MCPs <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
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
        <Loader2 className="h-6 w-6 animate-spin text-physical-orange" />
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
        <FileCode2 className="h-8 w-8 text-physical-orange" />
        <p className="mt-8 font-mono text-[0.68rem] uppercase tracking-[0.17em] text-physical-orange">404 / Skill not indexed</p>
        <h1 className="mt-4 break-words text-3xl font-semibold text-white">{id}</h1>
        <p className="mt-4 text-sm leading-relaxed text-white/45">This Skill is unavailable, unapproved, or has moved to a different registry path.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/hub/skills" className="focus-ring inline-flex items-center justify-center gap-2 bg-physical-orange px-5 py-3 text-sm font-semibold text-white">Browse Skills <ArrowRight className="h-4 w-4" /></Link>
          <Link href="/skills/publish" className="focus-ring inline-flex items-center justify-center gap-2 border border-white/15 px-5 py-3 text-sm text-white/60">Publish a skill <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </main>
  );
}
