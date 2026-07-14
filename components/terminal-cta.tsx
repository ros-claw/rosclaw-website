"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { INSTALL_COMMAND } from "@/content/shared";

export function TerminalCTA() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex min-h-12 min-w-0 items-center border border-white/10 bg-[#050708]/85 px-3 font-mono text-[11px] shadow-[inset_3px_0_0_rgba(0,240,255,0.6)] sm:px-4 sm:text-sm">
      <span className="mr-2 shrink-0 text-physical-orange">$</span>
      <code className="min-w-0 flex-1 truncate text-white/[0.68]">{INSTALL_COMMAND}</code>
      <button
        type="button"
        onClick={handleCopy}
        className="focus-ring ml-2 inline-flex h-8 shrink-0 items-center gap-1.5 px-2 text-[10px] uppercase tracking-wider text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white"
        aria-label={copied ? "Install command copied" : "Copy install command"}
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
        <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
      </button>
      <span className="sr-only" aria-live="polite">{copied ? "Install command copied" : ""}</span>
    </div>
  );
}
