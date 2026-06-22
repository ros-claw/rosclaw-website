import { HeroSection } from "@/components/hero-section";
import { LogoTicker } from "@/components/logo-ticker";
import { DocsSection } from "@/components/docs-section";
import { BentoGrid } from "@/components/bento-grid";
import { RuntimeLoopSection } from "@/components/runtime-loop-section";
import { CoreRuntimeModules } from "@/components/core-runtime-modules";
import { SandboxSafetySection } from "@/components/sandbox-safety-section";
import { PraxisFlywheelSection } from "@/components/praxis-flywheel-section";
import { PhysicalMemorySection } from "@/components/physical-memory-section";
import { AssetHubSection } from "@/components/asset-hub-section";
import { BuiltForSection } from "@/components/built-for-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Logo Ticker */}
      <LogoTicker />

      {/* First Embodiment */}
      <DocsSection />

      {/* Why Physical AI Needs Runtime Infrastructure */}
      <BentoGrid />

      {/* Runtime Loop */}
      <RuntimeLoopSection />

      {/* Core Runtime Modules */}
      <CoreRuntimeModules />

      {/* Sandbox Before Reality */}
      <SandboxSafetySection />

      {/* Praxis Data Flywheel */}
      <PraxisFlywheelSection />

      {/* Physical Memory & Runtime Intervention */}
      <PhysicalMemorySection />

      {/* Physical-AI Asset Hub */}
      <AssetHubSection />

      {/* Built For */}
      <BuiltForSection />

      {/* Contact */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
