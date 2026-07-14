import Link from "next/link";
import { ArrowRight, ArrowUpRight, Boxes, Cpu, Plug } from "lucide-react";

const primaryEntries = [
  {
    icon: Plug,
    index: "01 / Connect",
    type: "Hardware interface registry",
    title: "Hardware MCPs",
    description: "Typed tools that let agents inspect and control robot bodies, sensors, lab devices, and physical infrastructure.",
    details: ["Tool schemas", "Body scopes", "Sandbox stubs"],
    href: "/hub/mcps",
    accent: "cyan" as const,
  },
  {
    icon: Cpu,
    index: "02 / Behave",
    type: "Behavior package registry",
    title: "Skills",
    description: "Versioned task policies with recovery strategies, parameters, dependencies, and body compatibility.",
    details: ["Task policy", "Recovery", "Compatibility"],
    href: "/hub/skills",
    accent: "orange" as const,
  },
] as const;

export function AssetHubSection() {
  return (
    <section id="hub" className="border-b border-white/[0.08] bg-[#080b0c] px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="section-kicker">05 / Distribution layer</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl md:text-5xl">
              Connect a body. Install a behavior.
            </h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-2xl text-pretty text-base leading-relaxed text-white/55 lg:text-lg">
              The Hub has two primary artifacts: MCPs expose physical capabilities; Skills turn those capabilities into repeatable work.
            </p>
            <Link href="/hub" className="focus-ring mt-4 inline-flex items-center gap-2 text-sm text-cognitive-cyan transition-colors hover:text-white">
              Open the distribution Hub <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="mt-12 grid border border-white/10 bg-[#050708] lg:grid-cols-2">
          {primaryEntries.map(({ icon: Icon, index, type, title, description, details, href, accent }, itemIndex) => {
            const isCyan = accent === "cyan";
            return (
              <Link
                key={title}
                href={href}
                className={`focus-ring group relative flex min-h-[350px] flex-col overflow-hidden p-7 transition-colors hover:bg-white/[0.03] sm:p-9 ${itemIndex === 0 ? "border-b border-white/10 lg:border-b-0 lg:border-r" : ""}`}
              >
                <span className={`absolute inset-x-0 top-0 h-px ${isCyan ? "bg-cognitive-cyan" : "bg-physical-orange"}`} />
                <div className="flex items-start justify-between gap-4">
                  <div className={`flex h-11 w-11 items-center justify-center border ${isCyan ? "border-cognitive-cyan/30 bg-cognitive-cyan/[0.05] text-cognitive-cyan" : "border-physical-orange/30 bg-physical-orange/[0.05] text-physical-orange"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`font-mono text-[9px] uppercase tracking-[0.15em] ${isCyan ? "text-cognitive-cyan" : "text-physical-orange"}`}>{index}</span>
                </div>
                <p className="mt-8 font-mono text-[9px] uppercase tracking-[0.16em] text-white/30">{type}</p>
                <h3 className={`mt-2 flex items-center gap-2 text-2xl font-semibold text-white transition-colors ${isCyan ? "group-hover:text-cognitive-cyan" : "group-hover:text-physical-orange"}`}>
                  {title} <ArrowRight className="h-4 w-4" />
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/[0.48]">{description}</p>
                <div className="mt-auto grid grid-cols-3 border-t border-white/[0.08] pt-5 font-mono text-[8px] uppercase tracking-[0.12em] text-white/30 sm:text-[9px]">
                  {details.map((detail) => <span key={detail}>{detail}</span>)}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 border-x border-b border-white/10 px-5 py-4 font-mono text-[9px] uppercase tracking-[0.14em] text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-2"><Boxes className="h-3.5 w-3.5" /> Supporting context</span>
          <span>e-URDF · Digital Twins · Cognitive Wiki</span>
        </div>
      </div>
    </section>
  );
}
