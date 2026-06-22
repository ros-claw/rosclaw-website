"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Rocket,
  BookOpen,
  Cpu,
  Shield,
  Boxes,
  RotateCcw,
  Microscope,
  ArrowRight,
  Github,
  Mail,
  ExternalLink,
} from "lucide-react";
import { EmailLink } from "@/components/email-link";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const githubRepo = "https://github.com/ros-claw/rosclaw";

const groups = [
  {
    title: "Start",
    icon: Rocket,
    links: [
      { label: "First Embodiment", href: "/#first-embodiment", internal: true },
      { label: "Installation", href: `${githubRepo}#installation`, comingSoon: true },
      { label: "CLI", href: `${githubRepo}/blob/main/docs/CLI.md`, comingSoon: true },
      { label: "GitHub README", href: githubRepo, external: true },
    ],
  },
  {
    title: "Understand",
    icon: BookOpen,
    links: [
      { label: "Architecture", href: `${githubRepo}/blob/main/docs/ARCHITECTURE.md`, comingSoon: true },
      { label: "Safety Model", href: `${githubRepo}/blob/main/docs/SAFETY.md`, comingSoon: true },
      { label: "Runtime Loop", href: "/#runtime-loop", internal: true },
      { label: "Asset Hub", href: "/hub", internal: true },
    ],
  },
  {
    title: "Build",
    icon: Cpu,
    links: [
      { label: "e-URDF", href: `${githubRepo}/blob/main/docs/EURDF.md`, comingSoon: true },
      { label: "Hardware MCP", href: `${githubRepo}/blob/main/docs/HARDWARE_MCP.md`, comingSoon: true },
      { label: "Provider", href: `${githubRepo}/blob/main/docs/PROVIDER.md`, comingSoon: true },
      { label: "Sandbox", href: `${githubRepo}/blob/main/docs/SANDBOX.md`, comingSoon: true },
      { label: "Memory", href: `${githubRepo}/blob/main/docs/MEMORY.md`, comingSoon: true },
      { label: "Dashboard", href: `${githubRepo}/blob/main/docs/DASHBOARD.md`, comingSoon: true },
    ],
  },
  {
    title: "Evaluate",
    icon: Microscope,
    links: [
      { label: "Benchmarks", href: `${githubRepo}/blob/main/docs/BENCHMARKS.md`, comingSoon: true },
      { label: "Trace Replay", href: `${githubRepo}/blob/main/docs/TRACE_REPLAY.md`, comingSoon: true },
      { label: "Skill Promotion", href: `${githubRepo}/blob/main/docs/SKILL_PROMOTION.md`, comingSoon: true },
      { label: "Regression Testing", href: `${githubRepo}/blob/main/docs/REGRESSION_TESTING.md`, comingSoon: true },
    ],
  },
];

function DocLink({
  label,
  href,
  internal,
  external,
  comingSoon,
}: {
  label: string;
  href: string;
  internal?: boolean;
  external?: boolean;
  comingSoon?: boolean;
}) {
  const baseClasses =
    "group flex items-center justify-between text-white/60 hover:text-cognitive-cyan transition-colors";

  if (comingSoon) {
    return (
      <div className="flex items-center justify-between text-white/40">
        <span>{label}</span>
        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/40">
          Coming soon
        </span>
      </div>
    );
  }

  if (internal) {
    return (
      <Link href={href} className={baseClasses}>
        <span>{label}</span>
        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={baseClasses}
    >
      <span>{label}</span>
      <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 text-cognitive-cyan font-mono text-sm mb-4">
            <span className="text-physical-orange">&gt;_</span>
            <span>DOCUMENTATION</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            ROSClaw Docs
          </h1>
          <p className="text-text-secondary text-lg max-w-3xl mx-auto">
            Documentation is being consolidated on GitHub. Core concepts and
            onboarding flows are live here; deep-dive guides are marked when
            still in progress.
          </p>
        </motion.div>

        {/* Doc Groups */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {groups.map((group) => {
            const Icon = group.icon;
            return (
              <motion.div
                key={group.title}
                variants={fadeInUp}
                className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-cognitive-cyan/10 border border-cognitive-cyan/30 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-cognitive-cyan" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">{group.title}</h2>
                </div>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <DocLink {...link} />
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-gradient-to-br from-cognitive-cyan/5 to-physical-orange/5 border border-white/10 p-8 md:p-12 text-center"
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">Ready to start?</h2>
          <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
            The fastest way to understand ROSClaw is to give an agent its first
            physical body context.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/#first-embodiment"
              className="px-8 py-3 rounded-lg bg-cognitive-cyan/10 border border-cognitive-cyan/30 text-cognitive-cyan font-medium hover:bg-cognitive-cyan/20 transition-all"
            >
              Start First Embodiment
            </Link>
            <a
              href={githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-lg bg-white/5 border border-white/10 text-white/80 font-medium hover:bg-white/10 hover:text-white transition-all flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              View GitHub
            </a>
            <EmailLink
              email="ai@rosclaw.io"
              className="px-8 py-3 rounded-lg bg-white/5 border border-white/10 text-white/80 font-medium hover:bg-white/10 hover:text-white transition-all flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Contact
            </EmailLink>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
