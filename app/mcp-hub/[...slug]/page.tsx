import { McpPackageClient } from "./mcp-package-client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: { slug: string[] } }): Promise<Metadata> {
  const fullPath = params.slug.join("/");
  return {
    title: "MCP Package | ROSClaw",
    description: `${fullPath} - ROSClaw MCP Package`,
  };
}

interface McpPackagePageProps {
  params: { slug: string[] };
}

export default function McpPackagePage({ params }: McpPackagePageProps) {
  // Join slug array back to full path (owner/repo)
  const fullPath = params.slug.join("/");
  return <McpPackageClient id={fullPath} />;
}
