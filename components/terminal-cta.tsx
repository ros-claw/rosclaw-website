"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { terminalCommands } from "@/content/cli";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // Copy failed silently; the button simply won't show "Copied!"
    }
  };

  return (
    <motion.button
      onClick={handleCopy}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="ml-auto p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex-shrink-0"
      aria-label={copied ? "Copied!" : "Copy command"}
    >
      {copied ? (
        <span className="flex items-center gap-1 text-xs text-green-400 font-medium">
          <Check className="w-3.5 h-3.5" />
          Copied
        </span>
      ) : (
        <Copy className="w-4 h-4 text-white/60 hover:text-cognitive-cyan" />
      )}
    </motion.button>
  );
}

export function TerminalCTA() {
  return (
    <div className="inline-block text-left w-full max-w-[620px]">
      <div className="rounded-xl border border-cognitive-cyan/20 bg-black/40 backdrop-blur-sm p-1 shadow-[0_0_24px_-12px_rgba(0,240,255,0.15)]">
        <div className="flex flex-col gap-1 px-4 py-3 font-mono text-sm sm:text-base">
          {terminalCommands.map((command) => (
            <div
              key={command.command}
              className="flex items-center gap-3 min-w-0"
            >
              <span className="text-white/40 flex-shrink-0">$</span>
              <span className="text-cognitive-cyan truncate">{command.command}</span>
              <CopyButton text={command.command} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
