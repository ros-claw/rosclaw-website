"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Wrench, ExternalLink, Loader2 } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase/client";

interface PendingSkill {
  id: string;
  name: string;
  display_name: string;
  description: string;
  author_name: string;
  author_user_id: string;
  github_repo_url: string;
  category: string;
  version: string;
  tags: string[];
  robot_types: string[];
  created_at: string;
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<PendingSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingSkills();
  }, []);

  const fetchPendingSkills = async () => {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSkills(data || []);
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
        .from("skills")
        .update({ status: "approved" })
        .eq("id", id);

      if (error) throw error;
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      alert("Failed to approve: " + err.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject this skill?")) return;

    setProcessing(id);
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from("skills")
        .update({ status: "rejected" })
        .eq("id", id);

      if (error) throw error;
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      alert("Failed to reject: " + err.message);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-cognitive-cyan" />
      </div>
    );
  }

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
                <Wrench className="w-6 h-6 text-physical-orange" />
                Skill Market Moderation
              </h1>
              <p className="text-text-secondary mt-1">
                Review and approve pending skills
              </p>
            </div>
            <div className="text-sm text-text-muted">
              {skills.length} pending
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
              {error}
            </div>
          )}

          {skills.length === 0 ? (
            <div className="text-center py-12 text-text-muted">
              <Wrench className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No pending skills to review</p>
            </div>
          ) : (
            <div className="space-y-4">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {skill.display_name || skill.name}
                        </h3>
                        <span className="text-sm text-text-muted font-mono">
                          {skill.name}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs bg-yellow-500/10 text-yellow-500">
                          v{skill.version}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs bg-white/10 text-text-secondary">
                          {skill.category}
                        </span>
                      </div>

                      <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                        {skill.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted mb-3">
                        <span>By <span className="text-foreground">{skill.author_name}</span></span>
                        <span className="w-1 h-1 rounded-full bg-text-muted/50" />
                        <span>{new Date(skill.created_at).toLocaleDateString()}</span>
                      </div>

                      {skill.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {skill.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 rounded text-xs bg-white/5 text-text-secondary"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {skill.github_repo_url && (
                        <a
                          href={skill.github_repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-cognitive-cyan hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View on GitHub
                        </a>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleApprove(skill.id)}
                        disabled={processing === skill.id}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-500 hover:bg-green-500/20 transition-all disabled:opacity-50"
                      >
                        {processing === skill.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(skill.id)}
                        disabled={processing === skill.id}
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
