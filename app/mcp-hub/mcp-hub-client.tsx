"use client";

import { motion } from "framer-motion";
import { Search, Filter, Download, Star, Terminal, Cpu, ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface McpPackage {
  id: string;
  name: string;
  description: string;
  authorName: string;
  author_user_id?: string;
  githubRepoUrl: string;
  verified: boolean;
  isOfficial?: boolean;
  category: string;
  robotType: string;
  version: string;
  downloadsCount: number;
  rating: number;
  tags: string[];
  tools: { name: string; description: string }[];
}

// GitHub API cache
const githubCache: Record<string, { stars: number; updatedAt: string }> = {};

async function fetchGitHubData(githubUrl: string): Promise<{ stars: number; updatedAt: string }> {
  if (githubCache[githubUrl]) {
    return githubCache[githubUrl];
  }

  try {
    const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) return { stars: 0, updatedAt: "" };

    const [, owner, repo] = match;
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Accept: "application/vnd.github+json" },
    });

    if (!response.ok) {
      return { stars: 0, updatedAt: "" };
    }

    const data = await response.json();
    const result = {
      stars: data.stargazers_count || 0,
      updatedAt: data.updated_at || "",
    };

    githubCache[githubUrl] = result;
    return result;
  } catch {
    return { stars: 0, updatedAt: "" };
  }
}

const categories = [
  { id: "all", name: "All Packages" },
  { id: "manipulators", name: "Manipulators" },
  { id: "humanoids", name: "Humanoids" },
  { id: "mobile", name: "Mobile Bases" },
  { id: "sensors", name: "Sensors" },
  { id: "grippers", name: "Grippers" },
  { id: "cameras", name: "Cameras" },
];

export function McpHubClient() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [packages, setPackages] = useState<McpPackage[]>([]);
  const [githubData, setGithubData] = useState<Record<string, { stars: number; updatedAt: string }>>({});
  const [isLoading, setIsLoading] = useState(true);
  // Load packages from API
  useEffect(() => {
    async function loadPackages() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/mcp-packages?category=${activeCategory}&search=${searchQuery}`);
        if (res.ok) {
          const data = await res.json();
          setPackages(data);
        }
      } catch (err) {
        console.error("Failed to load packages:", err);
      }
      setIsLoading(false);
    }

    loadPackages();
  }, [activeCategory, searchQuery]);

  // Fetch GitHub stars
  useEffect(() => {
    let isMounted = true;

    async function fetchStars() {
      const batchSize = 3;
      for (let i = 0; i < packages.length; i += batchSize) {
        if (!isMounted) break;

        const batch = packages.slice(i, i + batchSize);
        const results = await Promise.all(
          batch.map(async (pkg) => {
            const data = await fetchGitHubData(pkg.githubRepoUrl);
            return { id: pkg.id, data };
          })
        );

        setGithubData((prev) => {
          const newData = { ...prev };
          results.forEach(({ id, data }) => {
            newData[id] = data;
          });
          return newData;
        });

        if (i + batchSize < packages.length) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    }

    if (packages.length > 0) {
      fetchStars();
    }

    return () => {
      isMounted = false;
    };
  }, [packages]);

  // Format number
  function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  }

  const categoryCounts = categories.map((cat) => ({
    ...cat,
    count:
      cat.id === "all"
        ? packages.length
        : packages.filter(
            (p) => p.category?.toLowerCase().replace(/\s+/g, "-") === cat.id
          ).length,
  }));

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">MCP Hub</h1>
              <p className="text-text-secondary mt-1">
                ROSClaw-compatible robot drivers and hardware interfaces
              </p>
            </div>
            <Link
              href="/mcp-hub/publish"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-cognitive-cyan/10 border border-cognitive-cyan/30 text-cognitive-cyan font-medium hover:bg-cognitive-cyan/20 transition-all"
            >
              <Terminal className="w-4 h-4 mr-2" />
              Publish Package
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search packages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-foreground placeholder:text-text-muted focus:outline-none focus:border-cognitive-cyan/50"
                />
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Categories
                </h3>
                <div className="space-y-1">
                  {categoryCounts.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeCategory === cat.id
                          ? "bg-cognitive-cyan/10 text-cognitive-cyan"
                          : "text-text-secondary hover:bg-glass-bg hover:text-foreground"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-text-muted text-xs">{cat.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Install */}
              <div className="p-4 rounded-lg bg-card-bg border border-glass-border">
                <h3 className="text-sm font-semibold text-foreground mb-2">Quick Install</h3>
                <code className="block p-2 rounded bg-black/40 text-xs text-text-secondary font-mono">
                  rosclaw mcp install {"<package>"}
                </code>
              </div>

              {/* Data Source Note */}
              <div className="p-3 rounded-lg bg-glass-bg text-xs text-text-muted">
                <p className="flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5" />
                  Stars fetched from GitHub in real-time
                </p>
              </div>
            </div>
          </div>

          {/* Packages Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-cognitive-cyan/30 border-t-cognitive-cyan rounded-full animate-spin mx-auto" />
                <p className="text-text-muted mt-4">Loading packages...</p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  {packages.map((pkg) => {
                    const ghData = githubData[pkg.id];
                    const stars = ghData?.stars || 0;

                    return (
                      <motion.div
                        key={pkg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group p-5 rounded-xl bg-card-bg border border-glass-border hover:border-cognitive-cyan/30 transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-foreground group-hover:text-cognitive-cyan transition-colors truncate font-mono text-sm">
                                <Link href={`/mcp-hub/${pkg.id}`}>{pkg.name}</Link>
                              </h3>
                              {pkg.verified ? (
                                <span className="flex-shrink-0 px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-medium">
                                  Official
                                </span>
                              ) : (
                                <span className="flex-shrink-0 px-1.5 py-0.5 rounded-full bg-cognitive-cyan/10 text-cognitive-cyan text-[10px] font-medium">
                                  Community
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-text-secondary mt-1">{pkg.authorName}</p>
                            <p className="text-sm text-text-muted mt-2 line-clamp-2">{pkg.description}</p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {pkg.tags?.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-1.5 py-0.5 rounded bg-glass-bg text-[10px] text-text-muted"
                                >
                                  {tag}
                                </span>
                              ))}
                              {pkg.tags && pkg.tags.length > 3 && (
                                <span className="px-1.5 py-0.5 rounded bg-glass-bg text-[10px] text-text-muted">
                                  +{pkg.tags.length - 3}
                                </span>
                              )}
                            </div>

                            {/* Meta */}
                            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
                              <span className="flex items-center gap-1 text-text-muted">
                                <Cpu className="w-3.5 h-3.5" />
                                {pkg.robotType || "Universal"}
                              </span>
                              <span className="text-text-muted">v{pkg.version}</span>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-glass-border">
                              <div className="flex items-center gap-1 text-text-muted text-sm">
                                <Download className="w-4 h-4" />
                                <span>{formatNumber(pkg.downloadsCount)}</span>
                              </div>
                              <div className="flex items-center gap-1 text-yellow-500 text-sm">
                                <Star className="w-4 h-4 fill-current" />
                                <span>{stars > 0 ? formatNumber(stars) : "—"}</span>
                              </div>
                              <Link
                                href={`/mcp-hub/${pkg.id}`}
                                className="flex items-center gap-1 text-cognitive-cyan text-sm ml-auto hover:underline"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {packages.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-text-muted">No packages found matching your criteria.</p>
                    <Link
                      href="/mcp-hub/publish"
                      className="inline-flex items-center gap-2 mt-4 text-cognitive-cyan hover:underline"
                    >
                      <Terminal className="w-4 h-4" />
                      Be the first to publish a package
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
