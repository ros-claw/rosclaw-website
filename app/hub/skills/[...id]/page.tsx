import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SkillDetailClient } from "../../../skills/[...id]/skill-detail-client";
import { loadSkill, loadRelatedRegistryItems } from "@/lib/registry/server";
import { detailMetadata, detailStructuredData } from "@/lib/registry/detail-seo";
import { RegistryJsonLd } from "@/components/hub/registry-jsonld";
import { RegistryIntegrationGuide } from "@/components/hub/registry-integration-guide";

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
  return detailMetadata("skills", fullPath, skill);
}

export default async function SkillPage({ params }: SkillPageProps) {
  const { id } = await params;
  const fullPath = id.join("/");
  const initialSkill = await loadSkill(fullPath);
  if (initialSkill === null) notFound();
  const related = initialSkill ? await loadRelatedRegistryItems(initialSkill, "skills") : [];
  return <>
    {initialSkill && <RegistryJsonLd data={detailStructuredData("skills", initialSkill)} />}
    <SkillDetailClient id={fullPath} initialSkill={initialSkill ?? undefined} initialLoadError={initialSkill === undefined}>
      {initialSkill && <RegistryIntegrationGuide kind="skills" item={initialSkill} related={related} />}
    </SkillDetailClient>
  </>;
}
