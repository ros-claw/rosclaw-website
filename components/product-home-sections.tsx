import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  GitBranch,
  Network,
  Plug,
  ScanEye,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Users,
} from "lucide-react";
import { StatusBadge } from "@/components/status/status-badge";
import { releaseManifest, shortCommit } from "@/content/release-manifest";

const mission = [
  ["01", "Goal", "Describe the outcome", "cognitive"],
  ["02", "Native Agent", "Plans the mission", "cognitive"],
  ["03", "Observe", "Reads body + scene", "cognitive"],
  ["04", "Worker", "Delegates specialist work", "cognitive"],
  ["05", "Approval", "Checks policy + operator", "physical"],
  ["06", "rosclawd", "Owns physical authority", "physical"],
  ["07", "Execute", "Runs the bounded action", "physical"],
  ["08", "Verify", "Checks outcome evidence", "verified"],
  ["09", "Receipt", "Returns an audit record", "verified"],
] as const;

const capabilities = [
  {
    icon: BrainCircuit,
    title: "Native Agent",
    body: "A terminal-native mission runtime that understands its body, tools, context, and delegated workers.",
    status: "Experimental" as const,
    href: "/native-agent",
  },
  {
    icon: ShieldCheck,
    title: "Governed execution",
    body: "Model output becomes a proposal. Policy, approval, rosclawd, and the executor remain in the physical lane.",
    status: "Component Tested" as const,
    href: "/safety",
  },
  {
    icon: Users,
    title: "Worker fabric",
    body: "Spawn, monitor, steer, and collect specialist workers without surrendering mission ownership.",
    status: "Experimental" as const,
    href: "/native-agent#workers",
  },
  {
    icon: Plug,
    title: "MCP + Skills",
    body: "Install body interfaces and reusable behaviors from a source-linked registry with visible trust signals.",
    status: "Indexed" as const,
    href: "/hub",
  },
  {
    icon: GitBranch,
    title: "Context control",
    body: "Compact, inspect, branch, and fork mission context so long-running work stays reviewable.",
    status: "Experimental" as const,
    href: "/native-agent#context",
  },
] as const;

export function ProductHomeSections() {
  return (
    <>
      <section className="border-b border-white/[0.08] bg-[#050708] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] divide-y divide-white/[0.08] border-x border-white/[0.08] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-5">
          {[
            ["Native Agent", "Experimental"],
            ["Simulation path", "Verified"],
            ["Physical authority", "rosclawd"],
            ["Worker delegation", "Experimental"],
            ["Registry", "Live + synced"],
          ].map(([label, value]) => (
            <div key={label} className="px-5 py-4">
              <p className="runtime-label">{label}</p>
              <p className="mt-1.5 font-mono text-xs text-white/72">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="mission" className="px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="section-kicker">One complete mission</p>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">From intent to receipt—without skipping the boundary.</h2>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-white/52 lg:justify-self-end">
              ROSClaw separates cognition from physical authority. Cyan stages can reason and propose; orange stages govern and execute; green stages prove what happened.
            </p>
          </div>

          <ol className="mt-12 grid border border-white/10 bg-[#070a0b] md:grid-cols-3 xl:grid-cols-9">
            {mission.map(([step, label, detail, lane], index) => (
              <li key={label} className={`relative min-h-40 p-5 ${index < mission.length - 1 ? "border-b border-white/10 md:border-r xl:border-b-0" : ""}`}>
                <span className={`font-mono text-[10px] ${lane === "physical" ? "text-physical-orange" : lane === "verified" ? "text-emerald-300" : "text-cognitive-cyan"}`}>{step}</span>
                <h3 className="mt-7 text-sm font-semibold text-white">{label}</h3>
                <p className="mt-2 text-xs leading-relaxed text-white/38">{detail}</p>
                <span className={`absolute inset-x-0 bottom-0 h-0.5 ${lane === "physical" ? "bg-physical-orange" : lane === "verified" ? "bg-emerald-400" : "bg-cognitive-cyan"}`} />
              </li>
            ))}
          </ol>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.1em] text-white/35">
            <span className="inline-flex items-center gap-2"><span className="h-1.5 w-4 bg-cognitive-cyan" /> Cognitive lane</span>
            <span className="inline-flex items-center gap-2"><span className="h-1.5 w-4 bg-physical-orange" /> Physical authority</span>
            <span className="inline-flex items-center gap-2"><span className="h-1.5 w-4 bg-emerald-400" /> Evidence</span>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.08] bg-[#050708] px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-3xl">
            <p className="section-kicker">Product surface</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">A native Agent that knows it has a body.</h2>
            <p className="mt-5 text-base leading-relaxed text-white/50">Mission planning, context, delegation, interfaces, and guarded execution live in one inspectable runtime.</p>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-6">
            {capabilities.map(({ icon: Icon, title, body, status, href }, index) => (
              <Link key={title} href={href} className={`focus-ring group bg-[#080b0c] p-6 transition-colors hover:bg-[#0c1214] lg:col-span-2 ${index < 2 ? "lg:col-span-3" : ""}`}>
                <div className="flex items-start justify-between gap-4">
                  <Icon className="h-5 w-5 text-cognitive-cyan" />
                  <StatusBadge status={status} />
                </div>
                <h3 className="mt-14 text-xl font-semibold text-white group-hover:text-cognitive-cyan">{title}</h3>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/45">{body}</p>
                <span className="mt-7 inline-flex items-center gap-2 text-xs text-white/42 group-hover:text-white">Inspect surface <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="section-kicker">Two honest starting points</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">Choose evidence or frontier.</h2>
              <p className="mt-5 text-sm leading-relaxed text-white/48">Both installers resolve to a fixed Git commit. No release channel silently tracks a moving branch.</p>
            </div>
            <div className="grid border border-white/10 bg-[#070a0b] md:grid-cols-2">
              <article className="border-b border-white/10 p-6 md:border-b-0 md:border-r sm:p-8">
                <div className="flex items-center justify-between gap-3"><StatusBadge status="Simulation Verified" /><span className="font-mono text-[10px] text-white/30">{shortCommit(releaseManifest.stable.commit)}</span></div>
                <h3 className="mt-7 text-2xl font-semibold text-white">Stable Alpha</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/46">Run the evidence-backed MuJoCo path with hardware disabled.</p>
                <code className="mt-7 block overflow-x-auto border border-white/10 bg-black/40 p-4 font-mono text-xs text-cognitive-cyan">curl -fsSL https://rosclaw.io/get | bash</code>
                <Link href="/start?path=simulation" className="focus-ring mt-5 inline-flex items-center gap-2 text-sm text-cognitive-cyan">Start verified path <ArrowRight className="h-4 w-4" /></Link>
              </article>
              <article className="p-6 sm:p-8">
                <div className="flex items-center justify-between gap-3"><StatusBadge status="Experimental" /><span className="font-mono text-[10px] text-white/30">{shortCommit(releaseManifest.main.commit)}</span></div>
                <h3 className="mt-7 text-2xl font-semibold text-white">Main · Native Agent</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/46">Try the newest TUI mission runtime and worker fabric in simulation.</p>
                <code className="mt-7 block overflow-x-auto border border-white/10 bg-black/40 p-4 font-mono text-xs text-cognitive-cyan">curl -fsSL https://rosclaw.io/get-main | bash</code>
                <Link href="/start?path=native-agent" className="focus-ring mt-5 inline-flex items-center gap-2 text-sm text-cognitive-cyan">Start Native Agent <ArrowRight className="h-4 w-4" /></Link>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.08] bg-[#050708] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-px border border-white/10 bg-white/10 lg:grid-cols-3">
          {[
            [Plug, "Hardware MCPs", "Typed body and device interfaces with source freshness and manifest signals.", "/hub/mcps", "Browse MCPs"],
            [Sparkles, "Skills", "Reusable robot behaviors indexed from source, with version and sync timestamps.", "/hub/skills", "Browse Skills"],
            [ScanEye, "Evidence + status", "See exactly what is verified, observed, component-tested, experimental, or planned.", "/status", "Inspect status"],
          ].map(([Icon, title, body, href, cta]) => {
            const Component = Icon as typeof Network;
            return <Link key={String(title)} href={String(href)} className="focus-ring group bg-[#080b0c] p-7 sm:p-9"><Component className="h-6 w-6 text-cognitive-cyan" /><h2 className="mt-8 text-2xl font-semibold text-white">{String(title)}</h2><p className="mt-3 text-sm leading-relaxed text-white/45">{String(body)}</p><span className="mt-8 inline-flex items-center gap-2 text-sm text-cognitive-cyan">{String(cta)} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></Link>;
          })}
        </div>
      </section>

      <section className="border-t border-white/[0.08] px-4 py-20 text-center sm:px-6 md:py-28 lg:px-8">
        <CheckCircle2 className="mx-auto h-7 w-7 text-emerald-300" />
        <p className="section-kicker mt-6">Start with the boundary visible</p>
        <h2 className="mx-auto mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">Give your Agent a body. Keep authority accountable.</h2>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/start" className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 bg-cognitive-cyan px-6 font-semibold text-[#021012]">Start ROSClaw <ArrowRight className="h-4 w-4" /></Link><Link href="/native-agent" className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 border border-white/15 px-6 text-sm text-white/70"><TerminalSquare className="h-4 w-4" /> Explore Native Agent</Link></div>
      </section>
    </>
  );
}
