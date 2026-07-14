import Link from "next/link";
import { ArrowUpRight, Box, Database, GitCompareArrows, PlugZap, ScanSearch, ShieldCheck } from "lucide-react";

const capabilities = [
  {
    icon: Box,
    name: "Body",
    purpose: "Tell the agent which robot, sensors, tools, frames, and limits are present.",
    artifact: "e-URDF + body.yaml",
    status: "Ready",
  },
  {
    icon: ShieldCheck,
    name: "Sandbox",
    purpose: "Validate a proposed action before it is allowed to touch real hardware.",
    artifact: "ALLOW / MODIFY / BLOCK",
    status: "Ready",
  },
  {
    icon: ScanSearch,
    name: "Practice",
    purpose: "Capture physical execution as a replayable, inspectable trace.",
    artifact: "MCAP + Parquet + JSONL",
    status: "Ready",
  },
  {
    icon: Database,
    name: "Memory",
    purpose: "Retrieve comparable failures, recoveries, and physical context.",
    artifact: "spatiotemporal evidence",
    status: "Experimental",
  },
  {
    icon: GitCompareArrows,
    name: "Darwin",
    purpose: "Compare, promote, and roll back skill candidates through evaluation.",
    artifact: "candidate → champion",
    status: "Experimental",
  },
  {
    icon: PlugZap,
    name: "Provider",
    purpose: "Connect VLAs, VLMs, world models, critics, and classical controllers.",
    artifact: "provider lifecycle",
    status: "In progress",
  },
] as const;

function Status({ value }: { value: (typeof capabilities)[number]["status"] }) {
  const colors = value === "Ready"
    ? "border-emerald-400/25 bg-emerald-400/[0.06] text-emerald-400"
    : value === "Experimental"
    ? "border-amber-300/25 bg-amber-300/[0.06] text-amber-300"
    : "border-cognitive-cyan/25 bg-cognitive-cyan/[0.06] text-cognitive-cyan";

  return <span className={`whitespace-nowrap border px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] ${colors}`}>{value}</span>;
}

export function RuntimeCapabilitiesSection() {
  return (
    <section id="capabilities" className="runtime-grid border-b border-white/[0.08] px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="section-kicker">04 / Runtime capabilities</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl md:text-5xl">
              What is usable, and what is still evolving.
            </h2>
          </div>
          <p className="max-w-2xl text-pretty text-base leading-relaxed text-white/55 lg:justify-self-end lg:text-lg">
            The status is part of the product surface. Ready capabilities can be tried today; experimental and in-progress modules are labeled instead of hidden behind broad platform claims.
          </p>
        </div>

        <div className="mt-12 overflow-hidden border border-white/10 bg-[#070a0b]/90">
          <div className="hidden grid-cols-[48px_0.58fr_1.35fr_0.72fr_116px] gap-4 border-b border-white/10 bg-white/[0.025] px-5 py-3 font-mono text-[9px] uppercase tracking-[0.14em] text-white/30 md:grid lg:px-6">
            <span />
            <span>Module</span>
            <span>What it solves</span>
            <span>Runtime artifact</span>
            <span>Status</span>
          </div>
          <div className="divide-y divide-white/[0.08]">
            {capabilities.map(({ icon: Icon, name, purpose, artifact, status }) => (
              <div key={name} className="grid gap-4 px-4 py-5 transition-colors hover:bg-white/[0.025] sm:px-5 md:grid-cols-[48px_0.58fr_1.35fr_0.72fr_116px] md:items-center md:px-5 lg:px-6">
                <div className="flex h-9 w-9 items-center justify-center border border-white/10 bg-white/[0.025] text-cognitive-cyan">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="runtime-label md:hidden">Module</p>
                  <h3 className="mt-1 text-base font-medium text-white md:mt-0">{name}</h3>
                </div>
                <div>
                  <p className="runtime-label md:hidden">What it solves</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/[0.52] md:mt-0">{purpose}</p>
                </div>
                <div>
                  <p className="runtime-label md:hidden">Runtime artifact</p>
                  <code className="mt-1 block font-mono text-[10px] leading-relaxed text-white/44 md:mt-0">{artifact}</code>
                </div>
                <div className="justify-self-start"><Status value={status} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-l-2 border-physical-orange bg-physical-orange/[0.035] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/55"><span className="font-medium text-white">Physical orange means reality.</span> It marks hardware execution, contact, warnings, and blocked actions—not decoration.</p>
          <Link href="/runtime" className="focus-ring inline-flex shrink-0 items-center gap-1.5 text-sm text-physical-orange transition-colors hover:text-white">
            Capability details <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
