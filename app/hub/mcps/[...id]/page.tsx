import type { Metadata } from "next";
import { McpPackageClient } from "../../../mcp-hub/[...slug]/mcp-package-client";

interface McpPackagePageProps {
  params: { id: string[] };
}

// Enable dynamic params for catch-all routes
export const dynamicParams = true;

// Generate static params (empty array = all paths generated on-demand)
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: McpPackagePageProps): Promise<Metadata> {
  const fullPath = params.id.join("/");
  return {
    title: `${fullPath} | Hardware MCPs | ROSClaw`,
    description: `${fullPath} - Hardware MCP Package on ROSClaw`,
  };
}

export default function McpPackagePage({ params }: McpPackagePageProps) {
  const fullPath = params.id.join("/");
  return <McpPackageClient id={fullPath} />;
}
