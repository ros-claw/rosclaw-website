import type {
  TelemetryEventInput as SchemaTelemetryEventInput,
  TelemetryHeartbeatInput as SchemaTelemetryHeartbeatInput,
} from "./schema";

export type TelemetryEventInput = SchemaTelemetryEventInput;
export type TelemetryHeartbeatInput = SchemaTelemetryHeartbeatInput;

/**
 * Normalized telemetry event ready for insertion into telemetry_events.
 */
export interface TelemetryEventRow {
  anonymous_installation_id: string;
  schema_version: string;
  event_type: string;
  command_name?: string | null;
  command_status?: string | null;
  module_name?: string | null;
  rosclaw_version?: string | null;
  cli_version?: string | null;
  os_family?: string | null;
  arch?: string | null;
  python_major_minor?: string | null;
  install_channel?: string | null;
  deployment_mode?: string | null;
  duration_bucket?: string | null;
  error_class_bucket?: string | null;
  created_at: string;
  payload: Record<string, unknown>;
}

export interface TelemetryInstallationRow {
  anonymous_installation_id: string;
  first_rosclaw_version?: string | null;
  latest_rosclaw_version?: string | null;
  os_family?: string | null;
  arch?: string | null;
  python_major_minor?: string | null;
  install_channel?: string | null;
  deployment_mode?: string | null;
  telemetry_status?: string;
}

export interface IngestResult {
  ok: true;
  request_id: string;
}

export interface IngestError {
  ok: false;
  error: string;
  field?: string;
  details?: string;
}
