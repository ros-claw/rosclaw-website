import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ROSClaw",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Linux, macOS, Windows WSL",
  description:
    "Trustworthy physical execution runtime and control plane for embodied AI agents.",
  url: "https://www.rosclaw.io/",
  codeRepository: "https://github.com/ros-claw/rosclaw",
};

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.rosclaw.io"),
  title: "ROSClaw | Trustworthy Physical Execution Runtime",
  description:
    "Give any AI agent a body-aware, guarded, and auditable path to simulation and real robots.",
  keywords: [
    "ROSClaw",
    "Physical AI",
    "Embodied AI",
    "Embodied Agent",
    "Robot Runtime",
    "Robot Safety",
    "MCP Robotics",
    "Model Context Protocol",
    "VLA",
    "Vision Language Action",
    "VLN",
    "Digital Twin",
    "Physical Memory",
    "Robot Data Flywheel",
    "Self-Evolving Skills",
    "e-URDF",
    "ROS 2",
    "ROS2",
    "MuJoCo",
    "OpenClaw",
    "Unitree Robotics",
    "Unitree G1",
    "Unitree Go2",
    "UR5",
    "UR10",
    "Universal Robots",
    "Franka Emika",
    "Dexterous Manipulation",
    "Robot Learning",
    "Sim-to-Real",
  ],
  authors: [{ name: "ROSClaw Team" }],
  creator: "ROSClaw",
  publisher: "ROSClaw",
  robots: "index, follow",
  openGraph: {
    title: "ROSClaw — Trustworthy Physical Execution Runtime",
    description:
      "A body-aware, guarded, and auditable path from AI agents to simulation and real robots.",
    type: "website",
    locale: "en_US",
    siteName: "ROSClaw",
  },
  twitter: {
    card: "summary_large_image",
    title: "ROSClaw | Trustworthy Physical Execution Runtime",
    description:
      "Body-aware, guarded, and auditable physical execution for embodied AI.",
    creator: "@rosclaw",
  },
};

export const viewport: Viewport = {
  themeColor: "#060809",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${GeistSans.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Navbar />
        <div id="main-content" tabIndex={-1}>{children}</div>
        <Analytics />
      </body>
    </html>
  );
}
