import { permanentRedirect } from "next/navigation";

export default function LegacyMcpHubPage() {
  permanentRedirect("/hub/mcps");
}
