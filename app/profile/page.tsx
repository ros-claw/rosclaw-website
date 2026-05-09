"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Github,
  LogOut,
  Package,
  Wrench,
  ExternalLink,
  Trash2,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  Terminal,
  BarChart3,
} from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase/client";

interface WikiUserInfo {
  user: {
    id: string;
    email: string;
    plan: string;
    created_at: string;
  };
  api_key: string;
  api_key_masked: string;
  usage_today: number;
  daily_limit: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userSkills, setUserSkills] = useState<any[]>([]);
  const [userPackages, setUserPackages] = useState<any[]>([]);
  const [wikiInfo, setWikiInfo] = useState<WikiUserInfo | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        router.push("/login");
        return;
      }
      setUser(session.user);
      setLoading(false);

      // Fetch user's skills and packages
      fetchUserContent(session.user.id);

      // Fetch Wiki user info
      fetchWikiUserInfo(session.access_token);
    });
  }, [router]);

  const fetchUserContent = async (userId: string) => {
    const supabase = getSupabaseClient();

    const [skillsRes, packagesRes] = await Promise.all([
      supabase.from("skills").select("*").eq("author_user_id", userId),
      supabase.from("mcp_packages").select("*").eq("author_user_id", userId),
    ]);

    if (skillsRes.data) setUserSkills(skillsRes.data);
    if (packagesRes.data) setUserPackages(packagesRes.data);
  };

  const fetchWikiUserInfo = async (accessToken: string) => {
    try {
      const res = await fetch("https://api.rosclaw.io/wiki/v1/auth/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setWikiInfo(data);
      }
    } catch (err) {
      console.error("Failed to fetch wiki info:", err);
    }
  };

  const handleCopyApiKey = () => {
    if (wikiInfo?.api_key) {
      navigator.clipboard.writeText(wikiInfo.api_key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDeletePackage = async (pkgId: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;

    try {
      const res = await fetch(`/api/mcp-packages?id=${pkgId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setUserPackages((prev) => prev.filter((p) => p.id !== pkgId));
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete package");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete package");
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    try {
      const res = await fetch(`/api/skills?id=${skillId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setUserSkills((prev) => prev.filter((s) => s.id !== skillId));
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete skill");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete skill");
    }
  };

  const handleSignOut = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-text-secondary">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  const usagePercent = wikiInfo
    ? Math.min((wikiInfo.usage_today / wikiInfo.daily_limit) * 100, 100)
    : 0;

  return (
    <div className="min-h-screen bg-background pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8 border border-white/10"
        >
          {/* Header */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cognitive-cyan to-physical-orange flex items-center justify-center">
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">
                {user.user_metadata?.full_name || user.email?.split("@")[0] || "User"}
              </h1>
              <p className="text-text-secondary">{user.email}</p>
              <div className="flex gap-2 mt-2">
                {user.app_metadata?.provider === "github" && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/5 text-xs text-text-secondary">
                    <Github className="w-3 h-3" />
                    GitHub
                  </span>
                )}
                {wikiInfo?.user.plan && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-purple-500/10 text-xs text-purple-500 border border-purple-500/20 capitalize">
                    {wikiInfo.user.plan} Plan
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-secondary hover:text-foreground hover:bg-white/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          {/* Wiki API Key Section */}
          {wikiInfo && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8 p-6 rounded-xl bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Key className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    ROSClaw Wiki API Key
                  </h2>
                  <p className="text-sm text-text-secondary">
                    用于访问 Wiki API 的知识图谱数据
                  </p>
                </div>
              </div>

              {/* API Key Display */}
              <div className="mb-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-black/40 border border-white/10 font-mono text-sm">
                  <code className="flex-1 text-foreground truncate">
                    {showApiKey ? wikiInfo.api_key : wikiInfo.api_key_masked}
                  </code>
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="p-2 rounded-lg text-text-muted hover:text-foreground hover:bg-white/5 transition-colors"
                    title={showApiKey ? "Hide" : "Show"}
                  >
                    {showApiKey ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={handleCopyApiKey}
                    className="p-2 rounded-lg text-text-muted hover:text-foreground hover:bg-white/5 transition-colors"
                    title="Copy"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Usage Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-text-secondary">今日用量</span>
                  <span className="text-foreground">
                    {wikiInfo.usage_today} / {wikiInfo.daily_limit} 次
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      usagePercent > 80
                        ? "bg-red-500"
                        : usagePercent > 50
                        ? "bg-yellow-500"
                        : "bg-cognitive-cyan"
                    }`}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              </div>

              {/* Code Examples */}
              <div className="space-y-3">
                <p className="text-sm text-text-secondary">使用示例：</p>
                <div className="p-3 rounded-lg bg-black/40 font-mono text-xs overflow-x-auto">
                  <code className="text-text-secondary">
                    <span className="text-purple-500">curl</span>{" "}
                    <span className="text-cognitive-cyan">
                      "https://api.rosclaw.io/wiki/v1/search?q=navigation"
                    </span>{" "}
                    <span className="text-physical-orange">
                      -H "Authorization: Bearer {wikiInfo.api_key.slice(0, 20)}..."
                    </span>
                  </code>
                </div>
              </div>

              {/* Dashboard Link */}
              <div className="mt-4 flex gap-3">
                <a
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-500 text-sm font-medium hover:bg-purple-500/20 transition-all"
                >
                  <BarChart3 className="w-4 h-4" />
                  查看详细用量
                </a>
              </div>
            </motion.div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-text-secondary mb-1">
                <Wrench className="w-4 h-4" />
                <span className="text-sm">Skills Published</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{userSkills.length}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-text-secondary mb-1">
                <Package className="w-4 h-4" />
                <span className="text-sm">MCP Packages</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{userPackages.length}</p>
            </div>
          </div>

          {/* User's Skills */}
          {userSkills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Your Skills</h2>
              <div className="space-y-3">
                {userSkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <a href={`/skills/${skill.id}`} className="flex-1">
                      <p className="font-medium text-foreground">{skill.display_name || skill.name}</p>
                      <p className="text-sm text-text-secondary">{skill.name}</p>
                    </a>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          skill.status === "approved"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-yellow-500/10 text-yellow-500"
                        }`}
                      >
                        {skill.status}
                      </span>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="p-2 rounded text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        title="Delete skill"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <a href={`/skills/${skill.id}`}>
                        <ExternalLink className="w-4 h-4 text-text-muted" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User's Packages */}
          {userPackages.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Your MCP Packages</h2>
              <div className="space-y-3">
                {userPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <a href={`/mcp-hub/${pkg.name}`} className="flex-1">
                      <p className="font-medium text-foreground">{pkg.name}</p>
                      <p className="text-sm text-text-secondary">{pkg.category}</p>
                    </a>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          pkg.status === "approved"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-yellow-500/10 text-yellow-500"
                        }`}
                      >
                        {pkg.status}
                      </span>
                      <button
                        onClick={() => handleDeletePackage(pkg.id)}
                        className="p-2 rounded text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        title="Delete package"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <a href={`/mcp-hub/${pkg.name}`}>
                        <ExternalLink className="w-4 h-4 text-text-muted" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <a
              href="/skills/publish"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-cognitive-cyan/10 border border-cognitive-cyan/30 text-cognitive-cyan font-medium hover:bg-cognitive-cyan/20 transition-all"
            >
              <Wrench className="w-4 h-4 mr-2" />
              Publish Skill
            </a>
            <a
              href="/mcp-hub/publish"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-foreground font-medium hover:bg-white/10 transition-all"
            >
              <Package className="w-4 h-4 mr-2" />
              Publish MCP Package
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
