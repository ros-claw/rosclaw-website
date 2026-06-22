"use client";

import { motion } from "framer-motion";
import { TerminalCTA } from "./terminal-cta";
import { VideoBackground } from "./video-background";
import { EmailLink } from "./email-link";

function RuntimePulse() {
  const nodes = [
    { id: "intent", label: "Intent", x: 200, y: 20 },
    { id: "body", label: "Body", x: 320, y: 80 },
    { id: "sandbox", label: "Sandbox", x: 320, y: 180 },
    { id: "execution", label: "Execute", x: 200, y: 240 },
    { id: "trace", label: "Trace", x: 80, y: 180 },
    { id: "memory", label: "Memory", x: 80, y: 80 },
    { id: "evolve", label: "Evolve", x: 200, y: 130 },
  ];

  const pathD =
    "M 200 20 L 320 80 L 320 180 L 200 240 L 80 180 L 80 80 Z";

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square hidden lg:block">
      <svg
        viewBox="0 0 400 280"
        className="w-full h-full"
        role="img"
        aria-label="ROSClaw runtime loop: intent flows through body, sandbox, execution, trace, memory, and evolution"
      >
        <defs>
          <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FF3E00" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Background loop path */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="url(#pulseGradient)"
          strokeWidth="2"
          strokeDasharray="6 6"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Moving pulse dot */}
        <motion.circle
          r="5"
          fill="#00F0FF"
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          style={{
            offsetPath: `path("${pathD}")`,
          }}
        />

        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.g
            key={node.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
          >
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="18"
              fill="rgba(5,5,5,0.8)"
              stroke="#00F0FF"
              strokeWidth="1.5"
              animate={{
                stroke: ["#00F0FF", "#FF3E00", "#00F0FF"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.4,
              }}
            />
            <text
              x={node.x}
              y={node.y + 4}
              textAnchor="middle"
              fill="#E5E7EB"
              fontSize="10"
              fontFamily="var(--font-jetbrains-mono)"
            >
              {node.label.slice(0, 2)}
            </text>
            <text
              x={node.x}
              y={node.y + 34}
              textAnchor="middle"
              fill="rgba(255,255,255,0.6)"
              fontSize="10"
              fontFamily="var(--font-jetbrains-mono)"
            >
              {node.label}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <VideoBackground />

      {/* Dark Overlay - dimmed in light mode via CSS */}
      <div className="absolute inset-0 bg-black/60 dark:opacity-100 opacity-0 z-10" />

      {/* Ambient Glow Effects */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cognitive-cyan/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-physical-orange/10 rounded-full blur-[128px]" />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div className="text-center lg:text-left">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase bg-white/5 border border-white/10 text-cognitive-cyan">
                Physical AI Runtime
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6"
            >
              <span className="block text-white">Self-Evolving Runtime</span>
              <span className="block text-gradient-cyan mt-2">Infrastructure for Physical AI</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg sm:text-xl md:text-2xl font-light text-white/80 mb-6"
            >
              Ground the agent.
              <span className="mx-2 text-cognitive-cyan">•</span>
              Guard the action.
              <span className="mx-2 text-cognitive-cyan">•</span>
              Evolve the skill.
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg text-white/60 mb-10"
            >
              ROSClaw connects AI agents, robot embodiments, sandbox validation,
              capability routing, physical memory, praxis capture, and
              benchmark-driven skill evolution into one coherent runtime layer.
            </motion.p>

            {/* Terminal CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex justify-center lg:justify-start mb-10"
            >
              <TerminalCTA />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <a
                href="/#first-embodiment"
                className="group px-8 py-3 rounded-lg bg-cognitive-cyan/10 border border-cognitive-cyan/30 text-cognitive-cyan font-medium hover:bg-cognitive-cyan/20 hover:border-cognitive-cyan/50 transition-all duration-300"
              >
                Start First Embodiment
              </a>
              <a
                href="https://github.com/ros-claw/rosclaw"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 rounded-lg bg-white/5 border border-white/10 text-white/80 font-medium hover:bg-white/10 hover:text-white transition-all duration-300"
              >
                View on GitHub
              </a>
              <EmailLink
                email="ai@rosclaw.io"
                className="px-8 py-3 rounded-lg bg-white/5 border border-white/10 text-white/80 font-medium hover:bg-white/10 hover:text-white transition-all duration-300"
              >
                Contact Us
              </EmailLink>
            </motion.div>
          </div>

          {/* Right: Runtime Pulse */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="hidden lg:flex items-center justify-center"
          >
            <RuntimePulse />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-2"
          >
            <div className="w-1 h-2 bg-cognitive-cyan/60 rounded-full" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
