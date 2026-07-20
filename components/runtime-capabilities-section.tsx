import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  Boxes,
  FlaskConical,
  Hand,
  ShieldCheck,
  Siren,
} from "lucide-react";
import { productStatus } from "@/content/product-status";

const capabilities = [
  {
    icon: Bot,
    name: productStatus.golden_paths.ur5e_reach.display.en,
    purpose: productStatus.golden_paths.ur5e_reach.evidence_summary.en,
    artifact: "ExecutionReceipt + trace + trajectory",
    status: "Simulation Verified",
  },
  {
    icon: ShieldCheck,
    name: productStatus.components.action_gateway.display.en,
    purpose: productStatus.components.action_gateway.evidence_summary.en,
    artifact: "ActionEnvelope + ExecutionReceipt",
    status: "Component Verified",
  },
  {
    icon: Siren,
    name: productStatus.components.estop.display.en,
    purpose: productStatus.components.estop.evidence_summary.en,
    artifact: "latched component control path",
    status: "Component Verified",
  },
  {
    icon: Hand,
    name: productStatus.golden_paths.rh56_single_step.display.en,
    purpose: productStatus.golden_paths.rh56_single_step.evidence_summary.en,
    artifact: "developer hardware reports",
    status: "Observed",
  },
  {
    icon: Boxes,
    name: productStatus.components.integrations.display.en,
    purpose: productStatus.components.integrations.evidence_summary.en,
    artifact: "contracts and adapters",
    status: "Experimental",
  },
  {
    icon: FlaskConical,
    name: productStatus.components.fixture_surfaces.display.en,
    purpose: productStatus.components.fixture_surfaces.evidence_summary.en,
    artifact: "FIXTURE / SYNTHETIC",
    status: "Fixture Only",
  },
] as const;

function Status({ value }: { value: (typeof capabilities)[number]["status"] }) {
  const colors =
    value === "Simulation Verified" || value === "Component Verified"
      ? "border-emerald-400/25 bg-emerald-400/[0.06] text-emerald-400"
      : value === "Observed"
        ? "border-amber-300/25 bg-amber-300/[0.06] text-amber-300"
        : value === "Experimental"
          ? "border-cognitive-cyan/25 bg-cognitive-cyan/[0.06] text-cognitive-cyan"
          : "border-white/15 bg-white/[0.04] text-white/45";

  return (
    <span className={`whitespace-nowrap border px-2 py-1 font-mono text-[8px] uppercase ${colors}`}>
      {value}
    </span>
  );
}

export function RuntimeCapabilitiesSection() {
  return (
    <section
      id="capabilities"
      className="runtime-grid border-b border-white/[0.08] px-4 py-20 sm:px-6 md:py-28 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="section-kicker">04 / Evidence boundary</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl md:text-5xl">
              Verified, observed, and experimental are different states.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-white/55 lg:justify-self-end lg:text-lg">
            This table is generated from the same product status used by the
            README and robot matrix. Component tests do not imply physical
            readiness, and developer observation is not independent verification.
          </p>
        </div>

        <div className="mt-12 overflow-hidden border border-white/10 bg-[#070a0b]/90">
          <div className="hidden grid-cols-[48px_0.58fr_1.35fr_0.72fr_132px] gap-4 border-b border-white/10 bg-white/[0.025] px-5 py-3 font-mono text-[9px] uppercase text-white/30 md:grid lg:px-6">
            <span />
            <span>Path</span>
            <span>Evidence boundary</span>
            <span>Artifact</span>
            <span>Status</span>
          </div>
          <div className="divide-y divide-white/[0.08]">
            {capabilities.map(({ icon: Icon, name, purpose, artifact, status }) => (
              <div
                key={name}
                className="grid gap-4 px-4 py-5 transition-colors hover:bg-white/[0.025] sm:px-5 md:grid-cols-[48px_0.58fr_1.35fr_0.72fr_132px] md:items-center md:px-5 lg:px-6"
              >
                <div className="flex h-9 w-9 items-center justify-center border border-white/10 bg-white/[0.025] text-cognitive-cyan">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="runtime-label md:hidden">Path</p>
                  <h3 className="mt-1 text-base font-medium text-white md:mt-0">{name}</h3>
                </div>
                <div>
                  <p className="runtime-label md:hidden">Evidence boundary</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/[0.52] md:mt-0">
                    {purpose}
                  </p>
                </div>
                <div>
                  <p className="runtime-label md:hidden">Artifact</p>
                  <code className="mt-1 block font-mono text-[10px] leading-relaxed text-white/44 md:mt-0">
                    {artifact}
                  </code>
                </div>
                <div className="justify-self-start">
                  <Status value={status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-l-2 border-physical-orange bg-physical-orange/[0.035] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/55">
            <span className="font-medium text-white">Current release is Alpha.</span>{" "}
            Repository-wide real robot readiness and physical E-Stop remain unverified.
          </p>
          <Link
            href="/robots"
            className="focus-ring inline-flex shrink-0 items-center gap-1.5 text-sm text-physical-orange transition-colors hover:text-white"
          >
            Robot support matrix
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
