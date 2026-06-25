/**
 * Allowlists and constants for ROSClaw product telemetry.
 * These must stay in sync with the CLI side telemetry client.
 */

export const TELEMETRY_EVENT_SCHEMA_VERSION = "rosclaw.telemetry.event.v1";
export const HEARTBEAT_SCHEMA_VERSION = "rosclaw.telemetry.heartbeat.v1";

export const ANONYMOUS_INSTALLATION_ID_PREFIX = "rci_";
export const ANONYMOUS_INSTALLATION_ID_LENGTH = 36; // "rci_" + 32 hex chars

export const EVENT_TYPES = [
  "install_started",
  "install_completed",
  "firstboot_started",
  "firstboot_completed",
  "doctor_started",
  "doctor_completed",
  "command_completed",
  "module_enabled",
  "provider_installed",
  "provider_served",
  "hub_asset_installed",
  "dashboard_opened",
  "practice_started",
  "heartbeat",
  "telemetry_ping",
] as const;

export const COMMAND_NAMES = [
  "doctor",
  "firstboot",
  "provider",
  "hub",
  "practice",
  "dashboard",
  "sandbox",
  "memory",
  "skill",
  "body",
  "mcp",
  "feedback",
  "version",
  "help",
] as const;

export const COMMAND_STATUSES = [
  "success",
  "failure",
  "cancelled",
  "timeout",
] as const;

export const DURATION_BUCKETS = [
  "<100ms",
  "100ms-1s",
  "1s-5s",
  "5s-30s",
  "30s-5m",
  ">5m",
] as const;

export const ERROR_CLASS_BUCKETS = [
  "ImportError",
  "ConfigError",
  "DockerUnavailable",
  "ROSNotFound",
  "ProviderTimeout",
  "PermissionDenied",
  "NetworkError",
  "ValidationError",
  "RuntimeError",
  "Unknown",
] as const;

export const FORBIDDEN_FIELDS = new Set([
  "hostname",
  "username",
  "ip",
  "local_path",
  "cwd",
  "full_command",
  "full_args",
  "prompt",
  "system_prompt",
  "tool_arguments",
  "provider_response",
  "stacktrace",
  "log",
  "video",
  "image",
  "audio",
  "mcap",
  "trace",
  "api_key",
  "secret",
  "robot_serial",
]);

export const DEFAULT_MAX_EVENT_BYTES = 16384;
export const DEFAULT_MAX_BUNDLE_MB = 25;

export const RATE_LIMITS = {
  eventsPerAnonIdPerHour: 100,
  eventsPerIpPerHour: 1000,
  heartbeatsPerAnonIdPerDay: 3,
} as const;
