import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ROSClaw - The Universal OS for Embodied AI",
  description:
    "Teach Once, Embody Anywhere. ROSClaw bridges Multimodal AI Agents with the Physical World through the Model Context Protocol (MCP).",
  keywords: [
    "ROSClaw",
    "Embodied AI",
    "MCP",
    "Robotics",
    "AI Agents",
    "ROS 2",
    "MuJoCo",
  ],
  openGraph: {
    title: "ROSClaw - The Universal OS for Embodied AI",
    description: "Teach Once, Embody Anywhere. Share Skills, Shape Reality.",
    type: "website",
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
        <SmoothScroll />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
