import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireAdmin } from "@/lib/admin/auth";
import { aggregateTelemetry } from "@/lib/telemetry/aggregate";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(cookies());

    const { searchParams } = new URL(req.url);
    const day = searchParams.get("day") || undefined;

    await aggregateTelemetry(day);

    return NextResponse.json({ ok: true, aggregated_for: day || "yesterday" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unauthorized";
    const status = message === "Forbidden" ? 403 : 401;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
