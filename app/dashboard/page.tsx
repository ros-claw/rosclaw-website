"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  BarChart3,
  Calendar,
  Terminal,
  Activity,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase/client";

interface UsageData {
  status: string;
  usage: {
    total_calls: number;
    total_tokens: number;
    by_endpoint: Record<string, number>;
    daily_breakdown: { date: string; calls: number }[];
    plan: string;
    period_remaining_days: number;
  };
}

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

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState<UsageData | null>(null);
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

      // Fetch usage data
      fetchUsageData(session.access_token);
      fetchWikiUserInfo(session.access_token);
      setLoading(false);
    });
  }, [router]);

  const fetchUsageData = async (accessToken: string) => {
    try {
      const res = await fetch(
        "https://api.rosclaw.io/wiki/v1/usage?days=30",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setUsage(data);
      }
    } catch (err) {
      console.error("Failed to fetch usage:", err);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-text-secondary">Loading...</p>
      </div>
    );
  }

  const usagePercent = wikiInfo
    ? Math.min((wikiInfo.usage_today / wikiInfo.daily_limit) * 100, 100)
    : 0;

  const maxDailyCalls =
    usage?.usage.daily_breakdown.reduce(
      (max, d) => Math.max(max, d.calls),
      0
    ) || 0;

  return (
    <div className="min-h-screen bg-background pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Link>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <BarChart3 className="w-7 h-7 text-purple-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Wiki API Dashboard
              </h1>
              <p className="text-text-secondary">Monitor your API usage and manage your key</p>
            </div>
          </div>
        </motion.div>

        {/* API Key Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 border border-white/10 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Key className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                API Key
              </h2>
              <p className="text-sm text-text-secondary">
                Use this key to authenticate your API requests
              </p>
            </div>
          </div>

          {wikiInfo && (
            <>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-black/40 border border-white/10 font-mono text-sm mb-4">
                <code className="flex-1 text-foreground truncate">
                  {showApiKey ? wikiInfo.api_key : wikiInfo.api_key_masked}
                </code>
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-2 rounded-lg text-text-muted hover:text-foreground hover:bg-white/5 transition-colors"
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
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="p-4 rounded-lg bg-black/40 font-mono text-xs overflow-x-auto">
                <code className="text-text-secondary block">
                  <span className="text-purple-500">curl</span>{" "}
                  <span className="text-cognitive-cyan">
                    "https://api.rosclaw.io/wiki/v1/search?q=navigation"
                  </span>{" "}
                  <span className="text-physical-orange">
                    -H "Authorization: Bearer {wikiInfo.api_key.slice(0, 20)}..."
                  </span>
                </code>
              </div>
            </>
          )}
        </motion.div>

        {/* Stats Grid */}
        {usage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
          >
            <div className="glass rounded-xl p-5 border border-white/10">
              <div className="flex items-center gap-2 text-text-secondary mb-2">
                <Activity className="w-4 h-4" />
                <span className="text-sm">Total Calls (30d)</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {usage.usage.total_calls.toLocaleString()}
              </p>
            </div>

            <div className="glass rounded-xl p-5 border border-white/10">
              <div className="flex items-center gap-2 text-text-secondary mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Total Tokens</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {usage.usage.total_tokens.toLocaleString()}
              </p>
            </div>

            <div className="glass rounded-xl p-5 border border-white/10">
              <div className="flex items-center gap-2 text-text-secondary mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Period Remaining</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {usage.usage.period_remaining_days} days
              </p>
            </div>

            <div className="glass rounded-xl p-5 border border-white/10">
              <div className="flex items-center gap-2 text-text-secondary mb-2">
                <Terminal className="w-4 h-4" />
                <span className="text-sm">Today's Usage</span>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-bold text-foreground">
                  {wikiInfo?.usage_today || 0}
                </p>
                <span className="text-sm text-text-muted mb-1">
                  / {wikiInfo?.daily_limit || 100}
                </span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    usagePercent > 80
                      ? "bg-red-500"
                      : usagePercent > 50
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Daily Usage Chart */}
        {usage?.usage.daily_breakdown && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6 border border-white/10 mb-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Daily Usage (Last 30 Days)
            </h2>
            <div className="h-48 flex items-end gap-1">
              {usage.usage.daily_breakdown.map((day, index) => {
                const height =
                  maxDailyCalls > 0
                    ? (day.calls / maxDailyCalls) * 100
                    : 0;
                return (
                  <div
                    key={day.date}
                    className="flex-1 flex flex-col items-center gap-1 group"
                  >
                    <div className="relative w-full">
                      <div
                        className="w-full bg-cognitive-cyan/30 rounded-t hover:bg-cognitive-cyan/50 transition-colors"
                        style={{ height: `${height}%`, minHeight: 4 }}
                      />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                        {day.date}: {day.calls} calls
                      </div>
                    </div>
                    {index % 5 === 0 && (
                      <span className="text-[10px] text-text-muted">
                        {day.date.slice(5)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Endpoint Usage */}
        {usage?.usage.by_endpoint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-6 border border-white/10"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Usage by Endpoint
            </h2>
            <div className="space-y-3">
              {Object.entries(usage.usage.by_endpoint)
                .sort(([, a], [, b]) => b - a)
                .map(([endpoint, count]) => (
                  <div
                    key={endpoint}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                  >
                    <code className="text-sm text-cognitive-cyan">
                      {endpoint}
                    </code>
                    <span className="text-foreground font-medium">
                      {count.toLocaleString()} calls
                    </span>
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
