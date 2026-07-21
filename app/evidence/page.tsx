import type { Metadata } from "next";
import { ArrowUpRight, FileCheck2 } from "lucide-react";
import { Footer } from "@/components/footer";
import { productStatus } from "@/content/product-status";
import { GITHUB_RAW_URL } from "@/content/shared";

export const metadata: Metadata = {
  title: "Evidence | ROSClaw",
  description: "Traceable evidence records behind ROSClaw Runtime, simulation, hardware, and Agent claims.",
  alternates: { canonical: "/evidence" },
};

const evidenceRows = [
  ...Object.entries(productStatus.golden_paths).flatMap(([scope, entry]) =>
    entry.evidence.map((evidence) => ({ scope, display: entry.display.en, evidence })),
  ),
  ...Object.entries(productStatus.components).flatMap(([scope, entry]) =>
    entry.evidence.map((evidence) => ({ scope, display: entry.display.en, evidence })),
  ),
].sort((a, b) => a.scope.localeCompare(b.scope) || a.evidence.id.localeCompare(b.evidence.id));

export default function EvidencePage() {
  return (
    <main className="min-h-screen bg-[#060809]">
      <section className="runtime-grid border-b border-white/[0.08] px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-7 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <p className="section-kicker">Evidence ledger</p>
              <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Claims point to inspectable records.</h1>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-white/55 lg:justify-self-end lg:text-lg">
              Fixture, simulation, developer-observed hardware, independent hardware, and external-Agent observations remain distinct. A test path does not silently become a physical claim.
            </p>
          </div>

          <div className="mt-12 hidden overflow-x-auto border border-white/10 md:block">
            <table className="w-full min-w-[1000px] border-collapse text-left">
              <thead className="bg-white/[0.025] font-mono text-[9px] uppercase text-white/35">
                <tr>{["Scope", "Evidence ID", "Kind", "Observation", "Fixture", "Independent", "Date"].map((heading) => <th key={heading} className="border-b border-white/10 px-4 py-3 font-normal">{heading}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-white/[0.08]">
                {evidenceRows.map(({ scope, display, evidence }) => (
                  <tr key={`${scope}:${evidence.id}`} className="align-top hover:bg-white/[0.02]">
                    <td className="px-4 py-4"><p className="text-xs text-white/65">{display}</p><code className="mt-1 block font-mono text-[9px] text-white/30">{scope}</code></td>
                    <td className="px-4 py-4"><a href={`${GITHUB_RAW_URL}/${evidence.path}`} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex max-w-[260px] items-center gap-1 text-xs text-cognitive-cyan hover:text-white"><span className="truncate">{evidence.id}</span><ArrowUpRight className="h-3 w-3 shrink-0" /></a></td>
                    <td className="px-4 py-4 font-mono text-[9px] text-white/45">{evidence.kind}</td>
                    <td className="px-4 py-4 font-mono text-[9px] text-white/45">{evidence.observation_scope}</td>
                    <td className="px-4 py-4 font-mono text-[9px] text-white/55">{evidence.fixture ? "yes" : "no"}</td>
                    <td className="px-4 py-4 font-mono text-[9px] text-white/55">{evidence.independent ? "yes" : "no"}</td>
                    <td className="px-4 py-4 font-mono text-[9px] text-white/45">{evidence.verified_at ?? "not recorded"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12 divide-y divide-white/[0.08] border border-white/10 md:hidden">
            {evidenceRows.map(({ scope, display, evidence }) => (
              <article key={`${scope}:${evidence.id}`} className="p-5">
                <div className="flex items-start gap-3"><FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-cognitive-cyan" /><div className="min-w-0"><p className="text-sm text-white">{display}</p><code className="mt-1 block font-mono text-[9px] text-white/30">{scope}</code></div></div>
                <a href={`${GITHUB_RAW_URL}/${evidence.path}`} target="_blank" rel="noopener noreferrer" className="focus-ring mt-4 inline-flex max-w-full items-center gap-1 text-xs text-cognitive-cyan hover:text-white"><span className="truncate">{evidence.id}</span><ArrowUpRight className="h-3 w-3 shrink-0" /></a>
                <dl className="mt-4 grid grid-cols-2 gap-3 font-mono text-[9px]"><div><dt className="text-white/25">Observation</dt><dd className="mt-1 break-words text-white/50">{evidence.observation_scope}</dd></div><div><dt className="text-white/25">Kind</dt><dd className="mt-1 break-words text-white/50">{evidence.kind}</dd></div><div><dt className="text-white/25">Fixture</dt><dd className="mt-1 text-white/50">{evidence.fixture ? "yes" : "no"}</dd></div><div><dt className="text-white/25">Independent</dt><dd className="mt-1 text-white/50">{evidence.independent ? "yes" : "no"}</dd></div></dl>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
