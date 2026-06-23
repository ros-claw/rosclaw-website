"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
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
  Search,
} from "lucide-react";
import { githubDocLinks } from "@/content/cli";
import { fadeInUp, staggerContainer, statusBadgeClasses } from "@/content/shared";
import type { StatusLabel } from "@/content/shared";

const assets = [
  {
    id: "eurdf",
    href: "/hub",
    icon: Box,
    title: "e-URDF Zoo",
    description:
      "Robot embodiment definitions, safety envelopes, sensors, actuators, capabilities, and simulation metadata.",
    status: "Experimental" as StatusLabel,
    version: "1.0.0",
    sandboxRequired: true,
    localOnly: true,
  },
  {
    id: "mcp",
    href: "/hub/mcps",
    icon: Plug,
    title: "Hardware MCP Hub",
    description:
      "Agent-facing interfaces for robot bodies, sensors, tools, lab devices, and physical infrastructure.",
    status: "Experimental" as StatusLabel,
    version: "0.6.0",
    sandboxRequired: true,
    localOnly: true,
  },
  {
    id: "provider",
    href: "/hub",
    icon: BrainCircuit,
    title: "Provider Hub",
    description:
      "LLMs, VLMs, VLAs, VLNs, world models, critics, embeddings, classical robotics algorithms, and skill policies.",
    status: "Planned" as StatusLabel,
    version: "—",
    sandboxRequired: false,
    localOnly: false,
  },
  {
    id: "twin",
    href: "/hub/twins",
    icon: Cuboid,
    title: "Digital Twin Hub",
    description:
      "Simulation worlds, robot assets, validation scenes, replay environments, and regression tests.",
    status: "Experimental" as StatusLabel,
    version: "0.4.0",
    sandboxRequired: true,
    localOnly: true,
  },
  {
    id: "wiki",
    href: "/hub/wiki",
    icon: BookOpen,
    title: "Cognitive Wiki Hub",
    description:
      "Task cards, failure taxonomies, constraints, evidence, repair knowledge, and domain-specific robotics notes.",
    status: "Experimental" as StatusLabel,
    version: "0.3.0",
    sandboxRequired: false,
    localOnly: true,
  },
  {
    id: "skill",
    href: "/hub/skills",
    icon: Cpu,
    title: "Skill Hub",
    description:
      "Versioned task policies, recovery strategies, parameter packs, and skill graphs.",
    status: "Experimental" as StatusLabel,
    version: "0.5.0",
    sandboxRequired: true,
    localOnly: true,
  },
  {
    id: "benchmark",
    href: "/hub",
    icon: BarChart3,
    title: "Benchmark Hub",
    description:
      "Reproducible evaluation tasks, regression suites, and skill promotion criteria.",
    status: "Planned" as StatusLabel,
    version: "—",
    sandboxRequired: false,
    localOnly: true,
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
  "rosclaw hub search g1 --type e_urdf",
  "rosclaw hub install rosclaw://hardware_mcp/rosclaw/unitree-g1@1.0.0 --yes",
  "rosclaw hub list --installed",
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

export default function HubPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "All" },
    { id: "eurdf", label: "e-URDF" },
    { id: "mcp", label: "Hardware MCP" },
    { id: "provider", label: "Provider" },
    { id: "twin", label: "Digital Twin" },
    { id: "skill", label: "Skill" },
    { id: "wiki", label: "Wiki" },
    { id: "benchmark", label: "Benchmark" },
  ];

  const filteredAssets =
    activeFilter === "all"
      ? assets
      : assets.filter((asset) => asset.id === activeFilter);

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="mb-12"
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

        {/* Search / Filter Mock */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search assets for a robot, task, or provider..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-text-muted focus:outline-none focus:border-cognitive-cyan/50 transition-all"
              readOnly
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeFilter === filter.id
                    ? "bg-cognitive-cyan/10 border border-cognitive-cyan/30 text-cognitive-cyan"
                    : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Asset Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {filteredAssets.map((asset) => {
            const Icon = asset.icon;
            const Card = (
              <motion.div
                variants={fadeInUp}
                className="group rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 hover:border-white/[0.15] hover:bg-white/[0.05] transition-all duration-300 h-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-cognitive-cyan" />
                  </div>
                  <StatusBadge status={asset.status} />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-cognitive-cyan transition-colors flex items-center gap-2">
                  {asset.title}
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h2>
                <p className="text-text-secondary text-sm leading-relaxed mb-4">{asset.description}</p>

                <div className="space-y-1.5 text-xs font-mono text-white/50 border-t border-white/5 pt-4">
                  <div className="flex justify-between">
                    <span>Version</span>
                    <span className="text-white/80">{asset.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sandbox</span>
                    <span className={asset.sandboxRequired ? "text-physical-orange" : "text-white/80"}>
                      {asset.sandboxRequired ? "required" : "optional"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mode</span>
                    <span className="text-white/80">{asset.localOnly ? "local-only" : "cloud-ready"}</span>
                  </div>
                </div>
              </motion.div>
            );

            return asset.href ? (
              <Link key={asset.id} href={asset.href} className="block">
                {Card}
              </Link>
            ) : (
              <div key={asset.id}>{Card}</div>
            );
          })}
        </motion.div>

        {/* Lifecycle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">Asset Lifecycle</h2>
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
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
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
                local validation, sandbox checks, and human review. Install counts
                and download numbers are never fabricated; statuses are labeled
                honestly as Stable, Experimental, Planned, or Research.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Back to Home + Asset Docs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-foreground transition-colors"
          >
            <span className="text-physical-orange">←</span>
            Back to Home
          </Link>
          <a
            href={githubDocLinks.assets}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-cognitive-cyan hover:text-physical-orange transition-colors"
          >
            View Asset Docs
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}
