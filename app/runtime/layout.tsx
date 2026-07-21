import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Runtime Architecture | ROSClaw",
  description: "Inspect ROSClaw's body grounding, guarded execution, trace, memory, and evolution capabilities.",
  alternates: { canonical: "/runtime" },
};

export default function RuntimeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
