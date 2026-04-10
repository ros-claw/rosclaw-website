import { McpPackageClient } from "./mcp-package-client";
import type { Metadata } from "next";

// Disable static generation for dynamic API data
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: "MCP Package | ROSClaw",
    description: "ROSClaw MCP Package - Model Context Protocol server for embodied AI.",
  };
}

interface McpPackagePageProps {
  params: { id: string };
}

export default function McpPackagePage({ params }: McpPackagePageProps) {
  return <McpPackageClient id={params.id} />;
}
