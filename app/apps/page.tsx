import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Boxes, Terminal } from "lucide-react";
import { Footer } from "@/components/footer";
import { VerificationBadges } from "@/components/verification-badges";
import { apps, type AppCatalogEntry } from "@/content/product-catalog";
import { productStatus } from "@/content/product-status";
import { GITHUB_RAW_URL } from "@/content/shared";

export const metadata: Metadata = {
  title: "Apps | ROSClaw",
  description: "Capability-only task recipes with explicit Runtime compatibility and evidence status.",
  alternates: { canonical: "/apps" },
};

const availabilityLabels: Record<AppCatalogEntry["availability"], string> = {
  installable: "Installable",
  binding_pending: "Runtime binding pending",
  planned: "Planned, not published",
};

export default function AppsPage() {
  return (
    <main className="min-h-screen bg-[#060809]">
      <section className="runtime-grid border-b border-white/[0.08] px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="section-kicker">Capability Apps</p>
              <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Tasks without device-specific control.</h1>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-white/55 lg:justify-self-end lg:text-lg">
              Apps declare capabilities and verification conditions. Hardware access still passes through rosclawd, policy, permits, leases, and the selected Robot Integration.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {apps.map((app) => {
              const status = app.statusKey ? productStatus.golden_paths[app.statusKey] : undefined;
              const evidence = status?.evidence[0];
              return (
                <article key={app.slug} className="flex min-w-0 flex-col border border-white/10 bg-[#080b0c] p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className={`font-mono text-[9px] uppercase ${app.availability === "installable" ? "text-cognitive-cyan" : app.availability === "binding_pending" ? "text-amber-300" : "text-white/35"}`}>
                        {availabilityLabels[app.availability]}
                      </p>
                      <h2 className="mt-2 text-xl font-semibold text-white">{app.name}</h2>
                      {app.packageName && <code className="mt-1 block truncate font-mono text-[10px] text-white/35">{app.packageName}</code>}
                    </div>
                    <Boxes className="h-5 w-5 shrink-0 text-physical-orange" />
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-white/50">{app.summary}</p>
                  <dl className="mt-5 divide-y divide-white/[0.08] border-y border-white/[0.08] text-xs">
                    <div className="grid gap-1 py-3 sm:grid-cols-[105px_1fr] sm:gap-3">
                      <dt className="font-mono text-[9px] uppercase text-white/30">Capabilities</dt>
                      <dd className="break-words font-mono text-[10px] leading-relaxed text-cognitive-cyan">{app.capabilities.join(", ")}</dd>
                    </div>
                    <div className="grid gap-1 py-3 sm:grid-cols-[105px_1fr] sm:gap-3">
                      <dt className="font-mono text-[9px] uppercase text-white/30">Robots</dt>
                      <dd className="leading-relaxed text-white/55">{app.compatibleRobots.join(", ")}</dd>
                    </div>
                  </dl>

                  {app.installCommand ? (
                    <pre className="mt-5 overflow-x-auto border-l-2 border-physical-orange bg-black/35 px-4 py-3 font-mono text-[10px] text-white/65"><code>{app.installCommand}</code></pre>
                  ) : (
                    <p className="mt-5 inline-flex items-center gap-2 border-l-2 border-white/20 px-4 py-2 text-xs text-white/40">
                      <Terminal className="h-3.5 w-3.5" /> No install command is published.
                    </p>
                  )}

                  <div className="mt-5"><VerificationBadges signals={app.signals} /></div>
                  <div className="mt-auto pt-5">
                    {evidence ? (
                      <a href={`${GITHUB_RAW_URL}/${evidence.path}`} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex items-center gap-1 text-xs text-cognitive-cyan hover:text-white">
                        {evidence.id} <ArrowUpRight className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="font-mono text-[10px] text-white/30">No evidence ID</span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col gap-4 border-l-2 border-cognitive-cyan bg-cognitive-cyan/[0.035] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-white/55">
              Installing an App installs a task manifest, not a driver and not a hardware permission. A compatible Integration, armed Runtime, Session, and required Permit remain mandatory.
            </p>
            <Link href="/robots" className="focus-ring inline-flex shrink-0 items-center gap-2 text-sm text-cognitive-cyan hover:text-white">
              Robot Integrations <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
