"use client";

import { motion } from "framer-motion";
import { Anchor, ShieldCheck, Route, ClipboardList, Database, AlertTriangle, GitBranch } from "lucide-react";
import { runtimeCapabilities } from "@/content/cli";
import { fadeInUp, staggerContainer, statusBadgeClasses } from "@/content/shared";
import type { StatusLabel } from "@/content/shared";

const iconMap: Record<string, React.ReactNode> = {
  "Embodiment Grounding": <Anchor className="w-6 h-6 text-cognitive-cyan" />,
  "Sandbox-before-Reality": <ShieldCheck className="w-6 h-6 text-physical-orange" />,
  "Capability Routing": <Route className="w-6 h-6 text-cognitive-cyan" />,
  "Praxis Capture": <ClipboardList className="w-6 h-6 text-physical-orange" />,
  "Physical Memory": <Database className="w-6 h-6 text-cognitive-cyan" />,
  "Runtime Intervention": <AlertTriangle className="w-6 h-6 text-physical-orange" />,
  "Skill Evolution": <GitBranch className="w-6 h-6 text-cognitive-cyan" />,
};

function StatusBadge({ status }: { status: StatusLabel }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider ${statusBadgeClasses[status]}`}
    >
      {status}
    </span>
  );
}

export function CoreRuntimeModules() {
  return (
    <section id="runtime-modules" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-cognitive-cyan text-sm uppercase tracking-widest mb-4 font-mono"
          >
            Core Runtime Capabilities
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6"
          >
            One Runtime. Seven Physical-AI Primitives.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg max-w-3xl mx-auto"
          >
            ROSClaw turns the requirements of physical intelligence into a
            coherent runtime: grounding, validation, routing, capture, memory,
            intervention, and evolution.
          </motion.p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {runtimeCapabilities.map((module) => (
            <motion.div
              key={module.title}
              variants={fadeInUp}
              className="group rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 hover:border-white/[0.15] hover:bg-white/[0.05] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  {iconMap[module.title]}
                </div>
                <StatusBadge status={module.status} />
              </div>

              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cognitive-cyan transition-colors">
                {module.title}
              </h3>
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
      </div>
    </section>
  );
}
