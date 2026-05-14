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
  ZoomIn,
  ZoomOut,
  Maximize2,
  Move,
} from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase/client";

interface WikiStats {
  status: string;
  wiki_name: string;
  description: string;
  global_stats: {
    total_pages: number;
    total_wikilinks: number;
    total_judgments: number;
    wiki_graph_nodes: number;
    wiki_graph_edges: number;
    total_code_graph_nodes: number;
    total_code_graph_edges: number;
    core_code_graph_nodes: number;
    core_code_graph_edges: number;
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
  entity: "#3b82f6",
  property: "#f59e0b",
  concept: "#06b6d4",
  algorithm: "#10b981",
  constraint: "#8b5cf6",
  skill: "#ec4899",
};

const typeLabels: Record<string, string> = {
  entity: "Entity",
  property: "Property",
  concept: "Concept",
  algorithm: "Algorithm",
  constraint: "Constraint",
  skill: "Skill",
};

function KnowledgeGraph({ keywords }: { keywords: WikiStats["keywords"] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<WikiStats["keywords"][0] | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Camera state for zoom/pan
  const cameraRef = useRef({ x: 0, y: 0, zoom: 1 });
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 });

  // Nodes data
  const nodesRef = useRef<(WikiStats["keywords"][0] & { x: number; y: number; size: number; vx: number; vy: number })[]>([]);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);

  // Initialize nodes with force-directed positions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !keywords.length) return;

    const resizeCanvas = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize more nodes (80 instead of 40)
    const nodeCount = Math.min(keywords.length, 80);
    const nodes = keywords.slice(0, nodeCount).map((keyword, i) => {
      const angle = (i / nodeCount) * Math.PI * 6;
      const radius = 80 + (i * 10);
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 50;
      const y = Math.sin(angle) * radius * 0.7 + (Math.random() - 0.5) * 50;
      const size = 5 + keyword.weight * 14;
      return { ...keyword, x, y, size, vx: 0, vy: 0 };
    });

    // Run force-directed layout
    const iterations = 150;
    for (let iter = 0; iter < iterations; iter++) {
      // Repulsion
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          let dx = a.x - b.x, dy = a.y - b.y;
          let dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 250) {
            const f = 1200 / (dist * dist);
            const fx = (dx / dist) * f;
            const fy = (dy / dist) * f;
            a.vx += fx; a.vy += fy;
            b.vx -= fx; b.vy -= fy;
          }
        }
      }

      // Attraction for same type
      nodes.forEach((node1, i) => {
        nodes.forEach((node2, j) => {
          if (i >= j) return;
          const sameType = node1.type === node2.type;
          const weightDiff = Math.abs(node1.weight - node2.weight);
          if (sameType || weightDiff < 0.15) {
            let dx = node2.x - node1.x, dy = node2.y - node1.y;
            let dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const targetDist = sameType ? 100 : 150;
            const f = (dist - targetDist) * 0.0003;
            const fx = (dx / dist) * f;
            const fy = (dy / dist) * f;
            node1.vx += fx; node1.vy += fy;
            node2.vx -= fx; node2.vy -= fy;
          }
        });
      });

      // Center gravity
      nodes.forEach(n => {
        n.vx *= 0.75;
        n.vy *= 0.75;
        n.vx -= n.x * 0.003;
        n.vy -= n.y * 0.003;
        n.x += n.vx;
        n.y += n.vy;
      });
    }

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
      timeRef.current += 0.01;
      const time = timeRef.current;
      const nodes = nodesRef.current;
      const { x: camX, y: camY, zoom } = cameraRef.current;

      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid background
      const gridSize = 50 * zoom;
      const gridOffsetX = camX % gridSize;
      const gridOffsetY = camY % gridSize;
      ctx.strokeStyle = "rgba(100, 100, 120, 0.05)";
      ctx.lineWidth = 1;
      for (let x = gridOffsetX; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = gridOffsetY; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw connections
      nodes.forEach((node1, i) => {
        nodes.forEach((node2, j) => {
          if (i >= j) return;
          const sameType = node1.type === node2.type;
          const dx = node2.x - node1.x;
          const dy = node2.y - node1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 200) {
            const x1 = centerX + (node1.x + camX) * zoom;
            const y1 = centerY + (node1.y + camY) * zoom;
            const x2 = centerX + (node2.x + camX) * zoom;
            const y2 = centerY + (node2.y + camY) * zoom;

            if (x1 < -50 || x1 > canvas.width + 50 || y1 < -50 || y1 > canvas.height + 50) return;
            if (x2 < -50 || x2 > canvas.width + 50 || y2 < -50 || y2 > canvas.height + 50) return;

            ctx.beginPath();
            if (sameType && dist > 60) {
              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2;
              const curvature = Math.sin(time * 0.3 + i * 0.1) * 15 * zoom;
              const perpX = -(y2 - y1) / (dist * zoom || 1) * curvature;
              const perpY = (x2 - x1) / (dist * zoom || 1) * curvature;
              ctx.moveTo(x1, y1);
              ctx.quadraticCurveTo(midX + perpX, midY + perpY, x2, y2);
            } else {
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
            }

            const opacity = (1 - dist / 200) * (sameType ? 0.4 : 0.2);
            let edgeColor = typeColors[node1.type] || "#888888";
            if (edgeColor.length === 4) {
              edgeColor = `#${edgeColor[1]}${edgeColor[1]}${edgeColor[2]}${edgeColor[2]}${edgeColor[3]}${edgeColor[3]}`;
            }
            ctx.strokeStyle = sameType
              ? `${edgeColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`
              : `rgba(100, 120, 140, ${opacity * 0.5})`;
            ctx.lineWidth = sameType ? 1.5 * zoom : 0.8 * zoom;
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      nodes.forEach((node, i) => {
        const x = centerX + (node.x + camX) * zoom;
        const y = centerY + (node.y + camY) * zoom;

        if (x < -100 || x > canvas.width + 100 || y < -100 || y > canvas.height + 100) return;

        const pulse = Math.sin(time * 1.5 + node.weight * 8 + i * 0.15) * 0.1 + 1;
        const size = node.size * zoom * pulse;

        // Ensure 6-digit hex color for glow effect
        let color = typeColors[node.type] || "#888888";
        if (color.length === 4) {
          color = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
        }

        // Glow effect
        const glowSize = size * 3;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
        gradient.addColorStop(0, `${color}40`);
        gradient.addColorStop(0.5, `${color}15`);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(x, y, size * 0.95, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Highlight
        ctx.beginPath();
        ctx.arc(x - size * 0.3, y - size * 0.3, size * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.fill();

        // Border for important nodes
        if (node.weight >= 0.75) {
          ctx.beginPath();
          ctx.arc(x, y, size + 3 * zoom, 0, Math.PI * 2);
          ctx.strokeStyle = `${color}80`;
          ctx.lineWidth = 2 * zoom;
          ctx.stroke();
        }

        // Label
        if (node.weight >= 0.7 && zoom > 0.5) {
          const labelText = node.name.slice(0, 16);
          const fontSize = Math.max(10, (node.weight >= 0.85 ? 13 : 11) * zoom);
          ctx.font = `600 ${fontSize}px system-ui, -apple-system, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          const textY = y + size + 14 * zoom;
          const textWidth = ctx.measureText(labelText).width;

          // Background pill
          const paddingX = 5 * zoom;
          const paddingY = 2 * zoom;
          ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
          ctx.beginPath();
          ctx.roundRect(
            x - textWidth / 2 - paddingX,
            textY - fontSize / 2 - paddingY,
            textWidth + paddingX * 2,
            fontSize + paddingY * 2,
            4 * zoom
          );
          ctx.fill();

          // Text with shadow
          ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
          ctx.shadowBlur = 4;
          ctx.fillStyle = "#ffffff";
          ctx.fillText(labelText, x, textY);
          ctx.shadowBlur = 0;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  // Mouse handling
  const getWorldPos = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    return {
      x: (clientX - rect.left - centerX) / cameraRef.current.zoom - cameraRef.current.x,
      y: (clientY - rect.top - centerY) / cameraRef.current.zoom - cameraRef.current.y,
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    setMousePos({ x: clientX, y: clientY });

    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      cameraRef.current.x += dx / cameraRef.current.zoom;
      cameraRef.current.y += dy / cameraRef.current.zoom;
      setDragStart({ x: e.clientX, y: e.clientY });
      setCamera({ ...cameraRef.current });
      return;
    }

    // Find hovered node
    const worldPos = getWorldPos(e.clientX, e.clientY);
    let found = null;
    for (const node of nodesRef.current) {
      const dx = worldPos.x - node.x;
      const dy = worldPos.y - node.y;
      if (Math.sqrt(dx * dx + dy * dy) < node.size + 5) {
        found = node;
        break;
      }
    }
    setHoveredNode(found);
  }, [isDragging, dragStart, getWorldPos]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!hoveredNode) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [hoveredNode]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    if (hoveredNode && !isDragging) {
      const slug = hoveredNode.name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
      window.open(`https://wiki.rosclaw.io/${slug}`, "_blank");
    }
  }, [hoveredNode, isDragging]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.3, Math.min(3, cameraRef.current.zoom * delta));
    cameraRef.current.zoom = newZoom;
    setCamera({ ...cameraRef.current });
  }, []);

  const zoomIn = useCallback(() => {
    cameraRef.current.zoom = Math.min(3, cameraRef.current.zoom * 1.2);
    setCamera({ ...cameraRef.current });
  }, []);

  const zoomOut = useCallback(() => {
    cameraRef.current.zoom = Math.max(0.3, cameraRef.current.zoom / 1.2);
    setCamera({ ...cameraRef.current });
  }, []);

  const resetView = useCallback(() => {
    cameraRef.current = { x: 0, y: 0, zoom: 1 };
    setCamera({ x: 0, y: 0, zoom: 1 });
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[500px] bg-[#0a0a0f] rounded-xl border border-white/10 overflow-hidden">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        onWheel={handleWheel}
        className={`absolute inset-0 w-full h-full ${hoveredNode ? "cursor-pointer" : isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      />

      {/* Tooltip */}
      {hoveredNode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute pointer-events-none z-10 px-3 py-2 rounded-lg bg-black/80 border border-white/20 backdrop-blur-md"
          style={{
            left: Math.min(mousePos.x + 10, (containerRef.current?.clientWidth || 800) - 180),
            top: Math.max(mousePos.y - 60, 10),
          }}
        >
          <p className="font-medium text-white text-sm">{hoveredNode.name}</p>
          <p className="text-xs" style={{ color: typeColors[hoveredNode.type] }}>
            {typeLabels[hoveredNode.type]} · {hoveredNode.pages} pages
          </p>
          <p className="text-xs text-white/50 mt-1">Click to open wiki</p>
        </motion.div>
      )}

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={zoomIn}
          className="p-2 rounded-lg bg-black/60 border border-white/10 text-white/70 hover:bg-black/80 hover:text-white transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={zoomOut}
          className="p-2 rounded-lg bg-black/60 border border-white/10 text-white/70 hover:bg-black/80 hover:text-white transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={resetView}
          className="p-2 rounded-lg bg-black/60 border border-white/10 text-white/70 hover:bg-black/80 hover:text-white transition-colors"
          title="Reset View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 px-2 py-1 rounded bg-black/60 border border-white/10 text-xs text-white/50 font-mono">
        {Math.round(camera.zoom * 100)}%
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 max-w-[70%]">
        {Object.entries(typeLabels).map(([type, label]) => (
          <div
            key={type}
            className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/60 border border-white/10"
          >
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: typeColors[type] }}
            />
            <span className="text-xs text-white/70">{label}</span>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="absolute top-4 left-4 px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-xs text-white/50">
        <div className="flex items-center gap-2">
          <Move className="w-3 h-3" />
          <span>Drag to pan · Scroll to zoom · Click node to open</span>
        </div>
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

interface SearchResult {
  id?: string;
  _id?: string;
  page_id?: string;
  slug?: string;
  file_path?: string;
  title: string;
  content?: string;
  snippet?: string;
  url?: string;
  score: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.rosclaw.io";
const API_KEY_STORAGE_KEY = "rosclaw_api_key";

export default function WikiPage() {
  const [stats, setStats] = useState<WikiStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("hybrid");
  const [showSearchTypeMenu, setShowSearchTypeMenu] = useState(false);

  // User session and API key state
  const [user, setUser] = useState<any>(null);
  const [apiKey, setApiKey] = useState<string>("");

  // Search state
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Check user session and load API key on mount
  useEffect(() => {
    const supabase = getSupabaseClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadApiKey(session.user.email);
      }
    });

    // Also listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadApiKey(session.user.email);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load API key from localStorage, cookie, or exchange via API
  const loadApiKey = async (email?: string) => {
    // First check localStorage
    let key = localStorage.getItem(API_KEY_STORAGE_KEY);

    // If not in localStorage, check cookie
    if (!key) {
      const cookieMatch = document.cookie.match(/rosclaw_api_key=([^;]+)/);
      if (cookieMatch) {
        key = decodeURIComponent(cookieMatch[1]);
        localStorage.setItem(API_KEY_STORAGE_KEY, key);
        // Clear the cookie after reading
        document.cookie = "rosclaw_api_key=; Max-Age=0; path=/";
      }
    }

    if (key) {
      setApiKey(key);
    } else if (email) {
      // Try to exchange email for API key
      await exchangeEmailForApiKey(email);
    }
  };

  const exchangeEmailForApiKey = async (email: string) => {
    try {
      const res = await fetch(`${API_BASE}/wiki/v1/auth/exchange`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.api_key) {
          localStorage.setItem(API_KEY_STORAGE_KEY, data.api_key);
          setApiKey(data.api_key);
        }
      }
    } catch (err) {
      console.error("Failed to exchange for API key:", err);
    }
  };

  useEffect(() => {
    fetch("https://api.rosclaw.io/v1/hub/stats")
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    setSearchError(null);
    setHasSearched(true);

    // Ensure we have the API key (load if not already loaded)
    let currentApiKey = apiKey;
    if (!currentApiKey && user?.email) {
      await loadApiKey(user.email);
      currentApiKey = localStorage.getItem(API_KEY_STORAGE_KEY) || "";
    }

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      if (currentApiKey) headers['X-API-Key'] = currentApiKey;

      const res = await fetch('https://api.rosclaw.io/v1/search', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: searchQuery,
          search_type: searchType,
          top_k: 10
        })
      });

      if (!res.ok) {
        throw new Error(`Search failed: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      // Handle different response formats
      if (Array.isArray(data)) {
        setSearchResults(data);
      } else if (data.results && Array.isArray(data.results)) {
        setSearchResults(data.results);
      } else if (data.data && Array.isArray(data.data)) {
        setSearchResults(data.data);
      } else {
        setSearchResults([]);
      }
    } catch (err: any) {
      setSearchError(err.message || 'Search failed. Please try again.');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
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

          {/* Search Results Panel */}
          {hasSearched && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 rounded-xl bg-black/40 border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white">
                  Search Results
                  {searchResults.length > 0 && (
                    <span className="ml-2 text-xs text-text-muted">({searchResults.length} found)</span>
                  )}
                </h3>
                <button
                  onClick={() => {
                    setHasSearched(false);
                    setSearchResults([]);
                    setSearchError(null);
                  }}
                  className="text-xs text-text-muted hover:text-white transition-colors"
                >
                  Clear
                </button>
              </div>

              {/* Loading State */}
              {searchLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-3 text-text-muted">
                    <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                    Searching...
                  </div>
                </div>
              )}

              {/* Error State */}
              {searchError && !searchLoading && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-red-400 text-sm flex items-center gap-2">
                    <span className="text-lg">⚠️</span>
                    {searchError.includes('API-Key') || searchError.includes('authentication')
                      ? 'API Key required for search'
                      : searchError}
                  </p>
                  {(searchError.includes('API-Key') || searchError.includes('authentication')) ? (
                    <div className="mt-2">
                      {!user ? (
                        <div>
                          <p className="text-text-muted text-xs">
                            Please log in to use the search feature.
                          </p>
                          <a
                            href="/login"
                            className="inline-block mt-2 text-xs text-purple-500 hover:text-purple-400 transition-colors"
                          >
                            Log in →
                          </a>
                        </div>
                      ) : (
                        <p className="text-text-muted text-xs">
                          Unable to load your API key. Please visit your profile to refresh it.
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-text-muted text-xs mt-2">
                      Please check your connection or try again later.
                    </p>
                  )}
                </div>
              )}

              {/* Empty Results */}
              {!searchLoading && !searchError && searchResults.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-text-muted text-sm">No results found for "{searchQuery}"</p>
                  <p className="text-text-muted/60 text-xs mt-2">
                    Try different keywords or search types
                  </p>
                </div>
              )}

              {/* Results List */}
              {!searchLoading && !searchError && searchResults.length > 0 && (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {searchResults.map((result, idx) => {
                    const identifier = result.id || result._id || result.page_id || result.slug || result.file_path;
                    const resultUrl = result.url || (identifier ? `https://wiki.rosclaw.io/${identifier}` : '#');
                    return (
                    <a
                      key={identifier || idx}
                      href={resultUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/30 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors truncate">
                            {result.title || 'Untitled'}
                          </h4>
                          {(result.content || result.snippet) && (
                            <p className="text-xs text-text-muted mt-1 line-clamp-2">
                              {result.content || result.snippet}
                            </p>
                          )}
                        </div>
                        <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-purple-400 flex-shrink-0" />
                      </div>
                      {result.score && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-500 rounded-full"
                              style={{ width: `${Math.min(100, result.score * 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-text-muted">{Math.round(result.score * 100)}%</span>
                        </div>
                      )}
                    </a>
                  )})}
                </div>
              )}
            </motion.div>
          )}

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
                  {Math.min(stats.keywords.length, 80)} keywords
                </span>
              </div>
              <KnowledgeGraph keywords={stats.keywords} />
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 space-y-6"
            >
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Knowledge Base
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    icon={Cpu}
                    value={globalStats?.robots_covered || 0}
                    label="Robot Models"
                    delay={0.15}
                  />
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">
                  Wiki Concept Graph
                </h2>
                <p className="text-xs text-muted-foreground mb-3">
                  Nodes are wiki pages; edges are deduped <code>[[wikilink]]</code> references — what an Obsidian-style graph view shows.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <StatCard
                    icon={Database}
                    value={globalStats?.wiki_graph_nodes || globalStats?.total_pages || 0}
                    label="Concept Nodes"
                    delay={0.2}
                  />
                  <StatCard
                    icon={GitBranch}
                    value={globalStats?.wiki_graph_edges || 0}
                    label="Concept Edges"
                    delay={0.25}
                  />
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">
                  Underlying Code Graph
                </h2>
                <p className="text-xs text-muted-foreground mb-3">
                  Python AST extracted from ingested research repositories. Nodes are modules/classes/functions; edges are imports and calls. <strong>Total</strong> includes generic monorepos (e.g.&nbsp;google-research); <strong>Core</strong> restricts to embodied-AI repos.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard
                    icon={Database}
                    value={globalStats?.total_code_graph_nodes || 0}
                    label="Code Nodes (Total)"
                    delay={0.3}
                    warning={!!globalStats?.total_code_graph_nodes}
                    tooltip="Includes generic monorepos; see Core for embodied-AI subset."
                  />
                  <StatCard
                    icon={GitBranch}
                    value={globalStats?.total_code_graph_edges || 0}
                    label="Code Edges (Total)"
                    delay={0.35}
                    warning={!!globalStats?.total_code_graph_edges}
                    tooltip="Includes generic monorepos; see Core for embodied-AI subset."
                  />
                  <StatCard
                    icon={Database}
                    value={globalStats?.core_code_graph_nodes || 0}
                    label="Code Nodes (Core)"
                    delay={0.4}
                  />
                  <StatCard
                    icon={GitBranch}
                    value={globalStats?.core_code_graph_edges || 0}
                    label="Code Edges (Core)"
                    delay={0.45}
                  />
                </div>
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
                      "https://api.rosclaw.io/v1/search?q=navigation"
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
