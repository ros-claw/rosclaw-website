"use client";

import { motion } from "framer-motion";
import { Eye, Star, GitBranch, Copy, Check, ChevronLeft, ExternalLink, Shield, Loader2, Cpu } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface Skill {
  id: string;
  name: string;
  displayName: string;
  description: string;
  longDescription?: string;
  readmeContent?: string;
  authorName: string;
  authorUrl?: string;
  githubRepoUrl?: string;
  viewsCount: number;
  githubStars: number;
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

// Fetch GitHub data (README + stars)
async function fetchGitHubData(githubUrl: string): Promise<{ readme: string; stars: number }> {
  try {
    const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) return { readme: "", stars: 0 };

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
    if (repoRes.ok) {
      const data = await repoRes.json();
      stars = data.stargazers_count || 0;
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

    return { readme, stars };
  } catch {
    return { readme: "", stars: 0 };
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

// Increment view count
async function incrementViews(id: string): Promise<void> {
  try {
    await fetch(`/api/skills/${encodeURIComponent(id)}?action=view`, {
      method: "POST",
    });
  } catch {
    // Silently fail - views are not critical
  }
}

export function SkillDetailClient({ id }: SkillDetailClientProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"readme" | "changelog">("readme");
  const [skill, setSkill] = useState<Skill | null>(null);
  const [readmeContent, setReadmeContent] = useState<string>("");
  const [githubStars, setGithubStars] = useState<number>(0);
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

      // Increment view count when skill is viewed
      incrementViews(id);

      // Priority: cached readme_content > GitHub API > long_description
      if (skillData.readmeContent) {
        // Use cached README from database
        setReadmeContent(skillData.readmeContent);
        setGithubStars(skillData.githubStars || 0);
      } else if (skillData.githubRepoUrl) {
        // Fetch from GitHub API as fallback
        const ghData = await fetchGitHubData(skillData.githubRepoUrl);
        if (isMounted) {
          setReadmeContent(ghData.readme);
          setGithubStars(ghData.stars || skillData.githubStars || 0);
        }
      } else {
        setGithubStars(skillData.githubStars || 0);
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
                <h1 className="text-2xl md:text-3xl font-bold text-foreground font-mono">{skill.name}</h1>
                {skill.displayName && skill.displayName !== skill.name && (
                  <p className="text-text-secondary text-lg">{skill.displayName}</p>
                )}
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
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-500" title="GitHub Stars">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-medium">{githubStars > 0 ? githubStars.toLocaleString() : "—"}</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-glass-bg text-text-secondary" title="Views">
                <Eye className="w-4 h-4" />
                <span>{(skill.viewsCount || 0).toLocaleString()}</span>
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
                className="prose prose-invert prose-lg max-w-none"
              >
                {displayDescription ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      h1: ({ children }: { children?: React.ReactNode }) => (
                        <h1 className="text-3xl font-bold text-foreground mt-8 mb-4 pb-2 border-b border-glass-border">{children}</h1>
                      ),
                      h2: ({ children }: { children?: React.ReactNode }) => (
                        <h2 className="text-2xl font-semibold text-foreground mt-6 mb-3">{children}</h2>
                      ),
                      h3: ({ children }: { children?: React.ReactNode }) => (
                        <h3 className="text-xl font-semibold text-foreground mt-4 mb-2">{children}</h3>
                      ),
                      p: ({ children }: { children?: React.ReactNode }) => (
                        <p className="text-text-secondary mb-4 leading-relaxed">{children}</p>
                      ),
                      ul: ({ children }: { children?: React.ReactNode }) => (
                        <ul className="list-disc list-inside mb-4 text-text-secondary space-y-1">{children}</ul>
                      ),
                      ol: ({ children }: { children?: React.ReactNode }) => (
                        <ol className="list-decimal list-inside mb-4 text-text-secondary space-y-1">{children}</ol>
                      ),
                      li: ({ children }: { children?: React.ReactNode }) => (
                        <li className="text-text-secondary">{children}</li>
                      ),
                      code: ({ children, className }: { children?: React.ReactNode; className?: string }) => {
                        const isInline = !className;
                        return isInline ? (
                          <code className="px-1.5 py-0.5 rounded bg-glass-bg text-cognitive-cyan font-mono text-sm">{children}</code>
                        ) : (
                          <pre className="bg-black/50 border border-glass-border rounded-lg p-4 overflow-x-auto my-4">
                            <code className={`${className} font-mono text-sm`}>{children}</code>
                          </pre>
                        );
                      },
                      pre: ({ children }: { children?: React.ReactNode }) => (
                        <div className="my-4">{children}</div>
                      ),
                      blockquote: ({ children }: { children?: React.ReactNode }) => (
                        <blockquote className="border-l-4 border-cognitive-cyan/50 pl-4 py-2 my-4 text-text-secondary italic bg-glass-bg/30 rounded-r">
                          {children}
                        </blockquote>
                      ),
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
                      },
                      table: ({ children }: { children?: React.ReactNode }) => (
                        <div className="overflow-x-auto my-4">
                          <table className="w-full border-collapse border border-glass-border">
                            {children}
                          </table>
                        </div>
                      ),
                      th: ({ children }: { children?: React.ReactNode }) => (
                        <th className="border border-glass-border px-4 py-2 bg-glass-bg text-foreground font-semibold">{children}</th>
                      ),
                      td: ({ children }: { children?: React.ReactNode }) => (
                        <td className="border border-glass-border px-4 py-2 text-text-secondary">{children}</td>
                      ),
                      hr: () => <hr className="border-glass-border my-6" />,
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
          <div className="space-y-6 lg:col-span-1 min-w-[260px] lg:pl-4">
            {/* Install Box */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-card-bg to-black/40 border border-cognitive-cyan/20 shadow-lg shadow-cognitive-cyan/5">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cognitive-cyan" />
                Install
              </h3>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-black/60 font-mono text-sm border border-white/5">
                <code className="flex-1 text-text-secondary text-xs truncate">{installCommand}</code>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-md hover:bg-white/10 transition-colors flex-shrink-0"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-text-muted" />}
                </button>
              </div>
            </div>

            {/* Compatible Robots */}
            {skill.compatibleRobots.length > 0 && (
              <div className="p-5 rounded-xl bg-gradient-to-br from-card-bg to-black/20 border border-glass-border hover:border-green-500/20 transition-colors">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  Compatible Robots
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skill.compatibleRobots.map((robot) => (
                    <span
                      key={robot}
                      className="px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium border border-green-500/20"
                    >
                      {robot}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dependencies */}
            {skill.dependencies.length > 0 && (
              <div className="p-5 rounded-xl bg-gradient-to-br from-card-bg to-black/20 border border-glass-border">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-text-muted" />
                  Dependencies
                </h3>
                <div className="space-y-2">
                  {skill.dependencies.map((dep) => (
                    <div key={dep} className="flex items-center gap-2 text-sm p-1.5 rounded hover:bg-white/5 transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-cognitive-cyan/60" />
                      <span className="text-text-secondary">{dep}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-card-bg to-black/20 border border-glass-border">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-text-muted" />
                Links
              </h3>
              <div className="space-y-1">
                {skill.githubRepoUrl && (
                  <Link
                    href={skill.githubRepoUrl}
                    target="_blank"
                    className="flex items-center gap-2 text-sm text-text-secondary hover:text-cognitive-cyan transition-colors p-2 -mx-2 rounded-lg hover:bg-cognitive-cyan/5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </div>
                    <span>GitHub Repository</span>
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
