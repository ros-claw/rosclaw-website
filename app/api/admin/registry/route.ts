import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { registryAdminActionSchema } from "@/lib/registry/admin-actions";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function authFailure(error: unknown) {
  const message = error instanceof Error ? error.message : "Unauthorized";
  const status = message === "Forbidden" ? 403 : 401;
  return NextResponse.json(
    { ok: false, error: status === 403 ? "Forbidden" : "Unauthorized" },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

function response(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function revalidateRegistry(assetType: "mcp" | "skill") {
  const basePath = assetType === "mcp" ? "/hub/mcps" : "/hub/skills";
  revalidatePath(basePath);
  revalidatePath(`${basePath}/[...id]`, "page");
  revalidatePath("/sitemap.xml");
}

export async function GET() {
  try {
    await requireAdmin(await cookies());
  } catch (error) {
    return authFailure(error);
  }

  try {
    const admin = getSupabaseAdmin();
    const [mcpResult, skillResult] = await Promise.all([
      admin
        .from("mcp_packages")
        .select(
          "id,name,description,author_name,github_repo_url,category,robot_type,version,status,is_verified,manifest_validated_at,manifest_validation_evidence,created_at,updated_at",
        )
        .in("status", ["pending", "approved"])
        .order("created_at", { ascending: false }),
      admin
        .from("skills")
        .select(
          "id,name,display_name,description,author_name,github_repo_url,category,version,status,created_at,updated_at",
        )
        .in("status", ["pending", "approved"])
        .order("created_at", { ascending: false }),
    ]);

    if (mcpResult.error || skillResult.error) {
      console.error(
        "Registry admin load failed:",
        mcpResult.error?.message ?? skillResult.error?.message,
      );
      return response({ ok: false, error: "Failed to load Registry records" }, 500);
    }

    return response({
      ok: true,
      mcpPackages: mcpResult.data ?? [],
      skills: skillResult.data ?? [],
    });
  } catch (error) {
    console.error("Registry admin load failed:", error);
    return response({ ok: false, error: "Failed to load Registry records" }, 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin(await cookies());
  } catch (error) {
    return authFailure(error);
  }

  const origin = req.headers.get("origin");
  if (origin && origin !== req.nextUrl.origin) {
    return response({ ok: false, error: "Cross-origin mutation denied" }, 403);
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return response({ ok: false, error: "Request body must be valid JSON" }, 400);
  }

  const parsed = registryAdminActionSchema.safeParse(payload);
  if (!parsed.success) {
    return response(
      {
        ok: false,
        error: "Invalid Registry action",
        details: parsed.error.flatten(),
      },
      400,
    );
  }

  try {
    const admin = getSupabaseAdmin();
    const action = parsed.data;
    const table = action.assetType === "mcp" ? "mcp_packages" : "skills";

    if (action.action === "attest_manifest") {
      const { data: existing, error: lookupError } = await admin
        .from("mcp_packages")
        .select("id,status")
        .eq("id", action.id)
        .single();
      if (lookupError || !existing) {
        return response({ ok: false, error: "MCP package not found" }, 404);
      }
      if (existing.status !== "approved") {
        return response(
          { ok: false, error: "Only approved MCP packages can be attested" },
          409,
        );
      }

      const validatedAt = new Date().toISOString();
      const { data, error } = await admin
        .from("mcp_packages")
        .update({
          is_verified: true,
          manifest_validated_at: validatedAt,
          manifest_validation_evidence: action.evidence,
        })
        .eq("id", action.id)
        .eq("status", "approved")
        .select(
          "id,status,is_verified,manifest_validated_at,manifest_validation_evidence",
        )
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        return response(
          { ok: false, error: "MCP package is no longer approved" },
          409,
        );
      }
      revalidateRegistry("mcp");
      return response({ ok: true, record: data });
    }

    if (action.action === "revoke_manifest") {
      const { data, error } = await admin
        .from("mcp_packages")
        .update({
          is_verified: false,
          manifest_validated_at: null,
          manifest_validation_evidence: null,
        })
        .eq("id", action.id)
        .select(
          "id,status,is_verified,manifest_validated_at,manifest_validation_evidence",
        )
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        return response({ ok: false, error: "MCP package not found" }, 404);
      }
      revalidateRegistry("mcp");
      return response({ ok: true, record: data });
    }

    const update =
      action.action === "approve"
        ? { status: "approved" }
        : action.assetType === "mcp"
          ? {
              status: "rejected",
              is_verified: false,
              manifest_validated_at: null,
              manifest_validation_evidence: null,
            }
          : { status: "rejected" };
    const { data, error } = await admin
      .from(table)
      .update(update)
      .eq("id", action.id)
      .select("id,status")
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      return response({ ok: false, error: "Registry record not found" }, 404);
    }
    revalidateRegistry(action.assetType);
    return response({ ok: true, record: data });
  } catch (error) {
    console.error("Registry admin mutation failed:", error);
    return response({ ok: false, error: "Registry action failed" }, 500);
  }
}
