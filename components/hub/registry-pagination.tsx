import Link from "next/link";
import { registryPageUrl } from "@/lib/registry/pagination";

export function RegistryPagination({ basePath, page, pages }: { basePath: string; page: number; pages: number }) {
  if (pages <= 1) return null;
  const numbers = Array.from(new Set([1, pages, ...Array.from({ length: 5 }, (_, i) => page + i - 2)]))
    .filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
  return (
    <nav aria-label="Registry pagination" className="flex flex-wrap items-center justify-center gap-2 border border-white/10 bg-[#080b0c] p-5 text-sm text-white/60">
      {page > 1 && <Link prefetch={false} href={registryPageUrl(basePath, page - 1)} className="focus-ring border border-white/15 px-3 py-2">Previous</Link>}
      {numbers.map((n, i) => <span key={n} className="flex items-center gap-2">
        {i > 0 && n - numbers[i - 1] > 1 && <span aria-hidden="true">…</span>}
        <Link prefetch={false} href={registryPageUrl(basePath, n)} aria-current={n === page ? "page" : undefined} className={`focus-ring border px-3 py-2 ${n === page ? "border-cognitive-cyan/50 text-cognitive-cyan" : "border-white/15 hover:text-white"}`}>{n}</Link>
      </span>)}
      {page < pages && <Link prefetch={false} href={registryPageUrl(basePath, page + 1)} className="focus-ring border border-white/15 px-3 py-2">Next</Link>}
    </nav>
  );
}
