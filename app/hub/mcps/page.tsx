import type { Metadata } from "next";
import { McpRegistryClient } from "@/components/hub/mcp-registry-client";
import { loadMcpPackages } from "@/lib/registry/server";

export const metadata: Metadata = {
  title: "Hardware MCP Registry | ROSClaw",
  description: "Server-rendered registry of typed physical interfaces for embodied agents.",
};

export const revalidate = 300;

export default async function McpsPage() {
  const registry = await loadMcpPackages();
  return (
    <McpRegistryClient
      initialPackages={registry.items}
      initialLoadError={!registry.available}
    />
  );
}
