import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { feedbackDeleteRequestSchema } from "@/lib/feedback/schema";

function errorResponse(
  error: string,
  options: { status?: number; details?: string } = {}
) {
  const { status = 400, details } = options;
  const body: Record<string, unknown> = { ok: false, error };
  if (details) body.details = details;
  return NextResponse.json(body, { status });
}

export async function POST(req: NextRequest) {
  try {
    if (req.method !== "POST") {
      return errorResponse("method_not_allowed", { status: 405 });
    }

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return errorResponse("unsupported_media_type", { status: 415 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return errorResponse("invalid_json", { status: 400 });
    }

    const parseResult = feedbackDeleteRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return errorResponse("invalid_schema", {
        status: 400,
        details: parseResult.error.issues.map((i) => i.message).join("; "),
      });
    }

    const { anonymous_installation_id, reason } = parseResult.data;
    const requestId = crypto.randomUUID();

    const admin = getSupabaseAdmin();
    const { error } = await admin.from("feedback_delete_requests").insert({
      id: requestId,
      anonymous_installation_id,
      reason,
      status: "pending",
    });

    if (error) {
      return errorResponse("database_error", {
        status: 500,
        details: error.message,
      });
    }

    return NextResponse.json({
      ok: true,
      request_id: `dr_${requestId}`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "internal_server_error";
    return errorResponse("internal_server_error", { status: 500, details: message });
  }
}
