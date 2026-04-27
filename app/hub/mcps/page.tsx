"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Cpu, ExternalLink, Terminal, ArrowLeft } from "lucide-react";

interface McpPackage {
  id: string;
  name: string;
  description: string;
  authorName: string;
  githubRepoUrl: string;
  verified: boolean;
  category: string;
  robotType: string;
  version: string;
  githubStars: number;
  tags: string[];
  tools: { name: string; description: string }[];
}

function PackageCard({ pkg }: { pkg: McpPackage }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 hover:border-white/20 transition-all"
    >
      <Link href={`/hub/mcps/${pkg.name}`}>
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-cognitive-cyan/10 border border-cognitive-cyan/20 flex items-center justify-center flex-shrink-0">
            <Cpu className="w-6 h-6 text-cognitive-cyan" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground truncate group-hover:text-cognitive-cyan transition-colors">
              {pkg.name}
            </h3>
            <p className="text-text-secondary text-sm">{pkg.authorName}</p>
          </div>
        </div>

        <p className="text-text-secondary text-sm mb-4 line-clamp-2">
          {pkg.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {pkg.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 rounded-full bg-white/5 text-text-secondary text-xs border border-white/5"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-text-muted">{pkg.robotType}</span>
          <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-cognitive-cyan transition-colors" />
        </div>
      </Link>
    </motion.div>
  );
}

export default function McpsPage() {
  const [packages, setPackages] = useState<McpPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/mcp-packages")
      .then((res) => res.json())
      .then((data) => {
        setPackages(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
            <div className="w-14 h-14 rounded-xl bg-cognitive-cyan/10 border border-cognitive-cyan/20 flex items-center justify-center">
              <Terminal className="w-7 h-7 text-cognitive-cyan" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Hardware MCPs
              </h1>
              <p className="text-cognitive-cyan">Zero-Code Embodiment</p>
            </div>
          </div>

          <p className="text-text-secondary max-w-2xl">
            Universal southbound drivers. Connect Unitree, UR5e, or ANY custom
            robot to AI agents instantly using the Model Context Protocol.
          </p>
        </motion.div>

        {/* Package Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white/5 rounded-xl border border-white/10 p-6 animate-pulse h-48"
              />
            ))}
          </div>
        ) : packages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Terminal className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No MCPs Available
            </h3>
            <p className="text-text-secondary mb-6">
              The Hardware MCP hub is currently empty.
            </p>
            <Link
              href="/hub"
              className="inline-flex items-center gap-2 text-cognitive-cyan hover:underline"
            >
              Back to Hub
            </Link>
          </div>
        )}

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-8">
            <p className="text-text-secondary mb-4">
              Can&apos;t find your robot?
            </p>
            <Link
              href="https://github.com/ros-claw/sdk_to_mcp"
              target="_blank"
              className="inline-flex items-center gap-2 text-cognitive-cyan hover:text-physical-orange transition-colors"
            >
              Generate a driver instantly using our sdk_to_mcp Auto-Compiler
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
