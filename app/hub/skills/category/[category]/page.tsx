import { RegistryBrowsePage, registryBrowseMetadata, type BrowseQuery } from "@/components/hub/registry-browse-page";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ category: string }>; searchParams: Promise<BrowseQuery> };
export async function generateMetadata({ params, searchParams }: Props) {
  return registryBrowseMetadata("skills", await searchParams, (await params).category);
}
export default async function CategoryPage({ params, searchParams }: Props) {
  return <RegistryBrowsePage kind="skills" query={await searchParams} slug={(await params).category} />;
}
