// CLI content shown on public product surfaces. Commands here are contract-tested.

import { release } from "./product-status";
import { GITHUB_RAW_URL, GITHUB_URL } from "./shared";

export type CommandStatus =
  | "Verified"
  | "Alpha"
  | "Experimental"
  | "Planned"
  | "Research";

export interface CliCommand {
  command: string;
  status: CommandStatus;
  note?: string;
}

export interface FirstEmbodimentStep {
  id: string;
  title: string;
  description: string;
  command: CliCommand;
  terminalOutput: string[];
  passport: Record<string, string>;
}

export const terminalCommands: CliCommand[] = [
  { command: "curl -sSL https://rosclaw.io/get | bash", status: "Alpha" },
  { command: "rosclaw demo run ur5e-reach", status: "Verified" },
  { command: "rosclaw explain latest", status: "Verified" },
];

export const firstEmbodimentSteps: FirstEmbodimentStep[] = [
  {
    id: "install",
    title: "Install ROSClaw",
    description:
      "Install the current alpha CLI. The installer does not enable hardware actions.",
    command: {
      command: "curl -sSL https://rosclaw.io/get | bash",
      status: "Alpha",
    },
    terminalOutput: [
      `Release: ${release.version}`,
      `Maturity: ${release.maturity.toUpperCase()}`,
      `Python: ${release.supported_python.join(", ")}`,
      "Hardware actions: disabled until explicitly configured",
    ],
    passport: {
      CLI: `v${release.version}`,
      Mode: "alpha",
    },
  },
  {
    id: "firstboot",
    title: "First Boot",
    description:
      "Create a local offline workspace. Firstboot never commands a real robot.",
    command: {
      command:
        "rosclaw firstboot --yes --profile offline --no-telemetry",
      status: "Alpha",
    },
    terminalOutput: [
      "Workspace:  ~/.rosclaw",
      "Profile:    offline",
      "Hardware actions: disabled",
      "Next: rosclaw demo run ur5e-reach",
    ],
    passport: {
      CLI: `v${release.version}`,
      Workspace: "~/.rosclaw",
      Mode: "offline",
      Safety: "strict",
    },
  },
  {
    id: "simulation",
    title: "Run Verified Simulation",
    description:
      "Execute the real MuJoCo UR5e golden path through Runtime and ActionGateway.",
    command: {
      command: "rosclaw demo run ur5e-reach",
      status: "Verified",
    },
    terminalOutput: [
      "Execution mode:   SIMULATION",
      "Robot:            sim_ur5e",
      "Policy:           ALLOW",
      "Physics:          yes (MuJoCo)",
      "Collision check:  PASS",
      "Task verified:    YES (TASK_VERIFIED)",
    ],
    passport: {
      CLI: `v${release.version}`,
      Workspace: "~/.rosclaw",
      Mode: "SIMULATION",
      Robot: "sim_ur5e",
      Profile: "body snapshot bound",
      Capabilities: "sandbox.reach",
      Safety: "policy allowed",
      Decision: "TASK_VERIFIED",
    },
  },
  {
    id: "explain",
    title: "Inspect the Evidence",
    description:
      "See what ROSClaw checked, executed, observed, and verified in the latest run.",
    command: {
      command: "rosclaw explain latest",
      status: "Verified",
    },
    terminalOutput: [
      "Body snapshot:    sha256:<model-hash>",
      "Policy:           ALLOW (target_within_declared_workspace)",
      "Final state:      COMPLETED",
      "Task verified:    YES (TASK_VERIFIED)",
      "Trace:            trace_<id>",
      "Receipt:          ~/.rosclaw/runs/<run-id>/receipt.json",
    ],
    passport: {
      CLI: `v${release.version}`,
      Workspace: "~/.rosclaw",
      Mode: "SIMULATION",
      Robot: "sim_ur5e",
      Profile: "body snapshot bound",
      Capabilities: "sandbox.reach",
      Safety: "policy allowed",
      Decision: "TASK_VERIFIED",
      Trace: "trace + trajectory + receipt",
      Status: "verified simulation",
    },
  },
];

export const tripleCardCommands = {
  guard: {
    title: "Guard the Action",
    headline: "No model output directly controls a robot.",
    description:
      "A target outside the declared workspace is blocked before physics or dispatch.",
    command: {
      command:
        "rosclaw demo run ur5e-reach --target 2 0 0.5 --json",
      status: "Verified" as CommandStatus,
    },
    badge: "ALLOW / BLOCK",
  },
  remember: {
    title: "Remember the Trace",
    headline: "Physical memory is not chat history.",
    description:
      "It is structured evidence from embodied interaction: what was tried, what failed, and what recovered.",
    command: {
      command: 'rosclaw memory query "similar failures near red cup"',
      status: "Experimental" as CommandStatus,
    },
  },
  evolve: {
    title: "Evolve the Skill",
    headline:
      "A failed attempt can become a tested proposal or a recorded dead end.",
    description:
      "Evaluation and promotion surfaces remain experimental and never self-authorize real execution.",
    commands: [
      {
        command: "rosclaw auto run --task pick_cup --rounds 3",
        status: "Experimental" as CommandStatus,
      },
      {
        command: "rosclaw auto champion --task pick_cup",
        status: "Experimental" as CommandStatus,
      },
    ],
  },
};

export const runtimeCapabilities = [
  {
    title: "Embodiment Grounding",
    status: "Alpha" as CommandStatus,
    oneLiner:
      "Bind bodies, sensors, actuators, calibration, limits, and capabilities through e-URDF and body.yaml.",
    commands: [
      "rosclaw body init --robot realsense-d405 --name d405_lab_01 --validate",
      "rosclaw robot inspect ur5e",
    ],
  },
  {
    title: "Verified MuJoCo Execution",
    status: "Verified" as CommandStatus,
    oneLiner:
      "Run a physics-backed action, enforce workspace and collision policy, and issue an evidence-bearing receipt.",
    commands: [
      "rosclaw demo run ur5e-reach",
      "rosclaw explain latest",
    ],
  },
  {
    title: "Capability Status",
    status: "Verified" as CommandStatus,
    oneLiner:
      "Inspect one machine-readable source for simulation, hardware, Agent, and evidence readiness.",
    commands: [
      "rosclaw status capabilities",
      "rosclaw status capabilities --json",
    ],
  },
  {
    title: "Capability Routing",
    status: "Experimental" as CommandStatus,
    oneLiner:
      "Route model and classical providers behind schemas and guard policy.",
    commands: ["rosclaw provider list", "rosclaw provider route --help"],
  },
  {
    title: "Practice Capture",
    status: "Alpha" as CommandStatus,
    oneLiner:
      "Record robot state, action proposals, observations, failures, and recoveries.",
    commands: [
      "rosclaw practice list",
      "rosclaw practice show <episode-id>",
    ],
  },
  {
    title: "Physical Memory",
    status: "Experimental" as CommandStatus,
    oneLiner:
      "Turn evidence-bearing episodes into failure and success patterns.",
    commands: [
      'rosclaw memory query "last failed grasp"',
      "rosclaw memory explain --help",
    ],
  },
];

export const githubDocLinks = {
  readme: GITHUB_URL,
  quickstart: `${GITHUB_RAW_URL}/QUICKSTART.md`,
  install: `${GITHUB_RAW_URL}/INSTALL.md`,
  firstboot: `${GITHUB_RAW_URL}/docs/FIRSTBOOT.md`,
  cli: `${GITHUB_RAW_URL}/docs/CLI.md`,
  architecture: `${GITHUB_RAW_URL}/ARCHITECTURE.md`,
  safety: `${GITHUB_RAW_URL}/docs/SAFETY.md`,
  assets: `${GITHUB_RAW_URL}/docs/ASSETS.md`,
  hub: `${GITHUB_RAW_URL}/docs/hub/README.md`,
};
