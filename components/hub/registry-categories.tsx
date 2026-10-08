import Link from "next/link";
import { matchesRegistryCategory, registryCategories, type RegistryKind, type RegistrySummary } from "@/lib/registry/discovery";

export function RegistryCategories({ kind, items }: { kind: RegistryKind; items: RegistrySummary[] }) {
  return (
    <nav aria-label="Browse topic collections" className="mt-7 border border-white/10 bg-[#080b0c] p-5">
      <p className="runtime-label">Browse by use case</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link prefetch={false} href={`/hub/${kind}`} className="focus-ring border border-white/15 px-3 py-2 text-xs text-white/60 hover:text-white">All {kind === "skills" ? "Skills" : "MCPs"}</Link>
        {registryCategories.map((category) => {
          const count = items.filter((item) => matchesRegistryCategory(item, category.slug)).length;
          return count > 0 ? <Link prefetch={false} key={category.slug} href={`/hub/${kind}/category/${category.slug}`} className="focus-ring border border-white/15 px-3 py-2 text-xs text-white/60 hover:border-cognitive-cyan/40 hover:text-white">{category.title} <span className="ml-2 font-mono text-white/30">{count}</span></Link> : null;
        })}
      </div>
    </nav>
  );
}
