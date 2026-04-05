"use client";

import { motion } from "framer-motion";
import { Search, Filter, Download, Star, GitBranch, Cpu, Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const categories = [
  { id: "all", name: "All Skills", count: 2847 },
  { id: "manipulation", name: "Manipulation", count: 456 },
  { id: "navigation", name: "Navigation", count: 323 },
  { id: "vision", name: "Computer Vision", count: 289 },
  { id: "grasping", name: "Grasping", count: 234 },
  { id: "assembly", name: "Assembly", count: 198 },
  { id: "social", name: "Social", count: 156 },
];

const skills = [
  {
    id: "pour-coffee",
    name: "Zero-Shot Pour Coffee",
    author: "MIT Robotics Lab",
    description: "Pour from any container to any cup without calibration. Includes spill detection and recovery.",
    downloads: 12400,
    rating: 4.9,
    reviews: 128,
    category: "manipulation",
    tags: ["dual-arm", "franka", "ur5"],
    version: "2.1.0",
    updatedAt: "2024-03-15",
    image: "/skills/pour-coffee.svg",
  },
  {
    id: "precision-screwing",
    name: "UR5e Precision Screwing",
    author: "ROSClaw Official",
    description: "High-precision flexible screwing with force feedback and cross-thread detection.",
    downloads: 45200,
    rating: 4.8,
    reviews: 342,
    category: "assembly",
    tags: ["ur5", "ur10", "force-control"],
    version: "1.5.2",
    updatedAt: "2024-03-20",
    image: "/skills/screwing.svg",
  },
  {
    id: "gimbal-choreo",
    name: "10-Gimbal Cyberpunk Choreo",
    author: "DanceBots Studio",
    description: "Multi-robot synchronized dance with audio analysis and beat-matched movement generation.",
    downloads: 8700,
    rating: 5.0,
    reviews: 89,
    category: "social",
    tags: ["dji-rs3", "dji-rs4", "audio-sync"],
    version: "3.0.1",
    updatedAt: "2024-03-18",
    image: "/skills/dance.svg",
  },
  {
    id: "pick-place",
    name: "Universal Pick & Place",
    author: "Stanford ILab",
    description: "General-purpose pick and place with object detection and grasp planning.",
    downloads: 23100,
    rating: 4.7,
    reviews: 256,
    category: "manipulation",
    tags: ["universal", "vision", "grasping"],
    version: "1.8.0",
    updatedAt: "2024-03-22",
    image: "/skills/pick-place.svg",
  },
  {
    id: "slam-nav",
    name: "Advanced SLAM Navigation",
    author: "CMU Robotics",
    description: "Real-time SLAM with dynamic obstacle avoidance and path replanning.",
    downloads: 18900,
    rating: 4.6,
    reviews: 178,
    category: "navigation",
    tags: ["mobile", "slam", "autonomous"],
    version: "2.3.1",
    updatedAt: "2024-03-10",
    image: "/skills/navigation.svg",
  },
  {
    id: "object-detection",
    name: "Real-time Object Detection",
    author: "ROSClaw Vision Team",
    description: "YOLO-based object detection optimized for robotic manipulation tasks.",
    downloads: 31500,
    rating: 4.8,
    reviews: 412,
    category: "vision",
    tags: ["yolo", "real-time", "manipulation"],
    version: "4.2.0",
    updatedAt: "2024-03-25",
    image: "/skills/vision.svg",
  },
];

export function SkillsClient() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSkills = skills.filter((skill) => {
    const matchesCategory = activeCategory === "all" || skill.category === activeCategory;
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
                      <span className="text-text-muted text-xs">{cat.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 gap-4">
              {filteredSkills.map((skill) => (
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
                          <Link href={`/skills/${skill.id}`}>{skill.name}</Link>
                        </h3>
                        <span className="text-xs text-text-muted flex-shrink-0">v{skill.version}</span>
                      </div>
                      <p className="text-sm text-text-secondary mt-1">{skill.author}</p>
                      <p className="text-sm text-text-muted mt-2 line-clamp-2">{skill.description}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {skill.tags.map((tag) => (
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
                          <span>{skill.downloads.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500 text-sm">
                          <Star className="w-4 h-4 fill-current" />
                          <span>{skill.rating}</span>
                          <span className="text-text-muted text-xs">({skill.reviews})</span>
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

            {filteredSkills.length === 0 && (
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
