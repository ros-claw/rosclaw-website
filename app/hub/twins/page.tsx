import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, FlaskConical } from "lucide-react";
import { Footer } from "@/components/footer";
import { productStatus, stateLabels } from "@/content/product-status";
import { GITHUB_RAW_URL } from "@/content/shared";

export const metadata: Metadata = {
  title: "Digital Twin Evidence | ROSClaw",
  description: "Physics-backed simulation paths and inspectable evidence currently verified by ROSClaw.",
  alternates: { canonical: "/hub/twins" },
};

const verifiedSimulations = Object.entries(productStatus.golden_paths).filter(
  ([, path]) => path.dimensions.simulation === "verified",
);

export default function TwinsPage() {
  return (
    <main className="min-h-screen bg-[#060809]">
      <section className="runtime-grid border-b border-white/[0.08] px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link href="/hub" className="focus-ring inline-flex items-center gap-2 text-sm text-white/40 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Distribution Hub
          </Link>
          <div className="mt-10 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="section-kicker">Digital twin evidence</p>
              <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Simulation is evidence, not a website animation.</h1>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-white/52 lg:justify-self-end lg:text-lg">
              Only physics-backed runs referenced by the canonical product status appear here. A simulation result does not imply hardware read, hardware actuation, physical E-Stop, or Agent-on-hardware verification.
            </p>
          </div>
          <div className="mt-12 grid border border-white/10 sm:grid-cols-3">
            <div className="border-b border-white/10 p-5 sm:border-b-0 sm:border-r sm:p-6"><p className="runtime-label">Verified paths</p><p className="mt-2 font-mono text-xl text-white">{verifiedSimulations.length}</p></div>
            <div className="border-b border-white/10 p-5 sm:border-b-0 sm:border-r sm:p-6"><p className="runtime-label">Physics engine</p><p className="mt-2 font-mono text-xl text-white">MuJoCo</p></div>
            <div className="p-5 sm:p-6"><p className="runtime-label">Physical claim</p><p className="mt-2 font-mono text-xl text-white">None</p></div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="section-kicker">Current paths</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Evidence-backed simulations</h2>
            </div>
            <Link href="/evidence" className="focus-ring hidden items-center gap-2 text-sm text-cognitive-cyan hover:text-white sm:inline-flex">Full ledger <ArrowUpRight className="h-4 w-4" /></Link>
          </div>

          <div className="mt-6 divide-y divide-white/[0.08] border border-white/10 bg-[#080b0c]">
            {verifiedSimulations.map(([key, path]) => {
              const evidence = path.evidence.filter((item) => item.observation_scope === "physics_simulation");
              return (
                <article key={key} className="grid gap-5 p-6 lg:grid-cols-[1fr_1fr_auto] lg:items-center">
                  <div>
                    <div className="flex items-center gap-2"><FlaskConical className="h-4 w-4 text-cognitive-cyan" /><span className="font-mono text-[9px] uppercase text-cognitive-cyan">{stateLabels[path.dimensions.simulation]}</span></div>
                    <h3 className="mt-3 text-lg font-medium text-white">{path.display.en}</h3>
                    <code className="mt-1 block font-mono text-[9px] text-white/30">{path.capability}</code>
                  </div>
                  <p className="text-sm leading-relaxed text-white/45">{path.evidence_summary.en}</p>
                  <div className="space-y-2 lg:text-right">
                    {evidence.map((item) => (
                      <a key={item.id} href={`${GITHUB_RAW_URL}/${item.path}`} target="_blank" rel="noopener noreferrer" className="focus-ring flex items-center gap-1 text-xs text-cognitive-cyan hover:text-white lg:justify-end">
                        <span>{item.id}</span><ArrowUpRight className="h-3 w-3" />
                      </a>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-10 border border-white/10 bg-[#080b0c] p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              <div>
                <h2 className="text-lg font-medium text-white">Run the verified path locally</h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/45">The executable workflow and Receipt are provided by the ROSClaw CLI. This website does not pretend to run a controller or physics engine in the browser.</p>
                <Link href="/start?path=simulation" className="focus-ring mt-5 inline-flex items-center gap-2 text-sm text-cognitive-cyan hover:text-white">Start in simulation <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
