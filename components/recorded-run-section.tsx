import Link from "next/link";
import { ArrowUpRight, Camera, CircleGauge, Fingerprint, Play } from "lucide-react";

const evidence = [
  {
    icon: Fingerprint,
    label: "Body context",
    value: "Unitree G1",
    detail: "Humanoid robot shown in the recorded showcase",
  },
  {
    icon: CircleGauge,
    label: "Guarded action",
    value: "Multi-step physical task",
    detail: "A historical agent-to-robot execution showcase",
  },
  {
    icon: Camera,
    label: "Evidence",
    value: "Historical showcase",
    detail: "Historical capture shown once, without stock footage",
  },
] as const;

export function RecordedRunSection() {
  return (
    <section id="robots" className="border-b border-white/[0.08] bg-[#080b0c] px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="section-kicker">01 / Real robot evidence</p>
            <h2 className="mt-4 max-w-xl text-balance text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl md:text-5xl">
              Start with what actually ran.
            </h2>
          </div>
          <p className="max-w-2xl text-pretty text-base leading-relaxed text-white/55 lg:justify-self-end lg:text-lg">
            ROSClaw is easiest to understand through physical execution, not architecture promises. This historical showcase is the page&apos;s single video artifact; the surrounding interface explains how body, action, and trace context fit around it.
          </p>
        </div>

        <div className="grid overflow-hidden border border-white/10 bg-[#050708] lg:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.65fr)]">
          <div className="min-w-0 border-b border-white/10 lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                <Play className="h-3.5 w-3.5 text-physical-orange" fill="currentColor" />
                Unitree G1 / Recorded showcase
              </div>
              <span className="font-mono text-[10px] text-white/[0.28]">ARCHIVE 01</span>
            </div>
            <div className="relative aspect-video overflow-hidden bg-[#020303]">
              <video
                className="h-full w-full object-cover"
                controls
                muted
                playsInline
                preload="none"
                poster="/videos/unitree-g1-poster.webp"
                aria-label="Historical ROSClaw physical AI showcase featuring a Unitree G1 humanoid robot"
              >
                <source src="/demo" type="video/mp4" />
                Your browser does not support HTML5 video.
              </video>
              <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent px-4 py-4 font-mono text-[9px] uppercase tracking-[0.16em] text-white/45">
                <span>Historical physical AI showcase</span>
                <span className="flex items-center gap-1.5 text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Captured</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex-1 divide-y divide-white/[0.08]">
              {evidence.map(({ icon: Icon, label, value, detail }, index) => (
                <div key={label} className="grid grid-cols-[36px_1fr] gap-3 px-5 py-5 sm:px-6">
                  <div className={`flex h-9 w-9 items-center justify-center border ${index === 1 ? "border-physical-orange/35 bg-physical-orange/[0.06] text-physical-orange" : "border-cognitive-cyan/25 bg-cognitive-cyan/[0.05] text-cognitive-cyan"}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="runtime-label">{label}</p>
                    <p className="mt-1.5 text-sm font-medium text-white">{value}</p>
                    <p className="mt-1 text-xs leading-relaxed text-white/[0.38]">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/runtime"
              className="focus-ring group flex items-center justify-between border-t border-white/10 bg-white/[0.025] px-5 py-4 text-sm font-medium text-white/[0.68] transition-colors hover:bg-white/[0.05] hover:text-white sm:px-6"
            >
              Explore the runtime model
              <ArrowUpRight className="h-4 w-4 text-cognitive-cyan transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
