import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, CircleDashed } from "lucide-react";
import { Footer } from "@/components/footer";
import { productStatus, release } from "@/content/product-status";

export const metadata: Metadata = {
  title: "Product Status | ROSClaw",
  description: "Canonical ROSClaw release, Runtime contract, support tier, and golden-path status.",
};

export default function StatusPage() {
  return (
    <main className="min-h-screen bg-[#060809]">
      <section className="runtime-grid border-b border-white/[0.08] px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-7 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <p className="section-kicker">Canonical product status</p>
              <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">v{release.version} {release.maturity}</h1>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-white/55 lg:justify-self-end lg:text-lg">
              This page is generated from the same versioned status source used by the core README and release checks. Candidate support never replaces current support without qualifying evidence.
            </p>
          </div>

          <div className="mt-12 grid border border-white/10 md:grid-cols-3">
            {[
              ["Python", release.supported_python.join(", ")],
              ["Golden paths", String(Object.keys(productStatus.golden_paths).length)],
              ["Runtime components", String(Object.keys(productStatus.components).length)],
            ].map(([label, value], index) => <div key={label} className={`p-5 sm:p-6 ${index < 2 ? "border-b border-white/10 md:border-b-0 md:border-r" : ""}`}><p className="runtime-label">{label}</p><p className="mt-2 font-mono text-lg text-white">{value}</p></div>)}
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            <section>
              <p className="section-kicker">Acknowledgement stages</p>
              <ol className="mt-5 divide-y divide-white/[0.08] border border-white/10 bg-[#080b0c]">
                {productStatus.acknowledgement_stages.map((stage, index) => <li key={stage} className="flex items-center gap-4 px-5 py-3"><span className="font-mono text-[9px] text-cognitive-cyan">{String(index + 1).padStart(2, "0")}</span><code className="font-mono text-[10px] text-white/60">{stage}</code></li>)}
              </ol>
            </section>
            <section>
              <p className="section-kicker">Evidence levels</p>
              <ol className="mt-5 divide-y divide-white/[0.08] border border-white/10 bg-[#080b0c]">
                {productStatus.evidence_levels.map((level, index) => <li key={level} className="flex items-center gap-4 px-5 py-3"><span className="font-mono text-[9px] text-physical-orange">{String(index + 1).padStart(2, "0")}</span><code className="font-mono text-[10px] text-white/60">{level}</code></li>)}
              </ol>
            </section>
          </div>

          <section className="mt-14">
            <p className="section-kicker">Support tiers</p>
            <div className="mt-5 divide-y divide-white/[0.08] border border-white/10 bg-[#080b0c]">
              {Object.entries(productStatus.support_tiers).map(([tier, definition]) => <div key={tier} className="grid gap-2 px-5 py-4 md:grid-cols-[250px_1fr]"><code className="font-mono text-[10px] text-cognitive-cyan">{tier}</code><p className="text-sm leading-relaxed text-white/50">{definition}</p></div>)}
            </div>
          </section>

          <section className="mt-14">
            <div>
              <p className="section-kicker">Runtime components</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Scoped component claims</h2>
            </div>
            <div className="mt-5 divide-y divide-white/[0.08] border border-white/10 bg-[#080b0c]">
              {Object.entries(productStatus.components).map(([key, component]) => (
                <article key={key} className="grid gap-3 p-5 md:grid-cols-[250px_1fr]">
                  <div>
                    <p className="text-sm font-medium text-white">{component.display.en}</p>
                    <code className="mt-1 block font-mono text-[9px] text-cognitive-cyan">{component.claim}</code>
                  </div>
                  <div>
                    <p className="text-sm leading-relaxed text-white/50">{component.evidence_summary.en}</p>
                    <p className="mt-2 font-mono text-[9px] text-white/30">{component.evidence.length} evidence record{component.evidence.length === 1 ? "" : "s"}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-14">
            <div className="flex items-end justify-between gap-5"><div><p className="section-kicker">Golden paths</p><h2 className="mt-3 text-2xl font-semibold text-white">Current claims</h2></div><Link href="/evidence" className="focus-ring inline-flex items-center gap-2 text-sm text-cognitive-cyan hover:text-white">Evidence ledger <ArrowUpRight className="h-4 w-4" /></Link></div>
            <div className="mt-5 divide-y divide-white/[0.08] border border-white/10 bg-[#080b0c]">
              {Object.entries(productStatus.golden_paths).map(([key, path]) => <article key={key} className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center"><div><p className="text-sm font-medium text-white">{path.display.en}</p><code className="mt-1 block font-mono text-[9px] text-white/30">{path.capability}</code><p className="mt-3 text-xs leading-relaxed text-white/45">{path.evidence_summary.en}</p></div><div className="flex items-center gap-2">{path.agent_ready ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <CircleDashed className="h-4 w-4 text-white/30" />}<code className="font-mono text-[9px] text-white/55">{path.support_tier}</code></div></article>)}
            </div>
          </section>
        </div>
      </section>
      <Footer />
    </main>
  );
}
