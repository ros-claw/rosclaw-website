import type { McpPackageSummary, SkillSummary } from "./types";

export type RegistryKind = "mcps" | "skills";
export type RegistrySummary = McpPackageSummary | SkillSummary;

export const registryCategories = [
  { slug: "robot-control", title: "Robot control & navigation", description: "Explore interfaces and task policies for robot motion, navigation, manipulation, and ROS 2 control. Compare declared hardware targets and inspect action permissions before deployment.", keywords: ["navigation", "navigate", "manipulation", "robot control", "ros2", "ros 2", "moveit", "humanoid", "unitree", "franka", "robot arm", "reachy"] },
  { slug: "sensors-vision", title: "Sensors & computer vision", description: "Find camera, depth, LiDAR, and perception packages. Review sensor models, calibration requirements, capture workflows, and the source documentation for your hardware.", keywords: ["camera", "vision", "sensor", "realsense", "lidar", "rgbd", "rgb-d", "perception", "image", "depth", "opencv"] },
  { slug: "simulation", title: "Simulation & digital twins", description: "Browse packages for MuJoCo, Isaac, Gazebo, and other simulation workflows. Use simulation to inspect behavior and gather evidence before connecting a physical body.", keywords: ["mujoco", "isaac", "gazebo", "simulation", "simulator", "digital twin", "urdf", "usd"] },
  { slug: "industrial-lab", title: "Industrial systems & laboratory automation", description: "Discover interfaces and procedures for PLCs, field buses, industrial equipment, and lab instruments. Check device protocols and operating limits in the publisher documentation.", keywords: ["industrial", "plc", "modbus", "canopen", "beckhoff", "laboratory", "lab automation", "instrument", "opc ua", "opc-ua"] },
  { slug: "data-evaluation", title: "Robot data & evaluation", description: "Explore recording, dataset, benchmarking, and evaluation workflows. Compare data formats and measurement procedures; a catalog entry alone does not establish a benchmark result.", keywords: ["dataset", "rosbag", "recording", "benchmark", "evaluation", "telemetry", "synthetic data", "training data", "data collection"] },
  { slug: "deployment", title: "Edge deployment & infrastructure", description: "Find packages for Jetson, embedded compute, runtime setup, and deployment. Review the declared operating system, dependencies, and setup steps for your target environment.", keywords: ["jetson", "deployment", "deploy", "firmware", "embedded", "docker", "bootstrap", "edge", "installation", "infrastructure"] },
  { slug: "diagnostics", title: "Diagnostics & calibration", description: "Browse troubleshooting, calibration, and recovery procedures for physical systems. Inspect the publisher's escalation steps and required measurements before applying a repair.", keywords: ["diagnostic", "calibrat", "troubleshoot", "recovery", "repair", "health check", "maintenance", "wedge"] },
  { slug: "other", title: "More community packages", description: "Browse community packages outside the focused robotics collections. Inspect their purpose, source, and declared dependencies to decide whether they fit your agent workflow.", keywords: [] },
] as const;

export function registrySearchText(item: RegistrySummary) {
  return [item.name, item.description, item.category, ...(item.tags || []),
    ...("robotTypes" in item ? item.robotTypes || [] : []),
    ...("robotType" in item ? [item.robotType] : []),
    ...("dependencies" in item ? item.dependencies || [] : []),
    ...("tools" in item ? (item.tools || []).map((tool) => tool.name) : []),
  ].filter(Boolean).join(" ").toLowerCase();
}

export function matchesRegistryCategory(item: RegistrySummary, slug: string): boolean {
  const text = registrySearchText(item);
  const category = registryCategories.find((entry) => entry.slug === slug);
  if (!category) return false;
  if (slug === "other") return !registryCategories.some((entry) => entry.slug !== "other" && entry.keywords.some((keyword) => text.includes(keyword)));
  return category.keywords.some((keyword) => text.includes(keyword));
}

export function itemCategories(item: RegistrySummary) {
  return registryCategories.filter((category) => matchesRegistryCategory(item, category.slug));
}

export function sourceDescription(text: string | undefined, fallback: string) {
  const plain = (text || fallback).replace(/<[^>]*>/g, "").replace(/[`*_#]/g, "").replace(/\s+/g, " ").trim();
  return plain.length > 180 ? `${plain.slice(0, 177).trimEnd()}…` : plain;
}

/** Excerpts remain publisher-authored; no generated claims or install commands. */
export function sourceGuidance(document: string) {
  const text = document.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
  const sections: { heading: string; text: string }[] = [];
  let current: { heading: string; lines: string[] } | null = null;
  let fenced = false;
  for (const line of text.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
    const heading = !fenced ? line.match(/^#{1,6}\s+(.+?)\s*#*$/) : null;
    if (heading) {
      if (current) sections.push({ heading: current.heading, text: current.lines.join("\n").trim() });
      current = { heading: heading[1], lines: [] };
    } else if (current) current.lines.push(line);
  }
  if (current) sections.push({ heading: current.heading, text: current.lines.join("\n").trim() });
  return sections.filter((section) => /usage|quick.?start|getting started|example|prerequisit|requirements|setup|installation|when to use/i.test(section.heading) && section.text)
    .slice(0, 2).map((section) => ({ ...section, text: section.text.length <= 2400 ? section.text : section.text.split(/\n\s*\n/)[0].slice(0, 2400) }));
}

export function rankedRegistryItems<T extends RegistrySummary>(items: T[], now = Date.now()): T[] {
  const score = (item: T) => (item.officialPublisher ? 10_000_000 : 0)
    + ("manifestValidated" in item && item.manifestValidated ? 1_000_000 : 0)
    + (now - Date.parse(item.lastSyncedAt || "") <= 6 * 86400000 ? 100_000 : 0)
    + (item.githubStars || 0) * 10;
  return [...items].sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name, "en"));
}
