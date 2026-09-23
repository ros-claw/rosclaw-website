import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, Github } from "lucide-react";
import { heroContent } from "@/content/home";
import { GITHUB_URL } from "@/content/shared";
import { TerminalDemo } from "@/components/tui/terminal-demo";

export function HeroSection({ locale = "en" }: { locale?: "en" | "zh" }) {
  const { title, category, ecosystem, loop, description, ctas } = heroContent;
  const zh = locale === "zh";

  return (
    <section id="product" className="runtime-grid brand-hero relative overflow-hidden border-b border-white/[0.08] px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-20 lg:pt-32">
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="max-w-3xl">
          <p className="brand-hero__wordmark">ROSClaw <span>／ Physical AI</span></p>
          <h1 className="text-balance text-[clamp(2.7rem,6vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-white">
            {zh ? "赋予 AI 身体" : title.line1}<br /><span className="text-white/72">{zh ? "让实践驱动进化" : title.line2}</span>
          </h1>

          <p className="mt-7 font-mono text-xs uppercase tracking-[0.12em] text-cognitive-cyan">{zh ? "面向具身智能体的 Physical AI Runtime" : category}</p>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/62 sm:text-lg">{zh ? "用统一、可信的运行时连接智能体与机器人：让 AI 理解身体、受控执行，并将经过验证的实践沉淀为记忆与技能。" : description}</p>
          <p className="mt-7 text-sm font-semibold tracking-wide text-white/78">{zh ? "任意智能体 · 任意本体 · 一个运行时" : ecosystem}</p>
          <p className="mt-2 font-mono text-xs tracking-wide text-evidence-green">{zh ? "行动 → 验证 → 记忆 → 进化" : loop}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href={ctas.primary.href} className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-[4px] bg-cognitive-cyan px-5 font-semibold text-[#021012] transition-colors hover:bg-white">
              {zh ? "开始使用" : ctas.primary.label}<ArrowDownRight className="h-4 w-4" />
            </Link>
            <Link href={ctas.secondary.href} className="focus-ring inline-flex min-h-12 items-center justify-center rounded-[4px] border border-white/20 px-5 text-sm font-medium text-white/75 transition-colors hover:border-white/45 hover:text-white">
              {zh ? "探索运行时" : ctas.secondary.label}
            </Link>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex h-12 w-12 items-center justify-center text-white/50 transition-colors hover:text-white" aria-label="ROSClaw on GitHub">
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="brand-hero__demo relative min-w-0 lg:pl-5">
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
