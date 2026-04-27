"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, ArrowLeft, GitBranch, ExternalLink } from "lucide-react";

const wikiNodes = [
  { id: "kinematics", label: "Kinematics", x: 100, y: 100, size: 20 },
  { id: "dynamics", label: "Dynamics", x: 250, y: 80, size: 18 },
  { id: "control", label: "Control Theory", x: 400, y: 120, size: 24 },
  { id: "perception", label: "Perception", x: 180, y: 200, size: 16 },
  { id: "planning", label: "Path Planning", x: 350, y: 220, size: 19 },
  { id: "learning", label: "Reinforcement Learning", x: 500, y: 180, size: 22 },
  { id: "simulation", label: "Simulation", x: 280, y: 300, size: 17 },
  { id: "hardware", label: "Hardware APIs", x: 450, y: 320, size: 15 },
  { id: "safety", label: "Safety", x: 120, y: 320, size: 18 },
  { id: "vla", label: "VLA Models", x: 600, y: 250, size: 20 },
];

const wikiArticles = [
  {
    title: "Inverse Kinematics for 6-DOF Arms",
    excerpt: "Mathematical foundations for computing joint angles from Cartesian targets...",
    sources: ["arXiv:2301.08458", "GitHub: ros-controls"],
    updated: "2 days ago",
  },
  {
    title: "Diffusion Policies in Practice",
    excerpt: "Implementation guide for diffusion-based visuomotor policies...",
    sources: ["arXiv:2405.12031"],
    updated: "1 week ago",
  },
  {
    title: "ROS 2 Control Architecture",
    excerpt: "Deep dive into the ros2_control framework and hardware interfaces...",
    sources: ["ROS 2 Docs", "GitHub: ros-controls"],
    updated: "3 days ago",
  },
  {
    title: "MuJoCo Contact Mechanics",
    excerpt: "Understanding contact models and collision detection in MuJoCo...",
    sources: ["arXiv:2108.12210"],
    updated: "5 days ago",
  },
];

const connections = [
  ["kinematics", "dynamics"],
  ["dynamics", "control"],
  ["control", "planning"],
  ["planning", "learning"],
  ["perception", "vla"],
  ["learning", "vla"],
  ["simulation", "dynamics"],
  ["hardware", "control"],
  ["safety", "control"],
  ["simulation", "planning"],
];

function KnowledgeGraph() {
  return (
    <div className="relative w-full h-80 bg-black/20 rounded-xl border border-white/10 overflow-hidden">
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Connections */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map(([from, to], i) => {
          const fromNode = wikiNodes.find((n) => n.id === from);
          const toNode = wikiNodes.find((n) => n.id === to);
          if (!fromNode || !toNode) return null;

          return (
            <motion.line
              key={i}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 1, delay: i * 0.1 }}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="#00F0FF"
              strokeWidth={1}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {wikiNodes.map((node, i) => (
        <motion.div
          key={node.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          style={{ left: node.x, top: node.y }}
        >
          <div
            className="rounded-full bg-cognitive-cyan/20 border border-cognitive-cyan/50 flex items-center justify-center transition-all group-hover:scale-125 group-hover:bg-cognitive-cyan/40"
            style={{ width: node.size * 2, height: node.size * 2 }}
          >
            <div className="w-2 h-2 rounded-full bg-cognitive-cyan" />
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-xs text-text-secondary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            {node.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function ArticleCard({ article }: { article: typeof wikiArticles[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="group bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 hover:border-white/20 transition-all cursor-pointer"
    >
      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-cognitive-cyan transition-colors">
        {article.title}
      </h3>
      <p className="text-text-secondary text-sm mb-4">{article.excerpt}</p>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-text-muted" />
          <span className="text-xs text-text-muted">
            {article.sources.join(", ")}
          </span>
        </div>
        <span className="text-xs text-text-muted">{article.updated}</span>
      </div>
    </motion.div>
  );
}

export default function WikiPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link
            href="/hub"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Hub
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-purple-500" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Cognitive Wiki
              </h1>
              <p className="text-purple-500">The Shared Memory.</p>
            </div>
          </div>

          <p className="text-text-secondary max-w-2xl">
            A persistent, LLM-generated knowledge graph of robotic physics,
            limits, and control theory. Endowing agents with lifelong memory.
          </p>
        </motion.div>

        {/* Knowledge Graph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Knowledge Graph
            </h2>
            <span className="text-xs text-text-muted font-mono">
              Interactive Visualization
            </span>
          </div>
          <KnowledgeGraph />
        </motion.div>

        {/* Articles Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Articles
            </h2>
            <code className="text-xs text-text-muted font-mono">
              $ rosclaw wiki pull {"<"}concept{">"}
            </code>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wikiArticles.map((article) => (
              <ArticleCard key={article.title} article={article} />
            ))}
          </div>
        </motion.div>

        {/* CLI Reference */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              CLI Commands
            </h3>
            <div className="space-y-3 font-mono text-sm">
              <code className="block text-text-secondary">
                <span className="text-cognitive-cyan">$</span> rosclaw wiki
                search{" "}
                <span className="text-physical-orange">
                  "inverse kinematics"
                </span>
              </code>
              <code className="block text-text-secondary">
                <span className="text-cognitive-cyan">$</span> rosclaw wiki
                pull{" "}
                <span className="text-physical-orange">dynamics</span>
              </code>
              <code className="block text-text-secondary">
                <span className="text-cognitive-cyan">$</span> rosclaw wiki
                graph{" "}
                <span className="text-physical-orange">--visualize</span>
              </code>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
