import { permanentRedirect } from "next/navigation";

export const dynamicParams = true;

export default async function LegacyMcpPackagePage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = slug.map(encodeURIComponent).join("/");
  permanentRedirect(`/hub/mcps/${path}`);
}
