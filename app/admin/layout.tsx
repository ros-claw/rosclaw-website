"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Shield, AlertCircle } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    // Check if already authenticated in session
    const sessionAuth = sessionStorage.getItem("admin_authenticated");
    if (sessionAuth === "true") {
      setAuthenticated(true);
    }
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const adminKey = process.env.NEXT_PUBLIC_ADMIN_KEY || "";
    if (password === adminKey && adminKey !== "") {
      setAuthenticated(true);
      setAuthError("");
      sessionStorage.setItem("admin_authenticated", "true");
    } else {
      setAuthError("Invalid password");
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    sessionStorage.removeItem("admin_authenticated");
  };

  // Auth screen
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass rounded-2xl p-8 border border-white/10">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-purple-500" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-text-secondary mt-2">Enter admin password to access</p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin password"
                  className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-foreground placeholder:text-text-muted focus:outline-none focus:border-purple-500/50"
                  autoFocus
                />
              </div>

              {authError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-500 font-medium hover:bg-purple-500/20 transition-all"
              >
                <Lock className="w-4 h-4" />
                Access Admin Panel
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <AdminDashboard onLogout={handleLogout}>
      {children}
    </AdminDashboard>
  );
}

function AdminDashboard({
  children,
  onLogout,
}: {
  children: React.ReactNode;
  onLogout: () => void;
}) {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "mcp", label: "MCP Packages", icon: "📦" },
    { id: "skills", label: "Skills", icon: "🛠️" },
    { id: "batch", label: "Batch Sync", icon: "🔄" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-black/20 border-r border-white/10">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Admin</h1>
              <p className="text-xs text-text-muted">Dashboard</p>
            </div>
          </div>

          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                  activeTab === tab.id
                    ? "bg-purple-500/10 text-purple-500 border border-purple-500/20"
                    : "text-text-secondary hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <span>{tab.icon}</span>
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full px-4 py-2 rounded-lg text-sm text-text-muted hover:text-foreground hover:bg-white/5 transition-all"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 pt-6 pb-16 px-8">
        <TabContent activeTab={activeTab} />
      </main>
    </div>
  );
}

function TabContent({ activeTab }: { activeTab: string }) {
  switch (activeTab) {
    case "overview":
      return <OverviewTab />;
    case "mcp":
      return <McpTab />;
    case "skills":
      return <SkillsTab />;
    case "batch":
      return <BatchTab />;
    default:
      return <OverviewTab />;
  }
}

// Overview Tab
function OverviewTab() {
  const [stats, setStats] = useState({
    pendingMcp: 0,
    pendingSkills: 0,
    batchPending: 0,
    health: null as any,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.rosclaw.io";
        const [healthRes, batchRes] = await Promise.all([
          fetch(`${API_BASE}/v1/health`).catch(() => null),
          fetch(`${API_BASE}/wiki/v1/batch/list`).catch(() => null),
        ]);

        const health = healthRes?.ok ? await healthRes.json() : null;
        const batchData = batchRes?.ok ? await batchRes.json() : { batches: [] };

        setStats({
          pendingMcp: 0, // Will be fetched separately
          pendingSkills: 0,
          batchPending: batchData.batches?.filter((b: any) => b.status === "pending").length || 0,
          health,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-foreground mb-6">Dashboard Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Pending MCP"
            value={stats.pendingMcp}
            icon="📦"
            color="cyan"
          />
          <StatCard
            title="Pending Skills"
            value={stats.pendingSkills}
            icon="🛠️"
            color="orange"
          />
          <StatCard
            title="Batch Pending"
            value={stats.batchPending}
            icon="🔄"
            color="purple"
          />
          <StatCard
            title="Wiki Pages"
            value={stats.health?.wiki_pages || 0}
            icon="📄"
            color="green"
          />
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-xl p-6 border border-white/10"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <a
            href="/hub/wiki"
            target="_blank"
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-secondary hover:text-foreground hover:bg-white/10 transition-all text-sm"
          >
            View Wiki Hub
          </a>
          <a
            href="https://api.rosclaw.io/docs"
            target="_blank"
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-secondary hover:text-foreground hover:bg-white/10 transition-all text-sm"
          >
            API Docs
          </a>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    cyan: "bg-cognitive-cyan/10 text-cognitive-cyan border-cognitive-cyan/20",
    orange: "bg-physical-orange/10 text-physical-orange border-physical-orange/20",
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    green: "bg-green-500/10 text-green-500 border-green-500/20",
  };

  return (
    <div className={`p-6 rounded-xl border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}

// MCP Tab
function McpTab() {
  return (
    <div className="h-[calc(100vh-100px)]">
      <iframe
        src="/admin/mcp-iframe"
        className="w-full h-full rounded-xl border border-white/10"
        title="MCP Moderation"
      />
    </div>
  );
}

// Skills Tab
function SkillsTab() {
  return (
    <div className="h-[calc(100vh-100px)]">
      <iframe
        src="/admin/skills-iframe"
        className="w-full h-full rounded-xl border border-white/10"
        title="Skills Moderation"
      />
    </div>
  );
}

// Batch Sync Tab
function BatchTab() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewData, setPreviewData] = useState<any>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.rosclaw.io";

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/wiki/v1/batch/list`);
      if (!res.ok) throw new Error("Failed to fetch batches");
      const data = await res.json();
      setBatches(data.batches || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async (batchId: string) => {
    try {
      const res = await fetch(`${API_BASE}/wiki/v1/batch/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batch_id: batchId }),
      });
      if (!res.ok) throw new Error("Failed to preview");
      const data = await res.json();
      setPreviewData(data);
    } catch (err: any) {
      alert("Preview failed: " + err.message);
    }
  };

  const handleMerge = async (batchId: string) => {
    if (!confirm("Are you sure you want to merge this batch?")) return;

    setProcessing(batchId);
    try {
      const res = await fetch(`${API_BASE}/wiki/v1/batch/merge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batch_id: batchId }),
      });
      if (!res.ok) throw new Error("Failed to merge");
      await fetchBatches();
      setPreviewData(null);
    } catch (err: any) {
      alert("Merge failed: " + err.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (batchId: string) => {
    if (!confirm("Are you sure you want to reject this batch?")) return;

    setProcessing(batchId);
    try {
      const res = await fetch(`${API_BASE}/wiki/v1/batch/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batch_id: batchId }),
      });
      if (!res.ok) throw new Error("Failed to reject");
      await fetchBatches();
    } catch (err: any) {
      alert("Reject failed: " + err.message);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Batch Sync Management</h2>
        <button
          onClick={fetchBatches}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-secondary hover:text-foreground hover:bg-white/10 transition-all text-sm"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </div>
      ) : batches.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          <p className="text-4xl mb-4">📝</p>
          <p>No batch submissions pending</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Batch List */}
          <div className="space-y-4">
            {batches.map((batch) => (
              <div
                key={batch.id}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{batch.batch_name}</h3>
                    <p className="text-sm text-text-muted">Device: {batch.device_id}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      batch.status === "pending"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : batch.status === "merged"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {batch.status}
                  </span>
                </div>

                <p className="text-sm text-text-secondary mb-4">
                  Submitted: {new Date(batch.created_at).toLocaleString()}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handlePreview(batch.id)}
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-text-secondary hover:bg-white/10 transition-all text-sm"
                  >
                    Preview
                  </button>
                  {batch.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleMerge(batch.id)}
                        disabled={processing === batch.id}
                        className="flex-1 px-3 py-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-all text-sm disabled:opacity-50"
                      >
                        {processing === batch.id ? "..." : "Merge"}
                      </button>
                      <button
                        onClick={() => handleReject(batch.id)}
                        disabled={processing === batch.id}
                        className="px-3 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all text-sm disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Preview Panel */}
          <div className="glass rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-foreground mb-4">Preview Changes</h3>
            {previewData ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-black/40">
                  <pre className="text-sm text-text-secondary overflow-auto max-h-96">
                    {JSON.stringify(previewData, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <p className="text-text-muted text-center py-12">
                Select a batch and click Preview to see changes
              </p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
