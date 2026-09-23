import type { Metadata } from "next";
import { HeroSection } from "@/components/hero-section";
import { ProductHomeSections } from "@/components/product-home-sections";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "ROSClaw | 赋予 AI 身体，让实践驱动进化",
  description: "面向具身智能体的 Physical AI Runtime。任意智能体，任意本体，一个运行时。",
  alternates: { canonical: "/zh", languages: { en: "/", "zh-CN": "/zh" } },
  openGraph: { locale: "zh_CN", title: "ROSClaw | 赋予 AI 身体，让实践驱动进化" },
};

export default function ChineseHome() {
  return <main className="relative min-h-screen"><HeroSection locale="zh"/><ProductHomeSections locale="zh"/><Footer locale="zh"/></main>;
}
