export interface McpPackageSummary {
  id: string;
  name: string;
  description: string;
  authorName: string;
  githubRepoUrl?: string;
  manifestValidated: boolean;
  category?: string;
  robotType?: string;
  version?: string;
  githubStars?: number;
  viewsCount?: number;
  tags?: string[];
  tools?: { name: string; description: string }[];
}

export interface McpPackageDetail extends McpPackageSummary {
  longDescription?: string;
  readmeContent?: string;
  status?: string;
}

export interface SkillSummary {
  id: string;
  name: string;
  displayName?: string;
  description: string;
  authorName: string;
  githubRepoUrl?: string;
  category?: string;
  version?: string;
  githubStars?: number;
  viewsCount?: number;
  rating?: number;
  robotTypes?: string[];
  tags?: string[];
  dependencies?: string[];
}

export interface SkillDetail extends SkillSummary {
  longDescription?: string;
  readmeContent?: string;
  authorUrl?: string;
  compatibleRobots?: string[];
  status?: string;
}

export interface RegistryLoad<T> {
  items: T[];
  available: boolean;
}
