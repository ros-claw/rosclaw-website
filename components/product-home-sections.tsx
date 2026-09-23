import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Cpu,
  Plug,
  ScanEye,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
} from "lucide-react";
import { StatusBadge } from "@/components/status/status-badge";
import { releaseManifest, shortCommit } from "@/content/release-manifest";

const outwardSteps = ["Intent", "Body", "Capability", "Authority", "Action", "Physical world"];
const inwardSteps = ["Observation", "Verification", "Episode", "Memory", "Skill", "Evolution"];

const experienceStages = [
  { number: "01", title: "Act", description: "An agent proposes a body-scoped action. The runtime checks policy, authority, and the execution boundary.", href: "/safety" },
  { number: "02", title: "Verify", description: "Observations and receipts record what happened. A request alone is never proof of completion.", href: "/evidence" },
  { number: "03", title: "Remember", description: "Practice episodes can become inspectable context for recovery and future decisions.", href: "/flywheel" },
  { number: "04", title: "Evolve", description: "Validated experience can inform reusable skills and evaluated changes; promotion remains governed.", href: "/hub/skills" },
] as const;

const agentExamples = ["Codex", "Claude Code", "Hermes", "OpenClaw", "VLA", "ROSClaw Native Agent"];
const bodyExamples = ["ROS 2", "Hardware MCP", "Vendor SDK", "MuJoCo", "Isaac", "Robots"];

const governance = [
  ["Body + capability", "Ground each request in a specific body and declared capability."],
  ["Policy + permit", "Physical authority stays with rosclawd and the operator."],
  ["Lease + E-Stop", "Bound work in time and retain a stop path."],
  ["Receipt + evidence", "Separate proposed, dispatched, and verified outcomes."],
] as const;

function LoopCard({ label, steps, accent }: { label: string; steps: readonly string[]; accent: "cyan" | "orange" }) {
  const color = accent === "cyan" ? "text-cognitive-cyan" : "text-physical-orange";
  return (
    <div className="flex h-full flex-col border border-white/10 bg-[#080b0c] p-6 sm:p-8">
      <p className={`font-mono text-[10px] uppercase tracking-[0.17em] ${color}`}>{label}</p>
      <ol className="mt-8 grid gap-2 sm:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step} className="flex min-h-20 items-center gap-3 border border-white/[0.08] bg-black/20 px-4 py-3">
            <span className={`font-mono text-[10px] ${color}`}>{String(index + 1).padStart(2, "0")}</span>
            <span className="text-sm font-medium text-white/75">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ProductHomeSections() {
  return (
    <>
      <section className="border-b border-white/[0.08] bg-[#050708] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] divide-y divide-white/[0.08] border-x border-white/[0.08] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {[["Runtime", "One governed boundary"], ["Agents", "Replaceable clients"], ["Bodies", "Physical + simulated"], ["Evidence", "Status linked to proof"]].map(([label, value]) => (
            <div key={label} className="px-5 py-4"><p className="runtime-label">{label}</p><p className="mt-1.5 font-mono text-xs text-white/72">{value}</p></div>
          ))}
        </div>
      </section>

      <section id="mission" className="px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div><p className="section-kicker">What is ROSClaw?</p><h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">One Runtime. Two Loops.</h2></div>
            <p className="max-w-2xl text-base leading-relaxed text-white/52 lg:justify-self-end">ROSClaw is the bidirectional runtime between intelligence and the physical world: turning intent into governed action, and verified physical experience into reusable intelligence.</p>
          </div>
          <div className="mt-12 grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
            <LoopCard label="Intelligence → Physical world" steps={outwardSteps} accent="cyan" />
            <div className="flex min-h-24 items-center justify-center border border-white/15 bg-white/[0.03] px-7 text-xl font-semibold tracking-[-0.04em] text-white lg:[writing-mode:vertical-rl]">ROSClaw</div>
            <LoopCard label="Physical world → Intelligence" steps={inwardSteps} accent="orange" />
          </div>
          <p className="mt-5 max-w-4xl text-sm leading-relaxed text-white/42">Execution is governed today; memory and skill evolution consume evidence through distinct, evaluated paths. See <Link href="/status" className="text-cognitive-cyan hover:text-white">current evidence and maturity</Link> for each capability.</p>
        </div>
      </section>

      <section className="border-y border-white/[0.08] bg-[#050708] px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <p className="section-kicker">The practice loop</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">Act. Verify. Remember. Evolve.</h2>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/50">Experience is useful when it can be checked, retained, and evaluated before it changes how a robot acts.</p>
          <div className="mt-12 grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-4">
            {experienceStages.map((stage) => (
              <Link key={stage.title} href={stage.href} className="focus-ring group flex min-h-72 flex-col bg-[#080b0c] p-7 transition-colors hover:bg-[#0c1214]">
                <span className="font-mono text-[10px] text-cognitive-cyan">{stage.number} / 04</span>
                <h3 className="mt-12 text-3xl font-semibold text-white group-hover:text-cognitive-cyan">{stage.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/46">{stage.description}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-8 text-xs text-white/45">Explore <ArrowRight className="h-3.5 w-3.5" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <p className="section-kicker">Open at both ends</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">Any Agent. Any Body. One Runtime.</h2>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/50">Bring the agent you use and connect a supported body or simulator. ROSClaw keeps the same physical execution boundary between them.</p>
          <div className="mt-12 grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
            <div className="border border-white/10 bg-[#080b0c] p-7"><div className="flex items-center gap-3 text-cognitive-cyan"><BrainCircuit className="h-5 w-5" /><h3 className="text-lg font-semibold">Agent clients</h3></div><div className="mt-7 flex flex-wrap gap-2">{agentExamples.map((name) => <span key={name} className="border border-white/10 px-3 py-2 text-sm text-white/65">{name}</span>)}</div></div>
            <div className="flex min-h-20 items-center justify-center border border-cognitive-cyan/25 bg-cognitive-cyan/[0.04] px-7 text-xl font-semibold text-white">ROSClaw</div>
            <div className="border border-white/10 bg-[#080b0c] p-7"><div className="flex items-center gap-3 text-physical-orange"><Cpu className="h-5 w-5" /><h3 className="text-lg font-semibold">Bodies + backends</h3></div><div className="mt-7 flex flex-wrap gap-2">{bodyExamples.map((name) => <span key={name} className="border border-white/10 px-3 py-2 text-sm text-white/65">{name}</span>)}</div></div>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-white/38">The examples show integration surfaces, not universal compatibility or verified support for every robot. <Link href="/robots" className="text-cognitive-cyan hover:text-white">Check the support matrix.</Link> ROSClaw Native Agent is an optional agent client.</p>
          <Link href="/integrations" className="focus-ring mt-7 inline-flex items-center gap-2 text-sm text-cognitive-cyan hover:text-white">Explore integrations <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <section className="border-y border-white/[0.08] bg-[#050708] px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <p className="section-kicker">Governed by design</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">Physical authority stays outside the model.</h2>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/50">Agents can reason and propose. ROSClaw checks the body, capability, policy, and permit before an executor can act.</p>
          <div className="mt-12 grid gap-px border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-4">
            {governance.map(([title, body]) => <div key={title} className="bg-[#080b0c] p-7"><ShieldCheck className="h-5 w-5 text-physical-orange" /><h3 className="mt-10 text-lg font-semibold text-white">{title}</h3><p className="mt-3 text-sm leading-relaxed text-white/44">{body}</p></div>)}
          </div>
          <Link href="/safety" className="focus-ring mt-7 inline-flex items-center gap-2 text-sm text-cognitive-cyan hover:text-white">Inspect safety boundary <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-2 lg:items-center">
          <div><p className="section-kicker">Experience becomes capability</p><h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">Teach Once. Embody Anywhere.</h2><p className="mt-5 max-w-xl text-base leading-relaxed text-white/50">Skills capture repeatable behavior. Body binding and capability mapping let a skill be adapted to another compatible robot, with validation at every step.</p><Link href="/hub/skills" className="focus-ring mt-7 inline-flex items-center gap-2 text-sm text-physical-orange hover:text-white">Explore Skills <ArrowRight className="h-4 w-4" /></Link></div>
          <div className="grid gap-4 sm:grid-cols-2"><Link href="/hub/mcps" className="focus-ring border border-cognitive-cyan/25 bg-cognitive-cyan/[0.04] p-7"><Plug className="h-6 w-6 text-cognitive-cyan" /><h3 className="mt-8 text-xl font-semibold text-white">MCPs expose the body</h3><p className="mt-3 text-sm leading-relaxed text-white/45">Typed interfaces for physical capabilities.</p></Link><Link href="/hub/skills" className="focus-ring border border-physical-orange/25 bg-physical-orange/[0.04] p-7"><Sparkles className="h-6 w-6 text-physical-orange" /><h3 className="mt-8 text-xl font-semibold text-white">Skills carry the behavior</h3><p className="mt-3 text-sm leading-relaxed text-white/45">Source-linked behaviors with visible trust signals.</p></Link></div>
        </div>
      </section>

      <section className="border-t border-white/[0.08] bg-[#050708] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="section-kicker">Evidence, not claims</p><h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">See what has been proven.</h2></div><p className="max-w-xl text-sm leading-relaxed text-white/45">Simulation verified, developer observed, component tested, and experimental paths remain distinct.</p></div>
          <div className="mt-10 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-3">
            {([[ScanEye, "Evidence", "Inspect receipts and validation records.", "/evidence"], [CheckCircle2, "Product status", "See current evidence and support levels.", "/status"], [TerminalSquare, "Native Agent", "Explore the optional experimental agent client.", "/native-agent"]] as const).map(([Icon, title, body, href]) => <Link key={title} href={href} className="focus-ring group bg-[#080b0c] p-7"><Icon className="h-6 w-6 text-cognitive-cyan" /><h3 className="mt-8 text-xl font-semibold text-white">{title}</h3><p className="mt-3 text-sm leading-relaxed text-white/45">{body}</p><span className="mt-6 inline-flex items-center gap-2 text-sm text-cognitive-cyan">Explore <ArrowRight className="h-4 w-4" /></span></Link>)}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.08] px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="mx-auto max-w-[1440px]"><div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]"><div><p className="section-kicker">Choose a starting point</p><h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">Start with a verified simulation.</h2><p className="mt-5 text-sm leading-relaxed text-white/48">The stable installer and the latest main build each resolve to a fixed commit.</p></div><div className="grid border border-white/10 bg-[#070a0b] md:grid-cols-2"><article className="border-b border-white/10 p-6 sm:p-8 md:border-b-0 md:border-r"><div className="flex items-center justify-between gap-3"><StatusBadge status="Simulation Verified" /><span className="font-mono text-[10px] text-white/30">{shortCommit(releaseManifest.stable.commit)}</span></div><h3 className="mt-7 text-2xl font-semibold text-white">Stable Alpha</h3><p className="mt-3 text-sm leading-relaxed text-white/46">Run the evidence-backed MuJoCo path with hardware disabled.</p><code className="mt-7 block overflow-x-auto border border-white/10 bg-black/40 p-4 font-mono text-xs text-cognitive-cyan">curl -fsSL https://rosclaw.io/get | bash</code><Link href="/start?path=simulation" className="focus-ring mt-5 inline-flex items-center gap-2 text-sm text-cognitive-cyan">Start verified path <ArrowRight className="h-4 w-4" /></Link></article><article className="p-6 sm:p-8"><div className="flex items-center justify-between gap-3"><StatusBadge status="Experimental" /><span className="font-mono text-[10px] text-white/30">{shortCommit(releaseManifest.main.commit)}</span></div><h3 className="mt-7 text-2xl font-semibold text-white">Main · Native Agent</h3><p className="mt-3 text-sm leading-relaxed text-white/46">Try the newest TUI mission runtime and worker fabric in simulation.</p><code className="mt-7 block overflow-x-auto border border-white/10 bg-black/40 p-4 font-mono text-xs text-cognitive-cyan">curl -fsSL https://rosclaw.io/get-main | bash</code><Link href="/start?path=native-agent" className="focus-ring mt-5 inline-flex items-center gap-2 text-sm text-cognitive-cyan">Explore experimental path <ArrowRight className="h-4 w-4" /></Link></article></div></div></div>
      </section>
    </>
  );
}
