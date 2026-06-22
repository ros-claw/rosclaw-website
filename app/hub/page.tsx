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
  ShieldCheck,
  Terminal,
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
    id: "eurdf",
    icon: Box,
    title: "e-URDF Zoo",
    description:
      "Robot embodiment definitions, safety envelopes, sensors, actuators, capabilities, and simulation metadata.",
    status: "Experimental",
  },
  {
    id: "mcp",
    icon: Plug,
    title: "Hardware MCP Hub",
    description:
      "Agent-facing interfaces for robot bodies, sensors, tools, lab devices, and physical infrastructure.",
    status: "Template",
  },
  {
    id: "provider",
    icon: BrainCircuit,
    title: "Provider Hub",
    description:
      "LLMs, VLMs, VLAs, VLNs, world models, critics, embeddings, classical robotics algorithms, and skill policies.",
    status: "Planned",
  },
  {
    id: "twin",
    icon: Cuboid,
    title: "Digital Twin Hub",
    description:
      "Simulation worlds, robot assets, validation scenes, replay environments, and regression tests.",
    status: "Demo",
  },
  {
    id: "wiki",
    icon: BookOpen,
    title: "Cognitive Wiki Hub",
    description:
      "Task cards, failure taxonomies, constraints, evidence, repair knowledge, and domain-specific robotics notes.",
    status: "Demo",
  },
  {
    id: "skill",
    icon: Cpu,
    title: "Skill Hub",
    description:
      "Versioned task policies, recovery strategies, parameter packs, and skill graphs.",
    status: "Experimental",
  },
  {
    id: "benchmark",
    icon: BarChart3,
    title: "Benchmark Hub",
    description:
      "Reproducible evaluation tasks, regression suites, and skill promotion criteria.",
    status: "Planned",
  },
];

const lifecycle = [
  "Create",
  "Validate",
  "Sign",
  "Publish",
  "Sync",
  "Install",
  "Activate",
  "Evaluate",
  "Update / Rollback",
  "Deprecate",
];

const cliExamples = [
  "rosclaw hub login",
  "rosclaw hub sync",
  "rosclaw hub search g1",
  "rosclaw hub install rosclaw://eurdf/rosclaw/unitree-g1@1.0.0",
  "rosclaw hub list --installed",
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

export default function HubPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 text-cognitive-cyan font-mono text-sm mb-4">
            <span className="text-physical-orange">&gt;_</span>
            <span>PHYSICAL-AI ASSET HUB</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            ROSClaw Physical-AI Asset Hub
          </h1>
          <p className="text-text-secondary text-lg max-w-3xl">
            A versioned registry for the physical assets, models, memories, and
            safety contexts embodied agents need.
          </p>
        </motion.div>

        {/* Asset Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
        >
          {assets.map((asset) => {
            const Icon = asset.icon;
            return (
              <motion.div
                key={asset.id}
                variants={fadeInUp}
                className="group rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 hover:border-white/[0.15] hover:bg-white/[0.05] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-cognitive-cyan" />
                  </div>
                  <StatusBadge status={asset.status} />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-cognitive-cyan transition-colors">
                  {asset.title}
                </h2>
                <p className="text-text-secondary text-sm leading-relaxed">{asset.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Lifecycle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-2xl font-bold text-foreground mb-8">Asset Lifecycle</h2>
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 md:p-8 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              {lifecycle.map((stage, i) => (
                <div key={stage} className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm whitespace-nowrap">
                    {stage}
                  </span>
                  {i < lifecycle.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-white/20 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CLI Examples + Manifest */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cognitive-cyan" />
              CLI Examples
            </h2>
            <div className="rounded-2xl bg-black/60 border border-white/10 p-6 font-mono text-sm overflow-x-auto">
              {cliExamples.map((cmd) => (
                <div key={cmd} className="text-cognitive-cyan mb-2 last:mb-0">
                  $ {cmd}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">Manifest Preview</h2>
            <div className="rounded-2xl bg-black/60 border border-white/10 p-6 font-mono text-sm overflow-x-auto">
              <pre className="text-white/70">
                {`name: rosclaw/unitree-g1
type: e_urdf
version: 1.0.0
status: experimental
capabilities:
  - locomotion
  - manipulation
  - balance
safety:
  sandbox_required: true
  human_approval_required: true`}
              </pre>
            </div>
          </motion.div>
        </div>

        {/* Safety & Trust */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-8 mb-16"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-cognitive-cyan/10 border border-cognitive-cyan/30 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-cognitive-cyan" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">Safety & Trust</h2>
              <p className="text-text-secondary leading-relaxed">
                Every asset in the Hub is treated as a proposal until it passes
                local validation, sandbox checks, and human review. Install
                counts and download numbers are never fabricated; statuses are
                labeled honestly as Experimental, Template, Demo, or Planned.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-foreground transition-colors"
          >
            <span className="text-physical-orange">←</span>
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
