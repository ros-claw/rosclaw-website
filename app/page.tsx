import { HeroSection } from "@/components/hero-section";
import { LogoTicker } from "@/components/logo-ticker";
import { DocsSection } from "@/components/docs-section";
import { RuntimeLoopSection } from "@/components/runtime-loop-section";
import { TripleValueSection } from "@/components/triple-value-section";
import { AssetHubSection } from "@/components/asset-hub-section";
import { BuiltForSection } from "@/components/built-for-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Compatible Ecosystem */}
      <LogoTicker />

      {/* 3. First Embodiment */}
      <DocsSection />

      {/* 4. Runtime Loop */}
      <RuntimeLoopSection />

      {/* 5. Safety / Memory / Evolution */}
      <TripleValueSection />

      {/* 6. Physical-AI Asset Hub Preview */}
      <AssetHubSection />

      {/* 7. Built For + Current Status */}
      <BuiltForSection />

      {/* 8. Contact */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
