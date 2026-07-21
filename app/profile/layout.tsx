import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | ROSClaw",
  robots: { index: false, follow: false },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
