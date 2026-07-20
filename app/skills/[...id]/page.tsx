import { SkillDetailClient } from "./skill-detail-client";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface SkillDetailPageProps {
  params: Promise<{ id: string[] }>;
}

export default async function SkillDetailPage({ params }: SkillDetailPageProps) {
  const { id } = await params;
  const fullPath = id.join("/");
  return <SkillDetailClient id={fullPath} />;
}
