import type { Metadata } from "next";
import PublishMcpPackageClient from "./publish-client";

export const metadata: Metadata = {
  title: "Publish MCP Package | ROSClaw",
  description:
    "Publish your robot driver or hardware interface to the ROSClaw MCP Hub. Share your MCP package with the community. One-click GitHub import.",
  keywords: [
    "Publish MCP Package",
    "Submit Robot Driver",
    "ROSClaw Registry",
    "Open Source Robotics",
    "MCP Package",
    "Robot Hardware Interface",
    "GitHub Import",
  ],
  openGraph: {
    title: "Publish MCP Package | ROSClaw",
    description: "Share your robot driver with the ROSClaw community",
    type: "website",
  },
  alternates: {
    canonical: "https://rosclaw.io/mcp-hub/publish",
  },
};

export default function PublishMcpPackagePage() {
  return <PublishMcpPackageClient />;
}
