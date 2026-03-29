"use client";

import { motion } from "framer-motion";
import { Download, Star, Copy, Check, ChevronLeft, ExternalLink, Shield, Cpu, Terminal, FileText, GitBranch } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock package data
const packageData = {
  id: "rosclaw-ur5-mcp",
  name: "rosclaw-ur5-mcp",
  displayName: "Universal Robots UR5/UR10 Driver",
  author: "ROSClaw Official",
  authorUrl: "https://github.com/ros-claw",
  description: "Production-ready Universal Robots driver with full e-URDF safety boundaries, trajectory planning, and force control.",
  longDescription: `## Overview

rosclaw-ur5-mcp is the official ROSClaw driver for Universal Robots UR5e and UR10e collaborative arms. It provides a complete MCP (Model Context Protocol) interface for AI agents to control these robots safely.

## Features

- **e-URDF Safety**: Embedded URDF with safety limits validated in MuJoCo
- **Trajectory Planning**: RRT* and CHOMP planners with collision avoidance
- **Force Control**: Impedance and admittance control modes
- **Real-time**: 1000Hz control loop with ROS 2 real-time support
- **Digital Twin**: Full MuJoCo simulation for pre-validation

## Installation

\`\`\`bash
rosclaw install rosclaw-ur5-mcp
\`\`\`

## Quick Start

\`\`\`python
from rosclaw import Robot

robot = Robot.connect("ur5e")
robot.move_to([0.5, 0.0, 0.3])
robot.grasp()
\`\`\``,
  downloads: 45200,
  rating: 4.8,
  reviews: 342,
  version: "3.2.1",
  updatedAt: "2024-03-20",
  license: "Apache-2.0",
  rosVersion: "ROS 2 Humble",
  pythonVersion: ">=3.8",
  safety: "e-URDF Certified",
  category: "Manipulators",
  tags: ["ur5", "ur10", "universal-robots", "manipulator", "force-control"],
  installCommand: "rosclaw install rosclaw-ur5-mcp",
  githubUrl: "https://github.com/ros-claw/rosclaw-ur5-mcp",
  documentationUrl: "https://docs.rosclaw.io/mcp/ur5",
  tools: [
    { name: "move_joint", description: "Move a single joint to target position" },
    { name: "move_pose", description: "Move end-effector to target pose" },
    { name: "gripper_control", description: "Control the gripper (if attached)" },
    { name: "get_state", description: "Get current robot state (joints, pose, forces)" },
    { name: "plan_trajectory", description: "Plan collision-free trajectory" },
  ],
  changelog: [
    { version: "3.2.1", date: "2024-03-20", changes: ["Fixed force control stability issue", "Improved trajectory planning speed"] },
    { version: "3.2.0", date: "2024-03-01", changes: ["Added support for UR10e", "New digital twin validation"] },
    { version: "3.1.0", date: "2024-02-15", changes: ["Breaking: Updated to ROS 2 Humble", "Improved e-URDF format"] },
  ],
};

interface McpPackageClientProps {
  id: string;
}

export function McpPackageClient({ id }: McpPackageClientProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"readme" | "tools" | "changelog">("readme");

  const handleCopy = () => {
    navigator.clipboard.writeText(packageData.installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/mcp-hub"
            className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-foreground transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to MCP Hub
          </Link>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-cognitive-cyan/10 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🦾</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">{packageData.displayName}</h1>
                  <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
                    Verified
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <code className="text-sm text-text-muted">{packageData.name}</code>
                  <span className="text-text-muted">•</span>
                  <Link
                    href={packageData.authorUrl}
                    target="_blank"
                    className="text-cognitive-cyan hover:underline"
                  >
                    {packageData.author}
                  </Link>
                  <span className="text-text-muted">•</span>
                  <span className="text-text-muted">v{packageData.version}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-medium">{packageData.rating}</span>
                <span className="text-yellow-500/70 text-sm">({packageData.reviews})</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-glass-bg text-text-secondary">
                <Download className="w-4 h-4" />
                <span>{packageData.downloads.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <p className="text-text-secondary mt-4 max-w-3xl">{packageData.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {packageData.tags.map((tag) => (
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
                onClick={() => setActiveTab("tools")}
                className={`pb-3 text-sm font-medium transition-colors ${
                  activeTab === "tools"
                    ? "text-cognitive-cyan border-b-2 border-cognitive-cyan"
                    : "text-text-muted hover:text-foreground"
                }`}
              >
                MCP Tools
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
                  {packageData.longDescription}
                </div>
              </motion.div>
            )}

            {activeTab === "tools" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                {packageData.tools.map((tool) => (
                  <div
                    key={tool.name}
                    className="p-4 rounded-lg bg-card-bg border border-glass-border hover:border-cognitive-cyan/30 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Terminal className="w-5 h-5 text-cognitive-cyan mt-0.5" />
                      <div>
                        <code className="text-sm font-semibold text-cognitive-cyan">{tool.name}</code>
                        <p className="text-sm text-text-secondary mt-1">{tool.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "changelog" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {packageData.changelog.map((entry) => (
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
                <code className="flex-1 text-text-secondary">{packageData.installCommand}</code>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded hover:bg-white/10 transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-text-muted" />}
                </button>
              </div>
            </div>

            {/* Requirements */}
            <div className="p-5 rounded-xl bg-card-bg border border-glass-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">Requirements</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Cpu className="w-4 h-4 text-text-muted" />
                  <span className="text-text-secondary">{packageData.rosVersion}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Terminal className="w-4 h-4 text-text-muted" />
                  <span className="text-text-secondary">Python {packageData.pythonVersion}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-green-500">{packageData.safety}</span>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="p-5 rounded-xl bg-card-bg border border-glass-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">Links</h3>
              <div className="space-y-2">
                <Link
                  href={packageData.githubUrl}
                  target="_blank"
                  className="flex items-center gap-2 text-sm text-text-secondary hover:text-foreground transition-colors"
                >
                  <GitBranch className="w-4 h-4" />
                  GitHub Repository
                </Link>
                <Link
                  href={packageData.documentationUrl}
                  target="_blank"
                  className="flex items-center gap-2 text-sm text-text-secondary hover:text-foreground transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Documentation
                </Link>
              </div>
            </div>

            {/* Last Updated */}
            <div className="p-4 rounded-lg bg-glass-bg text-center">
              <p className="text-xs text-text-muted">
                Last updated: {packageData.updatedAt}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
