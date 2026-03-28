import { HeroSection } from "@/components/hero-section";
import { LogoTicker } from "@/components/logo-ticker";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Logo Ticker */}
      <LogoTicker />

      {/* Placeholder for Phase 2: Bento Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/40 text-sm uppercase tracking-widest">
            Phase 2: Core Innovations Bento Grid (Coming Next)
          </p>
        </div>
      </section>
    </main>
  );
}
