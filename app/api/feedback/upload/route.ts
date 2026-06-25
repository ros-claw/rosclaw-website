import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { feedbackUploadFormSchema } from "@/lib/feedback/schema";
import { parseBundle } from "@/lib/feedback/parser";
import { uploadBundle, uploadAttachment } from "@/lib/feedback/storage";
import { FEEDBACK_BUCKET_NAMES } from "@/lib/feedback/constants";
import { DEFAULT_MAX_BUNDLE_MB } from "@/lib/telemetry/constants";

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
    if (!contentType.includes("multipart/form-data")) {
      return errorResponse("unsupported_media_type", { status: 415 });
    }

    const maxBundleMb = parseInt(
      process.env.ROSCLAW_FEEDBACK_MAX_BUNDLE_MB || String(DEFAULT_MAX_BUNDLE_MB),
      10
    );
    const maxBundleBytes = maxBundleMb * 1024 * 1024;

    const formData = await req.formData();
    const bundleFile = formData.get("bundle");

    if (!bundleFile || !(bundleFile instanceof File)) {
      return errorResponse("missing_bundle", { status: 400 });
    }

    if (bundleFile.size > maxBundleBytes) {
      return errorResponse("bundle_too_large", { status: 413 });
    }

    const fields: Record<string, string> = {};
    Array.from(formData.entries()).forEach(([key, value]) => {
      if (typeof value === "string") {
        fields[key] = value;
      }
    });

    const fieldResult = feedbackUploadFormSchema.safeParse(fields);
    if (!fieldResult.success) {
      return errorResponse("invalid_form", {
        status: 400,
        details: fieldResult.error.issues.map((i) => i.message).join("; "),
      });
    }

    const form = fieldResult.data;

    const redacted =
      typeof form.redacted === "boolean"
        ? form.redacted
        : form.redacted === "true";

    const requireRedact = process.env.ROSCLAW_FEEDBACK_REQUIRE_REDACT !== "false";
    if (requireRedact && !redacted) {
      return errorResponse("redaction_required", { status: 400 });
    }

    const bundleBuffer = Buffer.from(await bundleFile.arrayBuffer());
    const parsed = await parseBundle(bundleBuffer);

    if (parsed.manifest.anonymous_installation_id !== form.anonymous_installation_id) {
      return errorResponse("anonymous_id_mismatch", {
        status: 400,
        details: "manifest anonymous_installation_id does not match form field",
      });
    }

    const batchId = crypto.randomUUID();

    // Upload bundle to storage
    await uploadBundle(form.anonymous_installation_id, batchId, bundleBuffer);

    const admin = getSupabaseAdmin();

    // Insert batch
    const { error: batchError } = await admin.from("feedback_batches").insert({
      id: batchId,
      anonymous_installation_id: form.anonymous_installation_id,
      schema_version: form.schema_version,
      event_count: parsed.events.length,
      attachment_count: parsed.attachments.length,
      redacted,
      client_version: form.client_version,
      status: "received",
      privacy_level: parsed.manifest.privacy_level,
      redaction_report: {},
    });

    if (batchError) {
      return errorResponse("database_error", {
        status: 500,
        details: batchError.message,
      });
    }

    // Insert events
    if (parsed.events.length > 0) {
      const { error: eventsError } = await admin.from("feedback_events").insert(
        parsed.events.map((event) => ({
          batch_id: batchId,
          event_id: event.event_id,
          anonymous_installation_id: form.anonymous_installation_id,
          schema_version: event.schema_version,
          category: event.category,
          module: event.module,
          severity: event.severity,
          rosclaw_version: event.rosclaw_version,
          robot_type: event.robot_type,
          skill_id: event.skill_id,
          task_id: event.task_id,
          provider_type: event.provider_type,
          created_at: event.created_at,
          privacy_level: event.privacy_level,
          redacted: event.redacted,
          payload: event.payload,
        }))
      );

      if (eventsError) {
        return errorResponse("database_error", {
          status: 500,
          details: eventsError.message,
        });
      }
    }

    // Upload attachments and insert metadata
    for (const attachment of parsed.attachments) {
      const fileData = parsed.files[attachment.file_name] || parsed.files[`attachments/${attachment.file_name}`];
      if (!fileData) continue;

      const { path } = await uploadAttachment(
        form.anonymous_installation_id,
        batchId,
        attachment.file_name,
        fileData,
        attachment.mime_type
      );

      const { error: attachmentError } = await admin.from("feedback_attachments").insert({
        batch_id: batchId,
        anonymous_installation_id: form.anonymous_installation_id,
        storage_bucket: FEEDBACK_BUCKET_NAMES.attachments,
        storage_path: path,
        file_name: attachment.file_name,
        mime_type: attachment.mime_type,
        size_bytes: attachment.size_bytes,
        sha256: attachment.sha256,
        redacted: attachment.redacted,
        attachment_type: attachment.attachment_type,
      });

      if (attachmentError) {
        return errorResponse("database_error", {
          status: 500,
          details: attachmentError.message,
        });
      }
    }

    return NextResponse.json({
      ok: true,
      request_id: `fb_${batchId}`,
      batch_id: batchId,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "internal_server_error";
    return errorResponse("internal_server_error", { status: 500, details: message });
  }
}
