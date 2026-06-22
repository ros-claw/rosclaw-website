"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Github, ArrowRight } from "lucide-react";
import { runtimeCapabilities, githubDocLinks } from "@/content/cli";
import { GITHUB_URL } from "@/content/shared";
import { fadeInUp, staggerContainer, statusBadgeClasses } from "@/content/shared";
import type { StatusLabel } from "@/content/shared";

function StatusBadge({ status }: { status: StatusLabel }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider ${statusBadgeClasses[status]}`}
    >
      {status}
    </span>
  );
}

export default function RuntimePage() {
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
            <span>RUNTIME ARCHITECTURE</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Core Runtime Capabilities
          </h1>
          <p className="text-white/60 text-lg max-w-3xl mx-auto">
            ROSClaw turns the requirements of physical intelligence into a coherent
            runtime: grounding, validation, routing, capture, memory, intervention,
            and evolution.
          </p>
        </motion.div>

        {/* Capabilities grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {runtimeCapabilities.map((module) => (
            <motion.div
              key={module.title}
              variants={fadeInUp}
              className="group rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 hover:border-white/[0.15] hover:bg-white/[0.05] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-white group-hover:text-cognitive-cyan transition-colors">
                  {module.title}
                </h3>
                <StatusBadge status={module.status} />
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-4">{module.oneLiner}</p>
              <div className="space-y-2">
                {module.commands.map((cmd) => (
                  <div
                    key={cmd}
                    className="rounded-lg bg-black/40 border border-white/10 p-3 font-mono text-xs text-cognitive-cyan overflow-x-auto"
                  >
                    {cmd}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-gradient-to-br from-cognitive-cyan/5 to-physical-orange/5 border border-white/10 p-8 md:p-12 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Ready to run it?</h2>
          <p className="text-white/60 mb-8 max-w-2xl mx-auto">
            Start with First Embodiment or read the full CLI reference and
            architecture docs on GitHub.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/#first-embodiment"
              className="px-8 py-3 rounded-lg bg-cognitive-cyan/10 border border-cognitive-cyan/30 text-cognitive-cyan font-medium hover:bg-cognitive-cyan/20 transition-all"
            >
              Start First Embodiment
            </Link>
            <a
              href={githubDocLinks.cli}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-lg bg-white/5 border border-white/10 text-white/80 font-medium hover:bg-white/10 hover:text-white transition-all flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              CLI Reference
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-cognitive-cyan hover:text-physical-orange transition-colors"
            >
              View full repository
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
