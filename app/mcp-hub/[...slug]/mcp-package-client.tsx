"use client";

import { motion } from "framer-motion";
import { Eye, Star, Copy, Check, ChevronLeft, ExternalLink, Shield, Cpu, Terminal, GitBranch, MessageSquare, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface McpPackage {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  readmeContent?: string;
  authorName: string;
  author_user_id: string;
  githubRepoUrl: string;
  verified: boolean;
  category: string;
  robotType: string;
  version: string;
  downloadsCount: number;
  viewsCount: number;
  githubStars: number;
  rating: number;
  tags: string[];
  tools: { name: string; description: string }[];
  status: string;
}

interface McpPackageClientProps {
  id: string;
}

// Fetch GitHub data
async function fetchGitHubData(githubUrl: string): Promise<{ stars: number; forks: number; updatedAt: string; readme: string }> {
  try {
    const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) return { stars: 0, forks: 0, updatedAt: "", readme: "" };

    const [, owner, repo] = match;

    const [repoRes, readmeRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: { Accept: "application/vnd.github+json" },
      }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
        headers: { Accept: "application/vnd.github+json" },
      }),
    ]);

    let stars = 0;
    let forks = 0;
    let updatedAt = "";

    if (repoRes.ok) {
      const data = await repoRes.json();
      stars = data.stargazers_count || 0;
      forks = data.forks_count || 0;
      updatedAt = data.updated_at || "";
    }

    let readme = "";
    if (readmeRes.ok) {
      const data = await readmeRes.json();
      if (data.content) {
        try {
          const base64Content = data.content.replace(/\n/g, "");
          const binaryString = atob(base64Content);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          readme = new TextDecoder("utf-8").decode(bytes);
        } catch {
          readme = "";
        }
      }
    }

    return { stars, forks, updatedAt, readme };
  } catch {
    return { stars: 0, forks: 0, updatedAt: "", readme: "" };
  }
}

// Fetch package from API
async function fetchPackage(id: string): Promise<McpPackage | null> {
  try {
    const res = await fetch(`/api/mcp-packages/${id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Increment view count
async function incrementViews(id: string): Promise<void> {
  try {
    await fetch(`/api/mcp-packages/${id}?action=view`, {
      method: "POST",
    });
  } catch {
    // Silently fail - views are not critical
  }
}

export function McpPackageClient({ id }: McpPackageClientProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"readme" | "tools" | "install">("readme");
  const [packageData, setPackageData] = useState<McpPackage | null>(null);
  const [githubData, setGithubData] = useState<{ stars: number; forks: number; updatedAt: string; readme: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);

      // Fetch package from API
      const pkg = await fetchPackage(id);

      if (!isMounted) return;

      if (!pkg) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      setPackageData(pkg);

      // Increment view count when package is viewed
      incrementViews(id);

      // Fetch GitHub data (for README fallback and real-time stats)
      if (pkg.githubRepoUrl) {
        const ghData = await fetchGitHubData(pkg.githubRepoUrl);
        if (isMounted) {
          setGithubData(ghData);
        }
      }

      // Use cached readme_content if available, otherwise use GitHub data
      if (isMounted) {
        const cachedReadme = pkg.readmeContent;
        const githubReadme = pkg.longDescription;

        // Priority: cached readme > GitHub readme > empty
        if (!cachedReadme && !githubReadme && pkg.githubRepoUrl) {
          // If no cached data, trigger a background sync
          console.log("No cached README, consider running sync script");
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  }

  function formatDate(dateStr: string): string {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cognitive-cyan" />
      </div>
    );
  }

  if (notFound || !packageData) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground">Package Not Found</h1>
          <p className="text-text-muted mt-2">The package &quot;{id}&quot; does not exist.</p>
          <Link href="/mcp-hub" className="inline-flex items-center gap-2 mt-4 text-cognitive-cyan hover:underline">
            <ChevronLeft className="w-4 h-4" />
            Back to MCP Hub
          </Link>
        </div>
      </div>
    );
  }

  const installUrl = `https://rosclaw.io/mcp-hub/${id}`;
  const installCommand = `rosclaw install mcp ${packageData.name}`;
  // Use cached data from DB first, fallback to real-time GitHub fetch if not available
  const stars = packageData.githubStars || githubData?.stars || 0;
  // Priority: cached readme_content > GitHub API readme > long_description > description
  const readmeContent = packageData.readmeContent || githubData?.readme || packageData.longDescription || packageData.description;
  const authorUrl = `https://github.com/${packageData.name.split('/')[0]}`;
  const isOfficial = packageData.verified || false;

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
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground font-mono">{packageData.name}</h1>
                  {isOfficial ? (
                    <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
                      Official
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-cognitive-cyan/10 text-cognitive-cyan text-xs font-medium">
                      Community
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <code className="text-sm text-text-muted">{packageData.name}</code>
                  <span className="text-text-muted">•</span>
                  <Link
                    href={authorUrl}
                    target="_blank"
                    className="text-cognitive-cyan hover:underline"
                  >
                    {packageData.authorName}
                  </Link>
                  <span className="text-text-muted">•</span>
                  <span className="text-text-muted">v{packageData.version}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-500" title="GitHub Stars">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-medium">{formatNumber(stars)}</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-glass-bg text-text-secondary" title="Views">
                <Eye className="w-4 h-4" />
                <span>{formatNumber(packageData.viewsCount)}</span>
              </div>
            </div>
          </div>

          <p className="text-text-secondary mt-4 max-w-3xl">{packageData.description}</p>

          {/* Tags */}
          {packageData.tags.length > 0 && (
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
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-4">
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
                MCP Tools ({packageData.tools.length})
              </button>
              <button
                onClick={() => setActiveTab("install")}
                className={`pb-3 text-sm font-medium transition-colors ${
                  activeTab === "install"
                    ? "text-cognitive-cyan border-b-2 border-cognitive-cyan"
                    : "text-text-muted hover:text-foreground"
                }`}
              >
                Install
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "readme" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="markdown-body"
              >
                {readmeContent ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
                        // Convert relative links to GitHub absolute URLs
                        let finalHref = href || '';
                        if (href && !href.startsWith('http') && !href.startsWith('#') && packageData?.githubRepoUrl) {
                          const baseUrl = packageData.githubRepoUrl.replace(/\/+$/, '');
                          finalHref = `${baseUrl}/blob/main/${href}`;
                        }
                        return (
                          <a href={finalHref} target="_blank" rel="noopener noreferrer" className="text-cognitive-cyan hover:underline">
                            {children}
                          </a>
                        );
                      },
                      img: ({ src, alt }: { src?: string; alt?: string }) => {
                        // Convert relative image paths to GitHub raw URLs
                        let finalSrc = src || '';
                        if (src && !src.startsWith('http') && packageData?.githubRepoUrl) {
                          const baseUrl = packageData.githubRepoUrl.replace(/\/+$/, '');
                          finalSrc = `${baseUrl}/raw/main/${src}`;
                        }
                        return <img src={finalSrc} alt={alt} className="max-w-full rounded-lg my-4" />;
                      }
                    }}
                  >
                    {readmeContent}
                  </ReactMarkdown>
                ) : (
                  <div className="text-text-muted">No README available.</div>
                )}
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
                {packageData.tools.length === 0 && (
                  <div className="text-text-muted">No tools defined for this package.</div>
                )}
              </motion.div>
            )}

            {activeTab === "install" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Main Install Command - URL based */}
                <div className="p-5 rounded-xl bg-card-bg border border-glass-border">
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cognitive-cyan" />
                    Install from ROSClaw Registry
                  </h3>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-black/40 font-mono text-sm">
                    <code className="flex-1 text-text-secondary">{installCommand}</code>
                    <button
                      onClick={() => handleCopy(installCommand)}
                      className="p-1.5 rounded hover:bg-white/10 transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-text-muted" />}
                    </button>
                  </div>
                </div>

                {/* Natural Language */}
                <div className="p-4 rounded-lg bg-cognitive-cyan/5 border border-cognitive-cyan/20">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                    <MessageSquare className="w-4 h-4 text-cognitive-cyan" />
                    Natural Language
                  </h3>
                  <p className="text-sm text-text-secondary mb-2">
                    Simply tell your agent:
                  </p>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-black/40">
                    <code className="flex-1 text-sm text-cognitive-cyan">
                      Install the https://rosclaw.io/mcp-hub/{packageData.name} MCP package
                    </code>
                    <button
                      onClick={() => handleCopy(`Install the https://rosclaw.io/mcp-hub/${packageData.name} MCP package`)}
                      className="p-1.5 rounded hover:bg-white/10 transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-text-muted" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-1 min-w-[220px]">
            {/* Install Box */}
            <div className="p-5 rounded-xl bg-card-bg border border-glass-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">Install</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-black/40 font-mono text-sm">
                  <code className="flex-1 text-text-secondary text-xs">{installCommand}</code>
                  <button
                    onClick={() => handleCopy(installCommand)}
                    className="p-1.5 rounded hover:bg-white/10 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-text-muted" />}
                  </button>
                </div>
              </div>
            </div>

            {/* GitHub Stats */}
            <div className="p-5 rounded-xl bg-card-bg border border-glass-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">GitHub Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-text-secondary">{formatNumber(stars)} stars</span>
                </div>
                {githubData && githubData.forks > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <GitBranch className="w-4 h-4 text-text-muted" />
                    <span className="text-text-secondary">{formatNumber(githubData.forks)} forks</span>
                  </div>
                )}
                {githubData && githubData.updatedAt && (
                  <div className="text-xs text-text-muted">
                    Last updated: {formatDate(githubData.updatedAt)}
                  </div>
                )}
              </div>
            </div>

            {/* Requirements */}
            <div className="p-5 rounded-xl bg-card-bg border border-glass-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Cpu className="w-4 h-4 text-text-muted" />
                  <span className="text-text-secondary">{packageData.robotType}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Terminal className="w-4 h-4 text-text-muted" />
                  <span className="text-text-secondary">v{packageData.version}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className={`w-4 h-4 ${isOfficial ? "text-green-500" : "text-cognitive-cyan"}`} />
                  <span className={isOfficial ? "text-green-500" : "text-cognitive-cyan"}>
                    {isOfficial ? "Official Package" : "Community Package"}
                  </span>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="p-5 rounded-xl bg-card-bg border border-glass-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">Links</h3>
              <div className="space-y-2">
                <Link
                  href={packageData.githubRepoUrl}
                  target="_blank"
                  className="flex items-center gap-2 text-sm text-text-secondary hover:text-foreground transition-colors"
                >
                  <GitBranch className="w-4 h-4" />
                  GitHub Repository
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
