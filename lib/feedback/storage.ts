import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { FEEDBACK_BUCKET_NAMES } from "./constants";

/**
 * Uploads a feedback bundle to Supabase Storage.
 */
export async function uploadBundle(
  anonymousInstallationId: string,
  batchId: string,
  buffer: Buffer
): Promise<{ path: string } > {
  const admin = getSupabaseAdmin();
  const path = `${anonymousInstallationId}/${batchId}/bundle.tar.gz`;

  const { error } = await admin.storage
    .from(FEEDBACK_BUCKET_NAMES.bundles)
    .upload(path, buffer, {
      contentType: "application/gzip",
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload bundle: ${error.message}`);
  }

  return { path };
}

/**
 * Uploads an attachment to Supabase Storage.
 */
export async function uploadAttachment(
  anonymousInstallationId: string,
  batchId: string,
  fileName: string,
  buffer: Buffer,
  mimeType: string
): Promise<{ path: string } > {
  const admin = getSupabaseAdmin();
  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${anonymousInstallationId}/${batchId}/${safeFileName}`;

  const { error } = await admin.storage
    .from(FEEDBACK_BUCKET_NAMES.attachments)
    .upload(path, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload attachment: ${error.message}`);
  }

  return { path };
}
