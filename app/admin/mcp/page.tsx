"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Package, ExternalLink, Loader2, Lock } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase/client";

interface PendingPackage {
  id: string;
  name: string;
  description: string;
  author_name: string;
  author_user_id: string;
  github_repo_url: string;
  category: string;
  robot_type: string;
  version: string;
  tags: string[];
  tools: any[];
  created_at: string;
}

export default function AdminMcpPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [packages, setPackages] = useState<PendingPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (authenticated) {
      fetchPendingPackages();
    }
  }, [authenticated]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Check against ADMIN_API_KEY from env (injected at build time)
    const adminKey = process.env.NEXT_PUBLIC_ADMIN_KEY || "";
    if (password === adminKey && adminKey !== "") {
      setAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid password");
    }
  };

  const fetchPendingPackages = async () => {
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("mcp_packages")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPackages(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setProcessing(id);
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from("mcp_packages")
        .update({ status: "approved", is_verified: true })
        .eq("id", id);

      if (error) throw error;
      setPackages((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert("Failed to approve: " + err.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject this package?")) return;

    setProcessing(id);
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from("mcp_packages")
        .update({ status: "rejected" })
        .eq("id", id);

      if (error) throw error;
      setPackages((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert("Failed to reject: " + err.message);
    } finally {
      setProcessing(null);
    }
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
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cognitive-cyan/10 flex items-center justify-center">
                <Lock className="w-8 h-8 text-cognitive-cyan" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Admin Access</h1>
              <p className="text-text-secondary mt-2">Enter admin password to continue</p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin password"
                  className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-foreground placeholder:text-text-muted focus:outline-none focus:border-cognitive-cyan/50"
                  autoFocus
                />
              </div>

              {authError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full px-4 py-3 rounded-lg bg-cognitive-cyan/10 border border-cognitive-cyan/30 text-cognitive-cyan font-medium hover:bg-cognitive-cyan/20 transition-all"
              >
                Access Admin Panel
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // Main content
  return (
    <div className="min-h-screen bg-background pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8 border border-white/10"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <Package className="w-6 h-6 text-cognitive-cyan" />
                MCP Package Moderation
              </h1>
              <p className="text-text-secondary mt-1">
                Review and approve pending MCP packages
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-text-muted">
                {packages.length} pending
              </span>
              <button
                onClick={() => setAuthenticated(false)}
                className="text-sm text-text-muted hover:text-foreground"
              >
                Logout
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-cognitive-cyan" />
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-12 text-text-muted">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No pending packages to review</p>
            </div>
          ) : (
            <div className="space-y-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {pkg.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded text-xs bg-yellow-500/10 text-yellow-500">
                          v{pkg.version}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs bg-white/10 text-text-secondary">
                          {pkg.category}
                        </span>
                      </div>

                      <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                        {pkg.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted mb-3">
                        <span>By <span className="text-foreground">{pkg.author_name}</span></span>
                        <span className="w-1 h-1 rounded-full bg-text-muted/50" />
                        <span>{pkg.robot_type}</span>
                        <span className="w-1 h-1 rounded-full bg-text-muted/50" />
                        <span>{new Date(pkg.created_at).toLocaleDateString()}</span>
                      </div>

                      {pkg.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {pkg.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 rounded text-xs bg-white/5 text-text-secondary"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <a
                        href={pkg.github_repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-cognitive-cyan hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View on GitHub
                      </a>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleApprove(pkg.id)}
                        disabled={processing === pkg.id}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-500 hover:bg-green-500/20 transition-all disabled:opacity-50"
                      >
                        {processing === pkg.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(pkg.id)}
                        disabled={processing === pkg.id}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 transition-all disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
