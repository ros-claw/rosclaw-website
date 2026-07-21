import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CircleDashed,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";
import { Footer } from "@/components/footer";
import { productStatus } from "@/content/product-status";

export const metadata: Metadata = {
  title: "Model Provider Registry | ROSClaw",
  description: "Current publication state and required contract for model Providers used through ROSClaw.",
  alternates: { canonical: "/hub/models" },
};

const contractFields = [
  ["Identity", "Publisher, immutable model version, source, and license"],
  ["Interface", "Typed observations, outputs, units, frames, and capability mapping"],
  ["Runtime", "Declared hardware, dependencies, timeout, and resource limits"],
  ["Evidence", "Reproducible benchmark scope, dataset provenance, and receipts"],
] as const;

export default function ModelsPage() {
  const integrationStatus = productStatus.components.integrations;
  return (
    <main className="min-h-screen bg-[#060809]">
      <section className="runtime-grid border-b border-white/[0.08] px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link href="/hub" className="focus-ring inline-flex items-center gap-2 text-sm text-white/40 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Distribution Hub
          </Link>
          <div className="mt-10 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="section-kicker">Model Provider registry</p>
              <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">No installable catalog is published.</h1>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-white/52 lg:justify-self-end lg:text-lg">
              ROSClaw can route typed Provider capabilities, but this release does not publish model compatibility, latency, or deployment-readiness claims. Provider output remains a proposal until Runtime policy and the Action Gateway accept it.
            </p>
          </div>

          <div className="mt-12 grid border border-white/10 md:grid-cols-[0.75fr_1.25fr]">
            <div className="border-b border-white/10 p-6 md:border-b-0 md:border-r md:p-8">
              <CircleDashed className="h-6 w-6 text-white/35" />
              <p className="mt-5 font-mono text-[9px] uppercase text-white/30">Registry state</p>
              <p className="mt-2 text-xl font-medium text-white">Not published</p>
              <code className="mt-3 block font-mono text-[10px] text-cognitive-cyan">{integrationStatus.claim}</code>
            </div>
            <div className="p-6 md:p-8">
              <p className="runtime-label">Canonical boundary</p>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/50">{integrationStatus.evidence_summary.en}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="section-kicker">Publication contract</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">What a future Provider entry must declare</h2>
            </div>
            <FileCheck2 className="hidden h-7 w-7 text-cognitive-cyan sm:block" />
          </div>
          <div className="mt-6 divide-y divide-white/[0.08] border border-white/10 bg-[#080b0c]">
            {contractFields.map(([name, detail], index) => (
              <div key={name} className="grid gap-2 p-5 md:grid-cols-[80px_180px_1fr] md:items-center">
                <span className="font-mono text-[9px] text-cognitive-cyan">{String(index + 1).padStart(2, "0")}</span>
                <p className="text-sm font-medium text-white">{name}</p>
                <p className="text-sm leading-relaxed text-white/45">{detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-px bg-white/10 md:grid-cols-2">
            <section className="bg-[#080b0c] p-6 sm:p-8">
              <ShieldCheck className="h-5 w-5 text-physical-orange" />
              <h2 className="mt-4 text-lg font-medium text-white">Execution stays guarded</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/45">A VLA, VLM, VLN, critic, or classical planner never receives hardware authority merely because it is registered.</p>
            </section>
            <section className="bg-[#080b0c] p-6 sm:p-8">
              <BrainCircuit className="h-5 w-5 text-cognitive-cyan" />
              <h2 className="mt-4 text-lg font-medium text-white">Evidence stays scoped</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/45">Benchmark results must name the exact model, hardware, task, dataset, and observation boundary.</p>
            </section>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/runtime" className="focus-ring inline-flex items-center gap-2 bg-cognitive-cyan px-5 py-3 text-sm font-semibold text-[#021012] hover:bg-white">Runtime architecture <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/status" className="focus-ring inline-flex items-center gap-2 border border-white/15 px-5 py-3 text-sm text-white/60 hover:text-white">Product status <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
