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
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const assets = [
  {
    icon: Box,
    title: "e-URDF Profiles",
    description:
      "Robot embodiment definitions, safety envelopes, sensors, actuators, capabilities, and simulation metadata.",
    status: "Experimental",
  },
  {
    icon: Plug,
    title: "Hardware MCPs",
    description:
      "Agent-facing interfaces for robot bodies, sensors, tools, lab devices, and physical infrastructure.",
    status: "Template",
  },
  {
    icon: BrainCircuit,
    title: "Capability Providers",
    description:
      "LLMs, VLMs, VLAs, VLNs, world models, critics, embeddings, classical robotics algorithms, and skill policies.",
    status: "Planned",
  },
  {
    icon: Cuboid,
    title: "Digital Twins",
    description:
      "Simulation worlds, robot assets, validation scenes, replay environments, and regression tests.",
    status: "Demo",
  },
  {
    icon: Cpu,
    title: "Skills",
    description:
      "Versioned task policies, recovery strategies, parameter packs, and skill graphs.",
    status: "Experimental",
  },
  {
    icon: BookOpen,
    title: "Cognitive Wikis",
    description:
      "Task cards, failure taxonomies, constraints, evidence, repair knowledge, and domain-specific robotics notes.",
    status: "Demo",
  },
  {
    icon: BarChart3,
    title: "Benchmarks",
    description:
      "Reproducible evaluation tasks, regression suites, and skill promotion criteria.",
    status: "Planned",
  },
];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Experimental: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
    Template: "bg-cognitive-cyan/10 border-cognitive-cyan/30 text-cognitive-cyan",
    Planned: "bg-white/5 border-white/20 text-white/50",
    Demo: "bg-green-500/10 border-green-500/30 text-green-400",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider ${colors[status]}`}
    >
      {status}
    </span>
  );
}

export function AssetHubSection() {
  return (
    <section id="hub" className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-cognitive-cyan text-sm uppercase tracking-widest mb-4 font-mono"
          >
            Physical-AI Asset Hub
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6"
          >
            Install, Validate, Version, and Share Physical-AI Assets
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg max-w-3xl mx-auto"
          >
            The Hub manages the assets embodied agents need to act safely:
            bodies, providers, tools, twins, skills, memories, and safety
            contexts.
          </motion.p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {assets.map((asset) => {
            const Icon = asset.icon;
            return (
              <motion.div
                key={asset.title}
                variants={fadeInUp}
                className="group rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 hover:border-white/[0.15] hover:bg-white/[0.05] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-cognitive-cyan" />
                  </div>
                  <StatusBadge status={asset.status} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cognitive-cyan transition-colors">
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
          className="mt-12 text-center"
        >
          <Link
            href="/hub"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all"
          >
            Explore the Asset Hub
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
