'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Terminal } from 'lucide-react';

export function InstallationBlock() {
  const [copied, setCopied] = useState(false);
  const installCommand = 'curl -sSL https://rosclaw.io/install.sh | bash';

  const handleCopy = () => {
    navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const features = [
    { icon: '⚡', text: 'ROS 2 Humble / Iron / Jazzy' },
    { icon: '🔒', text: 'Local-first, Private by Default' },
    { icon: '📦', text: 'Auto MCP Discovery' },
    { icon: '🔄', text: 'Built-in OTA Updates' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
          One Command to Rule Your Robot
        </h3>
        <p className="text-lg text-[#A1A1AA]">
          Zero configuration. Native ROS 2 compatibility. Ready in 60 seconds.
        </p>
        <p className="text-base text-[#71717A] mt-2">
          零配置，原生兼容 ROS 2，60 秒就绪
        </p>
      </motion.div>

      {/* Code Block */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative bg-[#0D0D0D] rounded-xl border border-white/10 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#00F0FF]" />
            <span className="text-sm text-white/50">bash</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-white/70" />
                <span className="text-sm text-white/70">Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Code */}
        <div className="p-6 font-mono text-lg">
          <span className="text-[#00F0FF]">$</span>{' '}
          <span className="text-white">{installCommand}</span>
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-2.5 h-6 bg-[#00F0FF] ml-2 align-middle"
          />
        </div>

        {/* Gradient line */}
        <div className="h-1 bg-gradient-to-r from-[#00F0FF] via-[#FF3E00] to-[#00F0FF]" />
      </motion.div>

      {/* Feature badges */}
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        {features.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
          >
            <span>{item.icon}</span>
            <span className="text-sm text-[#A1A1AA]">{item.text}</span>
          </motion.div>
        ))}
      </div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mt-8 text-[#71717A] italic"
      >
        &ldquo;The era of hardcoded state machines is over. Install the ROSClaw kernel and let the LLM take the wheel.&rdquo;
      </motion.p>
    </div>
  );
}
