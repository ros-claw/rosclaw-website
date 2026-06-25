import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { getSummaryMetrics } from "@/lib/telemetry/aggregate";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { MetricCard } from "@/components/admin/telemetry/metric-card";
import { ChartCard } from "@/components/admin/telemetry/chart-card";
import { DataTable } from "@/components/admin/telemetry/data-table";
import { TelemetryCharts } from "@/components/admin/telemetry/charts";

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export default async function TelemetryAdminPage() {
  try {
    await requireAdmin(cookies());
  } catch {
    redirect("/login?redirect=/admin/telemetry");
  }

  const admin = getSupabaseAdmin();

  const [summary, recentEvents, topCommandsRaw, versionDist, osDist] = await Promise.all([
    getSummaryMetrics(),
    admin
      .from("telemetry_events")
      .select(
        "received_at, event_type, command_name, command_status, anonymous_installation_id, rosclaw_version"
      )
      .order("received_at", { ascending: false })
      .limit(20),
    admin
      .from("telemetry_events")
      .select("command_name, command_status")
      .eq("event_type", "command_completed")
      .not("command_name", "is", null)
      .limit(1000),
    admin
      .from("telemetry_installations")
      .select("latest_rosclaw_version")
      .not("latest_rosclaw_version", "is", null)
      .limit(1000),
    admin
      .from("telemetry_installations")
      .select("os_family")
      .not("os_family", "is", null)
      .limit(1000),
  ]);

  const commandStats = aggregateCommandStats(topCommandsRaw.data || []);
  const versionData = countDistribution(versionDist.data?.map((d) => d.latest_rosclaw_version) || []);
  const osData = countDistribution(osDist.data?.map((d) => d.os_family) || []);

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Telemetry Admin</h1>
          <p className="text-white/50">Product metrics and anonymous usage signals.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <MetricCard label="Total Installs" value={summary.total_installs as number} />
          <MetricCard label="DAU" value={summary.daily_active_installs as number} />
          <MetricCard label="WAU" value={summary.weekly_active_installs as number} />
          <MetricCard label="MAU" value={summary.monthly_active_installs as number} />
          <MetricCard
            label="Firstboot Rate"
            value={formatPercent(summary.firstboot_completion_rate as number)}
          />
          <MetricCard
            label="Doctor Success"
            value={formatPercent(summary.doctor_success_rate as number)}
          />
        </div>

        <TelemetryCharts versionData={versionData} osData={osData} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Command Reliability">
            <DataTable
              columns={[
                { key: "command_name", label: "Command" },
                { key: "total", label: "Total" },
                { key: "failures", label: "Failures" },
                { key: "rate", label: "Failure Rate" },
              ]}
              rows={commandStats.map((c) => ({
                command_name: c.command_name,
                total: c.total,
                failures: c.failures,
                rate: formatPercent(c.failure_rate),
              }))}
            />
          </ChartCard>

          <ChartCard title="Recent Events">
            <DataTable
              columns={[
                { key: "received_at", label: "Time" },
                { key: "event_type", label: "Event" },
                { key: "command_name", label: "Command" },
                { key: "command_status", label: "Status" },
              ]}
              rows={(recentEvents.data || []).map((e) => ({
                received_at: new Date(e.received_at).toLocaleString(),
                event_type: e.event_type,
                command_name: e.command_name,
                command_status: e.command_status,
              }))}
            />
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

function aggregateCommandStats(
  rows: { command_name: string | null; command_status: string | null }[]
) {
  const map = new Map<string, { total: number; failures: number }>();
  for (const row of rows) {
    if (!row.command_name) continue;
    const current = map.get(row.command_name) || { total: 0, failures: 0 };
    current.total += 1;
    if (row.command_status === "failure") current.failures += 1;
    map.set(row.command_name, current);
  }
  return Array.from(map.entries())
    .map(([command_name, stats]) => ({
      command_name,
      total: stats.total,
      failures: stats.failures,
      failure_rate: stats.total === 0 ? 0 : stats.failures / stats.total,
    }))
    .sort((a, b) => b.total - a.total);
}

function countDistribution(values: (string | null)[]) {
  const counts: Record<string, number> = {};
  for (const v of values) {
    if (!v) continue;
    counts[v] = (counts[v] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}
