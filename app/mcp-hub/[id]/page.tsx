import { McpPackageClient } from "./mcp-package-client";

export async function generateStaticParams() {
  return [
    { id: 'rosclaw-ur5-mcp' },
    { id: 'rosclaw-g1-mcp' },
    { id: 'rosclaw-go2-mcp' },
    { id: 'rosclaw-franka-mcp' },
    { id: 'rosclaw-realsense-mcp' },
    { id: 'rosclaw-turtlebot-mcp' },
  ];
}

interface McpPackagePageProps {
  params: { id: string };
}

export default function McpPackagePage({ params }: McpPackagePageProps) {
  return <McpPackageClient id={params.id} />;
}
