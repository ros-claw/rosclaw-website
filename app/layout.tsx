import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ROSClaw | The Embodied AI Operating System",
  description:
    "Teach Once, Embody Anywhere. ROSClaw bridges Multimodal AI Agents with the Physical World through the Model Context Protocol (MCP).",
  keywords: [
    "ROSClaw",
    "Embodied AI",
    "Embodied Intelligence",
    "Robotics",
    "Robot Operating System",
    "ROS 2",
    "ROS2",
    "MCP",
    "Model Context Protocol",
    "VLA Policy",
    "VLA",
    "Vision Language Action",
    "LLM",
    "Large Language Model",
    "AI Agents",
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
    "Digital Twin",
    "ClawHub",
    "Skill Market",
  ],
  authors: [{ name: "ROSClaw Team" }],
  creator: "ROSClaw",
  publisher: "ROSClaw",
  robots: "index, follow",
  openGraph: {
    title: "ROSClaw | The Embodied AI Operating System",
    description: "Teach Once, Embody Anywhere. Share Skills, Shape Reality.",
    type: "website",
    locale: "en_US",
    siteName: "ROSClaw",
  },
  twitter: {
    card: "summary_large_image",
    title: "ROSClaw | The Embodied AI Operating System",
    description: "The Universal OS for Embodied AI. Bridge LLMs to physical robots.",
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
        <ThemeProvider>
          <SmoothScroll />
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
