import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation | ROSClaw",
  description: "Start, understand, build, and evaluate trustworthy physical execution with ROSClaw.",
  alternates: { canonical: "/docs" },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
