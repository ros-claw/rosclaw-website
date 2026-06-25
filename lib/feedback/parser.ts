import { Readable } from "node:stream";
import * as tar from "tar";
import { feedbackEventSchema, feedbackManifestSchema } from "./schema";
import { FEEDBACK_ATTACHMENT_TYPES } from "./constants";
import type { ParsedFeedbackBundle, FeedbackAttachment, FeedbackEvent } from "./types";

type AttachmentType = (typeof FEEDBACK_ATTACHMENT_TYPES)[number];

/**
 * Parses a tar.gz feedback bundle buffer in memory.
 * Expects `manifest.json` and `feedback.jsonl` at the root.
 */
export async function parseBundle(buffer: Buffer): Promise<ParsedFeedbackBundle> {
  const files = await extractTarGz(buffer);

  const manifestRaw = files["manifest.json"];
  if (!manifestRaw) {
    throw new Error("manifest.json not found in bundle");
  }

  let manifest: unknown;
  try {
    manifest = JSON.parse(manifestRaw.toString("utf-8"));
  } catch {
    throw new Error("manifest.json is not valid JSON");
  }

  const manifestResult = feedbackManifestSchema.safeParse(manifest);
  if (!manifestResult.success) {
    throw new Error(`manifest.json validation failed: ${manifestResult.error.message}`);
  }

  const events: FeedbackEvent[] = [];
  const feedbackJsonl = files["feedback.jsonl"];
  if (feedbackJsonl) {
    const lines = feedbackJsonl.toString("utf-8").split("\n").filter(Boolean);
    for (const line of lines) {
      let parsed: unknown;
      try {
        parsed = JSON.parse(line);
      } catch {
        throw new Error("feedback.jsonl contains invalid JSON");
      }

      const eventResult = feedbackEventSchema.safeParse(parsed);
      if (!eventResult.success) {
        throw new Error(`feedback event validation failed: ${eventResult.error.message}`);
      }

      events.push(eventResult.data);
    }
  }

  const attachments: FeedbackAttachment[] = [];
  for (const [path, data] of Object.entries(files)) {
    if (path === "manifest.json" || path === "feedback.jsonl") continue;

    const fileName = path.split("/").pop() || path;
    const mimeType = guessMimeType(fileName);

    attachments.push({
      file_name: fileName,
      mime_type: mimeType,
      size_bytes: data.length,
      sha256: await computeSha256(data),
      attachment_type: guessAttachmentType(fileName, mimeType),
      redacted: true,
    });
  }

  return {
    manifest: manifestResult.data,
    events,
    attachments,
    files,
  };
}

async function extractTarGz(buffer: Buffer): Promise<Record<string, Buffer>> {
  const files: Record<string, Buffer> = {};

  await new Promise<void>((resolve, reject) => {
    const parser = new tar.Parser();

    parser.on("entry", (entry: tar.ReadEntry) => {
      if (entry.type === "File") {
        const chunks: Buffer[] = [];
        entry.on("data", (chunk: Buffer) => chunks.push(chunk));
        entry.on("end", () => {
          files[entry.path] = Buffer.concat(chunks);
        });
      } else {
        entry.resume();
      }
    });

    parser.on("end", resolve);
    parser.on("error", reject);

    Readable.from(buffer).pipe(parser);
  });

  return files;
}

async function computeSha256(buffer: Buffer): Promise<string> {
  const crypto = await import("node:crypto");
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function guessMimeType(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".json")) return "application/json";
  if (lower.endsWith(".jsonl")) return "application/jsonlines";
  if (lower.endsWith(".txt")) return "text/plain";
  if (lower.endsWith(".md")) return "text/markdown";
  if (lower.endsWith(".csv")) return "text/csv";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".mp4")) return "video/mp4";
  if (lower.endsWith(".mcap")) return "application/octet-stream";
  if (lower.endsWith(".tar.gz") || lower.endsWith(".tgz")) return "application/gzip";
  return "application/octet-stream";
}

function guessAttachmentType(fileName: string, mimeType: string): AttachmentType {
  const lower = fileName.toLowerCase();
  if (lower.includes("mcap")) return "mcap_summary";
  if (mimeType.startsWith("image/") || mimeType.startsWith("video/")) return "media";
  if (lower.includes("trace")) return "trace_summary";
  if (lower.includes("log")) return "log_summary";
  return "other";
}
