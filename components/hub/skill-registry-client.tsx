"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Cpu,
  Eye,
  GitBranch,
  Github,
  Layers3,
  Plus,
  Search,
  ShieldCheck,
  Star,
  Workflow,
} from "lucide-react";
import type { SkillSummary } from "@/lib/registry/types";

const PAGE_SIZE = 24;

function searchableText(skill: SkillSummary) {
  return [skill.name, skill.displayName, skill.description, skill.authorName, skill.category, ...(skill.tags || []), ...(skill.robotTypes || []), ...(skill.dependencies || [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function SkillCard({ skill, number }: { skill: SkillSummary; number: number }) {
  const robotTypes = skill.robotTypes || [];
  const tags = skill.tags || [];
  const dependencies = skill.dependencies || [];

  return (
    <Link
      href={`/hub/skills/${skill.name}`}
      className="focus-ring group flex min-h-[320px] min-w-0 flex-col overflow-hidden border border-white/10 bg-[#080b0c] p-6 transition-colors hover:border-physical-orange/45 hover:bg-physical-orange/[0.025]"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-[9px] tracking-[0.16em] text-white/25">SKILL-{String(number).padStart(3, "0")}</span>
        {skill.category && (
          <span className="max-w-[55%] truncate border border-physical-orange/25 bg-physical-orange/[0.04] px-2 py-1 font-mono text-[8px] uppercase tracking-wider text-physical-orange">
            {skill.category}
          </span>
        )}
      </div>

      <div className="mt-6 flex items-start gap-4">
        <div className="flex h-11 w-11 flex-none items-center justify-center border border-physical-orange/25 bg-physical-orange/[0.05] text-physical-orange">
          <Cpu className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h2 className="line-clamp-2 break-words text-lg font-semibold leading-snug text-white transition-colors group-hover:text-physical-orange">
            {skill.displayName || skill.name}
          </h2>
          <p className="mt-1 truncate font-mono text-[10px] text-white/28">{skill.name}</p>
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-white/35">
            <Github className="h-3 w-3" /> {skill.authorName || "Community publisher"}
          </p>
        </div>
      </div>

      <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-white/48">{skill.description || "No behavior description provided."}</p>

      <dl className="mt-6 grid grid-cols-2 border-y border-white/[0.08] py-4 font-mono text-[9px] uppercase tracking-[0.11em]">
        <div>
          <dt className="text-white/25">Body profiles</dt>
          <dd className="mt-1 truncate text-physical-orange">{robotTypes.length ? robotTypes.slice(0, 2).join(", ") : "Not declared"}</dd>
        </div>
        <div>
          <dt className="text-white/25">Dependencies</dt>
          <dd className="mt-1 text-white/60">{dependencies.length}</dd>
        </div>
      </dl>

      <div className="mt-4 flex min-h-6 flex-wrap gap-1.5">
        {tags.slice(0, 3).map((tag) => (
          <span key={tag} className="border border-white/[0.08] px-2 py-1 text-[10px] text-white/35">{tag}</span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between gap-4 pt-6 text-xs text-white/30">
        <span className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5" /> {skill.githubStars || 0}</span>
          <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {skill.viewsCount || 0}</span>
        </span>
        <span className="inline-flex items-center gap-1 font-mono text-[10px] text-white/45">
          v{skill.version || "—"} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

interface SkillRegistryClientProps {
  initialSkills: SkillSummary[];
  initialLoadError: boolean;
}

export function SkillRegistryClient({
  initialSkills,
  initialLoadError,
}: SkillRegistryClientProps) {
  const skills = initialSkills;
  const loading = false;
  const loadError = initialLoadError;
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearch = useDeferredValue(searchQuery);
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [deferredSearch, activeCategory, sortBy]);

  const categoryOptions = useMemo(() => {
    const counts = new Map<string, number>();
    skills.forEach((skill) => {
      const category = skill.category?.trim();
      if (category) counts.set(category, (counts.get(category) || 0) + 1);
    });
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [skills]);

  const processedSkills = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();
    return skills
      .filter((skill) => activeCategory === "all" || skill.category === activeCategory)
      .filter((skill) => !query || searchableText(skill).includes(query))
      .sort((a, b) => {
        if (sortBy === "stars") return (b.githubStars || 0) - (a.githubStars || 0);
        if (sortBy === "views") return (b.viewsCount || 0) - (a.viewsCount || 0);
        const score = (skill: SkillSummary) => (skill.githubStars || 0) * 10 + (skill.viewsCount || 0) + (skill.robotTypes?.length || 0) * 20 + (skill.dependencies?.length || 0) * 5;
        return score(b) - score(a);
      });
  }, [skills, deferredSearch, activeCategory, sortBy]);

  const uniqueBodies = useMemo(() => new Set(skills.flatMap((skill) => skill.robotTypes || []).filter(Boolean)).size, [skills]);
  const uniqueCategories = useMemo(() => new Set(skills.map((skill) => skill.category).filter(Boolean)).size, [skills]);
  const visibleSkills = processedSkills.slice(0, visibleCount);

  return (
    <main className="min-h-screen bg-background pb-20 pt-24">
      <section className="runtime-grid border-b border-white/[0.08] px-4 py-10 sm:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link href="/hub" className="focus-ring inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white">
                <ArrowLeft className="h-4 w-4" /> Distribution Hub
              </Link>
              <p className="mt-7 font-mono text-[0.68rem] uppercase tracking-[0.17em] text-physical-orange md:mt-10">02 / Behavior package registry</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl md:text-6xl">Skills</h1>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/50 md:text-lg">
                Find versioned task policies for embodied agents. Inspect the declared body profiles, dependencies, and operating assumptions before deployment.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Link href="/hub/mcps" className="focus-ring inline-flex items-center justify-center gap-2 border border-white/15 px-5 py-3 text-sm text-white/60 transition-colors hover:border-cognitive-cyan/40 hover:text-white">
                Need a body? Browse MCPs <ArrowRight className="h-4 w-4 text-cognitive-cyan" />
              </Link>
              <Link href="/skills/publish" className="focus-ring inline-flex items-center justify-center gap-2 bg-physical-orange px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#170500]">
                <Plus className="h-4 w-4" /> Publish Skill
              </Link>
            </div>
          </div>

          <dl className="mt-9 grid border border-white/10 bg-[#050708] sm:mt-12 sm:grid-cols-3">
            {[
              ["Registry skills", loading ? "—" : skills.length.toLocaleString()],
              ["Declared body profiles", loading ? "—" : uniqueBodies.toLocaleString()],
              ["Behavior categories", loading ? "—" : uniqueCategories.toLocaleString()],
            ].map(([label, value], index) => (
              <div key={label} className={`p-5 sm:p-6 ${index < 2 ? "border-b border-white/10 sm:border-b-0 sm:border-r" : ""}`}>
                <dt className="runtime-label">{label}</dt>
                <dd className="mt-2 font-mono text-xl text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-3 md:grid-cols-[1fr_220px]">
            <label className="relative block">
              <span className="sr-only">Search Skills</span>
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search tasks, hardware, dependencies, or publishers"
                className="h-14 w-full border border-white/10 bg-[#0a0e10] pl-12 pr-4 text-sm text-white placeholder:text-white/30 focus:border-physical-orange/50 focus:outline-none"
              />
            </label>
            <label className="relative block">
              <span className="sr-only">Sort Skills</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="h-14 w-full border border-white/10 bg-[#0a0e10] px-4 text-sm text-white/65 focus:border-physical-orange/50 focus:outline-none">
                <option value="recommended">Recommended</option>
                <option value="views">Most viewed</option>
                <option value="stars">Most GitHub stars</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            </label>
          </div>

          <div className="hub-filter-row mt-4 flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible" aria-label="Skill categories">
            <button type="button" onClick={() => setActiveCategory("all")} className={`focus-ring flex-none border px-4 py-2.5 text-sm transition-colors ${activeCategory === "all" ? "border-physical-orange/50 bg-physical-orange/[0.08] text-physical-orange" : "border-white/10 bg-white/[0.025] text-white/45 hover:border-white/20 hover:text-white"}`}>
              All skills <span className="ml-2 font-mono text-[10px] opacity-60">{skills.length}</span>
            </button>
            {categoryOptions.map(([category, count]) => (
              <button key={category} type="button" onClick={() => setActiveCategory(category)} className={`focus-ring flex-none border px-4 py-2.5 text-sm transition-colors ${activeCategory === category ? "border-physical-orange/50 bg-physical-orange/[0.08] text-physical-orange" : "border-white/10 bg-white/[0.025] text-white/45 hover:border-white/20 hover:text-white"}`}>
                {category} <span className="ml-2 font-mono text-[10px] opacity-60">{count}</span>
              </button>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-between border-b border-white/[0.08] pb-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">
              {loading ? "Indexing registry" : `${processedSkills.length.toLocaleString()} skills matched`}
            </p>
            <span className="hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-white/20 sm:inline-flex">
              <Workflow className="h-3.5 w-3.5" /> match body before execute
            </span>
          </div>

          {loading ? (
            <div className="grid gap-px bg-white/10 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-[320px] animate-pulse bg-[#080b0c]" />)}
            </div>
          ) : loadError ? (
            <RegistryMessage icon={Cpu} title="Registry temporarily unavailable" description="The skill index could not be loaded. Please retry in a moment." />
          ) : visibleSkills.length > 0 ? (
            <>
              <div className="grid min-w-0 gap-px bg-white/10 md:grid-cols-2 xl:grid-cols-3">
                {visibleSkills.map((skill, index) => <SkillCard key={skill.id} skill={skill} number={index + 1} />)}
              </div>
              {visibleCount < processedSkills.length && (
                <div className="flex justify-center border-x border-b border-white/10 bg-[#080b0c] p-6">
                  <button type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)} className="focus-ring inline-flex items-center gap-2 border border-white/15 px-6 py-3 text-sm text-white/60 transition-colors hover:border-physical-orange/40 hover:text-white">
                    Load {Math.min(PAGE_SIZE, processedSkills.length - visibleCount)} more <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <RegistryMessage
              icon={Workflow}
              title="No skills match this view"
              description="Try a broader task, hardware profile, dependency, or publisher. All declared package fields are searchable."
              action={() => { setSearchQuery(""); setActiveCategory("all"); }}
            />
          )}

          <div className="mt-16 grid border border-white/10 bg-[#080b0c] lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="p-6 sm:p-8">
              <p className="runtime-label">Publishable behavior contract</p>
              <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/50">
                <span className="inline-flex items-center gap-2"><Layers3 className="h-4 w-4 text-physical-orange" /> Versioned task policy</span>
                <span className="inline-flex items-center gap-2"><GitBranch className="h-4 w-4 text-physical-orange" /> Declared dependencies</span>
                <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-physical-orange" /> Body compatibility</span>
              </div>
            </div>
            <Link href="/skills/publish" className="focus-ring flex h-full items-center justify-center gap-2 border-t border-white/10 px-8 py-5 text-sm text-physical-orange transition-colors hover:bg-physical-orange/[0.05] lg:border-l lg:border-t-0">
              Publish documentation <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function RegistryMessage({ icon: Icon, title, description, action }: { icon: typeof Cpu; title: string; description: string; action?: () => void }) {
  return (
    <div className="border-x border-b border-white/10 bg-[#080b0c] px-6 py-20 text-center">
      <Icon className="mx-auto h-8 w-8 text-physical-orange" />
      <h2 className="mt-5 text-xl font-semibold text-white">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/45">{description}</p>
      {action && <button type="button" onClick={action} className="focus-ring mt-6 text-sm text-physical-orange hover:text-white">Clear search and filters</button>}
    </div>
  );
}
