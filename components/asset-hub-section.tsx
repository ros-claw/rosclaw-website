"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Box,
  Plug,
  BrainCircuit,
  Cuboid,
  Cpu,
  BookOpen,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { assetHubPreviewContent } from "@/content/home";
import { fadeInUp, staggerContainer, statusBadgeClasses } from "@/content/shared";
import type { StatusLabel } from "@/content/shared";

const assets = [
  {
    icon: Box,
    title: "e-URDF Profiles",
    description:
      "Robot embodiment definitions, safety envelopes, sensors, actuators, capabilities, and simulation metadata.",
    status: "Experimental" as StatusLabel,
  },
  {
    icon: Plug,
    title: "Hardware MCPs",
    description:
      "Agent-facing interfaces for robot bodies, sensors, tools, lab devices, and physical infrastructure.",
    status: "Experimental" as StatusLabel,
  },
  {
    icon: BrainCircuit,
    title: "Capability Providers",
    description:
      "LLMs, VLMs, VLAs, VLNs, world models, critics, embeddings, classical robotics algorithms, and skill policies.",
    status: "Planned" as StatusLabel,
  },
  {
    icon: Cuboid,
    title: "Digital Twins",
    description:
      "Simulation worlds, robot assets, validation scenes, replay environments, and regression tests.",
    status: "Experimental" as StatusLabel,
  },
  {
    icon: Cpu,
    title: "Skills",
    description:
      "Versioned task policies, recovery strategies, parameter packs, and skill graphs.",
    status: "Experimental" as StatusLabel,
  },
  {
    icon: BookOpen,
    title: "Cognitive Wikis",
    description:
      "Task cards, failure taxonomies, constraints, evidence, repair knowledge, and domain-specific robotics notes.",
    status: "Experimental" as StatusLabel,
  },
  {
    icon: BarChart3,
    title: "Benchmarks",
    description:
      "Reproducible evaluation tasks, regression suites, and skill promotion criteria.",
    status: "Planned" as StatusLabel,
  },
];

function StatusBadge({ status }: { status: StatusLabel }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider ${statusBadgeClasses[status]}`}
    >
      {status}
    </span>
  );
}

export function AssetHubSection() {
  return (
    <section id="hub" className="py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <motion.p
            variants={fadeInUp}
            className="text-cognitive-cyan text-sm uppercase tracking-widest mb-4 font-mono"
          >
            {assetHubPreviewContent.eyebrow}
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4"
          >
            {assetHubPreviewContent.title}
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-white/60 text-lg max-w-3xl mx-auto"
          >
            {assetHubPreviewContent.description}
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {assets.map((asset) => {
            const Icon = asset.icon;
            return (
              <motion.div
                key={asset.title}
                variants={fadeInUp}
                className="group rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 hover:border-white/[0.15] hover:bg-white/[0.05] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-cognitive-cyan" />
                  </div>
                  <StatusBadge status={asset.status} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cognitive-cyan transition-colors">
                  {asset.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">{asset.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center"
        >
          <Link
            href={assetHubPreviewContent.cta.href}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all"
          >
            {assetHubPreviewContent.cta.label}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
