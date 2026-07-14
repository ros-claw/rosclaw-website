"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyCommand({ command, tone = "cyan" }: { command: string; tone?: "cyan" | "orange" }) {
  const [copied, setCopied] = useState(false);
  const isOrange = tone === "orange";

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex min-w-0 items-center border border-white/10 bg-black/45">
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap px-4 py-3.5 font-mono text-xs text-white/60">{command}</code>
      <button
        type="button"
        onClick={copyCommand}
        className={`focus-ring flex h-11 w-11 flex-none items-center justify-center border-l border-white/10 transition-colors ${isOrange ? "text-physical-orange hover:bg-physical-orange/10" : "text-cognitive-cyan hover:bg-cognitive-cyan/10"}`}
        aria-label={copied ? "Copied command" : "Copy install command"}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}
