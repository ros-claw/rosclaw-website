"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Terminal,
  ArrowLeft,
  Plus,
  Search,
  Star,
  Github,
  Cpu,
  Layers,
  Zap,
  ChevronRight,
  ExternalLink,
  TerminalSquare,
} from "lucide-react";

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

const categories = [
  { id: "all", name: "All MCPs", icon: Layers },
  { id: "manipulator", name: "Manipulators", icon: Cpu },
  { id: "humanoid", name: "Humanoids", icon: Zap },
  { id: "mobile", name: "Mobile", icon: ChevronRight },
  { id: "vision", name: "Vision", icon: TerminalSquare },
];

function PackageCard({ pkg, index }: { pkg: McpPackage; index: number }) {
  const toolsCount = pkg.tools?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group relative"
    >
      <Link href={`/hub/mcps/${pkg.name}`}>
        <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden hover:border-cognitive-cyan/30 transition-all duration-300">
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cognitive-cyan/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="p-6">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cognitive-cyan/20 to-cognitive-cyan/5 border border-cognitive-cyan/20 flex items-center justify-center flex-shrink-0 group-hover:from-cognitive-cyan/30 group-hover:to-cognitive-cyan/10 transition-all">
                <Terminal className="w-6 h-6 text-cognitive-cyan" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-cognitive-cyan transition-colors truncate">
                    {pkg.name}
                  </h3>
                  {pkg.verified && (
                    <span className="px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-medium border border-green-500/20">
                      ✓
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Github className="w-3.5 h-3.5 text-text-muted" />
                  <span className="text-xs text-text-muted">{pkg.authorName}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-text-secondary text-sm mb-4 line-clamp-2 leading-relaxed">
              {pkg.description}
            </p>

            {/* Tools count badge */}
            {toolsCount > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cognitive-cyan/10 border border-cognitive-cyan/20">
                  <TerminalSquare className="w-3.5 h-3.5 text-cognitive-cyan" />
                  <span className="text-xs font-medium text-cognitive-cyan">
                    {toolsCount} tool{toolsCount !== 1 ? 's' : ''}
                  </span>
                </div>
                <span className="px-3 py-1.5 rounded-full bg-white/5 text-text-secondary text-xs border border-white/5">
                  {pkg.robotType}
                </span>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {pkg.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full bg-white/5 text-text-secondary text-xs border border-white/5"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Stats Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-sm text-text-muted">
                  <Star className="w-4 h-4" />
                  <span className="font-medium text-foreground">{pkg.githubStars || 0}</span>
                </span>
              </div>
              <span className="text-xs text-text-muted font-mono">{pkg.version}</span>
            </div>
          </div>

          {/* Hover glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-cognitive-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
      </Link>
    </motion.div>
  );
}

export default function McpsPage() {
  const [packages, setPackages] = useState<McpPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredPackages, setFilteredPackages] = useState<McpPackage[]>([]);

  useEffect(() => {
    fetch("/api/mcp-packages")
      .then((res) => res.json())
      .then((data) => {
        setPackages(data);
        setFilteredPackages(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = packages;

    if (activeCategory !== "all") {
      filtered = filtered.filter(
        (p) =>
          p.category?.toLowerCase().includes(activeCategory.toLowerCase()) ||
          p.robotType?.toLowerCase().includes(activeCategory.toLowerCase())
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    setFilteredPackages(filtered);
  }, [packages, searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
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

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cognitive-cyan/20 to-cognitive-cyan/5 border border-cognitive-cyan/20 flex items-center justify-center">
                <Terminal className="w-8 h-8 text-cognitive-cyan" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Hardware MCPs
                </h1>
                <p className="text-cognitive-cyan mt-1">Zero-Code Embodiment</p>
              </div>
            </div>

            <Link
              href="/mcp-hub/publish"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cognitive-cyan/10 border border-cognitive-cyan/30 text-cognitive-cyan font-medium hover:bg-cognitive-cyan/20 transition-all"
            >
              <Plus className="w-5 h-5" />
              Publish MCP
            </Link>
          </div>

          <p className="text-text-secondary max-w-2xl mt-4">
            Universal southbound drivers. Connect Unitree, UR5e, or ANY custom
            robot to AI agents instantly using the Model Context Protocol.
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Search MCPs by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-text-muted focus:outline-none focus:border-cognitive-cyan/50 focus:bg-white/[0.07] transition-all"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? "bg-cognitive-cyan/20 text-cognitive-cyan border border-cognitive-cyan/30"
                    : "bg-white/5 text-text-secondary border border-white/10 hover:bg-white/10 hover:text-foreground"
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        {!loading && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-text-muted text-sm">
              Showing <span className="text-foreground font-medium">{filteredPackages.length}</span> packages
            </p>
          </div>
        )}

        {/* Package Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden animate-pulse h-64"
              />
            ))}
          </div>
        ) : filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg, index) => (
              <PackageCard key={pkg.id} pkg={pkg} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Terminal className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No MCPs Found
            </h3>
            <p className="text-text-secondary mb-6">
              {searchQuery
                ? "No MCPs match your search criteria."
                : "The Hardware MCP hub is currently empty."}
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
          className="mt-16"
        >
          <div className="bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-md rounded-2xl border border-white/10 p-8 text-center">
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
