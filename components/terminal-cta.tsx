"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";

const commands = [
  { id: "install", label: "install", text: "curl -sSL https://rosclaw.io/get | bash" },
  { id: "firstboot", label: "firstboot", text: "rosclaw firstboot" },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Copy failed silently; the button simply won't show "Copied!"
    }
  };

  return (
    <motion.button
      onClick={handleCopy}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="ml-auto p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
      aria-label={copied ? "Copied!" : "Copy command"}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-400" />
      ) : (
        <Copy className="w-4 h-4 text-white/60 hover:text-cognitive-cyan" />
      )}
    </motion.button>
  );
}

export function TerminalCTA() {
  return (
    <div className="inline-block text-left">
      <div className="glass rounded-xl p-1 glow-cyan">
        <div className="flex flex-col gap-2 px-4 py-3 font-mono text-sm sm:text-base">
          {commands.map((command) => (
            <div
              key={command.id}
              className="flex items-center gap-3 min-w-0"
            >
              <span className="text-white/40">$</span>
              <span className="text-cognitive-cyan truncate">{command.text}</span>
              <CopyButton text={command.text} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
