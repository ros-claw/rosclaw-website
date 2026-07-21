import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireAdmin } from "@/lib/admin/auth";
import { isAdminApiKey } from "@/lib/api-key";
import { aggregateTelemetry } from "@/lib/telemetry/aggregate";

async function isAuthorized(req: NextRequest): Promise<boolean> {
  const apiKey = req.headers.get("x-api-key");
  if (isAdminApiKey(apiKey)) {
    return true;
  }

  try {
    await requireAdmin(await cookies());
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAuthorized(req))) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const day = searchParams.get("day") || undefined;

    await aggregateTelemetry(day);

    return NextResponse.json({ ok: true, aggregated_for: day || "yesterday" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "internal_server_error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
