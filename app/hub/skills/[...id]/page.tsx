import type { Metadata } from "next";
import { SkillsClient } from "../../../skills/[...id]/skills-client";

interface SkillPageProps {
  params: { id: string[] };
}

// Enable dynamic params for catch-all routes
export const dynamicParams = true;

// Generate static params (empty array = all paths generated on-demand)
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: SkillPageProps): Promise<Metadata> {
  const fullPath = params.id.join("/");
  return {
    title: `${fullPath} | e-Skill Market | ROSClaw`,
    description: `${fullPath} - Robot Skill on ROSClaw`,
  };
}

export default function SkillPage({ params }: SkillPageProps) {
  const fullPath = params.id.join("/");
  return <SkillsClient id={fullPath} />;
}
