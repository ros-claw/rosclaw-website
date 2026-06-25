import { z } from "zod";
import {
  FEEDBACK_UPLOAD_SCHEMA_VERSION,
  FEEDBACK_CATEGORIES,
  FEEDBACK_ATTACHMENT_TYPES,
} from "./constants";

const anonymousInstallationIdSchema = z
  .string()
  .length(36)
  .regex(/^rci_[a-f0-9]{32}$/, "anonymous_installation_id must be rci_ + 32 hex chars");

export const feedbackUploadFormSchema = z.object({
  schema_version: z.literal(FEEDBACK_UPLOAD_SCHEMA_VERSION),
  anonymous_installation_id: anonymousInstallationIdSchema,
  client_version: z.string().optional(),
  redacted: z.union([z.literal("true"), z.literal("false"), z.boolean()]),
  media_count: z.coerce.number().int().min(0).default(0),
  days: z.coerce.number().int().min(0).default(0),
});

export type FeedbackUploadFormInput = z.infer<typeof feedbackUploadFormSchema>;

export const feedbackEventSchema = z.object({
  event_id: z.string().min(1),
  schema_version: z.string(),
  category: z.enum(FEEDBACK_CATEGORIES),
  module: z.string().min(1),
  severity: z.enum(["info", "warning", "error", "critical"]).default("info"),
  rosclaw_version: z.string().optional(),
  robot_type: z.string().optional(),
  skill_id: z.string().optional(),
  task_id: z.string().optional(),
  provider_type: z.string().optional(),
  created_at: z.string().datetime(),
  privacy_level: z.string().default("L0"),
  redacted: z.boolean().default(true),
  payload: z.record(z.string(), z.unknown()).default({}),
});

export type FeedbackEventInput = z.infer<typeof feedbackEventSchema>;

export const feedbackManifestSchema = z.object({
  schema_version: z.string(),
  anonymous_installation_id: anonymousInstallationIdSchema,
  client_version: z.string().optional(),
  created_at: z.string().datetime(),
  redacted: z.boolean(),
  event_count: z.number().int().min(0),
  attachment_count: z.number().int().min(0),
  days: z.number().int().min(0).optional(),
  privacy_level: z.string().default("L0"),
});

export type FeedbackManifest = z.infer<typeof feedbackManifestSchema>;

export const feedbackAttachmentSchema = z.object({
  file_name: z.string().min(1),
  mime_type: z.string().min(1),
  size_bytes: z.number().int().min(0),
  sha256: z.string().min(1),
  attachment_type: z.enum(FEEDBACK_ATTACHMENT_TYPES),
  redacted: z.boolean().default(true),
});

export type FeedbackAttachmentInput = z.infer<typeof feedbackAttachmentSchema>;

export const feedbackDeleteRequestSchema = z.object({
  anonymous_installation_id: anonymousInstallationIdSchema,
  reason: z.string().max(500).optional(),
});

export type FeedbackDeleteRequestInput = z.infer<typeof feedbackDeleteRequestSchema>;
