import { z } from "zod";
import {
  TELEMETRY_EVENT_SCHEMA_VERSION,
  HEARTBEAT_SCHEMA_VERSION,
  EVENT_TYPES,
  COMMAND_NAMES,
  COMMAND_STATUSES,
  DURATION_BUCKETS,
  ERROR_CLASS_BUCKETS,
  ANONYMOUS_INSTALLATION_ID_LENGTH,
} from "./constants";

const anonymousInstallationIdSchema = z
  .string()
  .length(ANONYMOUS_INSTALLATION_ID_LENGTH)
  .regex(/^rci_[a-f0-9]{32}$/, "anonymous_installation_id must be rci_ + 32 hex chars");

const baseTelemetryEventSchema = z.object({
  anonymous_installation_id: anonymousInstallationIdSchema,
  created_at: z.string().datetime(),
  rosclaw_version: z.string().optional(),
  cli_version: z.string().optional(),
  os_family: z.string().optional(),
  arch: z.string().optional(),
  python: z.string().optional(),
  install_channel: z.string().optional(),
  deployment_mode: z.string().optional(),
  payload: z.record(z.string(), z.unknown()).default({}),
});

export const telemetryEventSchema = baseTelemetryEventSchema.merge(
  z.object({
    schema_version: z.literal(TELEMETRY_EVENT_SCHEMA_VERSION),
    event_type: z.enum(EVENT_TYPES),
    command_name: z.enum(COMMAND_NAMES).optional(),
    command_status: z.enum(COMMAND_STATUSES).optional(),
    duration_bucket: z.enum(DURATION_BUCKETS).optional(),
    module_name: z.string().optional(),
    error_class_bucket: z.enum(ERROR_CLASS_BUCKETS).optional(),
  })
);

export const telemetryHeartbeatSchema = baseTelemetryEventSchema.merge(
  z.object({
    schema_version: z.literal(HEARTBEAT_SCHEMA_VERSION),
    event_type: z.literal("heartbeat"),
    enabled_modules: z.array(z.string()).optional(),
  })
);

export type TelemetryEventInput = z.infer<typeof telemetryEventSchema>;
export type TelemetryHeartbeatInput = z.infer<typeof telemetryHeartbeatSchema>;
