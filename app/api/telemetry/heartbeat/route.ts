import { NextRequest, NextResponse } from "next/server";
import { telemetryHeartbeatSchema } from "@/lib/telemetry/schema";
import { findForbiddenField } from "@/lib/telemetry/validators";
import { isHeartbeatRateLimited } from "@/lib/telemetry/rate-limit";
import { ingestTelemetryEvent } from "@/lib/telemetry/ingest";
import { DEFAULT_MAX_EVENT_BYTES } from "@/lib/telemetry/constants";

function errorResponse(
  error: string,
  options: { status?: number; field?: string; details?: string } = {}
) {
  const { status = 400, field, details } = options;
  const body: Record<string, unknown> = { ok: false, error };
  if (field) body.field = field;
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

    const maxBytes = parseInt(
      process.env.ROSCLAW_TELEMETRY_MAX_EVENT_BYTES || String(DEFAULT_MAX_EVENT_BYTES),
      10
    );

    const text = await req.text();
    if (text.length > maxBytes) {
      return errorResponse("payload_too_large", { status: 413 });
    }

    let body: unknown;
    try {
      body = JSON.parse(text);
    } catch {
      return errorResponse("invalid_json", { status: 400 });
    }

    const parseResult = telemetryHeartbeatSchema.safeParse(body);
    if (!parseResult.success) {
      return errorResponse("invalid_schema", {
        status: 400,
        details: parseResult.error.issues.map((i) => i.message).join("; "),
      });
    }

    const event = parseResult.data;

    const forbiddenField = findForbiddenField(body);
    if (forbiddenField) {
      return errorResponse("forbidden_field", { status: 400, field: forbiddenField });
    }

    const rateLimitEnabled = process.env.ROSCLAW_TELEMETRY_RATE_LIMIT_ENABLED !== "false";
    if (rateLimitEnabled && isHeartbeatRateLimited(event.anonymous_installation_id)) {
      return errorResponse("rate_limited", { status: 429 });
    }

    const result = await ingestTelemetryEvent(event);

    if (!result.ok) {
      return errorResponse(result.error, { status: 500, details: result.details });
    }

    return NextResponse.json({ ok: true, request_id: result.request_id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "internal_server_error";
    return errorResponse("internal_server_error", { status: 500, details: message });
  }
}
