import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publish a Skill | ROSClaw",
  description: "Submit a versioned robot behavior package with declared dependencies and body compatibility.",
  alternates: { canonical: "/skills/publish" },
};

export default function PublishSkillLayout({ children }: { children: React.ReactNode }) {
  return children;
}
