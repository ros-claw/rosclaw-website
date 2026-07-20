import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Binary,
  CircleGauge,
  Fingerprint,
  ShieldCheck,
} from "lucide-react";
import { productStatus } from "@/content/product-status";
import { GITHUB_RAW_URL } from "@/content/shared";

const ur5e = productStatus.golden_paths.ur5e_reach;
const evidence = ur5e.evidence[0];

const facts = [
  {
    icon: Fingerprint,
    label: "Body",
    value: ur5e.robot,
    detail: "Action bound to an immutable MuJoCo model snapshot",
  },
  {
    icon: ShieldCheck,
    label: "Policy",
    value: "ALLOW",
    detail: "Workspace and collision guards applied before completion",
  },
  {
    icon: CircleGauge,
    label: "Verification",
    value: "TASK_VERIFIED",
    detail: "Cartesian task predicate evaluated after physics execution",
  },
] as const;

export function RecordedRunSection() {
  return (
    <section
      id="verified-run"
      className="border-b border-white/[0.08] bg-[#080b0c] px-4 py-20 sm:px-6 md:py-28 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="section-kicker">01 / Verified simulation</p>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold text-white sm:text-4xl md:text-5xl">
              Start with what actually ran.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-white/55 lg:justify-self-end lg:text-lg">
            The official UR5e path loads a real MuJoCo model, advances physics,
            applies policy and collision checks, evaluates the reach predicate,
            and returns a canonical ExecutionReceipt.
          </p>
        </div>

        <div className="grid overflow-hidden border border-white/10 bg-[#050708] lg:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.65fr)]">
          <div className="min-w-0 border-b border-white/10 lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase text-white/45">
                <Binary className="h-3.5 w-3.5 text-cognitive-cyan" />
                sim_ur5e / tabletop reach
              </div>
              <span className="font-mono text-[10px] text-emerald-400">
                H2 · SIMULATION_VERIFIED
              </span>
            </div>
            <div className="relative aspect-video overflow-hidden bg-black">
              <Image
                src="/ur5e-reach-verified.webp"
                alt="Final state of the verified UR5e tabletop reach in MuJoCo"
                fill
                sizes="(min-width: 1024px) 70vw, 100vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between bg-black/65 px-4 py-4 font-mono text-[9px] uppercase text-white/55">
                <span>Physics-backed system path</span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  TASK_VERIFIED
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex-1 divide-y divide-white/[0.08]">
              {facts.map(({ icon: Icon, label, value, detail }) => (
                <div key={label} className="grid grid-cols-[36px_1fr] gap-3 px-5 py-5 sm:px-6">
                  <div className="flex h-9 w-9 items-center justify-center border border-cognitive-cyan/25 bg-cognitive-cyan/[0.05] text-cognitive-cyan">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="runtime-label">{label}</p>
                    <p className="mt-1.5 text-sm font-medium text-white">{value}</p>
                    <p className="mt-1 text-xs leading-relaxed text-white/[0.38]">
                      {detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <a
              href={`${GITHUB_RAW_URL}/${evidence.path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring group flex items-center justify-between border-t border-white/10 bg-white/[0.025] px-5 py-4 text-sm font-medium text-white/[0.68] transition-colors hover:bg-white/[0.05] hover:text-white sm:px-6"
            >
              Evidence ID: {evidence.id}
              <ArrowUpRight className="h-4 w-4 text-cognitive-cyan transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <Link
              href="/robots"
              className="focus-ring flex items-center justify-between border-t border-white/10 px-5 py-4 text-sm text-white/50 transition-colors hover:text-white sm:px-6"
            >
              Compare robot support
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
