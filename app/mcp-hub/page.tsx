import type { Metadata } from "next";
import { McpHubClient } from "./mcp-hub-client";

export const metadata: Metadata = {
  title: "MCP Hub | ROSClaw - Robot Drivers & Hardware",
  description:
    "Browse and install ROSClaw-compatible robot drivers. 150+ MCP packages for UR5, Unitree G1, Franka, and more. Model Context Protocol hardware integration.",
  keywords: [
    "MCP Hub",
    "ROSClaw MCP",
    "Robot Drivers",
    "Model Context Protocol",
    "UR5 Driver",
    "Unitree G1 Driver",
    "Franka Driver",
    "ROS 2 Drivers",
    "Hardware Integration",
    "Robot Middleware",
  ],
  openGraph: {
    title: "MCP Hub | ROSClaw",
    description: "Browse and install ROSClaw-compatible robot drivers",
    type: "website",
  },
};

export default function McpHubPage() {
  return <McpHubClient />;
}
