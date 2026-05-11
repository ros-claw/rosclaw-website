"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";
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
  skill: "#ec4899", // pink
};

const typeLabels: Record<string, string> = {
  entity: "Entity",
  property: "Property",
  concept: "Concept",
  algorithm: "Algorithm",
  constraint: "Constraint",
  skill: "Skill",
};

// Connection colors by relationship strength (inspired by GitNexus)
// Using more subtle colors to not interfere with text readability
const getConnectionStyle = (node1: any, node2: any, distance: number) => {
  // Same type = stronger connection
  const sameType = node1.type === node2.type;
  // Similar weight = stronger connection
  const weightDiff = Math.abs(node1.weight - node2.weight);
  const similarWeight = weightDiff < 0.3;

  // Subtle gray-blue tones that don't interfere with text
  if (sameType && similarWeight) {
    return { color: "rgba(100, 120, 140, 0.35)", width: 1.0, opacity: 0.6 };
  } else if (sameType || similarWeight) {
    return { color: "rgba(100, 120, 140, 0.22)", width: 0.7, opacity: 0.4 };
  }
  return { color: "rgba(100, 120, 140, 0.12)", width: 0.5, opacity: 0.25 };
};

function KnowledgeGraph({ keywords }: { keywords: WikiStats["keywords"] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<WikiStats["keywords"][0] | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const nodesRef = useRef<(WikiStats["keywords"][0] & { x: number; y: number; size: number; vx: number; vy: number })[]>([]);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);

  // Initialize nodes with force-directed positions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !keywords.length) return;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize nodes with spiral layout + some randomness
    const nodes = keywords.slice(0, 40).map((keyword, i) => {
      const angle = (i / Math.min(keywords.length, 40)) * Math.PI * 4;
      const radius = 60 + (i * 6);
      const x = canvas.width / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 30;
      const y = canvas.height / 2 + Math.sin(angle) * radius * 0.6 + (Math.random() - 0.5) * 30;
      const size = 4 + keyword.weight * 12;
      return { ...keyword, x, y, size, vx: 0, vy: 0 };
    });

    // Run simple force-directed layout to spread nodes
    const iterations = 100;
    for (let iter = 0; iter < iterations; iter++) {
      // Repulsion between all nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          let dx = a.x - b.x, dy = a.y - b.y;
          let dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 200) {
            const f = 800 / (dist * dist);
            const fx = (dx / dist) * f;
            const fy = (dy / dist) * f;
            a.vx += fx; a.vy += fy;
            b.vx -= fx; b.vy -= fy;
          }
        }
      }

      // Attraction between connected nodes (same type or similar weight)
      nodes.forEach((node1, i) => {
        nodes.forEach((node2, j) => {
          if (i >= j) return;
          const sameType = node1.type === node2.type;
          const weightDiff = Math.abs(node1.weight - node2.weight);
          if (sameType || weightDiff < 0.2) {
            let dx = node2.x - node1.x, dy = node2.y - node1.y;
            let dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const targetDist = sameType ? 80 : 120;
            const f = (dist - targetDist) * 0.0005;
            const fx = (dx / dist) * f;
            const fy = (dy / dist) * f;
            node1.vx += fx; node1.vy += fy;
            node2.vx -= fx; node2.vy -= fy;
          }
        });
      });

      // Apply velocity + damping + stronger center gravity to prevent nodes flying away
      nodes.forEach(n => {
        n.vx *= 0.7;
        n.vy *= 0.7;
        // Stronger center gravity (was 0.0005, now 0.002)
        n.vx -= n.x * 0.002;
        n.vy -= n.y * 0.002;
        n.x += n.vx;
        n.y += n.vy;
      });
    }

    // Clamp nodes to canvas bounds with padding
    const padding = 50;
    nodes.forEach(n => {
      const maxX = canvas.width - padding;
      const maxY = canvas.height - padding;
      n.x = Math.max(padding, Math.min(maxX, n.x));
      n.y = Math.max(padding, Math.min(maxY, n.y));
    });

    nodesRef.current = nodes;

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [keywords]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodesRef.current.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      timeRef.current += 0.015;
      const time = timeRef.current;
      const nodes = nodesRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections with varying styles based on relationship
      nodes.forEach((node1, i) => {
        nodes.forEach((node2, j) => {
          if (i >= j) return;
          const dx = node2.x - node1.x;
          const dy = node2.y - node1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Only draw connections within range
          if (dist < 180) {
            const style = getConnectionStyle(node1, node2, dist);
            const opacity = style.opacity * (1 - dist / 180);

            ctx.beginPath();

            // Curved lines for same-type connections (GitNexus-inspired)
            const sameType = node1.type === node2.type;
            if (sameType && dist > 50) {
              // Calculate control point for quadratic curve
              const midX = (node1.x + node2.x) / 2;
              const midY = (node1.y + node2.y) / 2;
              const curvature = Math.sin(time * 0.5 + i * 0.1) * 10;
              const perpX = -dy / dist * curvature;
              const perpY = dx / dist * curvature;
              ctx.moveTo(node1.x, node1.y);
              ctx.quadraticCurveTo(midX + perpX, midY + perpY, node2.x, node2.y);
            } else {
              ctx.moveTo(node1.x, node1.y);
              ctx.lineTo(node2.x, node2.y);
            }

            ctx.strokeStyle = style.color.replace(/[\d.]+\)$/, `${opacity})`);
            ctx.lineWidth = style.width;
            ctx.stroke();
          }
        });
      });

      // Draw nodes with pulse effect
      nodes.forEach((node, i) => {
        const pulse = Math.sin(time * 2 + node.weight * 10 + i * 0.2) * 0.15 + 1;
        const color = typeColors[node.type] || "#00F0FF";

        // Glow effect - larger for high-weight nodes
        const glowSize = node.size * 2.5 * pulse;
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, glowSize
        );
        gradient.addColorStop(0, `${color}30`);
        gradient.addColorStop(0.5, `${color}10`);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Node circle with slight animation
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * (0.9 + pulse * 0.1), 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Inner highlight
        ctx.beginPath();
        ctx.arc(node.x - node.size * 0.3, node.y - node.size * 0.3, node.size * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fill();

        // Border for high weight nodes
        if (node.weight >= 0.7) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size + 3, 0, Math.PI * 2);
          ctx.strokeStyle = `${color}60`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Label for high weight nodes with improved readability
        if (node.weight >= 0.75) {
          const labelText = node.name.slice(0, 18);
          const fontSize = node.weight >= 0.85 ? 13 : 12;
          ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          const textY = node.y + node.size + 16;
          const textMetrics = ctx.measureText(labelText);
          const textWidth = textMetrics.width;
          const textHeight = fontSize;

          // Draw background pill for better contrast
          const paddingX = 6;
          const paddingY = 3;
          const cornerRadius = 4;
          ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
          ctx.beginPath();
          ctx.roundRect(
            node.x - textWidth / 2 - paddingX,
            textY - textHeight / 2 - paddingY,
            textWidth + paddingX * 2,
            textHeight + paddingY * 2,
            cornerRadius
          );
          ctx.fill();

          // Draw white text with shadow for extra clarity
          ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
          ctx.shadowBlur = 3;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 1;
          ctx.fillStyle = "#ffffff";
          ctx.fillText(labelText, node.x, textY);

          // Reset shadow
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Mouse interaction
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    let found = null;
    nodesRef.current.forEach((node) => {
      const dx = x - node.x;
      const dy = y - node.y;
      if (Math.sqrt(dx * dx + dy * dy) < node.size + 6) {
        found = node;
      }
    });
    setHoveredNode(found);
  }, []);

  const handleClick = useCallback(() => {
    if (hoveredNode) {
      const slug = hoveredNode.name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
      window.open(`https://wiki.rosclaw.io/${slug}`, "_blank");
    }
  }, [hoveredNode]);

  return (
    <div className="relative w-full h-96 bg-black/20 rounded-xl border border-white/10 overflow-hidden">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        className={`absolute inset-0 w-full h-full ${hoveredNode ? "cursor-pointer" : "cursor-crosshair"}`}
      />

      {/* Tooltip */}
      {hoveredNode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute pointer-events-none z-10 px-3 py-2 rounded-lg bg-black/80 border border-white/20 backdrop-blur-md"
          style={{
            left: Math.min(mousePos.x + 10, (canvasRef.current?.width || 400) - 150),
            top: Math.max(mousePos.y - 50, 10),
          }}
        >
          <p className="font-medium text-white text-sm">{hoveredNode.name}</p>
          <p className="text-xs" style={{ color: typeColors[hoveredNode.type] }}>
            {typeLabels[hoveredNode.type]} · {hoveredNode.pages} pages · Click to view
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
  warning,
  tooltip,
}: {
  icon: React.ElementType;
  value: number | string;
  label: string;
  delay?: number;
  warning?: boolean;
  tooltip?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md relative group"
      title={tooltip}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-cognitive-cyan/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-cognitive-cyan" />
        </div>
        <span className="text-2xl font-bold text-white flex items-center gap-2">
          {typeof value === "number" ? value.toLocaleString() : value}
          {warning && (
            <span className="text-yellow-500 text-sm" title={tooltip}>⚠️</span>
          )}
        </span>
      </div>
      <p className="text-xs text-white/50">{label}</p>
      {tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-black/80 border border-white/10 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
          {tooltip}
        </div>
      )}
    </motion.div>
  );
}

const searchTypes = [
  { value: "hybrid", label: "Hybrid", desc: "Keyword + Semantic (Default)" },
  { value: "keyword", label: "Keyword", desc: "Exact term matching" },
  { value: "semantic", label: "Semantic", desc: "Synonym association" },
  { value: "expanded", label: "Expanded", desc: "LLM query expansion" },
  { value: "judgment", label: "Judgment", desc: "Physical parameter search" },
];

export default function WikiPage() {
  const [stats, setStats] = useState<WikiStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("hybrid");
  const [showSearchTypeMenu, setShowSearchTypeMenu] = useState(false);

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
        `https://api.rosclaw.io/wiki/v1/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`,
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
            <div className="relative w-full md:w-[500px]">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search Wiki knowledge..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-text-muted focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.07] transition-all"
                  />
                </div>

                {/* Search Type Selector */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowSearchTypeMenu(!showSearchTypeMenu)}
                    className="h-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm hover:bg-white/[0.07] transition-all min-w-[100px]"
                  >
                    {searchTypes.find((t) => t.value === searchType)?.label}
                  </button>

                  {showSearchTypeMenu && (
                    <div className="absolute top-full right-0 mt-2 w-56 rounded-xl bg-black/90 border border-white/10 backdrop-blur-md overflow-hidden z-20">
                      {searchTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => {
                            setSearchType(type.value);
                            setShowSearchTypeMenu(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-white/5 transition-colors ${
                            searchType === type.value
                              ? "bg-purple-500/10 text-purple-500"
                              : "text-foreground"
                          }`}
                        >
                          <div className="font-medium text-sm">{type.label}</div>
                          <div className="text-xs text-text-muted">{type.desc}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-500 font-medium hover:bg-purple-500/20 transition-all"
                >
                  Search
                </button>
              </form>

              {/* Click outside to close */}
              {showSearchTypeMenu && (
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowSearchTypeMenu(false)}
                />
              )}
            </div>
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
              <span className="flex items-center gap-1.5" title={globalStats.entities_covered === 0 ? "Entity graph data is being imported" : undefined}>
                <Database className="w-4 h-4 text-cognitive-cyan" />
                {globalStats.entities_covered === 0 ? (
                  <span className="text-text-secondary">Pending Build</span>
                ) : (
                  `${globalStats.entities_covered} entities`
                )}
              </span>
              <span className="flex items-center gap-1.5" title={globalStats.causal_chains === 0 ? "Physical causal chains are being imported" : undefined}>
                <GitBranch className="w-4 h-4 text-cognitive-cyan" />
                {globalStats.causal_chains === 0 ? (
                  <span className="text-text-secondary">Pending Build</span>
                ) : (
                  `${globalStats.causal_chains} chains`
                )}
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
                  warning={!!globalStats?.total_code_graph_nodes}
                  tooltip="Contains google-research noise, will be filtered soon"
                />
                <StatCard
                  icon={GitBranch}
                  value={globalStats?.total_code_graph_edges || 0}
                  label="Graph Edges"
                  delay={0.2}
                  warning={!!globalStats?.total_code_graph_edges}
                  tooltip="Contains google-research noise, will be filtered soon"
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
