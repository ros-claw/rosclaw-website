import type { ProductStatusLabel } from "@/content/status-taxonomy";
import { statusTaxonomy } from "@/content/status-taxonomy";

const toneClasses = {
  success: "border-emerald-400/30 bg-emerald-400/[0.07] text-emerald-300",
  info: "border-cognitive-cyan/30 bg-cognitive-cyan/[0.06] text-cognitive-cyan",
  warning: "border-amber-300/30 bg-amber-300/[0.06] text-amber-200",
  danger: "border-rose-400/30 bg-rose-400/[0.06] text-rose-300",
  neutral: "border-white/15 bg-white/[0.035] text-white/55",
} as const;

export function StatusBadge({
  status,
  className = "",
}: {
  status: ProductStatusLabel;
  className?: string;
}) {
  const entry = statusTaxonomy[status];
  return (
    <span
      title={entry.description}
      className={`inline-flex min-h-6 items-center border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] ${toneClasses[entry.tone]} ${className}`}
    >
      {status}
    </span>
  );
}
