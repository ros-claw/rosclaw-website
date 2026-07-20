import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireAdmin } from "@/lib/admin/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(await cookies());

    const admin = getSupabaseAdmin();

    const [
      { count: totalBatches },
      { count: totalEvents },
      { count: crashes },
      { count: failureStats },
      { count: sandboxBlocks },
      { count: providerPerformance },
      { count: humanFeedback },
    ] = await Promise.all([
      admin.from("feedback_batches").select("id", { count: "exact", head: true }),
      admin.from("feedback_events").select("id", { count: "exact", head: true }),
      admin
        .from("feedback_events")
        .select("id", { count: "exact", head: true })
        .eq("category", "crash_summary"),
      admin
        .from("feedback_events")
        .select("id", { count: "exact", head: true })
        .eq("category", "failure_stats"),
      admin
        .from("feedback_events")
        .select("id", { count: "exact", head: true })
        .eq("category", "sandbox_block"),
      admin
        .from("feedback_events")
        .select("id", { count: "exact", head: true })
        .eq("category", "provider_performance"),
      admin
        .from("feedback_events")
        .select("id", { count: "exact", head: true })
        .eq("category", "human_feedback"),
    ]);

    return NextResponse.json({
      ok: true,
      total_batches: totalBatches ?? 0,
      total_events: totalEvents ?? 0,
      crashes: crashes ?? 0,
      failure_stats: failureStats ?? 0,
      sandbox_blocks: sandboxBlocks ?? 0,
      provider_performance_reports: providerPerformance ?? 0,
      human_feedback: humanFeedback ?? 0,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unauthorized";
    const status = message === "Forbidden" ? 403 : 401;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
