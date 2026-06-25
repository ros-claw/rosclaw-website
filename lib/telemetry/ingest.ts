import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type {
  TelemetryEventInput,
  TelemetryHeartbeatInput,
  IngestResult,
  IngestError,
} from "./types";

function toEventRow(event: TelemetryEventInput | TelemetryHeartbeatInput) {
  return {
    anonymous_installation_id: event.anonymous_installation_id,
    schema_version: event.schema_version,
    event_type: event.event_type,
    command_name: "command_name" in event ? event.command_name ?? null : null,
    command_status: "command_status" in event ? event.command_status ?? null : null,
    module_name: "module_name" in event ? event.module_name ?? null : null,
    rosclaw_version: event.rosclaw_version ?? null,
    cli_version: event.cli_version ?? null,
    os_family: event.os_family ?? null,
    arch: event.arch ?? null,
    python_major_minor: event.python ?? null,
    install_channel: event.install_channel ?? null,
    deployment_mode: event.deployment_mode ?? null,
    duration_bucket: "duration_bucket" in event ? event.duration_bucket ?? null : null,
    error_class_bucket: "error_class_bucket" in event ? event.error_class_bucket ?? null : null,
    created_at: event.created_at,
    payload: event.payload ?? {},
  };
}

function toInstallationRow(event: TelemetryEventInput | TelemetryHeartbeatInput) {
  return {
    anonymous_installation_id: event.anonymous_installation_id,
    latest_rosclaw_version: event.rosclaw_version ?? null,
    os_family: event.os_family ?? null,
    arch: event.arch ?? null,
    python_major_minor: event.python ?? null,
    install_channel: event.install_channel ?? null,
    deployment_mode: event.deployment_mode ?? null,
    telemetry_status: "enabled",
  };
}

/**
 * Ingests a validated telemetry event or heartbeat into Supabase.
 * Upserts the installation row and inserts the event row.
 */
export async function ingestTelemetryEvent(
  event: TelemetryEventInput | TelemetryHeartbeatInput
): Promise<IngestResult | IngestError> {
  try {
    const admin = getSupabaseAdmin();
    const now = new Date().toISOString();

    // Upsert installation: keep first_seen_at / first_rosclaw_version on insert,
    // update last_seen_at and latest version on conflict.
    await admin.rpc("upsert_telemetry_installation", {
      p_anonymous_installation_id: event.anonymous_installation_id,
      p_first_seen_at: now,
      p_last_seen_at: now,
      p_first_rosclaw_version: event.rosclaw_version ?? null,
      p_latest_rosclaw_version: event.rosclaw_version ?? null,
      p_os_family: event.os_family ?? null,
      p_arch: event.arch ?? null,
      p_python_major_minor: event.python ?? null,
      p_install_channel: event.install_channel ?? null,
      p_deployment_mode: event.deployment_mode ?? null,
      p_telemetry_status: "enabled",
    });

    const { error } = await admin.from("telemetry_events").insert(toEventRow(event));

    if (error) {
      return { ok: false, error: "database_error", details: error.message };
    }

    return { ok: true, request_id: generateRequestId("tel_") };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown_error";
    return { ok: false, error: "ingest_failed", details: message };
  }
}

function generateRequestId(prefix: string): string {
  const uuid = crypto.randomUUID();
  return `${prefix}${uuid}`;
}
