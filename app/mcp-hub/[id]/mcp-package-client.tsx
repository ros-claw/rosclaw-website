"use client";

import { motion } from "framer-motion";
import { Download, Star, Copy, Check, ChevronLeft, ExternalLink, Shield, Cpu, Terminal, FileText, GitBranch, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPackageById, type McpPackage } from "@/lib/data";

interface McpPackageClientProps {
  id: string;
}

// Fetch GitHub data
async function fetchGitHubData(githubUrl: string): Promise<{ stars: number; forks: number; updatedAt: string; readme: string }> {
  try {
    const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) return { stars: 0, forks: 0, updatedAt: "", readme: "" };

    const [, owner, repo] = match;

    // Fetch repo data and readme in parallel
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

export function McpPackageClient({ id }: McpPackageClientProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"readme" | "tools" | "install">("readme");
  const [githubData, setGithubData] = useState<{ stars: number; forks: number; updatedAt: string; readme: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get package data
  const packageData = getPackageById(id);

  // Fetch GitHub data
  useEffect(() => {
    if (!packageData) return;

    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      const data = await fetchGitHubData(packageData!.githubUrl);
      if (isMounted) {
        setGithubData(data);
        setIsLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [packageData]);

  // Handle copy
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format number
  function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  }

  // Format date
  function formatDate(dateStr: string): string {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (!packageData) {
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

  // URL-based install commands
  const installUrl = `https://rosclaw.io/mcp-hub/${id}`;
  const installCommand = `install mcp ${installUrl}`;
  const githubInstallCommand = `install mcp from ${packageData.githubUrl}`;
  const stars = githubData?.stars || packageData.stars || 0;
  const readmeContent = githubData?.readme || packageData.description;

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
                  {packageData.isOfficial ? (
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
                <span className="font-medium">{isLoading ? "—" : formatNumber(stars)}</span>
                <span className="text-yellow-500/70 text-sm">GitHub</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-glass-bg text-text-secondary">
                <Download className="w-4 h-4" />
                <span>{formatNumber(packageData.downloads)}</span>
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
                className="prose prose-invert prose-sm max-w-none prose-headings:text-foreground prose-headings:font-semibold prose-a:text-cognitive-cyan prose-a:no-underline hover:prose-a:underline prose-code:text-cognitive-cyan prose-code:bg-black/40 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-black/40 prose-pre:border prose-pre:border-glass-border prose-img:rounded-lg"
              >
                {readmeContent ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
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

                {/* Alternative: Install from GitHub */}
                <div className="p-5 rounded-xl bg-card-bg border border-glass-border">
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-cognitive-cyan" />
                    Install from GitHub Directly
                  </h3>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-black/40 font-mono text-sm">
                    <code className="flex-1 text-text-secondary">{githubInstallCommand}</code>
                    <button
                      onClick={() => handleCopy(githubInstallCommand)}
                      className="p-1.5 rounded hover:bg-white/10 transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-text-muted" />}
                    </button>
                  </div>
                </div>

                {/* Natural Language */}
                <div className="p-4 rounded-lg bg-cognitive-cyan/5 border border-cognitive-cyan/20">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-cognitive-cyan" />
                    Natural Language
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Simply tell your agent: <em>&quot;Install the {packageData.name} MCP package&quot;</em>
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
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
                <p className="text-xs text-text-muted">Or use GitHub URL directly</p>
              </div>
            </div>

            {/* GitHub Stats */}
            <div className="p-5 rounded-xl bg-card-bg border border-glass-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">GitHub Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-text-secondary">{isLoading ? "Loading..." : formatNumber(stars)} stars</span>
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
                  <Shield className={`w-4 h-4 ${packageData.isOfficial ? "text-green-500" : "text-cognitive-cyan"}`} />
                  <span className={packageData.isOfficial ? "text-green-500" : "text-cognitive-cyan"}>
                    {packageData.isOfficial ? "Official Package" : "Community Package"}
                  </span>
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
              </div>
            </div>

            {/* Last Updated */}
            <div className="p-4 rounded-lg bg-glass-bg text-center">
              <p className="text-xs text-text-muted">
                Last updated: {formatDate(packageData.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
