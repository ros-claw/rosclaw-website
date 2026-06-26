import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireAdmin } from "@/lib/admin/auth";
import { getSummaryMetrics } from "@/lib/telemetry/aggregate";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(cookies());

    const admin = getSupabaseAdmin();

    const [
      summary,
      { count: totalInstalls },
      { count: totalEvents },
      topCommandsResult,
      versionResult,
      osResult,
    ] = await Promise.all([
      getSummaryMetrics(),
      admin
        .from("telemetry_installations")
        .select("anonymous_installation_id", { count: "exact", head: true }),
      admin.from("telemetry_events").select("id", { count: "exact", head: true }),
      admin
        .from("telemetry_events")
        .select("command_name")
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

    const topCommands = countBy(
      (topCommandsResult.data || []).map((r) => r.command_name!)
    );
    const versionDistribution = countBy(
      (versionResult.data || []).map((r) => r.latest_rosclaw_version!)
    );
    const osDistribution = countBy((osResult.data || []).map((r) => r.os_family!));

    return NextResponse.json({
      ok: true,
      total_installs: totalInstalls ?? summary.total_installs ?? 0,
      dau: summary.daily_active_installs,
      wau: summary.weekly_active_installs,
      mau: summary.monthly_active_installs,
      firstboot_completion_rate: summary.firstboot_completion_rate,
      doctor_success_rate: summary.doctor_success_rate,
      top_commands: Object.entries(topCommands)
        .map(([command_name, count]) => ({ command_name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      version_distribution: Object.entries(versionDistribution)
        .map(([rosclaw_version, count]) => ({ rosclaw_version, count }))
        .sort((a, b) => b.count - a.count),
      os_distribution: Object.entries(osDistribution)
        .map(([os_family, count]) => ({ os_family, count }))
        .sort((a, b) => b.count - a.count),
      robot_type_distribution: summary.robot_type_distribution,
      ros_distro_distribution: summary.ros_distro_distribution,
      cuda_available_count: summary.cuda_available_count,
      cuda_unavailable_count: summary.cuda_unavailable_count,
      os_version_distribution: summary.os_version_distribution,
      gpu_info_distribution: summary.gpu_info_distribution,
      sensor_type_adoption: summary.sensor_type_adoption,
      total_events: totalEvents ?? 0,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unauthorized";
    const status = message === "Forbidden" ? 403 : 401;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

function countBy(values: string[]): Record<string, number> {
  return values.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}
