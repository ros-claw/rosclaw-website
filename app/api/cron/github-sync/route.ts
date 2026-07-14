import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { syncGitHubRegistry } from "@/lib/github/registry-sync";

export const dynamic = "force-dynamic";
export const maxDuration = 300;
export const runtime = "nodejs";

function secretsMatch(candidate: string | null, expected: string | undefined): boolean {
  if (!candidate || !expected) return false;

  const candidateBuffer = Buffer.from(candidate);
  const expectedBuffer = Buffer.from(expected);
  return (
    candidateBuffer.length === expectedBuffer.length &&
    timingSafeEqual(candidateBuffer, expectedBuffer)
  );
}

function isAuthorized(request: NextRequest): boolean {
  const authorization = request.headers.get("authorization");
  const cronSecret = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;
  const adminApiKey = request.headers.get("x-api-key");

  return (
    secretsMatch(cronSecret, process.env.CRON_SECRET) ||
    secretsMatch(adminApiKey, process.env.ADMIN_API_KEY)
  );
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const force = request.nextUrl.searchParams.get("force") === "1";
    const result = await syncGitHubRegistry({ force });

    return NextResponse.json(
      { ok: result.failed === 0, ...result },
      { status: result.failed > 0 ? 207 : 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("[github-sync] Cron failed:", error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
