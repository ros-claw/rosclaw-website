import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Github, Mail } from "lucide-react";
import { CONTACT_EMAIL, GITHUB_URL } from "@/content/shared";
import { InstitutionLinks } from "@/components/product-home-sections";

const linkGroups = [
  {
    title: "Product",
    links: [
      { label: "Native Agent", href: "/native-agent" },
      { label: "Runtime", href: "/runtime" },
      { label: "Safety", href: "/safety" },
      { label: "Robot support", href: "/robots" },
      { label: "Apps", href: "/apps" },
    ],
  },
  {
    title: "Build",
    links: [
      { label: "Start", href: "/start" },
      { label: "Documentation", href: "/docs" },
      { label: "Physical-AI Hub", href: "/hub" },
      { label: "Hardware MCPs", href: "/hub/mcps" },
      { label: "Skills", href: "/hub/skills" },
    ],
  },
  {
    title: "Trust",
    links: [
      { label: "Product status", href: "/status" },
      { label: "Evidence", href: "/evidence" },
      { label: "Integrations", href: "/integrations" },
      { label: "Telemetry privacy", href: "/privacy/telemetry" },
    ],
  },
] as const;

export function Footer({ locale = "en" }: { locale?: "en" | "zh" }) {
  return (
    <footer className="border-t border-white/10 bg-[#040606]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.35fr_0.75fr_0.75fr_0.75fr_1fr]">
          <div>
            <Link href="/" className="focus-ring inline-flex items-center gap-2.5" aria-label="ROSClaw home">
              <span className="flex h-8 w-8 items-center justify-center overflow-hidden bg-white">
                <Image src="/rosclaw-mark.webp" alt="" width={32} height={32} className="h-full w-full object-cover" />
              </span>
              <span className="text-lg font-semibold tracking-tight text-white">ROSClaw</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/[0.42]">
              {locale === "zh" ? "面向具身智能体的 Physical AI Runtime：让 AI 受控进入物理世界，让验证过的实践成为经验。" : "The Physical AI Runtime for Embodied Agents: governed action, verified experience, physical memory, and evolving skills."}
            </p>
            <p className="mt-6 font-mono text-[9px] uppercase text-white/25">{locale === "zh" ? "任意智能体 · 任意本体 · 一个运行时" : "Any Agent. Any Body. One Runtime."}</p>
          </div>

          {linkGroups.map((group) => (
            <div key={group.title}>
              <h2 className="font-mono text-[10px] uppercase text-white/[0.38]">{group.title}</h2>
              <ul className="mt-5 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="focus-ring text-sm text-white/[0.48] transition-colors hover:text-white">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="font-mono text-[10px] uppercase text-white/[0.38]">Project</h2>
            <div className="mt-5 space-y-3">
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="focus-ring flex items-center justify-between border-b border-white/[0.08] pb-3 text-sm text-white/[0.52] transition-colors hover:text-white">
                <span className="flex items-center gap-2"><Github className="h-4 w-4" /> GitHub</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-cognitive-cyan" />
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`} className="focus-ring flex items-center justify-between border-b border-white/[0.08] pb-3 text-sm text-white/[0.52] transition-colors hover:text-white">
                <span className="flex items-center gap-2"><Mail className="h-4 w-4" /> {CONTACT_EMAIL}</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-cognitive-cyan" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-7">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">{locale === "zh" ? "研发单位 / Research & Development" : "Research & Development / 研发单位"}</p>
          <InstitutionLinks compact />
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} ROSClaw. Open source under the MIT License.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy/telemetry" className="focus-ring transition-colors hover:text-white">Telemetry Privacy</Link>
            <a href={`${GITHUB_URL}/blob/main/LICENSE`} target="_blank" rel="noopener noreferrer" className="focus-ring transition-colors hover:text-white">MIT License</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
