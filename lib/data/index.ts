import packagesData from "./packages.json";

export interface McpTool {
  name: string;
  description: string;
}

export interface McpPackage {
  id: string;
  name: string;
  displayName: string;
  description: string;
  author: string;
  authorUrl: string;
  githubUrl: string;
  verified: boolean;
  isOfficial: boolean;
  category: string;
  robotType: string;
  version: string;
  updatedAt: string;
  stars: number;
  downloads: number;
  tags: string[];
  tools: McpTool[];
}

// Get all packages
export function getAllPackages(): McpPackage[] {
  return packagesData.packages;
}

// Get package by ID
export function getPackageById(id: string): McpPackage | undefined {
  return packagesData.packages.find((p) => p.id === id);
}

// Get package by name
export function getPackageByName(name: string): McpPackage | undefined {
  return packagesData.packages.find((p) => p.name === name);
}

// Check if package name exists
export function packageNameExists(name: string): boolean {
  return packagesData.packages.some(
    (p) => p.name.toLowerCase() === name.toLowerCase()
  );
}

// Get all categories with counts
export function getCategories(): { id: string; name: string; count: number }[] {
  const categories = [
    { id: "all", name: "All Packages" },
    { id: "manipulators", name: "Manipulators" },
    { id: "humanoids", name: "Humanoids" },
    { id: "mobile", name: "Mobile Bases" },
    { id: "sensors", name: "Sensors" },
    { id: "grippers", name: "Grippers" },
    { id: "cameras", name: "Cameras" },
  ];

  return categories.map((cat) => ({
    ...cat,
    count:
      cat.id === "all"
        ? packagesData.packages.length
        : packagesData.packages.filter(
            (p) => p.category.toLowerCase() === cat.name.toLowerCase()
          ).length,
  }));
}

// Filter packages
export function filterPackages(
  category: string,
  searchQuery: string
): McpPackage[] {
  return packagesData.packages.filter((pkg) => {
    const matchesCategory =
      category === "all" ||
      pkg.category.toLowerCase().replace(/\s+/g, "-") === category;
    const matchesSearch =
      !searchQuery ||
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });
}

// Generate install command
export function generateInstallCommand(name: string): string {
  return `rosclaw mcp install ${name}`;
}

// Generate agent adaptation commands
export function getAgentAdaptations(name: string): {
  agent: string;
  command: string;
  description: string;
}[] {
  return [
    {
      agent: "ROSClaw CLI",
      command: `rosclaw mcp install ${name}`,
      description: "Native ROSClaw command-line interface",
    },
    {
      agent: "OpenClaw",
      command: `install mcp ${name}`,
      description: "OpenClaw agent: 'install mcp package-name'",
    },
    {
      agent: "Claude Code",
      command: `@rosclaw install mcp ${name}`,
      description: "Claude Code with ROSClaw MCP: '@rosclaw install mcp package-name'",
    },
    {
      agent: "Generic Agent",
      command: `Use the ROSClaw MCP tool to install package "${name}"`,
      description: "Natural language instruction for any LLM agent",
    },
  ];
}

// Suggest alternative names
export function suggestAlternativeNames(name: string): string[] {
  return [
    `${name}-v2`,
    `${name}-community`,
    `${name}-${Math.floor(Math.random() * 1000)}`,
    `my-${name}`,
  ];
}
