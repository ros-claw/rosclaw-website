import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cognitive Wiki | ROSClaw",
  description: "Inspect linked physical-AI knowledge, constraints, and evidence in the ROSClaw Cognitive Wiki.",
  alternates: { canonical: "/hub/wiki" },
};

export default function WikiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
