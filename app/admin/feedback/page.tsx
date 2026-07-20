import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { MetricCard } from "@/components/admin/telemetry/metric-card";
import { ChartCard } from "@/components/admin/telemetry/chart-card";
import { DataTable } from "@/components/admin/telemetry/data-table";

export default async function FeedbackAdminPage() {
  try {
    await requireAdmin(await cookies());
  } catch {
    redirect("/login?redirect=/admin/feedback");
  }

  const admin = getSupabaseAdmin();

  const [batchesCount, eventsCount, crashes, failureStats, sandboxBlocks, providerPerf, humanFeedback, recentEvents, batches] = await Promise.all([
    admin.from("feedback_batches").select("id", { count: "exact", head: true }),
    admin.from("feedback_events").select("id", { count: "exact", head: true }),
    admin.from("feedback_events").select("id", { count: "exact", head: true }).eq("category", "crash_summary"),
    admin.from("feedback_events").select("id", { count: "exact", head: true }).eq("category", "failure_stats"),
    admin.from("feedback_events").select("id", { count: "exact", head: true }).eq("category", "sandbox_block"),
    admin.from("feedback_events").select("id", { count: "exact", head: true }).eq("category", "provider_performance"),
    admin.from("feedback_events").select("id", { count: "exact", head: true }).eq("category", "human_feedback"),
    admin
      .from("feedback_events")
      .select(
        "id, event_id, category, module, severity, robot_type, skill_id, created_at, received_at"
      )
      .order("received_at", { ascending: false })
      .limit(20),
    admin
      .from("feedback_batches")
      .select("id, anonymous_installation_id, event_count, attachment_count, status, received_at")
      .order("received_at", { ascending: false })
      .limit(20),
  ]);

  const counts = {
    total_batches: batchesCount.count ?? 0,
    total_events: eventsCount.count ?? 0,
    crashes: crashes.count ?? 0,
    failure_stats: failureStats.count ?? 0,
    sandbox_blocks: sandboxBlocks.count ?? 0,
    provider_performance_reports: providerPerf.count ?? 0,
    human_feedback: humanFeedback.count ?? 0,
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Feedback Admin</h1>
          <p className="text-white/50">Redacted diagnostic bundles and human feedback.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <MetricCard label="Batches" value={counts.total_batches} />
          <MetricCard label="Events" value={counts.total_events} />
          <MetricCard label="Crashes" value={counts.crashes} />
          <MetricCard label="Failures" value={counts.failure_stats} />
          <MetricCard label="Sandbox Blocks" value={counts.sandbox_blocks} />
          <MetricCard label="Provider Reports" value={counts.provider_performance_reports} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Recent Feedback Events">
            <DataTable
              columns={[
                { key: "received_at", label: "Time" },
                { key: "category", label: "Category" },
                { key: "module", label: "Module" },
                { key: "severity", label: "Severity" },
              ]}
              rows={(recentEvents.data || []).map((e) => ({
                received_at: new Date(e.received_at).toLocaleString(),
                category: e.category,
                module: e.module,
                severity: e.severity,
              }))}
            />
          </ChartCard>

          <ChartCard title="Recent Batches">
            <DataTable
              columns={[
                { key: "received_at", label: "Time" },
                { key: "event_count", label: "Events" },
                { key: "attachment_count", label: "Attachments" },
                { key: "status", label: "Status" },
              ]}
              rows={(batches.data || []).map((b) => ({
                received_at: new Date(b.received_at).toLocaleString(),
                event_count: b.event_count,
                attachment_count: b.attachment_count,
                status: b.status,
              }))}
            />
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
