import {
  BadgeCheck,
  Bot,
  CheckCircle2,
  Cpu,
  Eye,
  FileCheck2,
  FlaskConical,
} from "lucide-react";
import type { VerificationSignals } from "@/content/product-catalog";

const definitions = [
  { key: "officialPublisher", label: "Official Publisher", icon: BadgeCheck, className: "border-cognitive-cyan/25 text-cognitive-cyan" },
  { key: "manifestValidated", label: "Manifest Validated", icon: FileCheck2, className: "border-cognitive-cyan/25 text-cognitive-cyan" },
  { key: "ciPassed", label: "CI Passed", icon: CheckCircle2, className: "border-emerald-400/25 text-emerald-400" },
  { key: "simulationVerified", label: "Simulation Verified", icon: FlaskConical, className: "border-emerald-400/25 text-emerald-400" },
  { key: "hardwareObserved", label: "Hardware Observed", icon: Eye, className: "border-amber-300/25 text-amber-300" },
  { key: "hardwareVerified", label: "Hardware Verified", icon: Cpu, className: "border-emerald-400/25 text-emerald-400" },
  { key: "agentVerified", label: "Agent Verified", icon: Bot, className: "border-emerald-400/25 text-emerald-400" },
] as const;

export function VerificationBadges({ signals }: { signals: VerificationSignals }) {
  const active = definitions.filter(({ key }) => signals[key]);
  if (!active.length) {
    return <span className="font-mono text-[9px] uppercase text-white/30">No verification badge</span>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {active.map(({ key, label, icon: Icon, className }) => (
        <span key={key} className={`inline-flex items-center gap-1.5 border bg-white/[0.02] px-2 py-1 font-mono text-[8px] uppercase ${className}`}>
          <Icon className="h-3 w-3" /> {label}
        </span>
      ))}
    </div>
  );
}
