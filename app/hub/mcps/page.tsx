import { RegistryBrowsePage, registryBrowseMetadata, type BrowseQuery } from "@/components/hub/registry-browse-page";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<BrowseQuery> };
export async function generateMetadata({ searchParams }: Props) {
  return registryBrowseMetadata("mcps", await searchParams);
}
export default async function McpsPage({ searchParams }: Props) {
  return <RegistryBrowsePage kind="mcps" query={await searchParams} />;
}
