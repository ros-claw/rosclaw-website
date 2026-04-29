"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Cpu,
  ArrowLeft,
  Star,
  Download,
  Plus,
  Search,
  Filter,
  Zap,
  Github,
  Eye,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface Skill {
  id: string;
  name: string;
  displayName: string;
  description: string;
  authorName: string;
  githubRepoUrl: string;
  category: string;
  version: string;
  githubStars: number;
  viewsCount: number;
  rating: number;
  robotTypes: string[];
  tags: string[];
}

const categories = [
  { id: "all", name: "All Skills", icon: Zap },
  { id: "manipulation", name: "Manipulation", icon: Cpu },
  { id: "navigation", name: "Navigation", icon: ChevronRight },
  { id: "vision", name: "Vision", icon: Eye },
  { id: "grasping", name: "Grasping", icon: Cpu },
  { id: "simulation", name: "Simulation", icon: Sparkles },
];

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group relative"
    >
      <Link href={`/hub/skills/${skill.name}`}>
        <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden hover:border-physical-orange/30 transition-all duration-300">
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-physical-orange/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="p-6">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-physical-orange/20 to-physical-orange/5 border border-physical-orange/20 flex items-center justify-center flex-shrink-0 group-hover:from-physical-orange/30 group-hover:to-physical-orange/10 transition-all">
                <Cpu className="w-6 h-6 text-physical-orange" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-physical-orange transition-colors truncate">
                  {skill.displayName || skill.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Github className="w-3.5 h-3.5 text-text-muted" />
                  <span className="text-xs text-text-muted">{skill.authorName}</span>
                </div>
              </div>
              {skill.rating > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                  <span className="text-xs font-medium text-yellow-500">{skill.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-text-secondary text-sm mb-4 line-clamp-2 leading-relaxed">
              {skill.description}
            </p>

            {/* Robot Types */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {skill.robotTypes.slice(0, 3).map((type) => (
                <span
                  key={type}
                  className="px-2.5 py-1 rounded-full bg-physical-orange/10 text-physical-orange text-xs font-medium border border-physical-orange/10"
                >
                  {type}
                </span>
              ))}
              {skill.tags.slice(0, 2).map((tag) => (
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
                  <span className="font-medium text-foreground">{skill.githubStars || 0}</span>
                </span>
                <span className="flex items-center gap-1.5 text-sm text-text-muted">
                  <Download className="w-4 h-4" />
                  <span className="font-medium text-foreground">{skill.viewsCount || 0}</span>
                </span>
              </div>
              <span className="text-xs text-text-muted font-mono">{skill.version}</span>
            </div>
          </div>

          {/* Hover glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-physical-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
      </Link>
    </motion.div>
  );
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);

  useEffect(() => {
    fetch("/api/skills")
      .then((res) => res.json())
      .then((data) => {
        setSkills(data);
        setFilteredSkills(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = skills;

    if (activeCategory !== "all") {
      filtered = filtered.filter(
        (s) => s.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    setFilteredSkills(filtered);
  }, [skills, searchQuery, activeCategory]);

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
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-physical-orange/20 to-physical-orange/5 border border-physical-orange/20 flex items-center justify-center">
                <Cpu className="w-8 h-8 text-physical-orange" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  e-Skill Market
                </h1>
                <p className="text-physical-orange mt-1">Teach Once, Embody Anywhere</p>
              </div>
            </div>

            <Link
              href="/skills/publish"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-physical-orange/10 border border-physical-orange/30 text-physical-orange font-medium hover:bg-physical-orange/20 transition-all"
            >
              <Plus className="w-5 h-5" />
              Publish Skill
            </Link>
          </div>

          <p className="text-text-secondary max-w-2xl mt-4">
            Download, share, and deploy physics-grounded skills. Transform your
            hardware instantly with community-driven VLA weights and behavior trees.
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
                placeholder="Search skills by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-text-muted focus:outline-none focus:border-physical-orange/50 focus:bg-white/[0.07] transition-all"
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
                    ? "bg-physical-orange/20 text-physical-orange border border-physical-orange/30"
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
              Showing <span className="text-foreground font-medium">{filteredSkills.length}</span> skills
            </p>
          </div>
        )}

        {/* Skills Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden animate-pulse h-64"
              />
            ))}
          </div>
        ) : filteredSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill, index) => (
              <SkillCard key={skill.id} skill={skill} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Cpu className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Skills Found
            </h3>
            <p className="text-text-secondary mb-6">
              {searchQuery
                ? "No skills match your search criteria."
                : "The e-Skill Market is currently empty."}
            </p>
            <Link
              href="/hub"
              className="inline-flex items-center gap-2 text-physical-orange hover:underline"
            >
              Back to Hub
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
