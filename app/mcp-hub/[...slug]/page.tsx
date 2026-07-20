import { McpPackageClient } from "./mcp-package-client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const fullPath = slug.join("/");
  return {
    title: "MCP Package | ROSClaw",
    description: `${fullPath} - ROSClaw MCP Package`,
  };
}

interface McpPackagePageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function McpPackagePage({ params }: McpPackagePageProps) {
  // Join slug array back to full path (owner/repo)
  const { slug } = await params;
  const fullPath = slug.join("/");
  return <McpPackageClient id={fullPath} />;
}
