'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Search, Key, Database, Link2, Scale, Cpu, FileText, CheckCircle } from 'lucide-react';
import WikiGraph from '@/components/WikiGraph';
import { GraphData } from '@/components/WikiGraph/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://api.rosclaw.io';

const searchTypes = [
  { value: 'hybrid', label: 'Hybrid', desc: 'Keyword + Semantic' },
  { value: 'keyword', label: 'Keyword', desc: 'Exact match' },
  { value: 'semantic', label: 'Semantic', desc: 'Synonyms' },
  { value: 'expanded', label: 'Expanded', desc: 'LLM expansion' },
  { value: 'judgment', label: 'Judgment', desc: 'Physical params' },
];

const TYPE_OPTIONS = [
  { value: 'all', label: 'All Types', color: '#94a3b8' },
  { value: 'entity', label: 'Entity', color: '#3b82f6' },
  { value: 'algorithm', label: 'Algorithm', color: '#22c55e' },
  { value: 'concept', label: 'Concept', color: '#f59e0b' },
  { value: 'skill', label: 'Skill', color: '#ec4899' },
];

interface HubStats {
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
}

export default function WikiPage() {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  const [hubStats, setHubStats] = useState<HubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [graphNodeCount, setGraphNodeCount] = useState(0);
  const [graphEdgeCount, setGraphEdgeCount] = useState(0);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('hybrid');
  const [showSearchTypeMenu, setShowSearchTypeMenu] = useState(false);

  // API Key state
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  // Filter state
  const [activeFilter, setActiveFilter] = useState('all');

  // Health status
  const [healthStatus, setHealthStatus] = useState<'online' | 'offline'>('offline');

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [graphRes, statsRes, healthRes] = await Promise.all([
          fetch(`${API_BASE}/wiki/v1/graph`),
          fetch(`${API_BASE}/wiki/v1/hub/stats`),
          fetch(`${API_BASE}/v1/health`).catch(() => null),
        ]);

        if (!graphRes.ok) throw new Error('Failed to load graph data');
        if (!statsRes.ok) throw new Error('Failed to load stats');

        const graph = await graphRes.json();
        const stats = await statsRes.json();

        setGraphData(graph);
        setHubStats(stats);

        if (healthRes?.ok) {
          const health = await healthRes.json();
          setHealthStatus(health.backend === 'seekdb' ? 'online' : 'offline');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Load API key from localStorage
    const savedKey = localStorage.getItem('rosclaw_api_key');
    if (savedKey) setApiKey(savedKey);
  }, []);

  // Save API key
  const saveApiKey = () => {
    localStorage.setItem('rosclaw_api_key', apiKey);
    setShowApiKeyInput(false);
  };

  // Search handler
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (apiKey) headers['X-API-Key'] = apiKey;

    try {
      const res = await fetch(`${API_BASE}/v1/search`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: searchQuery,
          search_type: searchType,
          top_k: 5,
        }),
      });

      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();

      // Focus on first result if found
      if (data.results?.length > 0) {
        const firstId = data.results[0].file_path;
        // The graph component will handle this via focusNode
        // For now, show a toast
        alert(`Found: ${data.results[0].title}`);
      }
    } catch (err: any) {
      alert('Search failed: ' + err.message);
    }
  };

  const globalStats = hubStats?.global_stats;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-text-muted">
          <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          Loading knowledge graph...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load</p>
          <p className="text-text-secondary text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="h-14 bg-[#111827] border-b border-[#1e293b] flex items-center px-4 gap-4 z-50">
        {/* Logo */}
        <Link href="/hub" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-semibold">ROSClaw</span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search wiki..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#0a0e1a] border border-[#1e293b] text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSearchTypeMenu(!showSearchTypeMenu)}
              className="h-full px-3 py-2 rounded-lg bg-[#0a0e1a] border border-[#1e293b] text-white text-sm hover:bg-[#1e293b] transition-colors"
            >
              {searchTypes.find((t) => t.value === searchType)?.label}
            </button>
            {showSearchTypeMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 rounded-lg bg-[#111827] border border-[#1e293b] overflow-hidden z-50">
                {searchTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => {
                      setSearchType(type.value);
                      setShowSearchTypeMenu(false);
                    }}
                    className={`w-full px-3 py-2 text-left hover:bg-[#1e293b] transition-colors ${
                      searchType === type.value ? 'text-purple-500' : 'text-white'
                    }`}
                  >
                    <div className="text-sm font-medium">{type.label}</div>
                    <div className="text-xs text-text-muted">{type.desc}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-500 text-sm font-medium hover:bg-purple-500/20 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* API Key */}
          {showApiKeyInput ? (
            <div className="flex items-center gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="API Key"
                className="w-40 px-3 py-1.5 rounded-lg bg-[#0a0e1a] border border-[#1e293b] text-white text-sm"
              />
              <button
                onClick={saveApiKey}
                className="p-1.5 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowApiKeyInput(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0a0e1a] border border-[#1e293b] text-text-secondary text-sm hover:text-white transition-colors"
            >
              <Key className="w-4 h-4" />
              {apiKey ? 'API Key Set' : 'Set API Key'}
            </button>
          )}

          {/* Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0a0e1a] border border-[#1e293b]">
            <div className={`w-2 h-2 rounded-full ${healthStatus === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-xs text-text-secondary">
              {healthStatus === 'online' ? 'SeekDB Online' : 'Offline'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Stats */}
        <aside className="w-64 bg-[#111827] border-r border-[#1e293b] overflow-y-auto p-4">
          <h2 className="text-lg font-semibold text-white mb-4">Knowledge Base</h2>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <StatBox
              icon={FileText}
              value={globalStats?.total_pages || 0}
              label="Pages"
              color="text-cognitive-cyan"
            />
            <StatBox
              icon={Link2}
              value={globalStats?.total_wikilinks || 0}
              label="Links"
              color="text-cognitive-cyan"
            />
            <StatBox
              icon={Scale}
              value={globalStats?.total_judgments || 0}
              label="Judgments"
              color="text-cognitive-cyan"
            />
            <StatBox
              icon={Database}
              value={graphNodeCount}
              label="Graph Nodes"
              color="text-purple-500"
            />
            <StatBox
              icon={Link2}
              value={graphEdgeCount}
              label="Graph Edges"
              color="text-purple-500"
            />
            <StatBox
              icon={Cpu}
              value={globalStats?.robots_covered || 0}
              label="Robots"
              color="text-cognitive-cyan"
            />
          </div>

          {/* Type Filters */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-white mb-3">Filter by Type</h3>
            <div className="space-y-1">
              {TYPE_OPTIONS.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setActiveFilter(type.value)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                    activeFilter === type.value
                      ? 'bg-white/10 text-white'
                      : 'text-text-secondary hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: type.color }}
                  />
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-text-muted leading-relaxed">
            {hubStats?.description || 'Knowledge graph covering visual language navigation, robot control, physical parameter judgments, and other core embodied AI domains.'}
          </p>

          {globalStats?.last_updated && (
            <p className="text-xs text-text-muted mt-4">
              Updated: {new Date(globalStats.last_updated).toLocaleDateString()}
            </p>
          )}
        </aside>

        {/* Center - Graph */}
        <main className="flex-1 relative bg-[#0a0e1a]">
          <WikiGraph
            data={graphData}
            activeFilter={activeFilter}
            onNodeCountChange={setGraphNodeCount}
            onEdgeCountChange={setGraphEdgeCount}
          />
        </main>
      </div>

      {/* Click outside to close menus */}
      {showSearchTypeMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSearchTypeMenu(false)}
        />
      )}
    </div>
  );
}

function StatBox({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="p-3 rounded-lg bg-[#0a0e1a] border border-[#1e293b]">
      <Icon className={`w-4 h-4 ${color} mb-2`} />
      <p className="text-xl font-bold text-white">{value.toLocaleString()}</p>
      <p className="text-xs text-text-muted">{label}</p>
    </div>
  );
}
