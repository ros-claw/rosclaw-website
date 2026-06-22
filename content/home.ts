// Homepage copy and data for the ROSClaw website.

import { CONTACT_EMAIL, GITHUB_URL } from "./shared";

export const heroContent = {
  eyebrow: "Physical AI Runtime",
  title: {
    line1: "Self-Evolving Runtime",
    line2: "Infrastructure for Physical AI",
  },
  subtitle: ["Ground the agent.", "Guard the action.", "Evolve the skill."],
  description:
    "ROSClaw gives AI agents a body context, validates physical actions, captures traces, builds memory, and evolves safer skills.",
  ctas: {
    primary: { label: "Start First Embodiment", href: "/#first-embodiment" },
    secondary: { label: "View GitHub", href: GITHUB_URL },
    tertiary: { label: "Contact Us", href: `mailto:${CONTACT_EMAIL}` },
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
  eyebrow: "Current Status",
  title: "What Is Ready Today",
  description:
    "ROSClaw is under active development. Here is what you can try now, what is being built, and what remains research.",
  columns: [
    {
      title: "Ready Today",
      status: "Stable" as const,
      items: [
        "Local runtime workspace",
        "First Embodiment flow",
        "e-URDF profile structure",
        "Sandbox validation demos",
        "Hub manifest workflow",
        "Praxis trace schema",
        "Dashboard foundation",
      ],
    },
    {
      title: "In Progress",
      status: "Experimental" as const,
      items: [
        "Provider container lifecycle",
        "Hardware MCP auto-install",
        "Physical memory closed-loop evaluation",
        "Darwin skill promotion",
      ],
    },
    {
      title: "Research",
      status: "Research" as const,
      items: [
        "Cross-embodiment transfer",
        "Long-horizon physical memory",
        "Self-evolving VLA/VLN skills",
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
