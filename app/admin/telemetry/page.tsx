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
    await requireAdmin(await cookies());
  } catch {
    redirect("/login?redirect=/admin/telemetry");
  }

  const admin = getSupabaseAdmin();

  const [
    summary,
    recentEvents,
    topCommandsRaw,
    versionDist,
    osDist,
    robotTypeDist,
    rosDistroDist,
    cudaDist,
    gpuDist,
    osVersionDist,
    sensorDist,
  ] = await Promise.all([
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
    admin
      .from("telemetry_events")
      .select("payload->>robot_type")
      .eq("event_type", "firstboot_completed")
      .not("payload->>robot_type", "is", null)
      .limit(1000),
    admin
      .from("telemetry_events")
      .select("payload->>ros_distro_present")
      .eq("event_type", "firstboot_completed")
      .not("payload->>ros_distro_present", "is", null)
      .limit(1000),
    admin
      .from("telemetry_events")
      .select("payload->>cuda_available, anonymous_installation_id")
      .eq("event_type", "firstboot_completed")
      .not("payload->>cuda_available", "is", null)
      .limit(1000),
    admin
      .from("telemetry_events")
      .select("payload->>gpu_info, anonymous_installation_id")
      .eq("event_type", "firstboot_completed")
      .not("payload->>gpu_info", "is", null)
      .limit(1000),
    admin
      .from("telemetry_events")
      .select("payload->>os_version")
      .eq("event_type", "firstboot_completed")
      .not("payload->>os_version", "is", null)
      .limit(1000),
    admin
      .from("telemetry_events")
      .select("payload->sensor_types")
      .not("payload->sensor_types", "is", null)
      .limit(1000),
  ]);

  const commandStats = aggregateCommandStats(topCommandsRaw.data || []);
  const versionData = countDistribution(versionDist.data?.map((d) => d.latest_rosclaw_version) || []);
  const osData = countDistribution(osDist.data?.map((d) => d.os_family) || []);
  const robotTypeData = countDistribution(
    (robotTypeDist.data || []).map((d) => d.robot_type)
  );
  const rosDistroData = countDistribution(
    (rosDistroDist.data || []).map((d) => d.ros_distro_present)
  );
  const osVersionData = countDistribution(
    (osVersionDist.data || []).map((d) => d.os_version)
  );
  const cudaData = buildCudaDistribution(
    (cudaDist.data || []) as { anonymous_installation_id: string; cuda_available: unknown }[]
  );
  const gpuTopData = buildGpuTopList(
    (gpuDist.data || []) as { anonymous_installation_id: string; gpu_info: string | null }[]
  );
  const sensorData = buildSensorDistribution(
    (sensorDist.data || []) as { sensor_types: unknown }[]
  );

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

        <TelemetryCharts
          versionData={versionData}
          osData={osData}
          robotTypeData={robotTypeData}
          rosDistroData={rosDistroData}
          cudaData={cudaData}
          gpuTopData={gpuTopData}
          osVersionData={osVersionData}
          sensorData={sensorData}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="GPU Top List">
            <DataTable
              columns={[
                { key: "rank", label: "Rank" },
                { key: "name", label: "GPU" },
                { key: "value", label: "Installs" },
              ]}
              rows={gpuTopData.map((g, i) => ({
                rank: i + 1,
                name: g.name,
                value: g.value,
              }))}
            />
          </ChartCard>

          <ChartCard title="Sensor Adoption">
            <DataTable
              columns={[
                { key: "name", label: "Sensor Type" },
                { key: "value", label: "Appearances" },
              ]}
              rows={sensorData}
            />
          </ChartCard>
        </div>

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

function countDistribution(values: (string | null | undefined)[]) {
  const counts: Record<string, number> = {};
  for (const v of values) {
    if (!v) continue;
    counts[v] = (counts[v] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function buildCudaDistribution(
  rows: { anonymous_installation_id: string; cuda_available: unknown }[]
): { name: string; value: number }[] {
  const available = new Set<string>();
  const unavailable = new Set<string>();
  for (const row of rows) {
    const value = row.cuda_available;
    const boolValue = value === true || value === "true";
    if (boolValue) {
      available.add(row.anonymous_installation_id);
    } else {
      unavailable.add(row.anonymous_installation_id);
    }
  }
  return [
    { name: "Available", value: available.size },
    { name: "Unavailable", value: unavailable.size },
  ].filter((d) => d.value > 0);
}

function buildGpuTopList(
  rows: { anonymous_installation_id: string; gpu_info: string | null }[]
): { name: string; value: number }[] {
  const map = new Map<string, Set<string>>();
  for (const row of rows) {
    const gpu = row.gpu_info;
    if (!gpu) continue;
    const set = map.get(gpu) || new Set<string>();
    set.add(row.anonymous_installation_id);
    map.set(gpu, set);
  }
  return Array.from(map.entries())
    .map(([name, ids]) => ({ name, value: ids.size }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
}

function buildSensorDistribution(
  rows: { sensor_types: unknown }[]
): { name: string; value: number }[] {
  const counts: Record<string, number> = {};
  for (const row of rows) {
    const sensors = row.sensor_types;
    if (!Array.isArray(sensors)) continue;
    for (const sensor of sensors) {
      if (typeof sensor !== "string") continue;
      counts[sensor] = (counts[sensor] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}
