import type { Metadata } from "next";
import { SkillRegistryClient } from "@/components/hub/skill-registry-client";
import { loadSkills } from "@/lib/registry/server";

export const metadata: Metadata = {
  title: "Skill Registry | ROSClaw",
  description: "Server-rendered registry of versioned behavior packages for embodied agents.",
};

export const revalidate = 300;

export default async function SkillsPage() {
  const registry = await loadSkills();
  return (
    <SkillRegistryClient
      initialSkills={registry.items}
      initialLoadError={!registry.available}
    />
  );
}
