import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type MetricName =
  | "total_installs"
  | "daily_active_installs"
  | "weekly_active_installs"
  | "monthly_active_installs"
  | "install_completed_count"
  | "firstboot_completed_count"
  | "firstboot_completion_rate"
  | "doctor_total"
  | "doctor_success"
  | "doctor_success_rate"
  | "command_count_by_name"
  | "command_failure_rate_by_name"
  | "module_adoption_by_name"
  | "version_distribution"
  | "os_distribution"
  | "python_distribution"
  | "robot_type_distribution"
  | "ros_distro_distribution"
  | "cuda_available_count"
  | "cuda_unavailable_count"
  | "os_version_distribution"
  | "gpu_info_distribution"
  | "sensor_type_adoption";

export interface DailyMetric {
  day: string;
  metric_name: MetricName;
  dimension: Record<string, string>;
  value: number;
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function upsertMetric(
  day: string,
  metric_name: MetricName,
  dimension: Record<string, string>,
  value: number
) {
  const admin = getSupabaseAdmin();
  return admin.from("telemetry_daily_aggregates").upsert(
    {
      day,
      metric_name,
      dimension,
      value,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "day,metric_name,dimension" }
  );
}

function countDistinct(values: (string | null | undefined)[]): number {
  return new Set(values.filter(Boolean)).size;
}

/**
 * Aggregates telemetry for a given date and writes to telemetry_daily_aggregates.
 * Defaults to yesterday so the day's data is complete.
 */
export async function aggregateTelemetry(day?: string): Promise<void> {
  const targetDay = day || formatDate(new Date(Date.now() - 24 * 60 * 60 * 1000));
  const admin = getSupabaseAdmin();

  const startOfDay = `${targetDay}T00:00:00Z`;
  const endOfDay = `${targetDay}T23:59:59.999Z`;

  // Fetch all events for the target day
  const { data: dayEvents, error: dayEventsError } = await admin
    .from("telemetry_events")
    .select(
      "anonymous_installation_id, event_type, command_name, command_status, module_name, created_at"
    )
    .gte("created_at", startOfDay)
    .lte("created_at", endOfDay);

  if (dayEventsError) throw dayEventsError;

  // Fetch firstboot events with payload for device/environment metrics
  const { data: firstbootEvents, error: firstbootError } = await admin
    .from("telemetry_events")
    .select("anonymous_installation_id, payload")
    .eq("event_type", "firstboot_completed")
    .gte("created_at", startOfDay)
    .lte("created_at", endOfDay);

  if (firstbootError) throw firstbootError;

  // Fetch sensor events (any event with sensor_types in payload)
  const { data: sensorEvents, error: sensorError } = await admin
    .from("telemetry_events")
    .select("payload")
    .not("payload->sensor_types", "is", null)
    .gte("created_at", startOfDay)
    .lte("created_at", endOfDay);

  if (sensorError) throw sensorError;

  const events = dayEvents || [];

  // total_installs: distinct installations first seen on this day
  const { data: newInstallations, error: newInstallationsError } = await admin
    .from("telemetry_installations")
    .select("anonymous_installation_id")
    .gte("first_seen_at", startOfDay)
    .lte("first_seen_at", endOfDay);

  if (newInstallationsError) throw newInstallationsError;

  // DAU: distinct anon IDs with heartbeat on target day
  const dau = countDistinct(
    events.filter((e) => e.event_type === "heartbeat").map((e) => e.anonymous_installation_id)
  );

  // WAU / MAU: distinct anon IDs with heartbeat in rolling windows
  const wauStart = formatDate(new Date(new Date(targetDay).getTime() - 6 * 24 * 60 * 60 * 1000));
  const { data: wauEvents, error: wauError } = await admin
    .from("telemetry_events")
    .select("anonymous_installation_id, created_at")
    .eq("event_type", "heartbeat")
    .gte("created_at", `${wauStart}T00:00:00Z`)
    .lte("created_at", endOfDay);

  if (wauError) throw wauError;
  const wau = countDistinct(wauEvents?.map((e) => e.anonymous_installation_id));

  const mauStart = formatDate(new Date(new Date(targetDay).getTime() - 29 * 24 * 60 * 60 * 1000));
  const { data: mauEvents, error: mauError } = await admin
    .from("telemetry_events")
    .select("anonymous_installation_id, created_at")
    .eq("event_type", "heartbeat")
    .gte("created_at", `${mauStart}T00:00:00Z`)
    .lte("created_at", endOfDay);

  if (mauError) throw mauError;
  const mau = countDistinct(mauEvents?.map((e) => e.anonymous_installation_id));

  // Install / firstboot counts
  const installCompleted = events.filter((e) => e.event_type === "install_completed").length;
  const firstbootStarted = events.filter((e) => e.event_type === "firstboot_started").length;
  const firstbootCompleted = events.filter((e) => e.event_type === "firstboot_completed").length;
  const firstbootRate = firstbootStarted === 0 ? 0 : firstbootCompleted / firstbootStarted;

  // Doctor success rate
  const doctorEvents = events.filter((e) => e.event_type === "doctor_completed");
  const doctorTotal = doctorEvents.length;
  const doctorSuccess = doctorEvents.filter((e) => e.command_status === "success").length;
  const doctorRate = doctorTotal === 0 ? 0 : doctorSuccess / doctorTotal;

  // Upsert global metrics
  await upsertMetric(targetDay, "total_installs", {}, newInstallations?.length || 0);
  await upsertMetric(targetDay, "daily_active_installs", {}, dau);
  await upsertMetric(targetDay, "weekly_active_installs", {}, wau);
  await upsertMetric(targetDay, "monthly_active_installs", {}, mau);
  await upsertMetric(targetDay, "install_completed_count", {}, installCompleted);
  await upsertMetric(targetDay, "firstboot_completed_count", {}, firstbootCompleted);
  await upsertMetric(targetDay, "firstboot_completion_rate", {}, firstbootRate);
  await upsertMetric(targetDay, "doctor_total", {}, doctorTotal);
  await upsertMetric(targetDay, "doctor_success", {}, doctorSuccess);
  await upsertMetric(targetDay, "doctor_success_rate", {}, doctorRate);

  // Command counts and failure rates
  const commandMap = new Map<string, { total: number; failures: number }>();
  for (const e of events.filter((e) => e.event_type === "command_completed" && e.command_name)) {
    const current = commandMap.get(e.command_name!) || { total: 0, failures: 0 };
    current.total += 1;
    if (e.command_status === "failure") current.failures += 1;
    commandMap.set(e.command_name!, current);
  }

  for (const [name, stats] of Array.from(commandMap.entries())) {
    await upsertMetric(targetDay, "command_count_by_name", { command_name: name }, stats.total);
    await upsertMetric(
      targetDay,
      "command_failure_rate_by_name",
      { command_name: name },
      stats.total === 0 ? 0 : stats.failures / stats.total
    );
  }

  // Module adoption
  const moduleMap = new Map<string, number>();
  for (const e of events.filter((e) => e.event_type === "module_enabled" && e.module_name)) {
    moduleMap.set(e.module_name!, (moduleMap.get(e.module_name!) || 0) + 1);
  }
  for (const [name, count] of Array.from(moduleMap.entries())) {
    await upsertMetric(targetDay, "module_adoption_by_name", { module_name: name }, count);
  }

  // Version / OS / Python distributions from installations
  const { data: installations, error: installationsError } = await admin
    .from("telemetry_installations")
    .select("latest_rosclaw_version, os_family, python_major_minor");

  if (installationsError) throw installationsError;

  const versionMap = new Map<string, number>();
  const osMap = new Map<string, number>();
  const pythonMap = new Map<string, number>();

  for (const inst of installations || []) {
    if (inst.latest_rosclaw_version) {
      versionMap.set(
        inst.latest_rosclaw_version,
        (versionMap.get(inst.latest_rosclaw_version) || 0) + 1
      );
    }
    if (inst.os_family) {
      osMap.set(inst.os_family, (osMap.get(inst.os_family) || 0) + 1);
    }
    if (inst.python_major_minor) {
      pythonMap.set(inst.python_major_minor, (pythonMap.get(inst.python_major_minor) || 0) + 1);
    }
  }

  for (const [version, count] of Array.from(versionMap.entries())) {
    await upsertMetric(targetDay, "version_distribution", { rosclaw_version: version }, count);
  }
  for (const [os, count] of Array.from(osMap.entries())) {
    await upsertMetric(targetDay, "os_distribution", { os_family: os }, count);
  }
  for (const [python, count] of Array.from(pythonMap.entries())) {
    await upsertMetric(targetDay, "python_distribution", { python }, count);
  }

  // --- Device / Environment Aggregations ---
  const robotTypeMap = new Map<string, Set<string>>();
  const rosDistroMap = new Map<string, Set<string>>();
  const cudaAvailableSet = new Set<string>();
  const cudaUnavailableSet = new Set<string>();
  const osVersionMap = new Map<string, Set<string>>();
  const gpuInfoMap = new Map<string, Set<string>>();
  const sensorTypeMap = new Map<string, number>();

  for (const e of firstbootEvents || []) {
    const id = e.anonymous_installation_id;
    const p = (e.payload || {}) as Record<string, unknown>;

    if (typeof p.robot_type === "string") {
      const set = robotTypeMap.get(p.robot_type) || new Set<string>();
      set.add(id);
      robotTypeMap.set(p.robot_type, set);
    }
    if (typeof p.ros_distro_present === "string") {
      const set = rosDistroMap.get(p.ros_distro_present) || new Set<string>();
      set.add(id);
      rosDistroMap.set(p.ros_distro_present, set);
    }
    if (p.cuda_available === true) cudaAvailableSet.add(id);
    if (p.cuda_available === false) cudaUnavailableSet.add(id);
    if (typeof p.os_version === "string") {
      const set = osVersionMap.get(p.os_version) || new Set<string>();
      set.add(id);
      osVersionMap.set(p.os_version, set);
    }
    if (typeof p.gpu_info === "string") {
      const set = gpuInfoMap.get(p.gpu_info) || new Set<string>();
      set.add(id);
      gpuInfoMap.set(p.gpu_info, set);
    }
  }

  for (const e of sensorEvents || []) {
    const p = (e.payload || {}) as Record<string, unknown>;
    const sensors = p.sensor_types;
    if (Array.isArray(sensors)) {
      for (const sensor of sensors) {
        if (typeof sensor === "string") {
          sensorTypeMap.set(sensor, (sensorTypeMap.get(sensor) || 0) + 1);
        }
      }
    }
  }

  for (const [robotType, ids] of Array.from(robotTypeMap.entries())) {
    await upsertMetric(targetDay, "robot_type_distribution", { robot_type: robotType }, ids.size);
  }
  for (const [rosDistro, ids] of Array.from(rosDistroMap.entries())) {
    await upsertMetric(targetDay, "ros_distro_distribution", { ros_distro: rosDistro }, ids.size);
  }
  await upsertMetric(targetDay, "cuda_available_count", { cuda_available: "true" }, cudaAvailableSet.size);
  await upsertMetric(targetDay, "cuda_unavailable_count", { cuda_available: "false" }, cudaUnavailableSet.size);
  for (const [osVersion, ids] of Array.from(osVersionMap.entries())) {
    await upsertMetric(targetDay, "os_version_distribution", { os_version: osVersion }, ids.size);
  }
  for (const [gpuInfo, ids] of Array.from(gpuInfoMap.entries())) {
    await upsertMetric(targetDay, "gpu_info_distribution", { gpu_info: gpuInfo }, ids.size);
  }
  for (const [sensorType, count] of Array.from(sensorTypeMap.entries())) {
    await upsertMetric(targetDay, "sensor_type_adoption", { sensor_type: sensorType }, count);
  }
}

export async function getSummaryMetrics(): Promise<Record<MetricName, number | Record<string, number>>> {
  const admin = getSupabaseAdmin();

  const { data: rows } = await admin
    .from("telemetry_daily_aggregates")
    .select("metric_name, dimension, value")
    .order("day", { ascending: false });

  const summary: Record<MetricName, number | Record<string, number>> = {
    total_installs: 0,
    daily_active_installs: 0,
    weekly_active_installs: 0,
    monthly_active_installs: 0,
    install_completed_count: 0,
    firstboot_completed_count: 0,
    firstboot_completion_rate: 0,
    doctor_total: 0,
    doctor_success: 0,
    doctor_success_rate: 0,
    command_count_by_name: {},
    command_failure_rate_by_name: {},
    module_adoption_by_name: {},
    version_distribution: {},
    os_distribution: {},
    python_distribution: {},
    robot_type_distribution: {},
    ros_distro_distribution: {},
    cuda_available_count: {},
    cuda_unavailable_count: {},
    os_version_distribution: {},
    gpu_info_distribution: {},
    sensor_type_adoption: {},
  };

  const seenGlobal = new Set<MetricName>();

  for (const row of rows || []) {
    const metricName = row.metric_name as MetricName;
    const dimensionValue = Object.values(row.dimension || {})[0] as string | undefined;

    if (dimensionValue === undefined) {
      if (!seenGlobal.has(metricName)) {
        (summary[metricName] as number) = Number(row.value);
        seenGlobal.add(metricName);
      }
      continue;
    }

    const map = summary[metricName] as Record<string, number>;
    map[dimensionValue] = (map[dimensionValue] || 0) + Number(row.value);
  }

  return summary;
}
