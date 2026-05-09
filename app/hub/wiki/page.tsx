"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import {
  BookOpen,
  ArrowLeft,
  ExternalLink,
  Search,
  Database,
  GitBranch,
  Scale,
  Cpu,
  Box,
  Link2,
  Clock,
  FileText,
  ChevronRight,
} from "lucide-react";

interface WikiStats {
  status: string;
  wiki_name: string;
  description: string;
  global_stats: {
    total_pages: number;
    total_wikilinks: number;
    total_judgments: number;
    total_code_graph_nodes: number;
    total_code_graph_edges: number;
    robots_covered: number;
    entities_covered: number;
    causal_chains: number;
    last_updated: string;
  };
  keywords: {
    name: string;
    weight: number;
    type: string;
    pages: number;
  }[];
  keyword_categories: {
    entity: { name: string; weight: number; pages: number }[];
    concept: { name: string; weight: number; pages: number }[];
    property: { name: string; weight: number; pages: number }[];
    algorithm: { name: string; weight: number; pages: number }[];
    constraint: { name: string; weight: number; pages: number }[];
  };
}

const typeColors: Record<string, string> = {
  entity: "#3b82f6", // blue
  property: "#f59e0b", // amber
  concept: "#06b6d4", // cyan
  algorithm: "#10b981", // green
  constraint: "#8b5cf6", // purple
};

const typeLabels: Record<string, string> = {
  entity: "Entity",
  property: "Property",
  concept: "Concept",
  algorithm: "Algorithm",
  constraint: "Constraint",
};

function KnowledgeGraph({ keywords }: { keywords: WikiStats["keywords"] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<WikiStats["keywords"][0] | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !keywords.length) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Node positions - distribute in a spiral pattern
    const nodes = keywords.slice(0, 30).map((keyword, i) => {
      const angle = (i / Math.min(keywords.length, 30)) * Math.PI * 4;
      const radius = 50 + (i * 8);
      const x = canvas.width / 2 + Math.cos(angle) * radius;
      const y = canvas.height / 2 + Math.sin(angle) * radius * 0.6;
      const size = 4 + keyword.weight * 12;
      return { ...keyword, x, y, size };
    });

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      nodes.forEach((node1, i) => {
        nodes.forEach((node2, j) => {
          if (i >= j) return;
          const dx = node2.x - node1.x;
          const dy = node2.y - node1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(node1.x, node1.y);
            ctx.lineTo(node2.x, node2.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.1 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      nodes.forEach((node) => {
        const pulse = Math.sin(time * 2 + node.weight * 10) * 0.1 + 1;
        const color = typeColors[node.type] || "#00F0FF";

        // Glow effect
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.size * 2 * pulse
        );
        gradient.addColorStop(0, `${color}40`);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 2 * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Border for high weight nodes
        if (node.weight >= 0.8) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size + 2, 0, Math.PI * 2);
          ctx.strokeStyle = `${color}80`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Label for high weight nodes
        if (node.weight >= 0.7) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.font = "10px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(node.name.slice(0, 15), node.x, node.y + node.size + 12);
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

      let found = null;
      nodes.forEach((node) => {
        const dx = x - node.x;
        const dy = y - node.y;
        if (Math.sqrt(dx * dx + dy * dy) < node.size + 5) {
          found = node;
        }
      });
      setHoveredNode(found);
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [keywords]);

  return (
    <div className="relative w-full h-96 bg-black/20 rounded-xl border border-white/10 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
      />

      {/* Tooltip */}
      {hoveredNode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute pointer-events-none z-10 px-3 py-2 rounded-lg bg-black/80 border border-white/20 backdrop-blur-md"
          style={{
            left: mousePos.x + 10,
            top: mousePos.y - 40,
          }}
        >
          <p className="font-medium text-white text-sm">{hoveredNode.name}</p>
          <p className="text-xs" style={{ color: typeColors[hoveredNode.type] }}>
            {typeLabels[hoveredNode.type]} · {hoveredNode.pages} pages
          </p>
        </motion.div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
        {Object.entries(typeLabels).map(([type, label]) => (
          <div
            key={type}
            className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/40 border border-white/10"
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: typeColors[type] }}
            />
            <span className="text-xs text-white/70">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  delay = 0,
}: {
  icon: React.ElementType;
  value: number | string;
  label: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-cognitive-cyan/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-cognitive-cyan" />
        </div>
        <span className="text-2xl font-bold text-white">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
      </div>
      <p className="text-xs text-white/50">{label}</p>
    </motion.div>
  );
}

export default function WikiPage() {
  const [stats, setStats] = useState<WikiStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("https://api.rosclaw.io/wiki/v1/hub/stats")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stats");
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.open(
        `https://api.rosclaw.io/wiki/v1/search?q=${encodeURIComponent(searchQuery)}`,
        "_blank"
      );
    }
  };

  const globalStats = stats?.global_stats;

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
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
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-purple-500" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  ROSClaw Wiki
                </h1>
                <p className="text-purple-500 mt-1">
                  Embodied AI Physics Commonsense Hub
                </p>
              </div>
            </div>

            {/* Search Box */}
            <form onSubmit={handleSearch} className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Search Wiki knowledge..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-text-muted focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.07] transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-500 text-sm hover:bg-purple-500/20 transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          <p className="text-text-secondary max-w-2xl mt-4">
            {stats?.description ||
              "Knowledge graph covering visual language navigation, robot control, physical parameter judgments, and other core embodied AI domains."}
          </p>

          {/* Subtitle Stats */}
          {globalStats && (
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-text-muted">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cognitive-cyan" />
                {globalStats.total_pages.toLocaleString()} pages
              </span>
              <span className="flex items-center gap-1.5">
                <Link2 className="w-4 h-4 text-cognitive-cyan" />
                {globalStats.total_wikilinks.toLocaleString()} links
              </span>
              <span className="flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-cognitive-cyan" />
                {globalStats.total_judgments.toLocaleString()} judgments
              </span>
              <span className="flex items-center gap-1.5">
                <Box className="w-4 h-4 text-cognitive-cyan" />
                {globalStats.robots_covered} robots
              </span>
              {globalStats.last_updated && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-text-muted" />
                  Updated{" "}
                  {new Date(globalStats.last_updated).toLocaleDateString("en-US")}
                </span>
              )}
            </div>
          )}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-text-muted">
              <div className="w-5 h-5 border-2 border-cognitive-cyan/30 border-t-cognitive-cyan rounded-full animate-spin" />
              Loading knowledge graph...
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
            <p className="text-red-500 mb-2">Failed to load</p>
            <p className="text-text-secondary text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 rounded-lg bg-white/5 text-text-secondary hover:text-foreground transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && stats && (
          <>
            {/* Knowledge Graph */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Keyword Graph
                </h2>
                <span className="text-xs text-text-muted font-mono">
                  {stats.keywords.length} keywords
                </span>
              </div>
              <KnowledgeGraph keywords={stats.keywords} />
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Knowledge Base Stats
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard
                  icon={FileText}
                  value={globalStats?.total_pages || 0}
                  label="Wiki Pages"
                  delay={0}
                />
                <StatCard
                  icon={Link2}
                  value={globalStats?.total_wikilinks || 0}
                  label="Cross-links"
                  delay={0.05}
                />
                <StatCard
                  icon={Scale}
                  value={globalStats?.total_judgments || 0}
                  label="Physics Judgments"
                  delay={0.1}
                />
                <StatCard
                  icon={Database}
                  value={globalStats?.total_code_graph_nodes || 0}
                  label="Graph Nodes"
                  delay={0.15}
                />
                <StatCard
                  icon={GitBranch}
                  value={globalStats?.total_code_graph_edges || 0}
                  label="Graph Edges"
                  delay={0.2}
                />
                <StatCard
                  icon={Cpu}
                  value={globalStats?.robots_covered || 0}
                  label="Robot Models"
                  delay={0.25}
                />
              </div>
            </motion.div>

            {/* Top Keywords by Category */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Trending Keywords
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {Object.entries(stats.keyword_categories).map(
                  ([type, items]) => (
                    <div
                      key={type}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: typeColors[type] }}
                        />
                        <h3 className="font-medium text-foreground">
                          {typeLabels[type]}
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {items.slice(0, 5).map((item) => (
                          <div
                            key={item.name}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-text-secondary truncate flex-1">
                              {item.name}
                            </span>
                            <span className="text-text-muted text-xs">
                              {item.pages}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </motion.div>

            {/* API Docs Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-12"
            >
              <div className="bg-gradient-to-br from-purple-500/5 to-transparent backdrop-blur-md rounded-2xl border border-white/10 p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Access Wiki via API
                    </h3>
                    <p className="text-text-secondary text-sm">
                      Integrate embodied AI knowledge graph into your applications using the ROSClaw Wiki API
                    </p>
                  </div>
                  <a
                    href="https://api.rosclaw.io/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-500 font-medium hover:bg-purple-500/20 transition-all whitespace-nowrap"
                  >
                    View API Docs
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Code Example */}
                <div className="mt-4 p-4 rounded-lg bg-black/40 font-mono text-sm overflow-x-auto">
                  <code className="text-text-secondary">
                    <span className="text-purple-500">curl</span>{" "}
                    <span className="text-cognitive-cyan">
                      "https://api.rosclaw.io/wiki/v1/search?q=navigation"
                    </span>{" "}
                    <span className="text-physical-orange">
                      -H "Authorization: Bearer YOUR_API_KEY"
                    </span>
                  </code>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
