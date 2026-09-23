import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SkillDetailClient } from "../../../skills/[...id]/skill-detail-client";
import { loadSkill } from "@/lib/registry/server";

interface SkillPageProps {
  params: Promise<{ id: string[] }>;
}

// Enable dynamic params for catch-all routes
export const dynamicParams = true;
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: SkillPageProps): Promise<Metadata> {
  const { id } = await params;
  const fullPath = id.join("/");
  const skill = await loadSkill(fullPath);
  return {
    title: `${skill?.displayName ?? skill?.name ?? fullPath} | Skill Registry | ROSClaw`,
    description: skill?.description ?? `Inspect the body compatibility, dependencies, source, and install contract for the ${fullPath} Skill on ROSClaw.`,
    alternates: {
      canonical: `/hub/skills/${id.map(encodeURIComponent).join("/")}`,
    },
  };
}

export default async function SkillPage({ params }: SkillPageProps) {
  const { id } = await params;
  const fullPath = id.join("/");
  const initialSkill = await loadSkill(fullPath);
  if (initialSkill === null) notFound();
  return <SkillDetailClient id={fullPath} initialSkill={initialSkill ?? undefined} />;
}
