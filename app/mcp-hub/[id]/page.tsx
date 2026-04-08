import { McpPackageClient } from "./mcp-package-client";
import { getAllPackages } from "@/lib/data";

export async function generateStaticParams() {
  const packages = getAllPackages();
  return packages.map((pkg) => ({
    id: pkg.id,
  }));
}

interface McpPackagePageProps {
  params: { id: string };
}

export default function McpPackagePage({ params }: McpPackagePageProps) {
  return <McpPackageClient id={params.id} />;
}
