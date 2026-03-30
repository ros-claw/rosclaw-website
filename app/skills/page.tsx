import type { Metadata } from "next";
import { SkillsClient } from "./skills-client";

export const metadata: Metadata = {
  title: "Skill Market | ROSClaw - Embodied AI Skills",
  description:
    "Discover and share embodied AI skills for robots. 2,800+ skills for manipulation, navigation, vision, and more. Download skills for UR5, Franka, Unitree G1, and other robots.",
  keywords: [
    "ROSClaw Skills",
    "Embodied AI Skills",
    "Robot Skills",
    "Skill Market",
    "ClawHub",
    "Manipulation Skills",
    "Robot Learning",
    "UR5 Skills",
    "Franka Skills",
    "Unitree Skills",
    "Pick and Place",
    "Robot Vision",
    "SLAM",
  ],
  openGraph: {
    title: "Skill Market | ROSClaw",
    description: "Discover and share embodied AI skills for robots",
    type: "website",
  },
};

export default function SkillsPage() {
  return <SkillsClient />;
}
