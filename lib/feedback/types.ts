import type {
  FeedbackUploadFormInput,
  FeedbackEventInput,
  FeedbackManifest,
  FeedbackAttachmentInput,
  FeedbackDeleteRequestInput,
} from "./schema";

export type FeedbackUploadInput = FeedbackUploadFormInput;
export type FeedbackEvent = FeedbackEventInput;
export type FeedbackManifestData = FeedbackManifest;
export type FeedbackAttachment = FeedbackAttachmentInput;
export type FeedbackDeleteRequest = FeedbackDeleteRequestInput;

export interface ParsedFeedbackBundle {
  manifest: FeedbackManifestData;
  events: FeedbackEventInput[];
  attachments: FeedbackAttachmentInput[];
  files: Record<string, Buffer>;
}

export interface FeedbackBundleResult {
  ok: true;
  request_id: string;
  batch_id: string;
}

export interface FeedbackBundleError {
  ok: false;
  error: string;
  details?: string;
}

export type FeedbackBundleResponse = FeedbackBundleResult | FeedbackBundleError;
