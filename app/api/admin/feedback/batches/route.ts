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

    const admin = getSupabaseAdmin();
    const { data, error, count } = await admin
      .from("feedback_batches")
      .select(
        "id, anonymous_installation_id, event_count, attachment_count, redacted, client_version, status, received_at"
      )
      .order("received_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;

    return NextResponse.json({
      ok: true,
      batches: data || [],
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
