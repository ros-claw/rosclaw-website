import { RegistryBrowsePage, registryBrowseMetadata, type BrowseQuery } from "@/components/hub/registry-browse-page";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ category: string }>; searchParams: Promise<BrowseQuery> };
export async function generateMetadata({ params, searchParams }: Props) {
  return registryBrowseMetadata("mcps", await searchParams, (await params).category);
}
export default async function CategoryPage({ params, searchParams }: Props) {
  return <RegistryBrowsePage kind="mcps" query={await searchParams} slug={(await params).category} />;
}
