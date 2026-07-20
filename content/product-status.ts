import snapshotJson from "./product-status.json";

export type ProductState =
  | "verified"
  | "developer_observed"
  | "fixture_available"
  | "fixture_verified"
  | "not_applicable"
  | "not_run"
  | "not_verified";

export interface ProductEvidence {
  id: string;
  kind: string;
  path: string;
  observation_scope: string;
  fixture: boolean;
  independent: boolean;
  verified_at?: string;
  commit_sha?: string;
}

export interface GoldenPathStatus {
  display: { en: string; zh: string };
  robot: string;
  capability: string;
  claim: string;
  support_tier: string;
  candidate_tier: string;
  modes: Record<string, ProductState>;
  dimensions: Record<string, ProductState>;
  agent_ready: boolean;
  evidence: ProductEvidence[];
  evidence_summary: { en: string; zh: string };
}

export interface ComponentStatus {
  display: { en: string; zh: string };
  claim: string;
  evidence: ProductEvidence[];
  evidence_summary: { en: string; zh: string };
}

export interface ProductStatus {
  schema_version: string;
  release: {
    version: string;
    maturity: string;
    supported_python: string[];
  };
  golden_paths: Record<string, GoldenPathStatus>;
  components: Record<string, ComponentStatus>;
}

interface ProductStatusSnapshot {
  generated: {
    schema_version: string;
    source: string;
    source_sha256: string;
  };
  status: ProductStatus;
}

export const productStatusSnapshot =
  snapshotJson as unknown as ProductStatusSnapshot;
export const productStatus = productStatusSnapshot.status;
export const release = productStatus.release;

export const stateLabels: Record<ProductState, string> = {
  verified: "Verified",
  developer_observed: "Developer observed",
  fixture_available: "Fixture available",
  fixture_verified: "Fixture verified",
  not_applicable: "N/A",
  not_run: "Not run",
  not_verified: "Not verified",
};

export const robotSupportRows = [
  productStatus.golden_paths.ur5e_reach,
  productStatus.golden_paths.realsense_inspect,
  productStatus.golden_paths.rh56_single_step,
  productStatus.golden_paths.turtlesim_guarded_motion,
];
