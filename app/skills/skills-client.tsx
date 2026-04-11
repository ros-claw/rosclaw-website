"use client";

import { motion } from "framer-motion";
import { Search, Filter, Download, Star, GitBranch, Cpu, Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Skill {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  version: string;
  authorName: string;
  downloadsCount: number;
  rating: number;
  reviewCount: number;
  tags: string[];
}

const categories = [
  { id: "all", name: "All Skills" },
  { id: "manipulation", name: "Manipulation" },
  { id: "navigation", name: "Navigation" },
  { id: "vision", name: "Computer Vision" },
  { id: "grasping", name: "Grasping" },
  { id: "assembly", name: "Assembly" },
  { id: "social", name: "Social" },
];

export function SkillsClient() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSkills();
  }, [activeCategory, searchQuery]);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory !== "all") params.append("category", activeCategory);
      if (searchQuery) params.append("search", searchQuery);

      const res = await fetch(`/api/skills?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch skills");
      const data = await res.json();
      setSkills(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Skill Market</h1>
              <p className="text-text-secondary mt-1">
                Discover and share embodied AI skills
              </p>
            </div>
            <Link
              href="/skills/publish"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-cognitive-cyan/10 border border-cognitive-cyan/30 text-cognitive-cyan font-medium hover:bg-cognitive-cyan/20 transition-all"
            >
              <GitBranch className="w-4 h-4 mr-2" />
              Publish Skill
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
                  placeholder="Search skills..."
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
                  {categories.map((cat) => (
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
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-cognitive-cyan" />
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-400">
                {error}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {skills.map((skill) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group p-5 rounded-xl bg-card-bg border border-glass-border hover:border-cognitive-cyan/30 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-cognitive-cyan/10 flex items-center justify-center flex-shrink-0">
                        <Cpu className="w-6 h-6 text-cognitive-cyan" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-foreground group-hover:text-cognitive-cyan transition-colors truncate">
                            <Link href={`/skills/${skill.name}`}>{skill.displayName || skill.name}</Link>
                          </h3>
                          <span className="text-xs text-text-muted flex-shrink-0">v{skill.version}</span>
                        </div>
                        <p className="text-sm text-text-secondary mt-1">{skill.authorName}</p>
                        <p className="text-sm text-text-muted mt-2 line-clamp-2">{skill.description}</p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {skill.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-full bg-glass-bg text-text-muted text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-glass-border">
                          <div className="flex items-center gap-1 text-text-muted text-sm">
                            <Download className="w-4 h-4" />
                            <span>{skill.downloadsCount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1 text-yellow-500 text-sm">
                            <Star className="w-4 h-4 fill-current" />
                            <span>{skill.rating?.toFixed(1) || "0.0"}</span>
                            <span className="text-text-muted text-xs">({skill.reviewCount || 0})</span>
                          </div>
                          <div className="flex items-center gap-1 text-text-muted text-sm ml-auto">
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && skills.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-muted">No skills found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
