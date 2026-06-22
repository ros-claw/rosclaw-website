"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { runtimeLoopContent } from "@/content/home";

const runtimeNodes = [
  { id: "intent", label: "Intent", description: "A high-level task or goal expressed by an AI agent." },
  { id: "body", label: "Body", description: "The robot body, sensors, actuators, limits, and capabilities." },
  { id: "route", label: "Route", description: "Route the task to the right provider or controller." },
  { id: "sandbox", label: "Sandbox", description: "Validate the proposed action in a digital twin before hardware execution." },
  { id: "execute", label: "Execute", description: "The validated action runs on the real robot under runtime guards." },
  { id: "trace", label: "Trace", description: "Record states, streams, decisions, failures, and recoveries as a physical trace." },
  { id: "memory", label: "Memory", description: "Turn structured traces into spatiotemporal memory and reusable experience." },
  { id: "evolve", label: "Evolve", description: "Evaluate, patch, benchmark, and promote skills through validation loops." },
];

function RuntimeLoopDesktop() {
  const prefersReducedMotion = useReducedMotion();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const cx = 360;
  const cy = 220;
  const rx = 300;
  const ry = 160;

  const pathD = `M ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy}`;

  return (
    <div className="relative w-full max-w-[860px] mx-auto">
      <svg
        viewBox="0 0 720 440"
        className="w-full h-auto"
        role="img"
        aria-label="ROSClaw runtime loop from intent to evolved skill"
      >
        <defs>
          <linearGradient id="loopGradientV2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.4" />
            <stop offset="35%" stopColor="#3B82F6" stopOpacity="0.35" />
            <stop offset="65%" stopColor="#F59E0B" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.4" />
          </linearGradient>
          <filter id="loopGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Loop path */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="url(#loopGradientV2)"
          strokeWidth="2.5"
          strokeDasharray="6 6"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Moving pulse */}
        {!prefersReducedMotion && (
          <motion.circle
            r="6"
            fill="#00F0FF"
            filter="url(#loopGlow)"
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            style={{ offsetPath: `path("${pathD}")` }}
          />
        )}

        {/* Center core */}
        <g>
          <motion.circle
            cx={cx}
            cy={cy}
            r="48"
            fill="rgba(5,5,5,0.9)"
            stroke="#00F0FF"
            strokeWidth="1.5"
            strokeOpacity="0.5"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fill="#E5E7EB"
            fontSize="11"
            fontWeight="600"
            fontFamily="var(--font-jetbrains-mono)"
          >
            ROSClaw
          </text>
          <text
            x={cx}
            y={cy + 12}
            textAnchor="middle"
            fill="rgba(255,255,255,0.6)"
            fontSize="9"
            fontFamily="var(--font-jetbrains-mono)"
          >
            Runtime
          </text>
        </g>

        {/* Nodes */}
        {runtimeNodes.map((node, i) => {
          const angle = (i / runtimeNodes.length) * Math.PI * 2 - Math.PI / 2;
          const x = cx + rx * Math.cos(angle);
          const y = cy + ry * Math.sin(angle);
          const isHovered = hoveredNode === node.id;

          return (
            <g
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer"
            >
              <motion.circle
                cx={x}
                cy={y}
                r={isHovered ? 24 : 18}
                fill="rgba(5,5,5,0.95)"
                stroke={isHovered ? "#FF3E00" : "#00F0FF"}
                strokeWidth="1.5"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              />
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                fill="#E5E7EB"
                fontSize="9"
                fontFamily="var(--font-jetbrains-mono)"
              >
                {i + 1}
              </text>
              <text
                x={x}
                y={y + (y > cy ? 38 : -30)}
                textAnchor="middle"
                fill={isHovered ? "#00F0FF" : "rgba(255,255,255,0.7)"}
                fontSize="12"
                fontFamily="var(--font-jetbrains-mono)"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hover description panel */}
      <div className="min-h-[4rem] text-center mt-4">
        {hoveredNode ? (
          <motion.div
            key={hoveredNode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-6 py-3 rounded-xl bg-white/[0.03] border border-white/10"
          >
            <p className="text-cognitive-cyan font-medium text-sm">
              {runtimeNodes.find((n) => n.id === hoveredNode)?.label}
            </p>
            <p className="text-white/60 text-sm mt-1">
              {runtimeNodes.find((n) => n.id === hoveredNode)?.description}
            </p>
          </motion.div>
        ) : (
          <p className="text-white/40 text-sm">Hover a node to explore the runtime loop.</p>
        )}
      </div>
    </div>
  );
}

function RuntimeLoopMobile() {
  return (
    <div className="space-y-3">
      {runtimeNodes.map((node, i) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className="flex gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]"
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cognitive-cyan/10 border border-cognitive-cyan/30 flex items-center justify-center text-cognitive-cyan font-mono text-sm">
            {i + 1}
          </div>
          <div>
            <h4 className="text-white font-medium">{node.label}</h4>
            <p className="text-white/60 text-sm mt-1">{node.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function RuntimeLoopSection() {
  return (
    <section
      id="runtime-loop"
      className="min-h-[92vh] flex items-center py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-background"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-cognitive-cyan text-sm uppercase tracking-widest mb-4 font-mono"
          >
            {runtimeLoopContent.eyebrow}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6"
          >
            {runtimeLoopContent.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg max-w-3xl mx-auto"
          >
            {runtimeLoopContent.description}
          </motion.p>
        </div>

        <div className="hidden md:block">
          <RuntimeLoopDesktop />
        </div>
        <div className="md:hidden">
          <RuntimeLoopMobile />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center"
        >
          <a
            href={runtimeLoopContent.cta.href}
            className="inline-flex items-center gap-1 text-sm text-cognitive-cyan hover:text-physical-orange transition-colors"
          >
            {runtimeLoopContent.cta.label}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
