// CLI-related content used across the ROSClaw website.
// Commands are aligned with the current ROSClaw CLI reference.

import { GITHUB_RAW_URL, GITHUB_URL } from "./shared";

export type CommandStatus = "Stable" | "Experimental" | "Planned" | "Research";

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
  { command: "curl -sSL https://rosclaw.io/get | bash", status: "Stable" },
  { command: "rosclaw firstboot", status: "Stable" },
];

export const firstEmbodimentSteps: FirstEmbodimentStep[] = [
  {
    id: "install",
    title: "Install ROSClaw",
    description: "Download and install the ROSClaw CLI to your local workspace.",
    command: { command: "curl -sSL https://rosclaw.io/get | bash", status: "Stable" },
    terminalOutput: [
      "Downloading rosclaw v0.8.2...",
      "Verifying checksum...",
      "Installing to ~/.local/bin/rosclaw",
      "Done. Run 'rosclaw --help' to get started.",
    ],
    passport: {
      CLI: "ready",
    },
  },
  {
    id: "firstboot",
    title: "First Boot",
    description: "Initialize the runtime workspace, sandbox, and memory namespace.",
    command: {
      command: "rosclaw firstboot --yes --profile offline --enable-sandbox --enable-memory",
      status: "Stable",
    },
    terminalOutput: [
      "Creating ~/.rosclaw workspace...",
      "Mode: offline (local-only)",
      "Sandbox: enabled",
      "Memory: enabled",
      "Config written to ~/.rosclaw/config.yaml",
    ],
    passport: {
      CLI: "ready",
      Workspace: "~/.rosclaw",
      Mode: "offline",
      Safety: "strict",
      Memory: "enabled",
    },
  },
  {
    id: "body",
    title: "Create a Body",
    description: "Register a robot body profile and link its e-URDF description.",
    command: {
      command: "rosclaw body init --robot unitree-g1 --validate --render",
      status: "Stable",
    },
    terminalOutput: [
      "Created body.yaml for unitree-g1",
      "Linked e-URDF profile",
      "Joints: 29 | Sensors: 12 | Limits: loaded",
      "Safety envelope ready",
    ],
    passport: {
      CLI: "ready",
      Workspace: "~/.rosclaw",
      Mode: "offline",
      Robot: "unitree-g1",
      Profile: "e-URDF linked",
      Capabilities: "loaded",
      Safety: "envelope loaded",
      Memory: "enabled",
    },
  },
  {
    id: "sandbox",
    title: "Validate Before Reality",
    description: "Run the action through the digital twin before touching hardware.",
    command: {
      command: "rosclaw sandbox run --robot sim_g1 --task stand_balance",
      status: "Stable",
    },
    terminalOutput: [
      "Loading digital twin for sim_g1...",
      "Checking joint limits...",
      "Simulating stand_balance...",
      "Decision: ALLOW_WITH_LIMITS",
      "Trace saved: first_embodiment_001.mcap",
    ],
    passport: {
      CLI: "ready",
      Workspace: "~/.rosclaw",
      Mode: "offline",
      Robot: "unitree-g1",
      Profile: "e-URDF linked",
      Capabilities: "loaded",
      Safety: "envelope loaded",
      Decision: "ALLOW_WITH_LIMITS",
      Trace: "first_embodiment_001.mcap",
      Memory: "enabled",
    },
  },
  {
    id: "dashboard",
    title: "Open the Trace Viewer",
    description: "Launch the local dashboard to inspect robot state, sandbox decisions, and memory writes.",
    command: { command: "rosclaw dashboard --open", status: "Experimental" },
    terminalOutput: [
      "Starting dashboard on localhost:8080...",
      "Connected to local runtime",
      "Loaded trace: first_embodiment_001.mcap",
      "Panels: Robot State, Sandbox Decisions, Agent Plans, Provider Calls, Memory Writes",
    ],
    passport: {
      CLI: "ready",
      Workspace: "~/.rosclaw",
      Mode: "offline",
      Robot: "unitree-g1",
      Profile: "e-URDF linked",
      Capabilities: "loaded",
      Safety: "envelope loaded",
      Decision: "ALLOW_WITH_LIMITS",
      Trace: "first_embodiment_001.mcap",
      Dashboard: "open",
      Viewer: "open",
      Status: "embodied",
      Memory: "enabled",
    },
  },
];

export const tripleCardCommands = {
  guard: {
    title: "Guard the Action",
    headline: "No model output directly controls a robot.",
    description:
      "Every action is a proposal until sandbox and runtime guards approve it.",
    command: {
      command: "rosclaw sandbox check --robot sim_g1 --action actions/kick.json",
      status: "Stable" as CommandStatus,
    },
    badge: "ALLOW / MODIFY / BLOCK",
  },
  remember: {
    title: "Remember the Trace",
    headline: "Physical memory is not chat history.",
    description:
      "It is structured evidence from embodied interaction: what was tried, what failed, what changed, what recovered.",
    command: {
      command: 'rosclaw memory query "similar failures near red cup"',
      status: "Experimental" as CommandStatus,
    },
  },
  evolve: {
    title: "Evolve the Skill",
    headline: "Every failed attempt becomes a tested patch or a recorded dead end.",
    description:
      "Run evaluation rounds, promote champions, and roll back when performance regresses.",
    commands: [
      { command: "rosclaw auto run --task pick_cup --rounds 3", status: "Experimental" as CommandStatus },
      { command: "rosclaw auto champion --task pick_cup", status: "Experimental" as CommandStatus },
    ],
  },
};

export const runtimeCapabilities = [
  {
    title: "Embodiment Grounding",
    status: "Stable" as CommandStatus,
    oneLiner:
      "Describe robot bodies, sensors, actuators, safety limits, capabilities, tool frames, and simulation metadata through e-URDF and body.yaml.",
    commands: [
      "rosclaw body init --robot unitree-g1 --validate --render",
      "rosclaw body link-eurdf unitree-g1",
    ],
  },
  {
    title: "Sandbox-before-Reality",
    status: "Stable" as CommandStatus,
    oneLiner:
      "Validate action proposals in digital twins before they touch real hardware.",
    commands: [
      "rosclaw sandbox run --robot sim_g1 --task stand_balance",
      "rosclaw sandbox check --robot sim_g1 --action actions/stand_balance.json",
    ],
  },
  {
    title: "Capability Routing",
    status: "Experimental" as CommandStatus,
    oneLiner:
      "List and invoke providers: LLMs, VLMs, VLAs, VLNs, world models, critics, embeddings, classical robotics algorithms, and skill policies.",
    commands: [
      "rosclaw provider list",
      "rosclaw provider invoke <provider_name> --input request.json",
    ],
  },
  {
    title: "Praxis Capture",
    status: "Stable" as CommandStatus,
    oneLiner:
      "Record robot states, sensor streams, action proposals, tool calls, sandbox decisions, failures, and recoveries.",
    commands: [
      "rosclaw practice list",
      "rosclaw practice show <trace_id>",
      "rosclaw practice replay <trace_id>",
    ],
  },
  {
    title: "Physical Memory",
    status: "Experimental" as CommandStatus,
    oneLiner:
      "Turn physical traces into spatiotemporal memory, failure evidence, success patterns, and reusable experience.",
    commands: [
      'rosclaw memory query "last failed grasp near red cup"',
      "rosclaw memory explain <trace_id>",
    ],
  },
  {
    title: "Runtime Intervention",
    status: "Research" as CommandStatus,
    oneLiner:
      "Explain what went wrong and generate evidence-backed recovery plans when an embodied agent is stuck or unsafe.",
    commands: [
      "rosclaw how explain <trace_id>",
      "rosclaw how recover <trace_id> --output recovery_plan.yaml",
    ],
  },
  {
    title: "Skill Evolution",
    status: "Research" as CommandStatus,
    oneLiner:
      "Evaluate, patch, benchmark, promote, and roll back skills through automated validation loops.",
    commands: [
      "rosclaw auto run --task pick_cup --rounds 3 --episodes 20",
      "rosclaw auto champion --task pick_cup",
      "rosclaw skill rollback pick_cup --to v1",
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
