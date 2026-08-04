import Link from "next/link";
import { ArrowRight, BrainCircuit, CheckCircle2, Cpu, FileCheck2, LockKeyhole, ShieldCheck, TerminalSquare } from "lucide-react";
import { Footer } from "@/components/footer";
import { StatusBadge } from "@/components/status/status-badge";

const cognitive = [
  [BrainCircuit, "Native Agent", "Owns the mission, reasons over observations, and proposes bounded work.", "Experimental"],
  [TerminalSquare, "Tools + workers", "Calls MCP tools and delegates specialist tasks while preserving mission context.", "Experimental"],
  [Cpu, "Model providers", "Pluggable reasoning providers supply cognition, never physical authority.", "Developer Observed"],
] as const;
const physical = [
  [LockKeyhole, "Policy + approval", "Evaluates scopes, limits, execution mode, and required operator consent.", "Component Tested"],
  [ShieldCheck, "rosclawd", "Mediates all physical dispatch and remains authoritative below the Agent.", "Component Tested"],
  [FileCheck2, "Executor + receipt", "Performs the bounded action, verifies the result, and records evidence.", "Simulation Verified"],
] as const;

export default function RuntimePage() {
  return <main className="min-h-screen bg-[#060809] pt-16">
    <section className="runtime-grid border-b border-white/[0.08] px-4 py-20 sm:px-6 md:py-28 lg:px-8"><div className="mx-auto max-w-[1440px]"><p className="section-kicker">Runtime architecture</p><h1 className="mt-5 max-w-5xl text-balance text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">Reason freely. Execute through a governed boundary.</h1><p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/52">ROSClaw is two connected lanes: a cognitive runtime for missions, tools, context, and workers; a physical runtime for policy, approvals, executors, verification, and receipts.</p></div></section>
    <section className="px-4 py-20 sm:px-6 md:py-28 lg:px-8"><div className="mx-auto max-w-[1440px]">
      <div className="grid gap-8 lg:grid-cols-2">
        <RuntimeLane title="Cognitive lane" kicker="Reason + propose" accent="cyan" items={cognitive}/>
        <RuntimeLane title="Physical lane" kicker="Authorize + execute" accent="orange" items={physical}/>
      </div>
      <div className="mt-10 border border-white/10 bg-[#070a0b]">
        <div className="grid lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-stretch">
          {[["01","Mission request","Cognitive"],["02","Action proposal","Cognitive"],["03","Authority decision","Physical"],["04","Verified receipt","Evidence"]].map(([step,title,lane],index)=><div key={title} className="contents"><article className="p-6"><span className={`font-mono text-[10px] ${lane==="Physical"?"text-physical-orange":lane==="Evidence"?"text-emerald-300":"text-cognitive-cyan"}`}>{step} · {lane}</span><h2 className="mt-3 font-semibold text-white">{title}</h2></article>{index<3&&<div className="hidden items-center border-x border-white/10 px-3 text-white/25 lg:flex">→</div>}</div>)}
        </div>
      </div>
    </div></section>
    <section className="border-y border-white/[0.08] bg-[#050708] px-4 py-20 sm:px-6 lg:px-8"><div className="mx-auto max-w-[1440px]"><div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]"><div><p className="section-kicker">Execution modes</p><h2 className="mt-4 text-3xl font-semibold text-white">Mode is part of authority.</h2></div><div className="grid border border-white/10 sm:grid-cols-3">{[["OFFLINE","No network or hardware","Verified path"],["SIMULATION","Simulation executor only","Verified UR5e demo"],["REAL","Physical executor + policy","Explicitly gated"]].map(([mode,body,note],index)=><article key={mode} className={`p-6 ${index<2?"border-b border-white/10 sm:border-b-0 sm:border-r":""}`}><p className={`font-mono text-xs ${mode==="REAL"?"text-physical-orange":"text-cognitive-cyan"}`}>{mode}</p><p className="mt-4 text-sm text-white/58">{body}</p><p className="mt-2 text-xs text-white/30">{note}</p></article>)}</div></div></div></section>
    <section className="px-4 py-20 text-center sm:px-6"><CheckCircle2 className="mx-auto h-6 w-6 text-emerald-300"/><h2 className="mx-auto mt-5 max-w-2xl text-3xl font-semibold text-white">See the boundary run end to end.</h2><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/start?path=simulation" className="focus-ring inline-flex items-center justify-center gap-2 bg-cognitive-cyan px-6 py-3 font-semibold text-[#021012]">Run verified simulation <ArrowRight className="h-4 w-4"/></Link><Link href="/safety" className="focus-ring inline-flex items-center justify-center border border-white/15 px-6 py-3 text-sm text-white/70">Inspect safety model</Link></div></section><Footer/>
  </main>;
}

function RuntimeLane({title,kicker,accent,items}:{title:string;kicker:string;accent:"cyan"|"orange";items:readonly (readonly [typeof BrainCircuit,string,string,string])[]}) {
  return <section className="border border-white/10 bg-[#070a0b]"><div className={`border-b px-6 py-5 ${accent==="orange"?"border-physical-orange/35":"border-cognitive-cyan/35"}`}><p className={`font-mono text-[10px] uppercase tracking-[0.12em] ${accent==="orange"?"text-physical-orange":"text-cognitive-cyan"}`}>{kicker}</p><h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2></div><div className="divide-y divide-white/[0.08]">{items.map(([Icon,name,body,status])=><article key={name} className="p-6"><div className="flex items-start justify-between gap-3"><Icon className={`h-5 w-5 ${accent==="orange"?"text-physical-orange":"text-cognitive-cyan"}`}/><StatusBadge status={status as "Experimental"|"Developer Observed"|"Component Tested"|"Simulation Verified"}/></div><h3 className="mt-7 text-lg font-semibold text-white">{name}</h3><p className="mt-2 text-sm leading-relaxed text-white/44">{body}</p></article>)}</div></section>
}
