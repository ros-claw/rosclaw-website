import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireAdmin } from "@/lib/admin/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(cookies());

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
    const eventType = searchParams.get("event_type");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const admin = getSupabaseAdmin();
    let query = admin
      .from("telemetry_events")
      .select(
        "id, anonymous_installation_id, event_type, command_name, command_status, module_name, rosclaw_version, os_family, created_at, received_at",
        { count: "exact" }
      )
      .order("received_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (eventType) query = query.eq("event_type", eventType);
    if (from) query = query.gte("created_at", from);
    if (to) query = query.lte("created_at", to);

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
