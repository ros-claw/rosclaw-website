"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

const runtimeNodes = [
  {
    id: "intent",
    label: "Agent Intent",
    description: "A high-level task or goal expressed by an AI agent.",
  },
  {
    id: "body",
    label: "Embodiment Context",
    description: "The robot body, sensors, actuators, limits, and capabilities.",
  },
  {
    id: "provider",
    label: "Capability Routing",
    description: "Route the task to the right provider: LLM, VLM, VLA, VLN, world model, or classical controller.",
  },
  {
    id: "sandbox",
    label: "Sandbox Validation",
    description: "Validate the proposed action in a digital twin before hardware execution.",
  },
  {
    id: "execution",
    label: "Physical Execution",
    description: "The validated action runs on the real robot under runtime guards.",
  },
  {
    id: "trace",
    label: "Praxis Capture",
    description: "Record states, streams, decisions, failures, and recoveries as a physical trace.",
  },
  {
    id: "memory",
    label: "Physical Memory",
    description: "Turn structured traces into spatiotemporal memory and reusable experience.",
  },
  {
    id: "how",
    label: "Runtime Intervention",
    description: "Generate minimal, evidence-backed corrections when the agent is stuck or unsafe.",
  },
  {
    id: "know",
    label: "Knowledge Compilation",
    description: "Compile successful repairs and patterns into reusable task knowledge.",
  },
  {
    id: "auto",
    label: "Auto Evolution",
    description: "Patch skills and parameters based on accumulated memory and evidence.",
  },
  {
    id: "darwin",
    label: "Darwin Evaluation",
    description: "Benchmark evolved skills across seeds and scenarios to detect regressions.",
  },
  {
    id: "skill",
    label: "Champion Skill",
    description: "Promote the best validated skill for safer next execution.",
  },
];

function RuntimeLoopDesktop() {
  const prefersReducedMotion = useReducedMotion();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const cx = 250;
  const cy = 160;
  const rx = 220;
  const ry = 120;

  const pathD = `M ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy}`;

  return (
    <div className="relative">
      <svg
        viewBox="0 0 500 320"
        className="w-full max-w-3xl mx-auto"
        role="img"
        aria-label="ROSClaw runtime loop from intent to champion skill"
      >
        <defs>
          <linearGradient id="loopGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#FF3E00" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Loop path */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="url(#loopGradient)"
          strokeWidth="2"
          strokeDasharray="6 6"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Moving pulse */}
        {!prefersReducedMotion && (
          <motion.circle
            r="5"
            fill="#00F0FF"
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            style={{ offsetPath: `path("${pathD}")` }}
          />
        )}

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
                r={isHovered ? 22 : 16}
                fill="rgba(5,5,5,0.9)"
                stroke={isHovered ? "#FF3E00" : "#00F0FF"}
                strokeWidth="1.5"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              />
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                fill="#E5E7EB"
                fontSize="8"
                fontFamily="var(--font-jetbrains-mono)"
              >
                {i + 1}
              </text>
              <text
                x={x}
                y={y + (y > cy ? 34 : -24)}
                textAnchor="middle"
                fill={isHovered ? "#00F0FF" : "rgba(255,255,255,0.6)"}
                fontSize="10"
                fontFamily="var(--font-jetbrains-mono)"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hover description panel */}
      <div className="min-h-[4rem] text-center">
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
    <div className="space-y-4">
      {runtimeNodes.map((node, i) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
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
    <section id="runtime-loop" className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-cognitive-cyan text-sm uppercase tracking-widest mb-4 font-mono"
          >
            From Execution to Evolution
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6"
          >
            Every Action Becomes Evidence
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg max-w-3xl mx-auto"
          >
            Every physical action flows through validation, execution, capture,
            memory, and evolution — making the next execution safer and stronger.
          </motion.p>
        </div>

        <div className="hidden md:block">
          <RuntimeLoopDesktop />
        </div>
        <div className="md:hidden">
          <RuntimeLoopMobile />
        </div>
      </div>
    </section>
  );
}
