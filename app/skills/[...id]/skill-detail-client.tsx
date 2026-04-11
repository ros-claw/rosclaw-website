"use client";

import { motion } from "framer-motion";
import { Download, Star, GitBranch, Copy, Check, ChevronLeft, ExternalLink, Clock, Shield, Loader2, Cpu } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Skill {
  id: string;
  name: string;
  displayName: string;
  description: string;
  longDescription?: string;
  authorName: string;
  authorUrl?: string;
  githubRepoUrl?: string;
  downloadsCount: number;
  rating: number;
  reviewCount: number;
  version: string;
  category: string;
  tags: string[];
  compatibleRobots: string[];
  dependencies: string[];
}

interface SkillDetailClientProps {
  id: string;
}

// Fetch GitHub README
async function fetchGitHubReadme(githubUrl: string): Promise<string> {
  try {
    const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) return "";

    const [, owner, repo] = match;
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: { Accept: "application/vnd.github+json" },
    });

    if (!res.ok) return "";

    const data = await res.json();
    if (data.content) {
      try {
        const base64Content = data.content.replace(/\n/g, "");
        const binaryString = atob(base64Content);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return new TextDecoder("utf-8").decode(bytes);
      } catch {
        return "";
      }
    }
    return "";
  } catch {
    return "";
  }
}

// Fetch skill from API
async function fetchSkill(id: string): Promise<Skill | null> {
  try {
    const res = await fetch(`/api/skills/${encodeURIComponent(id)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export function SkillDetailClient({ id }: SkillDetailClientProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"readme" | "changelog">("readme");
  const [skill, setSkill] = useState<Skill | null>(null);
  const [readmeContent, setReadmeContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);

      const skillData = await fetchSkill(id);

      if (!isMounted) return;

      if (!skillData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setSkill(skillData);

      // Fetch GitHub README if available
      if (skillData.githubRepoUrl) {
        const readme = await fetchGitHubReadme(skillData.githubRepoUrl);
        if (isMounted) {
          setReadmeContent(readme);
        }
      }

      if (isMounted) {
        setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleCopy = () => {
    if (skill) {
      navigator.clipboard.writeText(`rosclaw install skill ${skill.name}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cognitive-cyan" />
      </div>
    );
  }

  if (notFound || !skill) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground">Skill Not Found</h1>
          <p className="text-text-muted mt-2">The skill &quot;{id}&quot; does not exist.</p>
          <Link href="/skills" className="inline-flex items-center gap-2 mt-4 text-cognitive-cyan hover:underline">
            <ChevronLeft className="w-4 h-4" />
            Back to Skills
          </Link>
        </div>
      </div>
    );
  }

  const displayDescription = readmeContent || skill.longDescription || skill.description;
  const installCommand = `rosclaw install skill ${skill.name}`;

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
                <Cpu className="w-8 h-8 text-cognitive-cyan" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{skill.displayName || skill.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Link
                    href={skill.authorUrl || "#"}
                    target="_blank"
                    className="text-cognitive-cyan hover:underline"
                  >
                    {skill.authorName}
                  </Link>
                  <span className="text-text-muted">•</span>
                  <span className="text-text-muted">v{skill.version}</span>
                  <span className="text-text-muted">•</span>
                  <span className="text-text-muted">{skill.category}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-medium">{skill.rating?.toFixed(1) || "0.0"}</span>
                <span className="text-yellow-500/70 text-sm">({skill.reviewCount || 0})</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-glass-bg text-text-secondary">
                <Download className="w-4 h-4" />
                <span>{skill.downloadsCount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <p className="text-text-secondary mt-4 max-w-3xl">{skill.description}</p>

          {/* Tags */}
          {skill.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {skill.tags.map((tag) => (
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
                Info
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "readme" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="markdown-body"
              >
                {displayDescription ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
                        let finalHref = href || '';
                        if (href && !href.startsWith('http') && !href.startsWith('#') && skill?.githubRepoUrl) {
                          const baseUrl = skill.githubRepoUrl.replace(/\/+$/, '');
                          finalHref = `${baseUrl}/blob/main/${href}`;
                        }
                        return (
                          <a href={finalHref} target="_blank" rel="noopener noreferrer" className="text-cognitive-cyan hover:underline">
                            {children}
                          </a>
                        );
                      },
                      img: ({ src, alt }: { src?: string; alt?: string }) => {
                        let finalSrc = src || '';
                        if (src && !src.startsWith('http') && skill?.githubRepoUrl) {
                          const baseUrl = skill.githubRepoUrl.replace(/\/+$/, '');
                          finalSrc = `${baseUrl}/raw/main/${src}`;
                        }
                        return <img src={finalSrc} alt={alt} className="max-w-full rounded-lg my-4" />;
                      }
                    }}
                  >
                    {displayDescription}
                  </ReactMarkdown>
                ) : (
                  <div className="text-text-muted">No README available.</div>
                )}
              </motion.div>
            )}

            {activeTab === "changelog" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="p-4 rounded-lg bg-card-bg border border-glass-border">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-cognitive-cyan">v{skill.version}</span>
                    <span className="text-text-muted text-sm">• Current Version</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Install Box */}
            <div className="p-5 rounded-xl bg-card-bg border border-glass-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">Install</h3>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-black/40 font-mono text-sm">
                <code className="flex-1 text-text-secondary text-xs">{installCommand}</code>
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
            {skill.compatibleRobots.length > 0 && (
              <div className="p-5 rounded-xl bg-card-bg border border-glass-border">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Compatible Robots
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skill.compatibleRobots.map((robot) => (
                    <span
                      key={robot}
                      className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs"
                    >
                      {robot}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dependencies */}
            {skill.dependencies.length > 0 && (
              <div className="p-5 rounded-xl bg-card-bg border border-glass-border">
                <h3 className="text-sm font-semibold text-foreground mb-3">Dependencies</h3>
                <div className="space-y-2">
                  {skill.dependencies.map((dep) => (
                    <div key={dep} className="flex items-center gap-2 text-sm">
                      <GitBranch className="w-3.5 h-3.5 text-text-muted" />
                      <span className="text-text-secondary">{dep}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="p-5 rounded-xl bg-card-bg border border-glass-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">Links</h3>
              <div className="space-y-2">
                {skill.githubRepoUrl && (
                  <Link
                    href={skill.githubRepoUrl}
                    target="_blank"
                    className="flex items-center gap-2 text-sm text-text-secondary hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    GitHub Repository
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
