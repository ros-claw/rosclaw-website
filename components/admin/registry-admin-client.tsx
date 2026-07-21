"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Check,
  ExternalLink,
  FileCheck2,
  LogOut,
  MessageSquareText,
  Package,
  RefreshCw,
  Search,
  ShieldOff,
  Wrench,
  X,
} from "lucide-react";
import { normalizePublicHttpsUrl } from "@/lib/security/public-url";
import { getSupabaseClient } from "@/lib/supabase/client";

interface McpAdminRecord {
  id: string;
  name: string;
  description: string | null;
  author_name: string;
  github_repo_url: string | null;
  category: string | null;
  robot_type: string | null;
  version: string;
  status: "pending" | "approved";
  is_verified: boolean;
  manifest_validated_at: string | null;
  manifest_validation_evidence: string | null;
  created_at: string;
}

interface SkillAdminRecord {
  id: string;
  name: string;
  display_name: string | null;
  description: string | null;
  author_name: string;
  github_repo_url: string | null;
  category: string | null;
  version: string;
  status: "pending" | "approved";
  created_at: string;
}

interface RegistryResponse {
  ok: boolean;
  error?: string;
  mcpPackages?: McpAdminRecord[];
  skills?: SkillAdminRecord[];
}

type AssetType = "mcp" | "skill";
type RegistryStatus = "pending" | "approved";

function formatDate(value: string | null) {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function isHttpsUrl(value: string | null): value is string {
  if (!value) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function RegistryAdminClient({ adminEmail }: { adminEmail: string }) {
  const [mcpPackages, setMcpPackages] = useState<McpAdminRecord[]>([]);
  const [skills, setSkills] = useState<SkillAdminRecord[]>([]);
  const [assetType, setAssetType] = useState<AssetType>("mcp");
  const [status, setStatus] = useState<RegistryStatus>("pending");
  const [query, setQuery] = useState("");
  const [evidence, setEvidence] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/registry", { cache: "no-store" });
      const body = (await response.json()) as RegistryResponse;
      if (!response.ok || !body.ok) {
        throw new Error(body.error || "Registry request failed");
      }
      setMcpPackages(body.mcpPackages ?? []);
      setSkills(body.skills ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Registry request failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const mutate = async (payload: Record<string, string>) => {
    const id = payload.id;
    setBusy(id);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/registry", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !body.ok) {
        throw new Error(body.error || "Registry action failed");
      }
      setMessage("Registry record updated");
      setEvidence((current) => ({ ...current, [id]: "" }));
      await load();
    } catch (mutationError) {
      setError(
        mutationError instanceof Error ? mutationError.message : "Registry action failed",
      );
    } finally {
      setBusy(null);
    }
  };

  const signOut = async () => {
    await getSupabaseClient().auth.signOut();
    window.location.assign("/login?redirect=/admin");
  };

  const pendingMcp = mcpPackages.filter((item) => item.status === "pending").length;
  const pendingSkills = skills.filter((item) => item.status === "pending").length;
  const validatedMcp = mcpPackages.filter(
    (item) =>
      item.is_verified &&
      item.manifest_validated_at &&
      item.manifest_validation_evidence,
  ).length;

  const records = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const source = assetType === "mcp" ? mcpPackages : skills;
    return source.filter((item) => {
      if (item.status !== status) return false;
      if (!normalizedQuery) return true;
      return [item.name, item.author_name, item.description, item.category]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [assetType, mcpPackages, query, skills, status]);

  return (
    <main className="min-h-screen bg-background pb-20 pt-24">
      <header className="border-b border-white/10 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="section-kicker">Registry operations</p>
          <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white sm:text-4xl">Moderation and evidence</h1>
              <p className="mt-3 font-mono text-xs text-white/35">{adminEmail}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin/feedback"
                className="focus-ring inline-flex h-10 items-center justify-center gap-2 border border-white/10 px-3 text-sm text-white/50 hover:border-white/20 hover:text-white"
              >
                <MessageSquareText className="h-4 w-4" /> Feedback
              </Link>
              <Link
                href="/admin/telemetry"
                className="focus-ring inline-flex h-10 items-center justify-center gap-2 border border-white/10 px-3 text-sm text-white/50 hover:border-white/20 hover:text-white"
              >
                <Activity className="h-4 w-4" /> Telemetry
              </Link>
              <button
                type="button"
                onClick={load}
                disabled={loading}
                className="focus-ring inline-flex h-10 items-center justify-center gap-2 border border-white/15 px-3 text-sm text-white/60 hover:border-cognitive-cyan/40 hover:text-white disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
              </button>
              <button
                type="button"
                onClick={signOut}
                className="focus-ring inline-flex h-10 items-center justify-center gap-2 border border-white/10 px-3 text-sm text-white/50 hover:border-red-400/25 hover:text-red-300"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </div>

          <dl className="mt-8 grid border border-white/10 bg-[#070a0b] sm:grid-cols-3">
            {[
              ["Pending MCPs", pendingMcp],
              ["Pending Skills", pendingSkills],
              ["Manifest attestations", validatedMcp],
            ].map(([label, value], index) => (
              <div
                key={label}
                className={`p-5 ${index < 2 ? "border-b border-white/10 sm:border-b-0 sm:border-r" : ""}`}
              >
                <dt className="runtime-label">{label}</dt>
                <dd className="mt-2 font-mono text-xl text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2" aria-label="Registry asset type">
              <FilterButton
                active={assetType === "mcp"}
                onClick={() => setAssetType("mcp")}
                icon={Package}
                label="MCP packages"
              />
              <FilterButton
                active={assetType === "skill"}
                onClick={() => setAssetType("skill")}
                icon={Wrench}
                label="Skills"
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex gap-2" aria-label="Registry status">
                <FilterButton
                  active={status === "pending"}
                  onClick={() => setStatus("pending")}
                  label="Pending"
                />
                <FilterButton
                  active={status === "approved"}
                  onClick={() => setStatus("approved")}
                  label="Approved"
                />
              </div>
              <label className="relative block min-w-0 sm:w-72">
                <span className="sr-only">Search Registry records</span>
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search Registry"
                  className="h-10 w-full border border-white/10 bg-[#080b0c] pl-10 pr-3 text-sm text-white placeholder:text-white/25 focus:border-cognitive-cyan/50 focus:outline-none"
                />
              </label>
            </div>
          </div>

          <div className="min-h-8 py-4 text-sm" aria-live="polite">
            {error && <p className="text-red-400">{error}</p>}
            {!error && message && <p className="text-cognitive-cyan">{message}</p>}
            {!error && !message && (
              <p className="font-mono text-[10px] uppercase text-white/30">
                {loading ? "Loading" : `${records.length.toLocaleString()} records`}
              </p>
            )}
          </div>

          {!loading && records.length === 0 ? (
            <div className="border border-white/10 bg-[#080b0c] px-6 py-16 text-center text-sm text-white/40">
              No records in this view.
            </div>
          ) : (
            <div className="divide-y divide-white/10 border border-white/10 bg-[#080b0c]">
              {records.map((record) =>
                assetType === "mcp" ? (
                  <McpRow
                    key={record.id}
                    record={record as McpAdminRecord}
                    evidence={evidence[record.id] ?? ""}
                    setEvidence={(value) =>
                      setEvidence((current) => ({ ...current, [record.id]: value }))
                    }
                    busy={busy === record.id}
                    mutate={mutate}
                  />
                ) : (
                  <SkillRow
                    key={record.id}
                    record={record as SkillAdminRecord}
                    busy={busy === record.id}
                    mutate={mutate}
                  />
                ),
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function FilterButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon?: typeof Package;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`focus-ring inline-flex h-10 items-center gap-2 border px-4 text-sm ${
        active
          ? "border-cognitive-cyan/45 bg-cognitive-cyan/[0.07] text-cognitive-cyan"
          : "border-white/10 text-white/45 hover:border-white/20 hover:text-white"
      }`}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {label}
    </button>
  );
}

function RecordHeader({
  name,
  description,
  author,
  version,
  source,
}: {
  name: string;
  description: string | null;
  author: string;
  version: string;
  source: string | null;
}) {
  const safeSource = normalizePublicHttpsUrl(source);

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h2 className="break-words font-mono text-sm font-medium text-white">{name}</h2>
        <span className="font-mono text-[10px] text-white/30">v{version}</span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/42">
        {description || "No description provided."}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-white/30">
        <span>{author}</span>
        {safeSource && (
          <a
            href={safeSource}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center gap-1.5 hover:text-cognitive-cyan"
          >
            Source <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}

function ApprovalActions({
  assetType,
  id,
  busy,
  mutate,
}: {
  assetType: AssetType;
  id: string;
  busy: boolean;
  mutate: (payload: Record<string, string>) => Promise<void>;
}) {
  return (
    <div className="flex flex-wrap gap-2 md:justify-end">
      <button
        type="button"
        disabled={busy}
        onClick={() => mutate({ action: "approve", assetType, id })}
        className="focus-ring inline-flex h-9 items-center gap-2 border border-emerald-400/30 px-3 text-sm text-emerald-300 hover:bg-emerald-400/[0.06] disabled:opacity-50"
      >
        <Check className="h-4 w-4" /> Approve
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => {
          if (window.confirm("Reject this Registry record?")) {
            mutate({ action: "reject", assetType, id });
          }
        }}
        className="focus-ring inline-flex h-9 items-center gap-2 border border-red-400/25 px-3 text-sm text-red-300 hover:bg-red-400/[0.06] disabled:opacity-50"
      >
        <X className="h-4 w-4" /> Reject
      </button>
    </div>
  );
}

function McpRow({
  record,
  evidence,
  setEvidence,
  busy,
  mutate,
}: {
  record: McpAdminRecord;
  evidence: string;
  setEvidence: (value: string) => void;
  busy: boolean;
  mutate: (payload: Record<string, string>) => Promise<void>;
}) {
  const validated = Boolean(
    record.is_verified &&
      record.manifest_validated_at &&
      record.manifest_validation_evidence,
  );

  return (
    <article className="grid min-w-0 gap-5 p-5 md:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] md:p-6">
      <RecordHeader
        name={record.name}
        description={record.description}
        author={record.author_name}
        version={record.version}
        source={record.github_repo_url}
      />
      {record.status === "pending" ? (
        <ApprovalActions assetType="mcp" id={record.id} busy={busy} mutate={mutate} />
      ) : validated ? (
        <div className="min-w-0 border-l border-cognitive-cyan/25 pl-4">
          <div className="flex items-center gap-2 text-sm text-cognitive-cyan">
            <FileCheck2 className="h-4 w-4" /> Manifest validated
          </div>
          <p className="mt-2 text-xs text-white/35">{formatDate(record.manifest_validated_at)}</p>
          {isHttpsUrl(record.manifest_validation_evidence) ? (
            <a
              href={record.manifest_validation_evidence}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring mt-2 inline-flex max-w-full items-center gap-1.5 break-all text-xs text-white/50 hover:text-cognitive-cyan"
            >
              Evidence <ExternalLink className="h-3.5 w-3.5 flex-none" />
            </a>
          ) : (
            <p className="mt-2 break-all text-xs text-white/45">
              {record.manifest_validation_evidence}
            </p>
          )}
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              if (window.confirm("Revoke this Manifest attestation?")) {
                mutate({ action: "revoke_manifest", assetType: "mcp", id: record.id });
              }
            }}
            className="focus-ring mt-4 inline-flex h-8 items-center gap-2 border border-white/10 px-3 text-xs text-white/45 hover:border-red-400/25 hover:text-red-300 disabled:opacity-50"
          >
            <ShieldOff className="h-3.5 w-3.5" /> Revoke
          </button>
        </div>
      ) : (
        <div className="min-w-0">
          <label className="block">
            <span className="runtime-label">Manifest evidence URL</span>
            <input
              type="url"
              value={evidence}
              onChange={(event) => setEvidence(event.target.value)}
              placeholder="https://github.com/.../actions/runs/..."
              className="mt-2 h-10 w-full border border-white/10 bg-black/25 px-3 text-xs text-white placeholder:text-white/20 focus:border-cognitive-cyan/45 focus:outline-none"
            />
          </label>
          <button
            type="button"
            disabled={busy || !evidence.trim()}
            onClick={() =>
              mutate({
                action: "attest_manifest",
                assetType: "mcp",
                id: record.id,
                evidence,
              })
            }
            className="focus-ring mt-3 inline-flex h-9 items-center gap-2 border border-cognitive-cyan/30 px-3 text-sm text-cognitive-cyan hover:bg-cognitive-cyan/[0.06] disabled:opacity-40"
          >
            <FileCheck2 className="h-4 w-4" /> Record attestation
          </button>
        </div>
      )}
    </article>
  );
}

function SkillRow({
  record,
  busy,
  mutate,
}: {
  record: SkillAdminRecord;
  busy: boolean;
  mutate: (payload: Record<string, string>) => Promise<void>;
}) {
  return (
    <article className="grid min-w-0 gap-5 p-5 md:grid-cols-[minmax(0,1fr)_auto] md:p-6">
      <RecordHeader
        name={record.display_name || record.name}
        description={record.description}
        author={record.author_name}
        version={record.version}
        source={record.github_repo_url}
      />
      {record.status === "pending" ? (
        <ApprovalActions assetType="skill" id={record.id} busy={busy} mutate={mutate} />
      ) : (
        <div className="inline-flex items-center gap-2 self-start font-mono text-[10px] uppercase text-white/35">
          <Check className="h-3.5 w-3.5" /> Approved
        </div>
      )}
    </article>
  );
}
