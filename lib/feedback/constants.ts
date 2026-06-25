/**
 * Allowlists and constants for ROSClaw feedback bundles.
 */

export const FEEDBACK_UPLOAD_SCHEMA_VERSION = "rosclaw.feedback.upload.v1";

export const FEEDBACK_CATEGORIES = [
  "failure_stats",
  "skill_performance",
  "crash_summary",
  "human_feedback",
  "sandbox_block",
  "provider_performance",
] as const;

export const FEEDBACK_BUCKET_NAMES = {
  bundles: "feedback-bundles",
  attachments: "feedback-attachments",
} as const;

export const FEEDBACK_ATTACHMENT_TYPES = [
  "media",
  "mcap_summary",
  "trace_summary",
  "log_summary",
  "other",
] as const;
