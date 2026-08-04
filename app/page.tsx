import type { Metadata } from "next";
import { HeroSection } from "@/components/hero-section";
import { ProductHomeSections } from "@/components/product-home-sections";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "ROSClaw | The Native Agent Runtime for Physical AI",
  description: "ROSClaw gives AI agents a body-aware mission runtime with governed execution, worker delegation, installable MCP interfaces, reusable Skills, and auditable receipts.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <HeroSection />
      <ProductHomeSections />
      <Footer />
    </main>
  );
}
