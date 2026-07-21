import { permanentRedirect } from "next/navigation";

export const dynamicParams = true;

export default async function LegacySkillPage({
  params,
}: {
  params: Promise<{ id: string[] }>;
}) {
  const { id } = await params;
  const path = id.map(encodeURIComponent).join("/");
  permanentRedirect(`/hub/skills/${path}`);
}
