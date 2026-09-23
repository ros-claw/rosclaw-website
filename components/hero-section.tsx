import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, Github, ShieldCheck } from "lucide-react";
import { heroContent } from "@/content/home";
import { releaseManifest, shortCommit } from "@/content/release-manifest";
import { GITHUB_URL } from "@/content/shared";
import { StatusBadge } from "@/components/status/status-badge";
import { TerminalDemo } from "@/components/tui/terminal-demo";

export function HeroSection() {
  const { title, category, ecosystem, loop, description, ctas } = heroContent;

  return (
    <section id="product" className="runtime-grid relative overflow-hidden border-b border-white/[0.08] px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-20 lg:pt-32">
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="max-w-3xl">
          <div className="mb-7 flex flex-wrap items-center gap-2">
            <span className="inline-flex min-h-7 items-center gap-2 border border-emerald-400/30 bg-emerald-400/[0.05] px-2.5 py-1 font-mono text-[10px] uppercase text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" /> {releaseManifest.stable.label} · v{releaseManifest.stable.version}
            </span>
            <StatusBadge status="Experimental" />
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/38">Runtime on Main · {shortCommit(releaseManifest.main.commit)}</span>
          </div>

          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.17em] text-cognitive-cyan sm:text-xs">{category}</p>
          <h1 className="text-balance text-[clamp(2.7rem,6vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-white">
            {title.line1}<br /><span className="text-white/72">{title.line2}</span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/62 sm:text-lg">{description}</p>
          <p className="mt-5 text-sm font-semibold tracking-wide text-white/78">{ecosystem}</p>
          <p className="mt-2 font-mono text-xs tracking-wide text-cognitive-cyan">{loop}</p>
          <p className="mt-5 max-w-2xl border-l-2 border-physical-orange pl-4 text-sm leading-relaxed text-white/50">Agents propose actions; rosclawd governs physical execution. Verified receipts can inform memory and future skills.</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href={ctas.primary.href} className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-[4px] bg-cognitive-cyan px-5 font-semibold text-[#021012] transition-colors hover:bg-white">
              {ctas.primary.label}<ArrowDownRight className="h-4 w-4" />
            </Link>
            <Link href={ctas.secondary.href} className="focus-ring inline-flex min-h-12 items-center justify-center rounded-[4px] border border-white/20 px-5 text-sm font-medium text-white/75 transition-colors hover:border-white/45 hover:text-white">
              {ctas.secondary.label}
            </Link>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex h-12 w-12 items-center justify-center text-white/50 transition-colors hover:text-white" aria-label="ROSClaw on GitHub">
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="relative min-w-0 lg:pl-5">
          <TerminalDemo />
          <div className="relative -mt-8 ml-auto hidden w-[42%] overflow-hidden rounded-[6px] border border-white/15 bg-black shadow-2xl sm:block lg:-mr-3">
            <Image src="/ur5e-reach-verified.webp" alt="Verified UR5e reach in MuJoCo" width={640} height={360} className="aspect-video w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-black/75 px-3 py-2 font-mono text-[10px] uppercase text-emerald-300">TASK_VERIFIED · MuJoCo</div>
          </div>
        </div>
      </div>
    </section>
  );
}
