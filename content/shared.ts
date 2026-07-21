// Shared constants and reusable animation variants for the ROSClaw website.

export const CONTACT_EMAIL = "ai@rosclaw.io";
export const SITE_URL = "https://www.rosclaw.io";
export const GITHUB_URL = "https://github.com/ros-claw/rosclaw";
export const GITHUB_RAW_URL = `${GITHUB_URL}/blob/main`;
export const INSTALL_COMMAND = "curl -sSL https://rosclaw.io/get | bash";
export const FIRSTBOOT_COMMAND = "rosclaw firstboot";

export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
  },
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] },
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

export type StatusLabel =
  | "Verified"
  | "Alpha"
  | "Observed"
  | "Not Verified"
  | "Stable"
  | "Supported"
  | "Experimental"
  | "Planned"
  | "Research"
  | "Ecosystem";

export const statusBadgeClasses: Record<StatusLabel, string> = {
  Verified: "bg-green-500/10 border-green-500/30 text-green-400",
  Alpha: "bg-cognitive-cyan/10 border-cognitive-cyan/30 text-cognitive-cyan",
  Observed: "bg-amber-500/10 border-amber-500/30 text-amber-300",
  "Not Verified": "bg-white/5 border-white/20 text-white/60",
  Stable: "bg-green-500/10 border-green-500/30 text-green-400",
  Supported: "bg-green-500/10 border-green-500/30 text-green-400",
  Experimental: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
  Planned: "bg-white/5 border-white/20 text-white/60",
  Research: "bg-purple-500/10 border-purple-500/30 text-purple-400",
  Ecosystem: "bg-cognitive-cyan/10 border-cognitive-cyan/30 text-cognitive-cyan",
};
