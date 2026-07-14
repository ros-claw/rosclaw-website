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
    "Runtime infrastructure that gives AI agents a body, guards physical actions, and turns execution traces into safer skills.",
  url: "https://www.rosclaw.io/",
  codeRepository: "https://github.com/ros-claw/rosclaw",
};

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rosclaw.io"),
  title: "ROSClaw | Give AI Agents a Body That Learns",
  description:
    "Ground AI agents in real robot bodies, guard every physical action, and turn execution traces into safer, reusable skills with ROSClaw.",
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
    title: "ROSClaw — Give AI Agents a Body That Learns",
    description:
      "Ground agents in real robot bodies, guard every physical action, and turn execution traces into safer skills.",
    type: "website",
    locale: "en_US",
    siteName: "ROSClaw",
  },
  twitter: {
    card: "summary_large_image",
    title: "ROSClaw | Give AI Agents a Body That Learns",
    description:
      "Runtime infrastructure for body-aware, guarded, and traceable embodied AI.",
    creator: "@rosclaw",
  },
  alternates: {
    canonical: "https://rosclaw.io",
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
