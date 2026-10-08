import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { McpPackageClient } from "../../../mcp-hub/[...slug]/mcp-package-client";
import { loadMcpPackage, loadRelatedRegistryItems } from "@/lib/registry/server";
import { detailMetadata, detailStructuredData } from "@/lib/registry/detail-seo";
import { RegistryJsonLd } from "@/components/hub/registry-jsonld";
import { RegistryIntegrationGuide } from "@/components/hub/registry-integration-guide";

interface McpPackagePageProps {
  params: Promise<{ id: string[] }>;
}

// Enable dynamic params for catch-all routes
export const dynamicParams = true;
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: McpPackagePageProps): Promise<Metadata> {
  const { id } = await params;
  const fullPath = id.join("/");
  const pkg = await loadMcpPackage(fullPath);
  return detailMetadata("mcps", fullPath, pkg);
}

export default async function McpPackagePage({ params }: McpPackagePageProps) {
  const { id } = await params;
  const fullPath = id.join("/");
  const initialPackage = await loadMcpPackage(fullPath);
  if (initialPackage === null) notFound();
  const related = initialPackage ? await loadRelatedRegistryItems(initialPackage, "mcps") : [];
  return <>
    {initialPackage && <RegistryJsonLd data={detailStructuredData("mcps", initialPackage)} />}
    <McpPackageClient id={fullPath} initialPackage={initialPackage ?? undefined} initialLoadError={initialPackage === undefined}>
      {initialPackage && <RegistryIntegrationGuide kind="mcps" item={initialPackage} related={related} />}
    </McpPackageClient>
  </>;
}
