// Homepage copy and data for the ROSClaw website.

import { CONTACT_EMAIL, GITHUB_URL } from "./shared";
import { productStatus, release } from "./product-status";

export const heroContent = {
  eyebrow: `v${release.version} · ${release.maturity}`,
  title: {
    line1: "Give AI a Body.",
    line2: "Let Experience Drive Evolution.",
  },
  category: "The Physical AI Runtime for Embodied Agents.",
  ecosystem: "Any Agent. Any Body. One Runtime.",
  loop: "Act → Verify → Remember → Evolve",
  description:
    "Connect AI agents to robots through one governed runtime: from body awareness and physical execution to verified experience, memory, and evolving skills.",
  ctas: {
    primary: { label: "Get Started", href: "/start" },
    secondary: { label: "Explore the Runtime", href: "/#mission" },
    tertiary: { label: "View GitHub", href: GITHUB_URL },
  },
};

export const ecosystemStripContent = {
  eyebrow: "Ecosystem",
  title: "Built for the Physical-AI Stack",
  description:
    "Agents, robot middleware, simulators, memory stores, model providers, and physical data pipelines.",
};

export const runtimeLoopContent = {
  eyebrow: "From Execution to Evolution",
  title: "Every Action Becomes Evidence",
  description:
    "Every physical action becomes evidence for safer execution, better recovery, and stronger skills.",
  cta: { label: "View full architecture", href: "/runtime" },
};

export const assetHubPreviewContent = {
  eyebrow: "Physical-AI Asset Hub",
  title: "Bodies, Models, Skills, and Traces — in One Registry",
  description:
    "Discover and validate e-URDF profiles, hardware MCPs, providers, digital twins, skills, and benchmarks.",
  cta: { label: "Browse the Hub", href: "/hub" },
};

export const builtForContent = {
  eyebrow: "Built For",
  title: "Who ROSClaw Is For",
  description:
    "A runtime layer for teams building, deploying, and evolving embodied intelligence.",
  cards: [
    {
      title: "Robotics Researchers",
      description:
        "Turn every episode into structured evidence for physical memory, benchmark loops, and skill evolution.",
    },
    {
      title: "Robot Developers",
      description:
        "Ground agents in real bodies, validate every command in simulation first, and capture failures as reusable memory.",
    },
    {
      title: "Industrial Physical-AI Teams",
      description:
        "Deploy runtime guardrails, traceability, and failure recovery for production robot fleets.",
    },
  ],
};

export const currentStatusContent = {
  eyebrow: `Current Status · v${release.version} ${release.maturity}`,
  title: "Evidence, Not Readiness Theater",
  description:
    "Verified, developer-observed, and not-yet-run paths are deliberately shown as different states.",
  columns: [
    {
      title: "Verified",
      status: "Verified" as const,
      items: [
        `${productStatus.golden_paths.ur5e_reach.display.en}: MuJoCo TASK_VERIFIED`,
        `${productStatus.components.action_gateway.display.en}: component/system tests`,
        `${productStatus.components.estop.display.en}: component tests only`,
      ],
    },
    {
      title: "Observed",
      status: "Observed" as const,
      items: [
        `${productStatus.golden_paths.rh56_single_step.display.en}: developer hardware reports`,
        "Independent v1 hardware revalidation is in progress",
        "No Agent black-box acceptance claim yet",
      ],
    },
    {
      title: "Not Verified",
      status: "Not Verified" as const,
      items: [
        `${productStatus.golden_paths.realsense_inspect.display.en}: hardware capture not run`,
        `${productStatus.golden_paths.turtlesim_guarded_motion.display.en}: golden path not run`,
        "Repository-wide real-robot readiness and physical E-Stop",
      ],
    },
  ],
};

export const contactContent = {
  eyebrow: "Contact",
  title: "Let's Build the Runtime for Physical AI",
  description:
    "We are looking for researchers, robot builders, embodied agent developers, foundation model teams, and industrial partners who care about Physical AI infrastructure.",
  ctas: {
    email: { label: "Email", href: `mailto:${CONTACT_EMAIL}` },
    github: { label: "GitHub", href: GITHUB_URL },
    firstEmbodiment: { label: "Start First Embodiment", href: "/#first-embodiment" },
  },
  cards: [
    {
      title: "Research Collaboration",
      description: "Explore physical memory, skill evolution, and runtime safety models.",
    },
    {
      title: "Robot Platform Integration",
      description: "Add new bodies, simulators, and hardware MCPs to the ecosystem.",
    },
    {
      title: "Provider Integration",
      description: "Connect VLAs, VLMs, world models, and classical controllers to the runtime.",
    },
    {
      title: "Industrial Physical-AI Use Cases",
      description: "Deploy runtime guardrails and traceability for production robot teams.",
    },
  ],
};
