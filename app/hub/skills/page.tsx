import { RegistryBrowsePage, registryBrowseMetadata, type BrowseQuery } from "@/components/hub/registry-browse-page";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<BrowseQuery> };
export async function generateMetadata({ searchParams }: Props) {
  return registryBrowseMetadata("skills", await searchParams);
}
export default async function SkillsPage({ searchParams }: Props) {
  return <RegistryBrowsePage kind="skills" query={await searchParams} />;
}
