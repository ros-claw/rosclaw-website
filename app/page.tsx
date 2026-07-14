import { HeroSection } from "@/components/hero-section";
import { LogoTicker } from "@/components/logo-ticker";
import { RecordedRunSection } from "@/components/recorded-run-section";
import { DocsSection } from "@/components/docs-section";
import { RuntimeLoopSection } from "@/components/runtime-loop-section";
import { RuntimeCapabilitiesSection } from "@/components/runtime-capabilities-section";
import { AssetHubSection } from "@/components/asset-hub-section";
import { BuiltForSection } from "@/components/built-for-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <HeroSection />
      <LogoTicker />
      <RecordedRunSection />
      <RuntimeLoopSection />
      <DocsSection />
      <RuntimeCapabilitiesSection />
      <AssetHubSection />
      <BuiltForSection />
      <Footer />
    </main>
  );
}
