"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";

export function TerminalCTA() {
  const [copied, setCopied] = useState(false);
  const installCommand = "curl -sSL https://rosclaw.io/get | bash";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="inline-block">
      <div className="glass rounded-xl p-1 glow-cyan">
        <div className="flex items-center gap-4 px-6 py-4 font-mono text-sm sm:text-base">
          <span className="text-white/40">$</span>
          <span className="text-cognitive-cyan">{installCommand}</span>
          <motion.button
            onClick={handleCopy}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="ml-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            aria-label={copied ? "Copied!" : "Copy command"}
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-white/60 hover:text-cognitive-cyan" />
            )}
          </motion.button>
        </div>
      </div>
      {copied && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-center text-xs text-cognitive-cyan mt-2"
        >
          Copied to clipboard!
        </motion.p>
      )}
    </div>
  );
}
