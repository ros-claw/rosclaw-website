import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ROSClaw",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Linux, macOS, Windows WSL",
  description:
    "Self-evolving runtime infrastructure for Physical AI and embodied agents.",
  url: "https://www.rosclaw.io/",
  codeRepository: "https://github.com/ros-claw/rosclaw",
};

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ROSClaw | Self-Evolving Runtime Infrastructure for Physical AI",
  description:
    "ROSClaw is open runtime infrastructure for Physical AI and embodied agents. Ground AI agents into robot bodies through embodiment models, sandbox validation, capability routing, physical memory, praxis capture, runtime intervention, and skill evolution.",
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
    title: "ROSClaw — Runtime Infrastructure for Physical AI",
    description:
      "Ground AI agents into robot bodies. Validate every action. Learn from every trace. Evolve every skill.",
    type: "website",
    locale: "en_US",
    siteName: "ROSClaw",
  },
  twitter: {
    card: "summary_large_image",
    title: "ROSClaw | Self-Evolving Runtime Infrastructure for Physical AI",
    description:
      "Ground AI agents into robot bodies. Validate every action. Learn from every trace. Evolve every skill.",
    creator: "@rosclaw",
  },
  verification: {
    google: "google-site-verification-code",
  },
  alternates: {
    canonical: "https://rosclaw.io",
  },
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
        <ThemeProvider>
          <SmoothScroll />
          <Navbar />
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
