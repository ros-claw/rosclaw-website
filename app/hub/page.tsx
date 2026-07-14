import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Box,
  Boxes,
  CheckCircle2,
  Cpu,
  FileCode2,
  Plug,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { githubDocLinks } from "@/content/cli";

const runtimeFlow = [
  { step: "01", label: "MCP exposes capability", detail: "typed tools + body boundary" },
  { step: "02", label: "Skill composes behavior", detail: "task policy + recovery" },
  { step: "03", label: "Runtime guards action", detail: "sandbox + approval gates" },
  { step: "04", label: "Trace returns evidence", detail: "inspect + improve + reuse" },
] as const;

const supportingAssets = [
  {
    icon: Box,
    name: "e-URDF",
    role: "Describes the body, limits, sensors, and capabilities.",
    href: "/hub",
    status: "Context",
  },
  {
    icon: Boxes,
    name: "Digital Twins",
    role: "Validate interfaces and skills before touching hardware.",
    href: "/hub/twins",
    status: "Validation",
  },
  {
    icon: BookOpen,
    name: "Cognitive Wiki",
    role: "Keeps task knowledge, constraints, and failure evidence.",
    href: "/hub/wiki",
    status: "Knowledge",
  },
] as const;

export default function HubPage() {
  return (
    <main className="min-h-screen bg-background pt-24">
      <section className="runtime-grid border-b border-white/[0.08] px-4 pb-16 pt-12 sm:px-6 md:pb-24 md:pt-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="section-kicker">Physical-AI distribution layer</p>
              <h1 className="mt-5 max-w-4xl text-balance text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl md:text-6xl">
                Interfaces expose the body. Skills teach it what to do.
              </h1>
            </div>
            <div className="max-w-2xl lg:justify-self-end">
              <p className="text-pretty text-lg leading-relaxed text-white/55">
                ROSClaw Hub is organized around the two artifacts an embodied agent actually installs: Hardware MCPs for physical access and Skills for reusable behavior.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[10px] uppercase tracking-[0.15em]">
                <span className="inline-flex items-center gap-2 text-cognitive-cyan">
                  <span className="h-1.5 w-1.5 bg-cognitive-cyan" /> Live registry
                </span>
                <span className="text-white/35">Local-first</span>
                <span className="text-white/35">Versioned</span>
                <span className="text-white/35">Inspectable</span>
              </div>
            </div>
          </div>

          <div className="mt-14 grid border border-white/10 bg-[#050708] lg:grid-cols-2">
            <article className="relative flex min-h-[430px] flex-col overflow-hidden border-b border-white/10 p-7 sm:p-10 lg:border-b-0 lg:border-r">
              <div className="absolute inset-x-0 top-0 h-px bg-cognitive-cyan" />
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center border border-cognitive-cyan/30 bg-cognitive-cyan/[0.06] text-cognitive-cyan">
                  <Plug className="h-6 w-6" />
                </div>
                <span className="border border-cognitive-cyan/25 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-cognitive-cyan">
                  01 / Connect
                </span>
              </div>
              <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">Hardware interface registry</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">Hardware MCPs</h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/50">
                Typed, agent-facing interfaces for robot bodies, cameras, sensors, PLCs, lab equipment, and other physical systems.
              </p>
              <div className="mt-7 grid grid-cols-3 border-y border-white/[0.08] py-4 font-mono text-[9px] uppercase tracking-wider text-white/35">
                <span>Tool schemas</span>
                <span>Body scopes</span>
                <span>Sandbox stubs</span>
              </div>
              <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
                <Link href="/hub/mcps" className="focus-ring inline-flex items-center justify-center gap-2 bg-cognitive-cyan px-5 py-3 text-sm font-semibold text-[#021012] transition-colors hover:bg-white">
                  Browse MCPs <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/mcp-hub/publish" className="focus-ring inline-flex items-center justify-center gap-2 border border-white/15 px-5 py-3 text-sm text-white/70 transition-colors hover:border-cognitive-cyan/40 hover:text-white">
                  Publish an interface <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </article>

            <article className="relative flex min-h-[430px] flex-col overflow-hidden p-7 sm:p-10">
              <div className="absolute inset-x-0 top-0 h-px bg-physical-orange" />
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center border border-physical-orange/30 bg-physical-orange/[0.06] text-physical-orange">
                  <Cpu className="h-6 w-6" />
                </div>
                <span className="border border-physical-orange/25 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-physical-orange">
                  02 / Behave
                </span>
              </div>
              <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">Behavior package registry</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">Skills</h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/50">
                Versioned task policies with recovery strategies, dependencies, parameters, and declared body compatibility.
              </p>
              <div className="mt-7 grid grid-cols-3 border-y border-white/[0.08] py-4 font-mono text-[9px] uppercase tracking-wider text-white/35">
                <span>Task policy</span>
                <span>Recovery</span>
                <span>Compatibility</span>
              </div>
              <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
                <Link href="/hub/skills" className="focus-ring inline-flex items-center justify-center gap-2 bg-physical-orange px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#170500]">
                  Browse Skills <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/skills/publish" className="focus-ring inline-flex items-center justify-center gap-2 border border-white/15 px-5 py-3 text-sm text-white/70 transition-colors hover:border-physical-orange/40 hover:text-white">
                  Publish a skill <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.08] px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="section-kicker">One execution path</p>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.035em] text-white md:text-4xl">From physical access to reusable evidence.</h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/45">
                An MCP and a Skill are useful together. The runtime keeps the boundary between what an agent can request and what hardware may execute.
              </p>
            </div>
            <ol className="grid border border-white/10 bg-[#080b0c] sm:grid-cols-2">
              {runtimeFlow.map((item, index) => (
                <li key={item.step} className={`p-6 sm:p-7 ${index < 2 ? "border-b border-white/10" : ""} ${index % 2 === 0 ? "sm:border-r" : ""}`}>
                  <span className="font-mono text-[9px] tracking-[0.18em] text-cognitive-cyan">{item.step}</span>
                  <h3 className="mt-5 text-lg font-medium text-white">{item.label}</h3>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-white/30">{item.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.08] bg-[#080b0c] px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-kicker">Supporting context</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white">Everything else supports the core pair.</h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-white/40">
              Body definitions, simulation, and knowledge remain available, but they no longer compete with the two primary install paths.
            </p>
          </div>
          <div className="mt-10 grid border border-white/10 bg-[#050708] md:grid-cols-3">
            {supportingAssets.map(({ icon: Icon, name, role, href, status }, index) => (
              <Link key={name} href={href} className={`focus-ring group p-6 transition-colors hover:bg-white/[0.03] sm:p-7 ${index < supportingAssets.length - 1 ? "border-b border-white/10 md:border-b-0 md:border-r" : ""}`}>
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5 text-white/40 transition-colors group-hover:text-cognitive-cyan" />
                  <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/25">{status}</span>
                </div>
                <h3 className="mt-7 flex items-center gap-2 text-lg font-medium text-white">
                  {name} <ArrowUpRight className="h-3.5 w-3.5 text-white/25 transition-colors group-hover:text-cognitive-cyan" />
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/40">{role}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div className="industrial-panel p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <Terminal className="h-5 w-5 text-cognitive-cyan" />
              <h2 className="text-lg font-medium text-white">Install the core pair</h2>
            </div>
            <div className="mt-6 space-y-3 font-mono text-xs">
              <div className="overflow-x-auto border border-white/10 bg-black/40 p-4 text-white/60"><span className="mr-3 text-cognitive-cyan">$</span>rosclaw install mcp owner/package</div>
              <div className="overflow-x-auto border border-white/10 bg-black/40 p-4 text-white/60"><span className="mr-3 text-physical-orange">$</span>rosclaw install skill owner/skill</div>
            </div>
            <a href={githubDocLinks.assets} target="_blank" rel="noopener noreferrer" className="focus-ring mt-6 inline-flex items-center gap-2 text-sm text-cognitive-cyan hover:text-white">
              Read the asset documentation <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <div className="border border-white/10 bg-[#080b0c] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-physical-orange" />
              <h2 className="text-lg font-medium text-white">Registry trust model</h2>
            </div>
            <ul className="mt-6 space-y-4 text-sm text-white/50">
              {[
                "Inspect package source and declared capabilities before install.",
                "Validate physical actions in a sandbox or digital twin first.",
                "Grant only the hardware scopes required for the task.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-cognitive-cyan" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center gap-2 border-t border-white/[0.08] pt-5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/25">
              <FileCode2 className="h-3.5 w-3.5" /> Manifest + source + trace
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
