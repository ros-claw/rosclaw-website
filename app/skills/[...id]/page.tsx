import { SkillDetailClient } from "./skill-detail-client";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface SkillDetailPageProps {
  params: { id: string[] };
}

export default function SkillDetailPage({ params }: SkillDetailPageProps) {
  const fullPath = params.id.join("/");
  return <SkillDetailClient id={fullPath} />;
}
