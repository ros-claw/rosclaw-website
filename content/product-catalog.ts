export interface VerificationSignals {
  officialPublisher: boolean;
  manifestValidated: boolean;
  ciPassed: boolean;
  simulationVerified: boolean;
  hardwareObserved: boolean;
  hardwareVerified: boolean;
  agentVerified: boolean;
}

export interface RobotIntegrationCatalogEntry {
  slug: string;
  name: string;
  packageName?: string;
  summary: string;
  availability: "installable" | "migration_pending" | "simulation_only";
  compatibleModels: string[];
  installCommand?: string;
  adapter: string;
  capabilities: string[];
  calibration: string;
  verifiedModes: string[];
  compatibleApps: string[];
  statusKey: string;
  signals: VerificationSignals;
}

export interface AppCatalogEntry {
  slug: string;
  name: string;
  packageName?: string;
  summary: string;
  availability: "installable" | "binding_pending" | "planned";
  installCommand?: string;
  capabilities: string[];
  compatibleRobots: string[];
  statusKey?: string;
  signals: VerificationSignals;
}

export const robotIntegrations: RobotIntegrationCatalogEntry[] = [
  {
    slug: "realsense-d400",
    name: "RealSense D400",
    packageName: "ros-claw/realsense-d400",
    summary: "Signed read-only RGB-D integration with daemon-side MCP execution.",
    availability: "installable",
    compatibleModels: ["Intel RealSense D405", "Intel RealSense D435i"],
    installCommand: "rosclaw robot install ros-claw/realsense-d400",
    adapter: "librealsense-mcp (commit locked, MCP stdio worker)",
    capabilities: ["camera.capture_rgbd"],
    calibration: "Factory calibration required and read from the device",
    verifiedModes: ["Contract", "Process-fault fixture"],
    compatibleApps: ["RealSense Inspect (VLM provider required)"],
    statusKey: "realsense_inspect",
    signals: {
      officialPublisher: true,
      manifestValidated: true,
      ciPassed: true,
      simulationVerified: false,
      hardwareObserved: false,
      hardwareVerified: false,
      agentVerified: false,
    },
  },
  {
    slug: "inspire-rh56",
    name: "Inspire RH56",
    summary: "LeRobot and SerialModbus execution exists; migration into a signed Robot Integration worker is still open.",
    availability: "migration_pending",
    compatibleModels: ["Inspire Robots RH56 left hand"],
    adapter: "Current: LeRobot + SerialModbus; Robot Integration worker pending",
    capabilities: ["rh56.single_step"],
    calibration: "Per-hand limits and identity binding required",
    verifiedModes: ["Fixture", "Developer-observed Shadow", "Developer-observed Real"],
    compatibleApps: ["RH56 RPS (production binding pending)"],
    statusKey: "rh56_single_step",
    signals: {
      officialPublisher: false,
      manifestValidated: false,
      ciPassed: true,
      simulationVerified: false,
      hardwareObserved: true,
      hardwareVerified: false,
      agentVerified: false,
    },
  },
  {
    slug: "mobile-base",
    name: "Mobile Base",
    summary: "Controller deadman and continuous lease are verified in MuJoCo; no production Integration or physical claim exists.",
    availability: "simulation_only",
    compatibleModels: ["Differential-drive reference model"],
    adapter: "MuJoCo deadman acceptance harness",
    capabilities: ["base.velocity_command"],
    calibration: "Physical controller and motion-capture calibration not run",
    verifiedModes: ["MuJoCo simulation"],
    compatibleApps: ["Guarded Motion (planned)", "Mocap Navigation (planned)"],
    statusKey: "mobile_base_deadman",
    signals: {
      officialPublisher: false,
      manifestValidated: false,
      ciPassed: true,
      simulationVerified: true,
      hardwareObserved: false,
      hardwareVerified: false,
      agentVerified: false,
    },
  },
];

export const apps: AppCatalogEntry[] = [
  {
    slug: "realsense-inspect",
    name: "RealSense Inspect",
    packageName: "ros-claw/realsense-inspect",
    summary: "Capture aligned RGB-D artifacts, then request a capability-based visual risk assessment.",
    availability: "installable",
    installCommand: "rosclaw app install ros-claw/realsense-inspect",
    capabilities: ["camera.capture_rgbd", "vlm.risk_assessment"],
    compatibleRobots: ["RealSense D400 Integration"],
    statusKey: "realsense_inspect",
    signals: {
      officialPublisher: true,
      manifestValidated: true,
      ciPassed: true,
      simulationVerified: false,
      hardwareObserved: false,
      hardwareVerified: false,
      agentVerified: false,
    },
  },
  {
    slug: "rh56-rps",
    name: "RH56 RPS",
    packageName: "ros-claw/rh56-rps",
    summary: "Submit one bounded receding-horizon hand step through rosclawd and verify the returned state.",
    availability: "binding_pending",
    installCommand: "rosclaw app install ros-claw/rh56-rps",
    capabilities: ["rh56.single_step"],
    compatibleRobots: ["Inspire RH56 (production Runtime binding pending)"],
    statusKey: "rh56_single_step",
    signals: {
      officialPublisher: true,
      manifestValidated: true,
      ciPassed: true,
      simulationVerified: false,
      hardwareObserved: false,
      hardwareVerified: false,
      agentVerified: false,
    },
  },
  {
    slug: "guarded-motion",
    name: "Guarded Motion",
    summary: "Proposed continuous-lease motion recipe; no installable manifest is published.",
    availability: "planned",
    capabilities: ["base.velocity_command"],
    compatibleRobots: ["Mobile Base (planned)"],
    statusKey: "mobile_base_deadman",
    signals: {
      officialPublisher: false,
      manifestValidated: false,
      ciPassed: false,
      simulationVerified: false,
      hardwareObserved: false,
      hardwareVerified: false,
      agentVerified: false,
    },
  },
  {
    slug: "mocap-navigation",
    name: "Mocap Navigation",
    summary: "Proposed motion-capture navigation recipe; implementation and physical evidence are pending.",
    availability: "planned",
    capabilities: ["base.navigate", "localization.mocap_pose"],
    compatibleRobots: ["Mobile Base (planned)"],
    signals: {
      officialPublisher: false,
      manifestValidated: false,
      ciPassed: false,
      simulationVerified: false,
      hardwareObserved: false,
      hardwareVerified: false,
      agentVerified: false,
    },
  },
];
