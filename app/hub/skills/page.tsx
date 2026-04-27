"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Cpu, ExternalLink, Play, ArrowLeft, Star, Download } from "lucide-react";

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

function SkillCard({ skill }: { skill: Skill }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition-all"
    >
      <Link href={`/hub/skills/${skill.name}`}>
        {/* Video/Image Placeholder */}
        <div className="aspect-video bg-gradient-to-br from-physical-orange/20 to-cognitive-cyan/10 flex items-center justify-center relative">
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
          <Play className="w-12 h-12 text-white/50 group-hover:text-white group-hover:scale-110 transition-all" />
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-cognitive-cyan transition-colors">
              {skill.displayName || skill.name}
            </h3>
            {skill.rating > 0 && (
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm">{skill.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <p className="text-text-secondary text-sm mb-4 line-clamp-2">
            {skill.description}
          </p>

          {/* Robot Types */}
          <div className="flex flex-wrap gap-2 mb-4">
            {skill.robotTypes.slice(0, 3).map((type) => (
              <span
                key={type}
                className="px-2 py-1 rounded-full bg-physical-orange/10 text-physical-orange text-xs"
              >
                {type}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5 text-sm text-text-muted">
            <span>{skill.authorName}</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                {skill.viewsCount || 0}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                {skill.githubStars || 0}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/skills")
      .then((res) => res.json())
      .then((data) => {
        setSkills(data);
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
            <div className="w-14 h-14 rounded-xl bg-physical-orange/10 border border-physical-orange/20 flex items-center justify-center">
              <Cpu className="w-7 h-7 text-physical-orange" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                e-Skill Market
              </h1>
              <p className="text-physical-orange">Teach Once, Embody Anywhere.</p>
            </div>
          </div>

          <p className="text-text-secondary max-w-2xl">
            Download, share, and deploy physics-grounded skills. Transform your
            hardware instantly with community-driven VLA weights and behavior trees.
          </p>
        </motion.div>

        {/* Skills Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white/5 rounded-xl border border-white/10 overflow-hidden animate-pulse"
              >
                <div className="aspect-video bg-white/5" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-white/5 rounded w-2/3" />
                  <div className="h-4 bg-white/5 rounded w-full" />
                  <div className="h-4 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : skills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Cpu className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Skills Available
            </h3>
            <p className="text-text-secondary mb-6">
              The e-Skill Market is currently empty.
            </p>
            <Link
              href="/hub"
              className="inline-flex items-center gap-2 text-cognitive-cyan hover:underline"
            >
              Back to Hub
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
