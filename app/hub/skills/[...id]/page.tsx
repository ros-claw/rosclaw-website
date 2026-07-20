import type { Metadata } from "next";
import { SkillDetailClient } from "../../../skills/[...id]/skill-detail-client";

interface SkillPageProps {
  params: Promise<{ id: string[] }>;
}

// Enable dynamic params for catch-all routes
export const dynamicParams = true;

// Generate static params (empty array = all paths generated on-demand)
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: SkillPageProps): Promise<Metadata> {
  const { id } = await params;
  const fullPath = id.join("/");
  return {
    title: `${fullPath} | Skill Registry | ROSClaw`,
    description: `Inspect the body compatibility, dependencies, source, and install contract for the ${fullPath} Skill on ROSClaw.`,
  };
}

export default async function SkillPage({ params }: SkillPageProps) {
  const { id } = await params;
  const fullPath = id.join("/");
  return <SkillDetailClient id={fullPath} />;
}
