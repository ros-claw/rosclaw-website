import { permanentRedirect } from "next/navigation";

export default function LegacySkillsPage() {
  permanentRedirect("/hub/skills");
}
