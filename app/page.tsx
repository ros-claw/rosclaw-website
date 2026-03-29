import { HeroSection } from "@/components/hero-section";
import { LogoTicker } from "@/components/logo-ticker";
import { BentoGrid } from "@/components/bento-grid";
import { McpHubSection } from "@/components/mcp-hub-section";
import { SkillMarketSection } from "@/components/skill-market-section";
import { DocsSection } from "@/components/docs-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Logo Ticker */}
      <LogoTicker />

      {/* Bento Grid - Core Innovations */}
      <BentoGrid />

      {/* MCP Hub Section */}
      <McpHubSection />

      {/* Skill Market Section */}
      <SkillMarketSection />

      {/* Documentation Section */}
      <DocsSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
