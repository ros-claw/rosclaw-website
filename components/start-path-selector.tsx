"use client";

import { useState } from "react";
import {
  Bot,
  Braces,
  BrainCircuit,
  Check,
  Copy,
  MonitorPlay,
  PackageOpen,
} from "lucide-react";
import { releaseManifest, shortCommit } from "@/content/release-manifest";

const paths = {
  simulation: {
    icon: MonitorPlay,
    label: "No robot",
    title: "Run the first verified receipt",
    status: "Simulation Verified",
    description:
      "Install locally, keep hardware disabled, execute the real MuJoCo UR5e path, and inspect its receipt.",
    limitation: "Requires Python 3.11-3.13. No physical hardware is contacted.",
    channel: "Stable Alpha",
    commit: releaseManifest.stable.commit,
    outcome: "TASK_VERIFIED receipt plus an explainable evidence trace.",
    commands: [
      "curl -sSL https://rosclaw.io/get | bash",
      "rosclaw firstboot --yes --profile offline --no-telemetry",
      "rosclaw demo run ur5e-reach",
      "rosclaw explain latest",
    ],
  },
  "native-agent": {
    icon: BrainCircuit,
    label: "Try Native Agent",
    title: "Run the first body-aware mission",
    status: "Main Experimental",
    description:
      "Install the pinned Main snapshot, initialize the local Agent daemon, check its runtime, and enter mission chat in simulation.",
    limitation:
      "This surface is newer than Stable Alpha. Keep execution in SIMULATION while evaluating it.",
    channel: "Main Experimental",
    commit: releaseManifest.main.commit,
    outcome: "A healthy agentd runtime and interactive rosclaw-tui mission session.",
    commands: [
      "curl -fsSL https://rosclaw.io/get-main | bash",
      "rosclaw firstboot --yes --profile offline --no-telemetry",
      "rosclaw agentd init",
      "rosclaw agentd doctor",
      "rosclaw chat --mode SIMULATION",
    ],
  },
  robot: {
    icon: Bot,
    label: "I have a robot",
    title: "Check support before connecting hardware",
    status: "Alpha · Gated",
    description:
      "Inspect the capability boundary and body tooling before creating any device-specific configuration.",
    limitation:
      "Robot Pack orchestration is not yet a stable product command. Real action remains locked until an explicit verified executor and authorization exist.",
    channel: "Stable Alpha",
    commit: releaseManifest.stable.commit,
    outcome: "A capability report that states what is available, gated, or unavailable.",
    commands: [
      "rosclaw status capabilities",
      "rosclaw robot list",
      "rosclaw body init --help",
      "rosclaw doctor --stage configured",
    ],
  },
  "external-agent": {
    icon: Braces,
    label: "Connect an Agent",
    title: "Install the cross-agent runtime boundary",
    status: "MCP P0 · No Real Execution",
    description:
      "Configure project MCP for Codex and Claude Code, and install the ROSClaw workspace skill used by OpenClaw and other Agent harnesses.",
    limitation:
      "A local Codex process completed the simulation receipt workflow. OpenClaw native MCP registration remains operator-owned, and Agent real actuation is not verified.",
    channel: "Stable Alpha",
    commit: releaseManifest.stable.commit,
    outcome: "Project-local integration files plus a successful MCP probe.",
    commands: [
      "rosclaw agent install --project-root . --skip-secrets",
      "rosclaw agent test codex --project-root . --quick --mcp-probe",
      "rosclaw demo run ur5e-reach",
      "rosclaw explain latest",
    ],
  },
  publisher: {
    icon: PackageOpen,
    label: "I publish hardware",
    title: "Validate a Hub asset before publishing",
    status: "Experimental Publisher",
    description:
      "Export the manifest schema, validate locally, check permissions, and perform a dry-run package build.",
    limitation:
      "Robot Pack aggregation and reference-hardware certification are planned; Hub publication does not imply execution verification.",
    channel: "Stable Alpha",
    commit: releaseManifest.stable.commit,
    outcome: "A locally validated asset manifest and dry-run package result.",
    commands: [
      "rosclaw hub schema export --output manifest.schema.json",
      "rosclaw hub validate ./asset/manifest.yaml",
      "rosclaw hub policy check ./asset",
      "rosclaw hub publish ./asset --dry-run",
    ],
  },
} as const;

export type StartPath = keyof typeof paths;

export function StartPathSelector({ initialPath }: { initialPath: StartPath }) {
  const [selected, setSelected] = useState<StartPath>(initialPath);
  const [copied, setCopied] = useState<number | null>(null);
  const path = paths[selected];

  const copyCommand = async (command: string, index: number) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(index);
      window.setTimeout(() => setCopied(null), 1400);
    } catch {
      setCopied(null);
    }
  };

  return (
    <div>
      <div className="mb-5 grid border border-white/10 bg-[#050708] sm:grid-cols-2">
        <div className="border-b border-white/10 p-4 sm:border-b-0 sm:border-r"><p className="runtime-label">Stable Alpha · evidence-backed</p><p className="mt-2 font-mono text-xs text-white/62">v{releaseManifest.stable.version} · {shortCommit(releaseManifest.stable.commit)}</p></div>
        <div className="p-4"><p className="runtime-label">Main · Native Agent frontier</p><p className="mt-2 font-mono text-xs text-white/62">v{releaseManifest.main.version} · {shortCommit(releaseManifest.main.commit)}</p></div>
      </div>
      <div
        role="tablist"
        aria-label="Choose a ROSClaw start path"
        className="grid border border-white/10 bg-[#050708] sm:grid-cols-2 lg:grid-cols-5"
      >
        {(Object.entries(paths) as [StartPath, (typeof paths)[StartPath]][]).map(
          ([id, item], index) => {
            const Icon = item.icon;
            const active = id === selected;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls="start-path-panel"
                onClick={() => {
                  setSelected(id);
                  setCopied(null);
                }}
                className={`focus-ring relative flex min-h-[88px] items-center gap-3 border-b border-white/10 px-4 py-4 text-left transition-colors sm:border-r lg:border-b-0 ${
                  index === 4 ? "sm:border-r-0" : ""
                } ${active ? "bg-white/[0.07] text-white" : "text-white/50 hover:bg-white/[0.03] hover:text-white"}`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${active ? "text-cognitive-cyan" : ""}`} />
                <span className="text-sm font-medium leading-snug">{item.label}</span>
                {active && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-cognitive-cyan" />}
              </button>
            );
          },
        )}
      </div>

      <section
        id="start-path-panel"
        role="tabpanel"
        className="grid border-x border-b border-white/10 bg-[#070a0b] lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]"
      >
        <div className="border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <p className="font-mono text-[10px] uppercase text-cognitive-cyan">
            {path.channel} · {shortCommit(path.commit)}
          </p>
          <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">{path.title}</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/55 sm:text-base">
            {path.description}
          </p>
          <span className="mt-6 inline-flex border border-white/15 bg-white/[0.04] px-2.5 py-1.5 font-mono text-[9px] uppercase text-white/65">
            {path.status}
          </span>
          <div className="mt-6 border-l-2 border-physical-orange bg-physical-orange/[0.035] px-4 py-3">
            <p className="text-sm leading-relaxed text-white/55">{path.limitation}</p>
          </div>
          <div className="mt-4 border-l-2 border-emerald-400 bg-emerald-400/[0.035] px-4 py-3">
            <p className="runtime-label text-emerald-300">Expected success</p>
            <p className="mt-2 text-sm leading-relaxed text-white/55">{path.outcome}</p>
          </div>
        </div>

        <div className="p-4 sm:p-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <p className="font-mono text-[10px] uppercase text-white/40">Run in order</p>
            <p className="font-mono text-[9px] uppercase text-white/25">
              Commands contract-tested
            </p>
          </div>
          <ol className="divide-y divide-white/[0.08]">
            {path.commands.map((command, index) => (
              <li key={command} className="grid grid-cols-[28px_minmax(0,1fr)_36px] items-center gap-2 py-4">
                <span className="font-mono text-[10px] text-white/25">0{index + 1}</span>
                <code className="min-w-0 whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-cognitive-cyan sm:text-sm">
                  {command}
                </code>
                <button
                  type="button"
                  onClick={() => copyCommand(command, index)}
                  className="focus-ring flex h-9 w-9 items-center justify-center text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white"
                  aria-label={copied === index ? "Command copied" : `Copy command ${index + 1}`}
                  title={copied === index ? "Copied" : "Copy command"}
                >
                  {copied === index ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </li>
            ))}
          </ol>
          <span className="sr-only" aria-live="polite">
            {copied === null ? "" : "Command copied"}
          </span>
        </div>
      </section>
    </div>
  );
}
