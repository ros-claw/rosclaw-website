import type { Metadata } from "next";
import { McpPackageClient } from "../../../mcp-hub/[...slug]/mcp-package-client";

interface McpPackagePageProps {
  params: { id: string[] };
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
