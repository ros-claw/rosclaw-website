import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Praxis Data Flywheel | ROSClaw",
  description: "Turn physical execution traces into replayable evidence, datasets, memory, and skill candidates.",
  alternates: { canonical: "/flywheel" },
};

export default function FlywheelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
