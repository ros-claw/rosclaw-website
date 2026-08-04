import manifestJson from "./release-manifest.json";

export type ReleaseChannel = "stable" | "main";

export interface ReleaseSnapshot {
  version: string;
  label: string;
  maturity: "alpha" | "experimental";
  ref_type: "commit";
  tag?: string | null;
  branch?: string;
  commit: string;
  published_at: string;
  python: string[];
  install_strategy: "verified-git-commit";
  release_notes: string;
}

export interface ReleaseManifest {
  schema_version: string;
  generated_at: string;
  repository: string;
  stable: ReleaseSnapshot;
  main: ReleaseSnapshot;
}

export const releaseManifest = manifestJson as ReleaseManifest;

export function releaseChannel(channel: ReleaseChannel): ReleaseSnapshot {
  return releaseManifest[channel];
}

export function shortCommit(commit: string): string {
  return commit.slice(0, 8);
}
