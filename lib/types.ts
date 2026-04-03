// Domain types for the ROSClaw project

// --- Skill (mirrors the skills table) ---
export interface Skill {
  id: string
  name: string
  displayName: string
  description: string
  category: Category
  version: string
  authorName: string
  authorUrl: string
  githubRepoUrl: string
  downloadsCount: number
  rating: number
  reviewCount: number
  status: 'draft' | 'published' | 'archived'
  robotTypes: string[]
  tags: string[]
  dependencies: string[]
  installCommand: string
  iconUrl: string
  createdAt: string
  updatedAt: string
}

// --- McpPackage (mirrors mcp_packages table) ---
export interface McpPackage {
  id: string
  name: string
  displayName: string
  description: string
  category: Category
  version: string
  authorName: string
  verified: boolean
  githubRepoUrl: string
  downloadsCount: number
  rating: number
  reviewCount: number
  rosVersion: string
  safetyCert: string
  pythonVersion: string
  status: 'draft' | 'published' | 'archived'
  robotType: string | null
  tags: string[]
  tools: { name: string; description: string }[]
  installCommand: string
  createdAt: string
  updatedAt: string
}

// --- Profile (mirrors profiles table) ---
export interface Profile {
  id: string
  username: string
  fullName: string
  avatarUrl: string
  githubUsername: string
}

// --- Changelog entry ---
export interface ChangelogEntry {
  id: string
  parentType: 'skill' | 'mcp_package'
  parentId: string
  version: string
  changes: string[]
  createdAt: string
}

// --- Category union type ---
export type Category = 'Humanoids' | 'Manipulators' | 'Mobiles' | 'Sensors' | 'General'
