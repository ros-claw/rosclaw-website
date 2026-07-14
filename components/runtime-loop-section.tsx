"use client";

import { KeyboardEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

const stages = [
  {
    id: "intent",
    label: "Intent",
    short: "Task enters the runtime",
    description: "A model or operator proposes a goal. At this point it is intent—not a hardware command.",
    evidence: "task / gesture.ok",
    accent: "cyan",
  },
  {
    id: "body",
    label: "Body Context",
    short: "Load capabilities and limits",
    description: "The runtime resolves the active robot, joints, sensors, frames, tools, and safety envelope.",
    evidence: "e-URDF / body.yaml",
    accent: "cyan",
  },
  {
    id: "sandbox",
    label: "Sandbox",
    short: "Check before reality",
    description: "The proposed action is validated against limits and, where available, rehearsed in a digital twin.",
    evidence: "ALLOW / MODIFY / BLOCK",
    accent: "orange",
  },
  {
    id: "execute",
    label: "Execute",
    short: "Touch real hardware",
    description: "Only an approved action reaches the robot, while runtime guards continue watching physical state.",
    evidence: "guarded hardware call",
    accent: "orange",
  },
  {
    id: "trace",
    label: "Physical Trace",
    short: "Record what happened",
    description: "Robot state, decisions, sensor events, failures, and recovery steps become replayable evidence.",
    evidence: "MCAP / Parquet / JSONL",
    accent: "cyan",
  },
  {
    id: "memory",
    label: "Memory & Evolution",
    short: "Turn evidence into change",
    description: "Traces can be retrieved as physical memory and evaluated as candidates for safer skill updates.",
    evidence: "candidate / benchmark / promote",
    accent: "cyan",
  },
] as const;

export function RuntimeLoopSection() {
  const [activeIndex, setActiveIndex] = useState(2);
  const active = stages[activeIndex];

  const handleKeys = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % stages.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + stages.length) % stages.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = stages.length - 1;
    else return;

    event.preventDefault();
    setActiveIndex(next);
    document.getElementById(`runtime-tab-${stages[next].id}`)?.focus();
  };

  return (
    <section id="runtime-loop" className="runtime-grid border-b border-white/[0.08] px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="section-kicker">02 / Runtime loop</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl md:text-5xl">
              Every action becomes evidence.
            </h2>
          </div>
          <p className="max-w-2xl text-pretty text-base leading-relaxed text-white/55 lg:justify-self-end lg:text-lg">
            One causal path connects agent intent to physical execution and learning. Select a stage to inspect what the runtime knows and produces.
          </p>
        </div>

        <div className="mt-12 border border-white/10 bg-[#070a0b]/90">
          <div
            role="tablist"
            aria-label="ROSClaw runtime stages"
            className="grid grid-cols-1 divide-y divide-white/[0.08] md:grid-cols-3 md:divide-x md:divide-y-0 xl:grid-cols-6"
          >
            {stages.map((stage, index) => {
              const selected = activeIndex === index;
              return (
                <button
                  key={stage.id}
                  id={`runtime-tab-${stage.id}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls={`runtime-panel-${stage.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveIndex(index)}
                  onKeyDown={(event) => handleKeys(event, index)}
                  className={`focus-ring group relative min-h-[104px] px-4 py-4 text-left transition-colors sm:px-5 ${selected ? "bg-white/[0.055]" : "hover:bg-white/[0.025]"}`}
                >
                  <span className={`font-mono text-[9px] ${stage.accent === "orange" ? "text-physical-orange" : "text-cognitive-cyan"}`}>
                    0{index + 1}
                  </span>
                  <span className="mt-3 block text-sm font-medium text-white">{stage.label}</span>
                  <span className="mt-1 block text-xs leading-snug text-white/35">{stage.short}</span>
                  {selected && (
                    <span className={`absolute inset-x-0 bottom-0 h-0.5 ${stage.accent === "orange" ? "bg-physical-orange" : "bg-cognitive-cyan"}`} />
                  )}
                </button>
              );
            })}
          </div>

          <div
            id={`runtime-panel-${active.id}`}
            role="tabpanel"
            aria-labelledby={`runtime-tab-${active.id}`}
            className="grid min-h-[190px] border-t border-white/10 md:grid-cols-[1.3fr_0.7fr]"
          >
            <div className="px-5 py-7 sm:px-8 sm:py-9">
              <div className="flex items-center gap-3">
                <span className={`h-2 w-2 rounded-full ${active.accent === "orange" ? "bg-physical-orange shadow-[0_0_12px_rgba(255,62,0,0.55)]" : "bg-cognitive-cyan shadow-[0_0_12px_rgba(0,240,255,0.55)]"}`} />
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">Selected stage</p>
              </div>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white">{active.label}</h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/[0.58] sm:text-base">{active.description}</p>
            </div>
            <div className="flex flex-col justify-between border-t border-white/10 bg-black/25 px-5 py-7 md:border-l md:border-t-0 sm:px-8">
              <div>
                <p className="runtime-label">Runtime artifact</p>
                <code className={`mt-3 block font-mono text-sm ${active.accent === "orange" ? "text-physical-orange" : "text-cognitive-cyan"}`}>
                  {active.evidence}
                </code>
              </div>
              <Link href="/runtime" className="focus-ring mt-6 inline-flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-white">
                Full runtime architecture <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-5 hidden items-center justify-center gap-3 font-mono text-[9px] uppercase tracking-[0.14em] text-white/25 md:flex">
          Intent <ArrowRight className="h-3 w-3" /> body <ArrowRight className="h-3 w-3" /> guard <ArrowRight className="h-3 w-3" /> reality <ArrowRight className="h-3 w-3" /> evidence <ArrowRight className="h-3 w-3" /> evolution
        </div>
      </div>
    </section>
  );
}
