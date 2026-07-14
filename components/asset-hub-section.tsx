import Link from "next/link";
import { ArrowUpRight, Box, Boxes, Plug } from "lucide-react";

const featuredEntries = [
  {
    icon: Box,
    type: "Embodiment registry",
    title: "e-URDF Zoo",
    description: "Body definitions with joints, sensors, capabilities, simulation metadata, and safety limits.",
    version: "v1.0.0",
    mode: "local-first",
    status: "Experimental",
    href: "/hub",
  },
  {
    icon: Plug,
    type: "Hardware interface",
    title: "Hardware MCP Hub",
    description: "Agent-facing adapters for robot bodies, sensors, tools, and physical infrastructure.",
    version: "v0.6.0",
    mode: "sandbox required",
    status: "Experimental",
    href: "/hub/mcps",
  },
  {
    icon: Boxes,
    type: "Validation environment",
    title: "Digital Twin Hub",
    description: "Simulation worlds, replay environments, robot assets, and regression scenes.",
    version: "v0.4.0",
    mode: "local-first",
    status: "Experimental",
    href: "/hub/twins",
  },
] as const;

export function AssetHubSection() {
  return (
    <section id="hub" className="border-b border-white/[0.08] bg-[#080b0c] px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="section-kicker">05 / Physical-AI asset hub</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl md:text-5xl">
              Installable context for real bodies.
            </h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-2xl text-pretty text-base leading-relaxed text-white/55 lg:text-lg">
              The Hub is a versioned registry, not a category moodboard. These entries lead to the assets currently represented in the product surface.
            </p>
            <Link href="/hub" className="focus-ring mt-4 inline-flex items-center gap-2 text-sm text-cognitive-cyan transition-colors hover:text-white">
              Browse the full Hub <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="mt-12 grid border border-white/10 bg-[#050708] lg:grid-cols-3">
          {featuredEntries.map(({ icon: Icon, type, title, description, version, mode, status, href }, index) => (
            <Link
              key={title}
              href={href}
              className={`focus-ring group relative flex min-h-[310px] flex-col p-6 transition-colors hover:bg-white/[0.035] sm:p-8 ${index < featuredEntries.length - 1 ? "border-b border-white/10 lg:border-b-0 lg:border-r" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center border border-cognitive-cyan/25 bg-cognitive-cyan/[0.05] text-cognitive-cyan">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="border border-amber-300/25 bg-amber-300/[0.05] px-2 py-1 font-mono text-[8px] uppercase tracking-wider text-amber-300">{status}</span>
              </div>
              <p className="mt-7 font-mono text-[9px] uppercase tracking-[0.16em] text-white/30">{type}</p>
              <h3 className="mt-2 flex items-center gap-2 text-xl font-semibold text-white group-hover:text-cognitive-cyan">
                {title}
                <ArrowUpRight className="h-4 w-4 opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/[0.48]">{description}</p>
              <dl className="mt-auto grid grid-cols-2 gap-4 border-t border-white/[0.08] pt-5 font-mono text-[9px] uppercase tracking-wider">
                <div>
                  <dt className="text-white/25">Version</dt>
                  <dd className="mt-1 text-white/65">{version}</dd>
                </div>
                <div>
                  <dt className="text-white/25">Runtime mode</dt>
                  <dd className="mt-1 text-physical-orange">{mode}</dd>
                </div>
              </dl>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
