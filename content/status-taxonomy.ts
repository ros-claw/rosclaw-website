export type ProductStatusLabel =
  | "Verified"
  | "Simulation Verified"
  | "Developer Observed"
  | "Component Tested"
  | "Installable"
  | "Manifest Validated"
  | "Experimental"
  | "Planned"
  | "Unavailable"
  | "Indexed"
  | "Fresh";

export const statusTaxonomy: Record<
  ProductStatusLabel,
  { description: string; tone: "success" | "info" | "warning" | "danger" | "neutral" }
> = {
  Verified: {
    description: "The scoped claim has qualifying evidence. Read the evidence boundary before extending the claim.",
    tone: "success",
  },
  "Simulation Verified": {
    description: "A physics-backed simulation completed and produced valid evidence. This does not imply real-hardware acceptance.",
    tone: "success",
  },
  "Developer Observed": {
    description: "A developer recorded the behavior, but it has not passed independent verification.",
    tone: "warning",
  },
  "Component Tested": {
    description: "Automated component or contract tests pass. Physical readiness is not implied.",
    tone: "info",
  },
  Installable: {
    description: "A reviewed installation path is available. Installation alone does not grant physical authority.",
    tone: "success",
  },
  "Manifest Validated": {
    description: "A manifest passed schema validation with durable evidence. Runtime execution is a separate claim.",
    tone: "info",
  },
  Experimental: {
    description: "Available on the Main channel for development and evaluation; interfaces may change.",
    tone: "warning",
  },
  Planned: {
    description: "The capability is on the roadmap and is not currently available for use.",
    tone: "neutral",
  },
  Unavailable: {
    description: "No supported path is currently published.",
    tone: "danger",
  },
  Indexed: {
    description: "Discovery metadata is indexed. This is not an installability, validation, or execution claim.",
    tone: "neutral",
  },
  Fresh: {
    description: "The cached source snapshot was synchronized within the registry refresh window.",
    tone: "success",
  },
};
