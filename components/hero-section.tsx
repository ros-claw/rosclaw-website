import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, Github, ShieldCheck } from "lucide-react";
import { heroContent } from "@/content/home";
import { release } from "@/content/product-status";
import { TerminalCTA } from "./terminal-cta";

export function HeroSection() {
  const { title, subtitle, description, ctas } = heroContent;

  return (
    <section
      id="product"
      className="relative flex min-h-[88svh] items-center overflow-hidden border-b border-white/[0.08] pb-10 pt-20"
    >
      <Image
        src="/ur5e-reach-verified.webp"
        alt="UR5e executing the verified tabletop reach in MuJoCo"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[64%_48%]"
      />
      <div className="absolute inset-0 bg-black/75" />
      <div className="absolute inset-y-0 left-0 w-full bg-black/35 lg:w-[72%]" />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-3xl py-8">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 border border-cognitive-cyan/30 bg-black/50 px-3 py-1.5 font-mono text-xs uppercase text-cognitive-cyan">
              <ShieldCheck className="h-3.5 w-3.5" />
              v{release.version} {release.maturity}
            </span>
            <span className="font-mono text-xs uppercase text-white/60">
              UR5e MuJoCo path · TASK_VERIFIED
            </span>
          </div>

          <h1 className="mb-4 text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
            {title.line1}
          </h1>
          <p className="mb-5 text-xl font-semibold text-white/90 sm:text-2xl lg:text-3xl">
            {title.line2}
          </p>

          <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-sm text-cognitive-cyan sm:text-base">
            {subtitle.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <p className="mb-7 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            {description}
          </p>

          <div className="mb-7 max-w-[620px]">
            <TerminalCTA />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={ctas.primary.href}
              className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 bg-cognitive-cyan px-5 font-semibold text-black transition-colors hover:bg-white"
            >
              {ctas.primary.label}
              <ArrowDownRight className="h-4 w-4" />
            </Link>
            <Link
              href={ctas.secondary.href}
              className="focus-ring inline-flex min-h-12 items-center justify-center border border-white/25 bg-black/35 px-5 font-medium text-white transition-colors hover:border-white/50"
            >
              {ctas.secondary.label}
            </Link>
            <a
              href={ctas.tertiary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 px-4 text-white/70 transition-colors hover:text-white"
            >
              <Github className="h-4 w-4" />
              {ctas.tertiary.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
