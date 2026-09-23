import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";

export function RegistryDetailUnavailable({ id, backHref, backLabel }: { id: string; backHref: string; backLabel: string }) {
  return <main className="runtime-grid min-h-screen px-4 pb-20 pt-36 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-3xl border border-amber-300/20 bg-[#10120f] p-8 sm:p-12">
      <AlertTriangle className="h-8 w-8 text-amber-300" />
      <p className="mt-8 font-mono text-[0.68rem] uppercase tracking-[0.17em] text-amber-300">Registry temporarily unavailable</p>
      <h1 className="mt-4 break-words text-3xl font-semibold text-white">{id}</h1>
      <p className="mt-4 text-sm leading-relaxed text-white/55">The registry could not be reached, so this item’s availability and source details cannot be verified right now. It has not been marked as missing.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a href="" className="focus-ring inline-flex min-h-11 items-center gap-2 bg-cognitive-cyan px-5 py-3 text-sm font-semibold text-[#021012]"><RotateCw className="h-4 w-4"/> Retry</a>
        <Link href={backHref} className="focus-ring inline-flex min-h-11 items-center border border-white/15 px-5 py-3 text-sm text-white/65">{backLabel}</Link>
      </div>
    </div>
  </main>;
}
