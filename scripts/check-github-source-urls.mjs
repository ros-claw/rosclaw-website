import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(path.join(root, "lib/github/source-url.ts"), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const module = { exports: {} };
new Function("exports", "module", compiled)(module.exports, module);
const { canonicalRegistrySourceUrl, resolveGitHubMarkdownUrl } = module.exports;

const failures = [];
const equal = (actual, expected, label) => {
  if (actual !== expected) failures.push(`${label}: expected ${expected}, received ${actual}`);
};

const realsenseSource = canonicalRegistrySourceUrl(
  "https://github.com/ros-claw/skills",
  "ros-claw/realsense_ops",
  "skill",
);
equal(
  realsenseSource,
  "https://github.com/ros-claw/skills/tree/main/skills/realsense_ops",
  "official Skill monorepo source",
);
equal(
  canonicalRegistrySourceUrl(
    "https://github.com/NVIDIA/skills/tree/f6075a5060ed3c86536055700d95eb68655162ee/skills/jetson-customize-uphy",
    "NVIDIA/jetson-customize-uphy",
    "skill",
  ),
  "https://github.com/NVIDIA/skills/tree/f6075a5060ed3c86536055700d95eb68655162ee/skills/jetson-customize-uphy",
  "existing directory source",
);
equal(
  canonicalRegistrySourceUrl(
    "https://github.com/ros-claw/rosclaw/blob/abc123/.agents/skills/rosclaw",
    "ros-claw/rosclaw",
    "skill",
  ),
  "https://github.com/ros-claw/rosclaw/tree/abc123/.agents/skills/rosclaw",
  "directory imported with blob marker",
);
equal(
  canonicalRegistrySourceUrl(
    "https://github.com/Seeed-Projects/reBot-Isaacsim/blob/abc123/VALIDATION_SKILL.md",
    "Seeed-Projects/validating-urdf-usd-multi-engine",
    "skill",
  ),
  "https://github.com/Seeed-Projects/reBot-Isaacsim/blob/abc123/VALIDATION_SKILL.md",
  "nonstandard Skill document filename",
);
equal(
  canonicalRegistrySourceUrl(
    "https://github.com/NVlabs/GraspGenX/blob/b942909",
    "NVlabs/graspgenx",
    "skill",
  ),
  "https://github.com/NVlabs/GraspGenX/tree/b942909",
  "repository root imported with blob marker",
);
equal(
  canonicalRegistrySourceUrl(
    "https://github.com/ros-claw/rosclaw/tree/main/skills/realsense_camera_usage",
    "rosclaw/realsense_camera_usage",
    "skill",
  ),
  "https://github.com/ros-claw/skills/tree/main/skills/realsense_camera_usage",
  "moved official Skill source",
);
equal(
  canonicalRegistrySourceUrl(
    "https://github.com/ros-claw/inspire_rh56_hand_gestures",
    "ros-claw/inspire_rh56_hand_gestures",
    "skill",
  ),
  "https://github.com/ros-claw/skills/tree/main/skills/inspire_rh56_hand_gestures",
  "consolidated official Skill source",
);
equal(
  resolveGitHubMarkdownUrl(realsenseSource, "guides/setup.md"),
  "https://github.com/ros-claw/skills/blob/main/skills/realsense_ops/guides/setup.md",
  "relative documentation link",
);
equal(
  resolveGitHubMarkdownUrl(realsenseSource, "../shared.md"),
  "https://github.com/ros-claw/skills/blob/main/skills/shared.md",
  "parent documentation link",
);
equal(
  resolveGitHubMarkdownUrl(realsenseSource, "assets/camera.png", true),
  "https://raw.githubusercontent.com/ros-claw/skills/main/skills/realsense_ops/assets/camera.png",
  "relative documentation image",
);
equal(
  resolveGitHubMarkdownUrl(realsenseSource, "guides/setup.md?mode=robot#camera"),
  "https://github.com/ros-claw/skills/blob/main/skills/realsense_ops/guides/setup.md?mode=robot#camera",
  "relative link query and fragment",
);
equal(
  canonicalRegistrySourceUrl(
    "https://github.com/example/robot-skills.git",
    "example/camera",
    "skill",
  ),
  "https://github.com/example/robot-skills",
  "repository git suffix",
);
equal(
  resolveGitHubMarkdownUrl(realsenseSource, "https://example.com/guide"),
  "https://example.com/guide",
  "absolute link",
);
equal(
  resolveGitHubMarkdownUrl(realsenseSource, "/ros-claw/skills/issues"),
  "https://github.com/ros-claw/skills/issues",
  "GitHub root-relative link",
);
equal(
  resolveGitHubMarkdownUrl(realsenseSource, "javascript:alert(1)"),
  "",
  "unsafe link protocol",
);

if (failures.length) {
  console.error("GitHub source URL contract failed:");
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}
console.log("GitHub source URL contract passed.");
