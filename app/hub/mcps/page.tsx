"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
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
  Award,
  TrendingUp,
  Box,
  HardDrive,
  Eye,
  Navigation,
  Settings,
  Sparkles,
  CheckCircle2,
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
  githubForks: number;
  tags: string[];
  tools: { name: string; description: string }[];
  createdAt: string;
}

const sidebarCategories = [
  { id: "all", name: "All Hardware", icon: Layers, count: null },
  { id: "official", name: "Official", icon: Award, count: null, special: true },
  { id: "manipulation", name: "Manipulation", icon: Box, count: null },
  { id: "humanoid", name: "Humanoids", icon: Zap, count: null },
  { id: "mobile", name: "Mobile Robots", icon: Navigation, count: null },
  { id: "vision", name: "Vision & Cameras", icon: Eye, count: null },
  { id: "sensors", name: "Sensors", icon: HardDrive, count: null },
  { id: "simulation", name: "Simulation", icon: Cpu, count: null },
];

const sortOptions = [
  { id: "recommended", name: "Recommended", icon: Sparkles },
  { id: "stars", name: "Most Stars", icon: Star },
  { id: "newest", name: "Recently Added", icon: TrendingUp },
];

function PackageCard({ pkg, index, featured = false }: { pkg: McpPackage; index: number; featured?: boolean }) {
  const toolsCount = pkg.tools?.length || 0;
  const isOfficial = pkg.authorName === "ros-claw" || pkg.name.startsWith("ros-claw/");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group relative"
    >
      <Link href={`/hub/mcps/${pkg.name}`}>
        <div className={`relative bg-gradient-to-br backdrop-blur-md rounded-2xl border overflow-hidden transition-all duration-300 ${
          featured
            ? "from-cognitive-cyan/[0.12] to-cognitive-cyan/[0.02] border-cognitive-cyan/30 hover:border-cognitive-cyan/50"
            : "from-white/[0.08] to-white/[0.02] border-white/10 hover:border-cognitive-cyan/30"
        }`}>
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cognitive-cyan/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Official badge */}
          {isOfficial && (
            <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-l from-cognitive-cyan/20 to-cognitive-cyan/5 border-b border-l border-cognitive-cyan/30 rounded-bl-lg">
              <span className="flex items-center gap-1 text-xs font-medium text-cognitive-cyan">
                <CheckCircle2 className="w-3 h-3" />
                Official
              </span>
            </div>
          )}

          <div className="p-6">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                featured
                  ? "bg-gradient-to-br from-cognitive-cyan/30 to-cognitive-cyan/10 border border-cognitive-cyan/30"
                  : "bg-gradient-to-br from-cognitive-cyan/20 to-cognitive-cyan/5 border border-cognitive-cyan/20 group-hover:from-cognitive-cyan/30 group-hover:to-cognitive-cyan/10"
              }`}>
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
                  <span className={`text-xs ${isOfficial ? "text-cognitive-cyan font-medium" : "text-text-muted"}`}>
                    {pkg.authorName}
                  </span>
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
                <span className="text-sm text-text-muted">
                  <span className="font-medium text-foreground">{pkg.githubForks || 0}</span> forks
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
  const [sortBy, setSortBy] = useState("recommended");

  useEffect(() => {
    fetch("/api/mcp-packages")
      .then((res) => res.json())
      .then((data) => {
        setPackages(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // 智能排序和筛选逻辑
  const processedPackages = useMemo(() => {
    let filtered = [...packages];

    // 分类筛选
    if (activeCategory !== "all") {
      if (activeCategory === "official") {
        filtered = filtered.filter(
          (p) => p.authorName === "ros-claw" || p.name.startsWith("ros-claw/")
        );
      } else {
        filtered = filtered.filter(
          (p) =>
            p.category?.toLowerCase().includes(activeCategory.toLowerCase()) ||
            p.robotType?.toLowerCase().includes(activeCategory.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(activeCategory.toLowerCase()))
        );
      }
    }

    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    // 排序逻辑
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "stars":
          return (b.githubStars || 0) - (a.githubStars || 0);
        case "newest":
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case "recommended":
        default: {
          // 推荐排序：官方优先 > Star数 > 工具数量
          const aIsOfficial = a.authorName === "ros-claw" || a.name.startsWith("ros-claw/") ? 1000000 : 0;
          const bIsOfficial = b.authorName === "ros-claw" || b.name.startsWith("ros-claw/") ? 1000000 : 0;
          const aScore = aIsOfficial + (a.githubStars || 0) * 10 + (a.tools?.length || 0) * 100;
          const bScore = bIsOfficial + (b.githubStars || 0) * 10 + (b.tools?.length || 0) * 100;
          return bScore - aScore;
        }
      }
    });
  }, [packages, searchQuery, activeCategory, sortBy]);

  // 计算每个分类的数量
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: packages.length };
    sidebarCategories.forEach((cat) => {
      if (cat.id === "all") return;
      if (cat.id === "official") {
        counts[cat.id] = packages.filter(
          (p) => p.authorName === "ros-claw" || p.name.startsWith("ros-claw/")
        ).length;
      } else {
        counts[cat.id] = packages.filter(
          (p) =>
            p.category?.toLowerCase().includes(cat.id.toLowerCase()) ||
            p.robotType?.toLowerCase().includes(cat.id.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(cat.id.toLowerCase()))
        ).length;
      }
    });
    return counts;
  }, [packages]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
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
                <p className="text-cognitive-cyan mt-1">
                  {packages.length} packages • Zero-Code Embodiment
                </p>
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

        {/* Search and Sort Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
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

            {/* Sort Options */}
            <div className="flex gap-2">
              {sortOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSortBy(opt.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    sortBy === opt.id
                      ? "bg-cognitive-cyan/20 text-cognitive-cyan border border-cognitive-cyan/30"
                      : "bg-white/5 text-text-secondary border border-white/10 hover:bg-white/10 hover:text-foreground"
                  }`}
                >
                  <opt.icon className="w-4 h-4" />
                  {opt.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Content: Sidebar + Grid */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:w-64 flex-shrink-0"
          >
            <div className="sticky top-24 bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-md rounded-2xl border border-white/10 p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4 px-2">
                Categories
              </h3>
              <nav className="space-y-1">
                {sidebarCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeCategory === cat.id
                        ? cat.special
                          ? "bg-cognitive-cyan/20 text-cognitive-cyan border border-cognitive-cyan/30"
                          : "bg-white/10 text-foreground border border-white/10"
                        : "text-text-secondary hover:bg-white/5 hover:text-foreground"
                    }`}
                  >
                    <cat.icon className={`w-4 h-4 ${cat.special ? "text-cognitive-cyan" : ""}`} />
                    <span className="flex-1 text-left">{cat.name}</span>
                    {categoryCounts[cat.id] !== undefined && (
                      <span className={`text-xs ${
                        activeCategory === cat.id
                          ? cat.special ? "text-cognitive-cyan/70" : "text-text-muted"
                          : "text-text-muted"
                      }`}>
                        {categoryCounts[cat.id]}
                      </span>
                    )}
                  </button>
                ))}
              </nav>

              {/* Info Box */}
              <div className="mt-6 p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-cognitive-cyan flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-text-secondary">
                    Official packages from{" "}
                    <span className="text-cognitive-cyan font-medium">ros-claw</span>{" "}
                    are highlighted and prioritized.
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Right Content */}
          <div className="flex-1">
            {/* Results Count */}
            {!loading && (
              <div className="flex items-center justify-between mb-4">
                <p className="text-text-muted text-sm">
                  Showing{" "}
                  <span className="text-foreground font-medium">
                    {processedPackages.length}
                  </span>{" "}
                  packages
                  {activeCategory !== "all" && (
                    <span className="ml-1">
                      in{" "}
                      <span className="text-cognitive-cyan">
                        {sidebarCategories.find((c) => c.id === activeCategory)?.name}
                      </span>
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Package Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden animate-pulse h-64"
                  />
                ))}
              </div>
            ) : processedPackages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {processedPackages.map((pkg, index) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    index={index}
                    featured={
                      sortBy === "recommended" &&
                      index < 3 &&
                      (pkg.authorName === "ros-claw" || pkg.githubStars > 50)
                    }
                  />
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
                    : "No packages found in this category."}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                  className="inline-flex items-center gap-2 text-cognitive-cyan hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>

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
