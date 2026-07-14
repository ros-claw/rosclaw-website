"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Cpu,
  Eye,
  Github,
  Layers3,
  Plus,
  Search,
  ShieldCheck,
  Star,
  Terminal,
  Wrench,
} from "lucide-react";

interface McpPackage {
  id: string;
  name: string;
  description: string;
  authorName: string;
  githubRepoUrl?: string;
  verified: boolean;
  category?: string;
  robotType?: string;
  version?: string;
  githubStars?: number;
  viewsCount?: number;
  tags?: string[];
  tools?: { name: string; description: string }[];
}

const PAGE_SIZE = 24;

const categoryDefinitions = [
  { id: "all", label: "All interfaces", keywords: [] },
  { id: "official", label: "Verified", keywords: [] },
  { id: "robots", label: "Robot bodies", keywords: ["robot", "humanoid", "mobile", "arm", "manipulation", "unitree", "ros2"] },
  { id: "sensing", label: "Sensors & vision", keywords: ["sensor", "vision", "camera", "lidar", "realsense", "imu"] },
  { id: "industrial", label: "Industrial & lab", keywords: ["plc", "industrial", "lab", "modbus", "canopen", "beckhoff", "device"] },
  { id: "simulation", label: "Simulation", keywords: ["simulation", "simulator", "gazebo", "isaac", "mujoco", "digital twin"] },
] as const;

function isOfficial(pkg: McpPackage) {
  return pkg.verified || pkg.authorName === "ros-claw" || pkg.name.startsWith("ros-claw/");
}

function searchableText(pkg: McpPackage) {
  return [pkg.name, pkg.description, pkg.authorName, pkg.category, pkg.robotType, ...(pkg.tags || []), ...(pkg.tools || []).map((tool) => tool.name)]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function matchesCategory(pkg: McpPackage, categoryId: string) {
  if (categoryId === "all") return true;
  if (categoryId === "official") return isOfficial(pkg);
  const category = categoryDefinitions.find((item) => item.id === categoryId);
  if (!category) return true;
  const text = searchableText(pkg);
  return category.keywords.some((keyword) => text.includes(keyword));
}

function PackageCard({ pkg, number }: { pkg: McpPackage; number: number }) {
  const official = isOfficial(pkg);
  const tools = pkg.tools || [];
  const tags = pkg.tags || [];

  return (
    <Link
      href={`/hub/mcps/${pkg.name}`}
      className="focus-ring group flex min-h-[320px] min-w-0 flex-col overflow-hidden border border-white/10 bg-[#080b0c] p-6 transition-colors hover:border-cognitive-cyan/40 hover:bg-cognitive-cyan/[0.025]"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-[9px] tracking-[0.16em] text-white/25">MCP-{String(number).padStart(3, "0")}</span>
        {official && (
          <span className="inline-flex items-center gap-1.5 border border-cognitive-cyan/25 bg-cognitive-cyan/[0.04] px-2 py-1 font-mono text-[8px] uppercase tracking-wider text-cognitive-cyan">
            <CheckCircle2 className="h-3 w-3" /> Verified
          </span>
        )}
      </div>

      <div className="mt-6 flex items-start gap-4">
        <div className="flex h-11 w-11 flex-none items-center justify-center border border-cognitive-cyan/25 bg-cognitive-cyan/[0.05] text-cognitive-cyan">
          <Terminal className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h2 className="line-clamp-2 break-words text-lg font-semibold leading-snug text-white transition-colors group-hover:text-cognitive-cyan">
            {pkg.name}
          </h2>
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-white/35">
            <Github className="h-3 w-3" /> {pkg.authorName || "Community publisher"}
          </p>
        </div>
      </div>

      <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-white/48">{pkg.description || "No interface description provided."}</p>

      <dl className="mt-6 grid grid-cols-2 border-y border-white/[0.08] py-4 font-mono text-[9px] uppercase tracking-[0.11em]">
        <div>
          <dt className="text-white/25">Exposed tools</dt>
          <dd className="mt-1 text-cognitive-cyan">{tools.length}</dd>
        </div>
        <div>
          <dt className="text-white/25">Target</dt>
          <dd className="mt-1 truncate text-white/60">{pkg.robotType || "Not declared"}</dd>
        </div>
      </dl>

      <div className="mt-4 flex min-h-6 flex-wrap gap-1.5">
        {tags.slice(0, 3).map((tag) => (
          <span key={tag} className="border border-white/[0.08] px-2 py-1 text-[10px] text-white/35">{tag}</span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between gap-4 pt-6 text-xs text-white/30">
        <span className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5" /> {pkg.githubStars || 0}</span>
          <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {pkg.viewsCount || 0}</span>
        </span>
        <span className="inline-flex items-center gap-1 font-mono text-[10px] text-white/45">
          v{pkg.version || "—"} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export default function McpsPage() {
  const [packages, setPackages] = useState<McpPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearch = useDeferredValue(searchQuery);
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    let active = true;
    fetch("/api/mcp-packages")
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        setPackages(Array.isArray(data) ? data : []);
        setLoadError(false);
      })
      .catch(() => active && setLoadError(true))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [deferredSearch, activeCategory, sortBy]);

  const categoryCounts = useMemo(() => Object.fromEntries(
    categoryDefinitions.map((category) => [category.id, packages.filter((pkg) => matchesCategory(pkg, category.id)).length])
  ), [packages]);

  const availableCategories = categoryDefinitions.filter((category) => category.id === "all" || (categoryCounts[category.id] || 0) > 0);

  const processedPackages = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();
    return packages
      .filter((pkg) => matchesCategory(pkg, activeCategory))
      .filter((pkg) => !query || searchableText(pkg).includes(query))
      .sort((a, b) => {
        if (sortBy === "stars") return (b.githubStars || 0) - (a.githubStars || 0);
        if (sortBy === "tools") return (b.tools?.length || 0) - (a.tools?.length || 0);
        const score = (pkg: McpPackage) => (isOfficial(pkg) ? 1_000_000 : 0) + (pkg.tools?.length || 0) * 100 + (pkg.githubStars || 0) * 10;
        return score(b) - score(a);
      });
  }, [packages, deferredSearch, activeCategory, sortBy]);

  const totalTools = useMemo(() => packages.reduce((total, pkg) => total + (pkg.tools?.length || 0), 0), [packages]);
  const verifiedCount = useMemo(() => packages.filter(isOfficial).length, [packages]);
  const visiblePackages = processedPackages.slice(0, visibleCount);

  return (
    <main className="min-h-screen bg-background pb-20 pt-24">
      <section className="runtime-grid border-b border-white/[0.08] px-4 py-10 sm:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link href="/hub" className="focus-ring inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white">
                <ArrowLeft className="h-4 w-4" /> Distribution Hub
              </Link>
              <p className="section-kicker mt-7 md:mt-10">01 / Physical interface registry</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl md:text-6xl">Hardware MCPs</h1>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/50 md:text-lg">
                Find the typed tools that connect an agent to a robot, sensor, device, or physical system. Inspect every interface before granting hardware access.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Link href="/hub/skills" className="focus-ring inline-flex items-center justify-center gap-2 border border-white/15 px-5 py-3 text-sm text-white/60 transition-colors hover:border-physical-orange/40 hover:text-white">
                Need behavior? Browse Skills <ArrowRight className="h-4 w-4 text-physical-orange" />
              </Link>
              <Link href="/mcp-hub/publish" className="focus-ring inline-flex items-center justify-center gap-2 bg-cognitive-cyan px-5 py-3 text-sm font-semibold text-[#021012] transition-colors hover:bg-white">
                <Plus className="h-4 w-4" /> Publish MCP
              </Link>
            </div>
          </div>

          <dl className="mt-9 grid border border-white/10 bg-[#050708] sm:mt-12 sm:grid-cols-3">
            {[
              ["Registry packages", loading ? "—" : packages.length.toLocaleString()],
              ["Exposed tools", loading ? "—" : totalTools.toLocaleString()],
              ["Verified publishers", loading ? "—" : verifiedCount.toLocaleString()],
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
              <span className="sr-only">Search Hardware MCPs</span>
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search interfaces, tools, hardware, or publishers"
                className="h-14 w-full border border-white/10 bg-[#0a0e10] pl-12 pr-4 text-sm text-white placeholder:text-white/30 focus:border-cognitive-cyan/50 focus:outline-none"
              />
            </label>
            <label className="relative block">
              <span className="sr-only">Sort Hardware MCPs</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="h-14 w-full border border-white/10 bg-[#0a0e10] px-4 text-sm text-white/65 focus:border-cognitive-cyan/50 focus:outline-none">
                <option value="recommended">Recommended</option>
                <option value="tools">Most tools</option>
                <option value="stars">Most GitHub stars</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            </label>
          </div>

          <div className="hub-filter-row mt-4 flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible" aria-label="MCP categories">
            {availableCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className={`focus-ring flex-none border px-4 py-2.5 text-sm transition-colors ${activeCategory === category.id ? "border-cognitive-cyan/50 bg-cognitive-cyan/[0.08] text-cognitive-cyan" : "border-white/10 bg-white/[0.025] text-white/45 hover:border-white/20 hover:text-white"}`}
              >
                {category.label} <span className="ml-2 font-mono text-[10px] opacity-60">{categoryCounts[category.id] || 0}</span>
              </button>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-between border-b border-white/[0.08] pb-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">
              {loading ? "Indexing registry" : `${processedPackages.length.toLocaleString()} interfaces matched`}
            </p>
            <span className="hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-white/20 sm:inline-flex">
              <ShieldCheck className="h-3.5 w-3.5" /> inspect before execute
            </span>
          </div>

          {loading ? (
            <div className="grid gap-px bg-white/10 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-[320px] animate-pulse bg-[#080b0c]" />)}
            </div>
          ) : loadError ? (
            <RegistryMessage icon={Cpu} title="Registry temporarily unavailable" description="The package index could not be loaded. Please retry in a moment." />
          ) : visiblePackages.length > 0 ? (
            <>
              <div className="grid min-w-0 gap-px bg-white/10 md:grid-cols-2 xl:grid-cols-3">
                {visiblePackages.map((pkg, index) => <PackageCard key={pkg.id} pkg={pkg} number={index + 1} />)}
              </div>
              {visibleCount < processedPackages.length && (
                <div className="flex justify-center border-x border-b border-white/10 bg-[#080b0c] p-6">
                  <button type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)} className="focus-ring inline-flex items-center gap-2 border border-white/15 px-6 py-3 text-sm text-white/60 transition-colors hover:border-cognitive-cyan/40 hover:text-white">
                    Load {Math.min(PAGE_SIZE, processedPackages.length - visibleCount)} more <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <RegistryMessage
              icon={Wrench}
              title="No interfaces match this view"
              description="Try a broader term or clear the active category. Package names, tools, hardware targets, and publishers are all searchable."
              action={() => { setSearchQuery(""); setActiveCategory("all"); }}
            />
          )}

          <div className="mt-16 grid border border-white/10 bg-[#080b0c] lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="p-6 sm:p-8">
              <p className="runtime-label">Publishable interface contract</p>
              <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/50">
                <span className="inline-flex items-center gap-2"><Layers3 className="h-4 w-4 text-cognitive-cyan" /> Typed MCP tools</span>
                <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-cognitive-cyan" /> Declared hardware scope</span>
                <span className="inline-flex items-center gap-2"><Terminal className="h-4 w-4 text-cognitive-cyan" /> Sandbox test path</span>
              </div>
            </div>
            <Link href="/mcp-hub/publish" className="focus-ring flex h-full items-center justify-center gap-2 border-t border-white/10 px-8 py-5 text-sm text-cognitive-cyan transition-colors hover:bg-cognitive-cyan/[0.05] lg:border-l lg:border-t-0">
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
      <Icon className="mx-auto h-8 w-8 text-cognitive-cyan" />
      <h2 className="mt-5 text-xl font-semibold text-white">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/45">{description}</p>
      {action && <button type="button" onClick={action} className="focus-ring mt-6 text-sm text-cognitive-cyan hover:text-white">Clear search and filters</button>}
    </div>
  );
}
