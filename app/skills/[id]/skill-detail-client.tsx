"use client";

import { motion } from "framer-motion";
import { Download, Star, GitBranch, Copy, Check, ChevronLeft, ExternalLink, Clock, Shield } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock skill data - in real app, fetch from API
const skillData = {
  id: "pour-coffee",
  name: "Zero-Shot Pour Coffee",
  author: "MIT Robotics Lab",
  authorUrl: "https://github.com/mit-robotics",
  description: "Pour from any container to any cup without calibration. Includes spill detection and recovery.",
  longDescription: `## Overview

Zero-Shot Pour Coffee is a manipulation skill that enables robots to pour liquids from arbitrary containers into target vessels without prior calibration. The skill uses vision-based analysis to estimate container geometry and liquid volume, then plans a pouring trajectory that minimizes spillage.

## Features

- **Zero-shot adaptation**: Works with any container/cup combination
- **Spill detection**: Real-time monitoring with automatic recovery
- **Force feedback**: Adjusts pouring speed based on weight sensors
- **Safety first**: Automatic stop if spill is detected

## Requirements

- Robot with at least 6 DOF
- RGB-D camera for visual analysis
- Force/torque sensor on end effector (optional but recommended)

## Usage

\`\`\`bash
rosclaw skill load pour-coffee
rosclaw skill run pour-coffee --container="mug" --target="cup"
\`\`\``,
  downloads: 12400,
  rating: 4.9,
  reviews: 128,
  version: "2.1.0",
  updatedAt: "2024-03-15",
  license: "MIT",
  category: "Manipulation",
  tags: ["dual-arm", "franka", "ur5", "vision", "force-control"],
  compatibleRobots: ["UR5/UR10", "Franka Panda", "Universal"],
  dependencies: ["rosclaw-vision>=1.5.0", "rosclaw-force>=0.8.0"],
  installCommand: "rosclaw skill install pour-coffee",
  githubUrl: "https://github.com/mit-robotics/pour-coffee-skill",
  changelog: [
    { version: "2.1.0", date: "2024-03-15", changes: ["Improved spill detection accuracy", "Added support for viscous liquids"] },
    { version: "2.0.0", date: "2024-02-01", changes: ["Complete rewrite with new vision pipeline", "Breaking: requires ROSClaw 2.0+"] },
    { version: "1.5.2", date: "2023-12-10", changes: ["Bug fixes for narrow containers"] },
  ],
};

interface SkillDetailClientProps {
  id: string;
}

export function SkillDetailClient({ id }: SkillDetailClientProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"readme" | "changelog">("readme");

  const handleCopy = () => {
    navigator.clipboard.writeText(skillData.installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/skills"
            className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-foreground transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Skills
          </Link>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-cognitive-cyan/10 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">☕</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{skillData.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Link
                    href={skillData.authorUrl}
                    target="_blank"
                    className="text-cognitive-cyan hover:underline"
                  >
                    {skillData.author}
                  </Link>
                  <span className="text-text-muted">•</span>
                  <span className="text-text-muted">v{skillData.version}</span>
                  <span className="text-text-muted">•</span>
                  <span className="text-text-muted">{skillData.license}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-medium">{skillData.rating}</span>
                <span className="text-yellow-500/70 text-sm">({skillData.reviews})</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-glass-bg text-text-secondary">
                <Download className="w-4 h-4" />
                <span>{skillData.downloads.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <p className="text-text-secondary mt-4 max-w-3xl">{skillData.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {skillData.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full bg-glass-bg text-text-secondary text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-4 border-b border-glass-border mb-6">
              <button
                onClick={() => setActiveTab("readme")}
                className={`pb-3 text-sm font-medium transition-colors ${
                  activeTab === "readme"
                    ? "text-cognitive-cyan border-b-2 border-cognitive-cyan"
                    : "text-text-muted hover:text-foreground"
                }`}
              >
                README
              </button>
              <button
                onClick={() => setActiveTab("changelog")}
                className={`pb-3 text-sm font-medium transition-colors ${
                  activeTab === "changelog"
                    ? "text-cognitive-cyan border-b-2 border-cognitive-cyan"
                    : "text-text-muted hover:text-foreground"
                }`}
              >
                Changelog
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "readme" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="prose prose-invert prose-sm max-w-none"
              >
                <div className="whitespace-pre-wrap text-text-secondary leading-relaxed">
                  {skillData.longDescription}
                </div>
              </motion.div>
            )}

            {activeTab === "changelog" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {skillData.changelog.map((entry) => (
                  <div key={entry.version} className="p-4 rounded-lg bg-card-bg border border-glass-border">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-cognitive-cyan">v{entry.version}</span>
                      <span className="text-text-muted text-sm">•</span>
                      <span className="text-text-muted text-sm">{entry.date}</span>
                    </div>
                    <ul className="space-y-1">
                      {entry.changes.map((change, i) => (
                        <li key={i} className="text-text-secondary text-sm flex items-start gap-2">
                          <span className="text-cognitive-cyan mt-1.5">•</span>
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Install Box */}
            <div className="p-5 rounded-xl bg-card-bg border border-glass-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">Install</h3>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-black/40 font-mono text-sm">
                <code className="flex-1 text-text-secondary">{skillData.installCommand}</code>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded hover:bg-white/10 transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-text-muted" />}
                </button>
              </div>
            </div>

            {/* Compatible Robots */}
            <div className="p-5 rounded-xl bg-card-bg border border-glass-border">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Compatible Robots
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillData.compatibleRobots.map((robot) => (
                  <span
                    key={robot}
                    className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs"
                  >
                    {robot}
                  </span>
                ))}
              </div>
            </div>

            {/* Dependencies */}
            <div className="p-5 rounded-xl bg-card-bg border border-glass-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">Dependencies</h3>
              <div className="space-y-2">
                {skillData.dependencies.map((dep) => (
                  <div key={dep} className="flex items-center gap-2 text-sm">
                    <GitBranch className="w-3.5 h-3.5 text-text-muted" />
                    <span className="text-text-secondary">{dep}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="p-5 rounded-xl bg-card-bg border border-glass-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">Links</h3>
              <div className="space-y-2">
                <Link
                  href={skillData.githubUrl}
                  target="_blank"
                  className="flex items-center gap-2 text-sm text-text-secondary hover:text-foreground transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  GitHub Repository
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-2 text-sm text-text-secondary hover:text-foreground transition-colors"
                >
                  <Clock className="w-4 h-4" />
                  Report Issue
                </Link>
              </div>
            </div>

            {/* Last Updated */}
            <div className="p-4 rounded-lg bg-glass-bg text-center">
              <p className="text-xs text-text-muted">
                Last updated: {skillData.updatedAt}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
