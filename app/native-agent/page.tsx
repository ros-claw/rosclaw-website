import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bot, BrainCircuit, GitFork, Network, ShieldCheck, TerminalSquare, Users } from "lucide-react";
import { Footer } from "@/components/footer";
import { StatusBadge } from "@/components/status/status-badge";
import { TerminalDemo } from "@/components/tui/terminal-demo";
import { releaseManifest, shortCommit } from "@/content/release-manifest";

export const metadata: Metadata = {
  title: "Native Agent | ROSClaw",
  description: "Meet ROSClaw's terminal-native, body-aware mission Agent with context control, worker delegation, approval gates, and auditable receipts.",
  alternates: { canonical: "/native-agent" },
};

const roles = [
  [BrainCircuit, "Native Agent", "Owns the mission, reasons over body context, calls tools, and delegates bounded work.", "Cognitive"],
  [Users, "Workers", "Specialists spawned for perception, planning, research, code, or verification tasks.", "Delegated"],
  [ShieldCheck, "rosclawd", "Enforces policy and approvals; remains the physical authority below every Agent.", "Physical authority"],
] as const;

export default function NativeAgentPage() {
  return (
    <main className="min-h-screen bg-[#060809] pt-16">
      <section className="runtime-grid border-b border-white/[0.08] px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3"><StatusBadge status="Experimental" /><span className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/35">Main · {shortCommit(releaseManifest.main.commit)}</span></div>
            <p className="section-kicker mt-8">ROSClaw Native Agent</p>
            <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:text-6xl">An Agent that understands the body it is operating.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/55">Mission-first interaction in the terminal, with context control, worker delegation, model-provider choice, approval gates, and receipts.</p>
            <p className="mt-5 border-l-2 border-physical-orange pl-4 text-sm leading-relaxed text-white/62">The Agent can propose physical work. It cannot bypass rosclawd, policy, executor limits, or operator approval.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/start?path=native-agent" className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 bg-cognitive-cyan px-6 font-semibold text-[#021012]">Start on Main <ArrowRight className="h-4 w-4" /></Link><Link href="#architecture" className="focus-ring inline-flex min-h-12 items-center justify-center border border-white/15 px-6 text-sm text-white/70">Inspect architecture</Link></div>
          </div>
          <TerminalDemo />
        </div>
      </section>

      <section id="architecture" className="px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <p className="section-kicker">Runtime roles</p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[0.68fr_1.32fr]">
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">Clear ownership at every boundary.</h2>
            <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
              {roles.map(([Icon, title, body, lane]) => <article key={title} className="bg-[#080b0c] p-6"><Icon className={`h-5 w-5 ${lane === "Physical authority" ? "text-physical-orange" : "text-cognitive-cyan"}`} /><p className="runtime-label mt-8">{lane}</p><h3 className="mt-2 text-xl font-semibold text-white">{title}</h3><p className="mt-3 text-sm leading-relaxed text-white/45">{body}</p></article>)}
            </div>
          </div>
        </div>
      </section>

      <section id="context" className="border-y border-white/[0.08] bg-[#050708] px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <StatusBadge status="Experimental" />
              <h2 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">Context is a controllable runtime resource.</h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/48">Long missions need more than an endless chat log. Inspect the tree, compact history, branch an approach, or fork a worker without losing mission lineage.</p>
            </div>
            <div className="overflow-hidden border border-white/10 bg-[#030506] font-mono text-xs">
              <div className="border-b border-white/10 px-5 py-3 text-[10px] uppercase tracking-[0.12em] text-white/35">mission/context</div>
              <div className="space-y-3 p-5 text-white/55"><p><span className="text-cognitive-cyan">/tree</span>       inspect mission lineage</p><p><span className="text-cognitive-cyan">/compact</span>    compress completed context</p><p><span className="text-cognitive-cyan">/branch</span>     explore a reversible path</p><p><span className="text-cognitive-cyan">/fork</span>       delegate with selected context</p><p className="border-t border-white/10 pt-4 text-emerald-300">context_budget: healthy · lineage: preserved</p></div>
            </div>
          </div>
        </div>
      </section>

      <section id="workers" className="px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-3xl"><p className="section-kicker">Worker fabric</p><h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">Delegate work. Keep mission ownership.</h2></div>
          <div className="mt-12 grid border border-white/10 bg-[#070a0b] sm:grid-cols-2 lg:grid-cols-5">
            {[["01","Spawn","Select role + context"],["02","Monitor","Observe progress"],["03","Steer","Correct direction"],["04","Collect","Receive evidence"],["05","Close","Return to mission"]].map(([step,title,body], index) => <article key={title} className={`min-h-44 p-5 ${index < 4 ? "border-b border-white/10 sm:border-r lg:border-b-0" : ""}`}><span className="font-mono text-[10px] text-cognitive-cyan">{step}</span><h3 className="mt-8 font-semibold text-white">{title}</h3><p className="mt-2 text-xs text-white/38">{body}</p></article>)}
          </div>
          <div className="mt-10 grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
            {[[TerminalSquare,"Inside ROSClaw","Native mission workers share the governed runtime."],[Network,"External agents","Codex, Claude Code, and other harnesses can integrate through MCP and workspace Skills."],[GitFork,"Teams","Multi-agent team coordination is an experimental Main capability, not part of Stable Alpha."]].map(([Icon,title,body]) => { const C = Icon as typeof Bot; return <article key={String(title)} className="bg-[#080b0c] p-6"><C className="h-5 w-5 text-cognitive-cyan"/><h3 className="mt-6 text-lg font-semibold text-white">{String(title)}</h3><p className="mt-3 text-sm leading-relaxed text-white/45">{String(body)}</p></article>; })}
          </div>
        </div>
      </section>
      <section className="border-t border-white/[0.08] bg-[#050708] px-4 py-20 text-center sm:px-6"><p className="section-kicker">Main Experimental</p><h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold text-white sm:text-4xl">Run the Native Agent with hardware disabled first.</h2><code className="mx-auto mt-7 block max-w-xl overflow-x-auto border border-white/10 bg-black/40 p-4 text-left font-mono text-xs text-cognitive-cyan">curl -fsSL https://rosclaw.io/get-main | bash</code><Link href="/start?path=native-agent" className="focus-ring mt-6 inline-flex items-center gap-2 text-sm text-cognitive-cyan">Open guided setup <ArrowRight className="h-4 w-4" /></Link></section>
      <Footer />
    </main>
  );
}
