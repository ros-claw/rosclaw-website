import packagesData from "./packages.json";

export interface McpTool {
  name: string;
  description: string;
}

export interface McpPackage {
  id: string;
  name: string;
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

// Get all packages from local JSON (legacy - now empty)
export function getAllPackages(): McpPackage[] {
  return (packagesData.packages || []) as McpPackage[];
}

// Get package by ID (legacy - now uses API)
export function getPackageById(id: string): McpPackage | undefined {
  const packages = (packagesData.packages || []) as McpPackage[];
  return packages.find((p: McpPackage) => p.id === id);
}

// Get all packages including user-submitted ones (legacy)
export function getAllPackagesWithUserSubmitted(): McpPackage[] {
  return (packagesData.packages || []) as McpPackage[];
}

// Get package by name (legacy)
export function getPackageByName(name: string): McpPackage | undefined {
  const packages = (packagesData.packages || []) as McpPackage[];
  return packages.find((p: McpPackage) => p.name === name);
}

// Check if package name exists (legacy - always returns false now)
export function packageNameExists(name: string): boolean {
  const packages = (packagesData.packages || []) as McpPackage[];
  return packages.some(
    (p: McpPackage) => p.name.toLowerCase() === name.toLowerCase()
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

  const packages = (packagesData.packages || []) as McpPackage[];

  return categories.map((cat) => ({
    ...cat,
    count:
      cat.id === "all"
        ? packages.length
        : packages.filter(
            (p: McpPackage) => p.category.toLowerCase() === cat.name.toLowerCase()
          ).length,
  }));
}

// Filter packages (legacy)
export function filterPackages(
  category: string,
  searchQuery: string
): McpPackage[] {
  const packages = (packagesData.packages || []) as McpPackage[];
  return packages.filter((pkg: McpPackage) => {
    const matchesCategory =
      category === "all" ||
      pkg.category.toLowerCase().replace(/\s+/g, "-") === category;
    const matchesSearch =
      !searchQuery ||
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.tags.some((tag: string) =>
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
export function getAgentAdaptations(name: string, githubUrl: string): {
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
      command: `install mcp from ${githubUrl}`,
      description: "OpenClaw agent needs the full GitHub URL",
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
