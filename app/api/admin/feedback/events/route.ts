import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireAdmin } from "@/lib/admin/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(await cookies());

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
    const category = searchParams.get("category");
    const severity = searchParams.get("severity");

    const admin = getSupabaseAdmin();
    let query = admin
      .from("feedback_events")
      .select(
        "id, batch_id, event_id, category, module, severity, robot_type, skill_id, task_id, provider_type, created_at, received_at",
        { count: "exact" }
      )
      .order("received_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (category) query = query.eq("category", category);
    if (severity) query = query.eq("severity", severity);

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      ok: true,
      events: data || [],
      meta: {
        total: count || 0,
        page,
        limit,
        total_pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unauthorized";
    const status = message === "Forbidden" ? 403 : 401;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
