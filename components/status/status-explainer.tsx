import type { ProductStatusLabel } from "@/content/status-taxonomy";
import { statusTaxonomy } from "@/content/status-taxonomy";
import { StatusBadge } from "./status-badge";

export function StatusExplainer({ status }: { status: ProductStatusLabel }) {
  return (
    <details className="group border border-white/10 bg-[#080b0c] p-4">
      <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-4">
        <StatusBadge status={status} />
        <span className="text-xs text-white/35 group-open:hidden">What this means</span>
      </summary>
      <p className="mt-4 text-sm leading-relaxed text-white/50">
        {statusTaxonomy[status].description}
      </p>
    </details>
  );
}
