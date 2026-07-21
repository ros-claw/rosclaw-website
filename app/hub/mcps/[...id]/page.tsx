import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { McpPackageClient } from "../../../mcp-hub/[...slug]/mcp-package-client";
import { loadMcpPackage } from "@/lib/registry/server";

interface McpPackagePageProps {
  params: Promise<{ id: string[] }>;
}

// Enable dynamic params for catch-all routes
export const dynamicParams = true;
export const revalidate = 300;

// Generate static params (empty array = all paths generated on-demand)
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: McpPackagePageProps): Promise<Metadata> {
  const { id } = await params;
  const fullPath = id.join("/");
  const pkg = await loadMcpPackage(fullPath);
  return {
    title: `${pkg?.name ?? fullPath} | Hardware MCP Registry | ROSClaw`,
    description: pkg?.description ?? `Inspect the tools, target hardware, source, and install contract for the ${fullPath} MCP package on ROSClaw.`,
    alternates: {
      canonical: `/hub/mcps/${id.map(encodeURIComponent).join("/")}`,
    },
  };
}

export default async function McpPackagePage({ params }: McpPackagePageProps) {
  const { id } = await params;
  const fullPath = id.join("/");
  const initialPackage = await loadMcpPackage(fullPath);
  if (initialPackage === null) notFound();
  return <McpPackageClient id={fullPath} initialPackage={initialPackage ?? undefined} />;
}
