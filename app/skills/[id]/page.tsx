import { SkillDetailClient } from "./skill-detail-client";

export async function generateStaticParams() {
  return [
    { id: 'pour-coffee' },
    { id: 'precision-screwing' },
    { id: 'gimbal-choreo' },
  ];
}

interface SkillDetailPageProps {
  params: { id: string };
}

export default function SkillDetailPage({ params }: SkillDetailPageProps) {
  return <SkillDetailClient id={params.id} />;
}
