import { McpPackageClient } from "./mcp-package-client";
import { getAllPackages, getPackageById } from "@/lib/data";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const packages = getAllPackages();
  return packages.map((pkg) => ({
    id: pkg.id,
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const pkg = getPackageById(params.id);

  if (!pkg) {
    return {
      title: "Package Not Found | ROSClaw MCP Hub",
      description: "The requested MCP package could not be found.",
    };
  }

  const title = `${pkg.name} | ROSClaw MCP Package`;
  const description = `${pkg.description} Install ${pkg.name} with one command. Compatible with ${pkg.robotType}. ${pkg.tools.length}+ MCP tools included.`;

  return {
    title,
    description,
    keywords: [
      pkg.name,
      pkg.category,
      pkg.robotType,
      "MCP package",
      "robot driver",
      "ROSClaw",
      "Model Context Protocol",
      ...pkg.tags.slice(0, 5),
    ],
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "ROSClaw",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: {
      canonical: `https://rosclaw.io/mcp-hub/${pkg.id}`,
    },
  };
}

interface McpPackagePageProps {
  params: { id: string };
}

export default function McpPackagePage({ params }: McpPackagePageProps) {
  return <McpPackageClient id={params.id} />;
}
