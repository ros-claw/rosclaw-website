import Link from "next/link";
import { ArrowDownRight, Github, ShieldCheck } from "lucide-react";
import { TerminalCTA } from "./terminal-cta";
import { GITHUB_URL } from "@/content/shared";

const traceEvents = [
  { time: "00:00.084", label: "Intent", value: "stand_balance", tone: "cyan" },
  { time: "00:00.106", label: "Sandbox", value: "ALLOW_WITH_LIMITS", tone: "green" },
  { time: "00:00.314", label: "Execute", value: "joint targets", tone: "orange" },
  { time: "00:00.612", label: "Robot state", value: "balance stable", tone: "orange" },
  { time: "00:00.790", label: "Trace", value: "persisted", tone: "cyan" },
] as const;

function RuntimeTracePanel() {
  return (
    <div className="industrial-panel relative overflow-hidden" aria-label="ROSClaw physical trace example">
      <div className="scanline" aria-hidden="true" />
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/55">
          <span className="h-2 w-2 rounded-full bg-cognitive-cyan shadow-[0_0_10px_rgba(0,240,255,0.65)]" />
          Runtime trace
        </div>
        <span className="font-mono text-[10px] text-white/35">FIRST-EMB-001</span>
      </div>

      <div className="grid grid-cols-2 border-b border-white/10 sm:grid-cols-3">
        <div className="border-r border-white/10 px-4 py-4 sm:px-5">
          <p className="runtime-label">Robot</p>
          <p className="mt-1 text-sm font-medium text-white">Unitree G1</p>
        </div>
        <div className="border-r-0 border-white/10 px-4 py-4 sm:border-r sm:px-5">
          <p className="runtime-label">Body profile</p>
          <p className="mt-1 text-sm font-medium text-cognitive-cyan">loaded</p>
        </div>
        <div className="col-span-2 border-t border-white/10 px-4 py-4 sm:col-span-1 sm:border-t-0 sm:px-5">
          <p className="runtime-label">Guard</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" /> ALLOW + LIMITS
          </p>
        </div>
      </div>

      <div className="px-4 py-4 sm:px-5 sm:py-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="runtime-label">Physical event stream</p>
          <p className="font-mono text-[10px] text-white/30">LOCAL / HARDWARE</p>
        </div>
        <ol className="relative space-y-0 before:absolute before:bottom-4 before:left-[65px] before:top-4 before:w-px before:bg-white/10 sm:before:left-[73px]">
          {traceEvents.map((event) => (
            <li key={`${event.time}-${event.label}`} className="grid grid-cols-[58px_10px_1fr] items-center gap-2.5 py-2 sm:grid-cols-[66px_10px_1fr]">
              <time className="font-mono text-[10px] text-white/30">{event.time}</time>
              <span
                className={`relative z-10 h-2 w-2 rounded-full border ${
                  event.tone === "cyan"
                    ? "border-cognitive-cyan bg-cognitive-cyan/40"
                    : event.tone === "green"
                    ? "border-emerald-400 bg-emerald-400/40"
                    : "border-physical-orange bg-physical-orange/40"
                }`}
              />
              <div className="flex min-w-0 items-center justify-between gap-3 border-b border-white/[0.06] pb-2">
                <span className="font-mono text-[11px] text-white/45">{event.label}</span>
                <span className="truncate font-mono text-[11px] text-white/85">{event.value}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.025] px-4 py-3 font-mono text-[10px] sm:px-5">
        <span className="text-white/35">TRACE FORMAT</span>
        <span className="text-cognitive-cyan">MCAP + JSONL</span>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section id="product" className="runtime-grid relative overflow-hidden border-b border-white/[0.08] pt-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_34%,rgba(0,240,255,0.09),transparent_28%),radial-gradient(circle_at_18%_82%,rgba(255,62,0,0.055),transparent_24%)]" />
      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-[1440px] grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1.02fr)_minmax(390px,0.82fr)] lg:gap-16 lg:px-8 lg:py-24 xl:px-12">
        <div className="max-w-3xl">
          <div className="mb-7 flex items-center gap-3">
            <span className="h-px w-8 bg-cognitive-cyan" />
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-cognitive-cyan sm:text-xs">
              Physical AI Runtime
            </p>
            <span className="border border-white/10 bg-black/30 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-white/45">
              Open source
            </span>
          </div>

          <h1 className="max-w-[760px] text-balance text-[clamp(3.1rem,7.3vw,7.4rem)] font-semibold leading-[0.91] tracking-[-0.055em] text-white">
            Give AI agents
            <span className="mt-2 block text-cognitive-cyan">a body that learns.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-pretty text-base leading-relaxed text-white/[0.62] sm:text-lg lg:text-xl">
            Ground agents in real robot bodies, guard every physical action, and turn execution traces into safer, reusable skills.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="#first-embodiment"
              className="focus-ring group inline-flex min-h-12 items-center justify-center gap-2 bg-cognitive-cyan px-6 text-sm font-semibold text-[#021012] transition-colors hover:bg-[#6af7ff]"
            >
              Start First Embodiment
              <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 border border-white/15 bg-white/[0.035] px-6 text-sm font-medium text-white/80 transition-colors hover:border-white/30 hover:bg-white/[0.07] hover:text-white"
            >
              <Github className="h-4 w-4" />
              View GitHub
            </a>
          </div>

          <div className="mt-6 max-w-[620px]">
            <TerminalCTA />
          </div>

          <dl className="mt-8 grid max-w-xl grid-cols-3 gap-px border border-white/[0.08] bg-white/[0.08]">
            {[
              ["Body-aware", "Context"],
              ["Guarded", "Actions"],
              ["Replayable", "Traces"],
            ].map(([value, label]) => (
              <div key={value} className="bg-[#080b0c]/90 px-3 py-3 sm:px-4">
                <dt className="text-sm font-medium text-white sm:text-base">{value}</dt>
                <dd className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-white/35">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-[600px] lg:mx-0 lg:justify-self-end">
          <div className="absolute -left-5 top-10 hidden h-24 w-px bg-gradient-to-b from-transparent via-physical-orange/70 to-transparent lg:block" />
          <div className="absolute -right-4 -top-4 h-16 w-16 border-r border-t border-cognitive-cyan/35" aria-hidden="true" />
          <RuntimeTracePanel />
          <p className="mt-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-white/[0.28]">
            <span>Executable runtime context</span>
            <span>Inspect every decision</span>
          </p>
        </div>
      </div>
    </section>
  );
}
