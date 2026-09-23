import type { Metadata } from "next";
import { HeroSection } from "@/components/hero-section";
import { ProductHomeSections } from "@/components/product-home-sections";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "ROSClaw | Give AI a Body. Let Experience Drive Evolution.",
  description: "The Physical AI Runtime for Embodied Agents. Connect any agent to robot bodies through governed action, verified experience, physical memory, and evolving skills.",
  alternates: { canonical: "/", languages: { en: "/", "zh-CN": "/zh" } },
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
