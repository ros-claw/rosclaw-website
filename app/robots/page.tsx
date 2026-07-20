import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CircleDashed, Eye, ShieldCheck } from "lucide-react";
import { Footer } from "@/components/footer";
import {
  type ProductState,
  release,
  robotSupportRows,
  stateLabels,
} from "@/content/product-status";
import { GITHUB_RAW_URL } from "@/content/shared";

export const metadata: Metadata = {
  title: "Robot Support | ROSClaw",
  description:
    "Evidence-backed ROSClaw support matrix for simulation, read, actuation, Agent, and E-Stop paths.",
};

function StateBadge({ state }: { state: ProductState }) {
  const className =
    state === "verified"
      ? "border-emerald-400/25 bg-emerald-400/[0.06] text-emerald-400"
      : state === "developer_observed"
        ? "border-amber-300/25 bg-amber-300/[0.06] text-amber-300"
        : state === "fixture_available" || state === "fixture_verified"
          ? "border-cognitive-cyan/25 bg-cognitive-cyan/[0.06] text-cognitive-cyan"
          : "border-white/15 bg-white/[0.035] text-white/45";

  return (
    <span className={`inline-flex whitespace-nowrap border px-2 py-1 font-mono text-[8px] uppercase ${className}`}>
      {stateLabels[state]}
    </span>
  );
}

function EvidenceLink({
  path,
  id,
}: {
  path: string;
  id: string;
}) {
  return (
    <a
      href={`${GITHUB_RAW_URL}/${path}`}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-ring inline-flex max-w-[240px] items-center gap-1 text-xs text-cognitive-cyan transition-colors hover:text-white"
    >
      <span className="truncate">{id}</span>
      <ArrowUpRight className="h-3 w-3 shrink-0" />
    </a>
  );
}

export default function RobotsPage() {
  return (
    <main className="min-h-screen bg-[#060809]">
      <section className="runtime-grid border-b border-white/[0.08] px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-7 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <p className="section-kicker">
                v{release.version} {release.maturity} · Robot support
              </p>
              <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
                Support is a matrix, not a badge.
              </h1>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-white/55 lg:justify-self-end lg:text-lg">
              Simulation, hardware read, hardware actuation, Agent black-box,
              and physical E-Stop are tracked independently. Candidate tiers do
              not become current tiers until their evidence requirements pass.
            </p>
          </div>

          <div className="mt-10 grid border border-white/10 sm:grid-cols-3">
            <div className="border-b border-white/10 p-5 sm:border-b-0 sm:border-r">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <p className="mt-3 text-sm font-medium text-white">Verified</p>
              <p className="mt-1 text-xs leading-relaxed text-white/40">
                Matching non-fixture evidence exists; H3 through H5 also
                require independent observation.
              </p>
            </div>
            <div className="border-b border-white/10 p-5 sm:border-b-0 sm:border-r">
              <Eye className="h-5 w-5 text-amber-300" />
              <p className="mt-3 text-sm font-medium text-white">Developer observed</p>
              <p className="mt-1 text-xs leading-relaxed text-white/40">
                A developer reported a hardware run; independent revalidation is pending.
              </p>
            </div>
            <div className="p-5">
              <CircleDashed className="h-5 w-5 text-white/45" />
              <p className="mt-3 text-sm font-medium text-white">Not verified</p>
              <p className="mt-1 text-xs leading-relaxed text-white/40">
                Contract presence, import success, or fixtures do not satisfy the claim.
              </p>
            </div>
          </div>

          <div className="mt-10 hidden overflow-x-auto border border-white/10 md:block">
            <table className="w-full min-w-[1100px] border-collapse text-left">
              <thead className="bg-white/[0.025] font-mono text-[9px] uppercase text-white/35">
                <tr>
                  {[
                    "Robot path",
                    "Tier",
                    "Simulation",
                    "Read",
                    "Actuation",
                    "Agent",
                    "Physical E-Stop",
                    "Evidence",
                  ].map((heading) => (
                    <th key={heading} className="border-b border-white/10 px-4 py-3 font-normal">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.08]">
                {robotSupportRows.map((row) => {
                  const firstEvidence = row.evidence[0];
                  return (
                    <tr key={row.robot} className="align-top transition-colors hover:bg-white/[0.02]">
                      <td className="px-4 py-5">
                        <p className="text-sm font-medium text-white">{row.display.en}</p>
                        <code className="mt-1 block font-mono text-[10px] text-white/35">
                          {row.robot}
                        </code>
                      </td>
                      <td className="px-4 py-5">
                        <code className="block font-mono text-[9px] text-white/65">
                          {row.support_tier}
                        </code>
                        {row.candidate_tier !== row.support_tier && (
                          <code className="mt-1 block font-mono text-[9px] text-white/30">
                            candidate: {row.candidate_tier}
                          </code>
                        )}
                      </td>
                      <td className="px-4 py-5"><StateBadge state={row.dimensions.simulation} /></td>
                      <td className="px-4 py-5"><StateBadge state={row.dimensions.hardware_read} /></td>
                      <td className="px-4 py-5"><StateBadge state={row.dimensions.hardware_actuation} /></td>
                      <td className="px-4 py-5"><StateBadge state={row.dimensions.agent_blackbox} /></td>
                      <td className="px-4 py-5"><StateBadge state={row.dimensions.physical_estop} /></td>
                      <td className="px-4 py-5">
                        {firstEvidence ? (
                          <EvidenceLink path={firstEvidence.path} id={firstEvidence.id} />
                        ) : (
                          <span className="font-mono text-[10px] text-white/30">none</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-10 divide-y divide-white/[0.08] border border-white/10 md:hidden">
            {robotSupportRows.map((row) => {
              const firstEvidence = row.evidence[0];
              const dimensions = [
                ["Simulation", row.dimensions.simulation],
                ["Read", row.dimensions.hardware_read],
                ["Actuation", row.dimensions.hardware_actuation],
                ["Agent", row.dimensions.agent_blackbox],
                ["Physical E-Stop", row.dimensions.physical_estop],
              ] as const;
              return (
                <article key={row.robot} className="p-5">
                  <p className="text-base font-medium text-white">{row.display.en}</p>
                  <code className="mt-1 block font-mono text-[10px] text-white/35">{row.robot}</code>
                  <p className="mt-4 font-mono text-[9px] text-white/55">{row.support_tier}</p>
                  <dl className="mt-5 space-y-3">
                    {dimensions.map(([label, state]) => (
                      <div key={label} className="flex items-center justify-between gap-3">
                        <dt className="text-xs text-white/40">{label}</dt>
                        <dd><StateBadge state={state} /></dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-5 border-t border-white/[0.08] pt-4">
                    {firstEvidence ? (
                      <EvidenceLink path={firstEvidence.path} id={firstEvidence.id} />
                    ) : (
                      <span className="font-mono text-[10px] text-white/30">No evidence ID</span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-4 border-l-2 border-physical-orange bg-physical-orange/[0.035] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-white/55">
              RH56 independent v1 hardware revalidation is still in progress.
              This page will not promote it to H4 or Agent Ready from developer reports alone.
            </p>
            <Link
              href="/start?path=robot"
              className="focus-ring inline-flex min-h-10 shrink-0 items-center gap-2 text-sm text-physical-orange transition-colors hover:text-white"
            >
              Check your robot
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
