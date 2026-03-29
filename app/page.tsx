import { HeroSection } from "@/components/hero-section";
import { LogoTicker } from "@/components/logo-ticker";
import { BentoGrid } from "@/components/bento-grid";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Logo Ticker */}
      <LogoTicker />

      {/* Bento Grid - Core Innovations */}
      <BentoGrid />
    </main>
  );
}
