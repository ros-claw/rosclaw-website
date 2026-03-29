"use client";

import { motion } from "framer-motion";
import { Search, Filter, Download, Terminal, Cpu, Shield, Star, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const categories = [
  { id: "all", name: "All Packages", count: 156 },
  { id: "manipulators", name: "Manipulators", count: 42 },
  { id: "humanoids", name: "Humanoids", count: 18 },
  { id: "mobile", name: "Mobile Bases", count: 35 },
  { id: "sensors", name: "Sensors", count: 28 },
  { id: "grippers", name: "Grippers", count: 15 },
  { id: "cameras", name: "Cameras", count: 18 },
];

const packages = [
  {
    id: "rosclaw-ur5-mcp",
    name: "rosclaw-ur5-mcp",
    description: "Universal Robots UR5e/UR10e driver with full e-URDF safety boundaries, trajectory planning, and force control.",
    author: "ROSClaw Official",
    verified: true,
    downloads: 45200,
    rating: 4.8,
    reviews: 342,
    category: "manipulators",
    version: "3.2.1",
    updatedAt: "2024-03-20",
    rosVersion: "ROS 2 Humble",
    safety: "e-URDF Certified",
  },
  {
    id: "rosclaw-g1-mcp",
    name: "rosclaw-g1-mcp",
    description: "Unitree G1 humanoid with 23 DoF, walking gait control, manipulation primitives, and whole-body control.",
    author: "Unitree Robotics",
    verified: true,
    downloads: 12800,
    rating: 4.7,
    reviews: 156,
    category: "humanoids",
    version: "2.1.0",
    updatedAt: "2024-03-18",
    rosVersion: "ROS 2 Humble",
    safety: "Digital Twin",
  },
  {
    id: "rosclaw-go2-mcp",
    name: "rosclaw-go2-mcp",
    description: "Unitree Go2 quadruped with terrain adaptation, SLAM navigation, and voice command support.",
    author: "Unitree Robotics",
    verified: true,
    downloads: 8400,
    rating: 4.6,
    reviews: 98,
    category: "mobile",
    version: "1.8.2",
    updatedAt: "2024-03-15",
    rosVersion: "ROS 2 Humble",
    safety: "Terrain Aware",
  },
  {
    id: "rosclaw-franka-mcp",
    name: "rosclaw-franka-mcp",
    description: "Franka Emika Panda with Franka Control Interface (FCI), force/torque feedback, and impedance control.",
    author: "Franka Robotics",
    verified: true,
    downloads: 6200,
    rating: 4.7,
    reviews: 124,
    category: "manipulators",
    version: "2.0.1",
    updatedAt: "2024-03-22",
    rosVersion: "ROS 2 Foxy/Humble",
    safety: "FCI Certified",
  },
  {
    id: "rosclaw-realsense-mcp",
    name: "rosclaw-realsense-mcp",
    description: "Intel RealSense D435/D455 depth cameras with point cloud streaming and object detection pipeline.",
    author: "ROSClaw Vision Team",
    verified: true,
    downloads: 15600,
    rating: 4.5,
    reviews: 234,
    category: "cameras",
    version: "4.1.0",
    updatedAt: "2024-03-25",
    rosVersion: "ROS 2 Humble",
    safety: "N/A",
  },
  {
    id: "rosclaw-turtlebot-mcp",
    name: "rosclaw-turtlebot-mcp",
    description: "TurtleBot3/4 mobile base with navigation stack, multi-robot coordination, and SLAM support.",
    author: "ROBOTIS",
    verified: true,
    downloads: 22100,
    rating: 4.4,
    reviews: 312,
    category: "mobile",
    version: "3.0.0",
    updatedAt: "2024-03-12",
    rosVersion: "ROS 2 Humble",
    safety: "Collision Avoid",
  },
];

export default function McpHubPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPackages = packages.filter((pkg) => {
    const matchesCategory = activeCategory === "all" || pkg.category === activeCategory;
    const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
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

              {/* Quick Install */}
              <div className="p-4 rounded-lg bg-card-bg border border-glass-border">
                <h3 className="text-sm font-semibold text-foreground mb-2">Quick Install</h3>
                <code className="block p-2 rounded bg-black/40 text-xs text-text-secondary font-mono">
                  rosclaw install {'<package>'}
                </code>
              </div>
            </div>
          </div>

          {/* Packages Grid */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 gap-4">
              {filteredPackages.map((pkg) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group p-5 rounded-xl bg-card-bg border border-glass-border hover:border-cognitive-cyan/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground group-hover:text-cognitive-cyan transition-colors truncate">
                          <Link href={`/mcp-hub/${pkg.id}`}>{pkg.name}</Link>
                        </h3>
                        {pkg.verified && (
                          <span className="flex-shrink-0 px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-medium">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-text-secondary mt-1">{pkg.author}</p>
                      <p className="text-sm text-text-muted mt-2 line-clamp-2">{pkg.description}</p>

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
                        <span className="flex items-center gap-1 text-text-muted">
                          <Cpu className="w-3.5 h-3.5" />
                          {pkg.rosVersion}
                        </span>
                        <span className="flex items-center gap-1 text-text-muted">
                          <Shield className="w-3.5 h-3.5" />
                          {pkg.safety}
                        </span>
                        <span className="text-text-muted">v{pkg.version}</span>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-glass-border">
                        <div className="flex items-center gap-1 text-text-muted text-sm">
                          <Download className="w-4 h-4" />
                          <span>{pkg.downloads.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500 text-sm">
                          <Star className="w-4 h-4 fill-current" />
                          <span>{pkg.rating}</span>
                          <span className="text-text-muted text-xs">({pkg.reviews})</span>
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
              ))}
            </div>

            {filteredPackages.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-muted">No packages found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
