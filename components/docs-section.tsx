"use client";

import { KeyboardEvent, useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink, Terminal } from "lucide-react";
import { firstEmbodimentSteps } from "@/content/cli";

const onboardingSteps = [
  {
    ...firstEmbodimentSteps[0],
    step: "Install",
    result: ["Release: current alpha", "Hardware actions: disabled"],
  },
  {
    ...firstEmbodimentSteps[1],
    step: "Firstboot",
    result: ["Profile: offline", "Telemetry: disabled"],
  },
  {
    ...firstEmbodimentSteps[2],
    step: "Run",
    result: ["Engine: MuJoCo", "Evidence: TASK_VERIFIED"],
  },
  {
    ...firstEmbodimentSteps[3],
    step: "Explain",
    result: ["Receipt: persisted", "Trace: inspectable"],
  },
] as const;

export function DocsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const active = onboardingSteps[activeIndex];

  const selectStep = (index: number) => {
    setActiveIndex(index);
    setCopied(false);
  };

  const handleKeys = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      next = (index + 1) % onboardingSteps.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      next = (index - 1 + onboardingSteps.length) % onboardingSteps.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = onboardingSteps.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    selectStep(next);
    document.getElementById(`embodiment-tab-${onboardingSteps[next].id}`)?.focus();
  };

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(active.command.command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      id="first-embodiment"
      className="border-b border-white/[0.08] bg-[#080b0c] px-4 py-20 sm:px-6 md:py-28 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-7 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="section-kicker">03 / First verified receipt</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl md:text-5xl">
              Run a physical action you can inspect.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-white/55 lg:justify-self-end lg:text-lg">
            Four explicit steps install ROSClaw, create an offline workspace,
            execute the physics-backed UR5e path, and explain its evidence.
            No real robot is commanded.
          </p>
        </div>

        <div className="mt-12 grid border border-white/10 bg-[#050708] lg:grid-cols-[minmax(220px,0.42fr)_minmax(0,1.58fr)]">
          <div
            role="tablist"
            aria-label="First verified receipt steps"
            className="grid grid-cols-1 border-b border-white/10 sm:grid-cols-4 lg:block lg:border-b-0 lg:border-r"
          >
            {onboardingSteps.map((step, index) => {
              const selected = activeIndex === index;
              return (
                <button
                  key={step.id}
                  id={`embodiment-tab-${step.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`embodiment-panel-${step.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => selectStep(index)}
                  onKeyDown={(event) => handleKeys(event, index)}
                  className={`focus-ring relative w-full border-b border-white/10 px-4 py-4 text-left transition-colors last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 lg:min-h-[112px] lg:border-b lg:border-r-0 lg:last:border-b-0 lg:px-6 lg:py-5 ${
                    selected ? "bg-white/[0.055]" : "hover:bg-white/[0.025]"
                  }`}
                >
                  <span
                    className={`font-mono text-[9px] ${
                      selected ? "text-cognitive-cyan" : "text-white/25"
                    }`}
                  >
                    STEP 0{index + 1}
                  </span>
                  <span
                    className={`mt-2 block text-sm font-medium ${
                      selected ? "text-white" : "text-white/[0.52]"
                    }`}
                  >
                    {step.step}
                  </span>
                  <span className="mt-1 hidden text-xs leading-snug text-white/30 lg:block">
                    {step.description}
                  </span>
                  {selected && (
                    <span className="absolute inset-y-0 left-0 w-0.5 bg-cognitive-cyan sm:inset-x-0 sm:bottom-0 sm:top-auto sm:h-0.5 sm:w-auto lg:inset-y-0 lg:left-0 lg:right-auto lg:h-auto lg:w-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          <div
            id={`embodiment-panel-${active.id}`}
            role="tabpanel"
            aria-labelledby={`embodiment-tab-${active.id}`}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase text-white/[0.38]">
                <Terminal className="h-3.5 w-3.5 text-cognitive-cyan" />
                rosclaw-cli
              </div>
              <span
                className={`border px-2 py-1 font-mono text-[8px] uppercase ${
                  active.command.status === "Verified"
                    ? "border-emerald-400/25 bg-emerald-400/[0.06] text-emerald-400"
                    : "border-cognitive-cyan/25 bg-cognitive-cyan/[0.06] text-cognitive-cyan"
                }`}
              >
                {active.command.status}
              </span>
            </div>

            <div className="grid lg:grid-cols-[minmax(0,1.28fr)_minmax(250px,0.72fr)]">
              <div className="min-w-0 px-4 py-6 sm:px-6 sm:py-8">
                <div className="flex min-w-0 items-center border border-white/10 bg-black/40 px-3 py-3 font-mono text-[11px] sm:text-sm">
                  <span className="mr-2 text-physical-orange">$</span>
                  <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-cognitive-cyan">
                    {active.command.command}
                  </code>
                  <button
                    type="button"
                    onClick={copyCommand}
                    className="focus-ring ml-2 inline-flex h-8 shrink-0 items-center gap-1.5 px-2 text-[10px] uppercase text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white"
                    aria-label={copied ? "Command copied" : "Copy command"}
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <div className="mt-5 space-y-2 font-mono text-[11px] leading-relaxed sm:text-xs">
                  {active.terminalOutput.map((line, index) => (
                    <p key={`${line}-${index}`} className="flex gap-2 text-white/[0.48]">
                      <span className="text-emerald-400/75">·</span>
                      <span>{line}</span>
                    </p>
                  ))}
                </div>
                <span className="sr-only" aria-live="polite">
                  {copied ? "Command copied" : ""}
                </span>
              </div>

              <div className="border-t border-white/10 bg-white/[0.02] px-4 py-6 sm:px-6 sm:py-8 lg:border-l lg:border-t-0">
                <p className="runtime-label">Verified result</p>
                <dl className="mt-5 space-y-3">
                  {active.result.map((item) => {
                    const [label, ...rest] = item.split(": ");
                    return (
                      <div
                        key={item}
                        className="flex items-start justify-between gap-3 border-b border-white/[0.06] pb-3 font-mono text-[10px]"
                      >
                        <dt className="text-white/35">{label}</dt>
                        <dd className="max-w-[65%] text-right text-cognitive-cyan">
                          {rest.join(": ")}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
                <Link
                  href="/start?path=simulation"
                  className="focus-ring mt-6 inline-flex items-center gap-2 text-xs text-white/45 transition-colors hover:text-white"
                >
                  Open guided start
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
