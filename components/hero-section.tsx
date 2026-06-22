"use client";

import { motion, useReducedMotion } from "framer-motion";
import { TerminalCTA } from "./terminal-cta";
import { VideoBackground } from "./video-background";
import { EmailLink } from "./email-link";
import { Github } from "lucide-react";
import { heroContent } from "@/content/home";

function RuntimeMark() {
  const prefersReducedMotion = useReducedMotion();

  const cx = 280;
  const cy = 200;
  const rx = 220;
  const ry = 140;

  const nodes = [
    { id: "intent", label: "Intent" },
    { id: "body", label: "Body" },
    { id: "route", label: "Route" },
    { id: "sandbox", label: "Sandbox" },
    { id: "execute", label: "Execute" },
    { id: "trace", label: "Trace" },
    { id: "memory", label: "Memory" },
    { id: "evolve", label: "Evolve" },
  ];

  const pathD = `M ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy}`;

  return (
    <div className="relative w-full max-w-[560px] mx-auto aspect-[560/420] hidden lg:block">
      <svg
        viewBox="0 0 560 420"
        className="w-full h-full"
        role="img"
        aria-label="ROSClaw runtime loop: intent flows through body, route, sandbox, execution, trace, memory, and evolution"
      >
        <defs>
          <linearGradient id="heroLoopGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#FF3E00" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.5" />
          </linearGradient>
          <filter id="heroGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background loop path */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="url(#heroLoopGradient)"
          strokeWidth="2"
          strokeDasharray="6 6"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Traveling pulse */}
        {!prefersReducedMotion && (
          <motion.circle
            r="5"
            fill="#00F0FF"
            filter="url(#heroGlow)"
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            style={{ offsetPath: `path("${pathD}")` }}
          />
        )}

        {/* Center core */}
        <g>
          <motion.circle
            cx={cx}
            cy={cy}
            r="42"
            fill="rgba(5,5,5,0.85)"
            stroke="#00F0FF"
            strokeWidth="1.5"
            strokeOpacity="0.5"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          />
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fill="#E5E7EB"
            fontSize="10"
            fontWeight="600"
            fontFamily="var(--font-jetbrains-mono)"
          >
            ROSClaw
          </text>
          <text
            x={cx}
            y={cy + 10}
            textAnchor="middle"
            fill="rgba(255,255,255,0.6)"
            fontSize="8"
            fontFamily="var(--font-jetbrains-mono)"
          >
            Runtime
          </text>
        </g>

        {/* Nodes */}
        {nodes.map((node, i) => {
          const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
          const x = cx + rx * Math.cos(angle);
          const y = cy + ry * Math.sin(angle);

          return (
            <motion.g
              key={node.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.08, duration: 0.5 }}
            >
              <motion.circle
                cx={x}
                cy={y}
                r="20"
                fill="rgba(5,5,5,0.9)"
                stroke="#00F0FF"
                strokeWidth="1.5"
                animate={prefersReducedMotion ? {} : {
                  stroke: ["#00F0FF", "#FF3E00", "#00F0FF"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.4,
                }}
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
                y={y + (y > cy ? 38 : -28)}
                textAnchor="middle"
                fill="rgba(255,255,255,0.7)"
                fontSize="11"
                fontFamily="var(--font-jetbrains-mono)"
              >
                {node.label}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}

export function HeroSection() {
  const { eyebrow, title, subtitle, description, ctas } = heroContent;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <VideoBackground />

      {/* Strong overlay for readability */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: `
            radial-gradient(circle at 72% 40%, rgba(0, 224, 255, 0.12), transparent 34%),
            linear-gradient(90deg, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.82) 42%, rgba(0,0,0,0.62) 100%),
            linear-gradient(180deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 48%, rgba(0,0,0,0.95) 100%)
          `,
        }}
      />

      {/* Ambient glow */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cognitive-cyan/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-physical-orange/10 rounded-full blur-[128px]" />
      </div>

      {/* Content */}
      <div className="relative z-20 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div
          className="grid items-center gap-12 lg:gap-[clamp(48px,6vw,96px)]"
          style={{
            gridTemplateColumns: "minmax(520px, 0.9fr) minmax(420px, 0.8fr)",
          }}
        >
          {/* Left: Copy */}
          <div className="text-center lg:text-left py-20 lg:py-0">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase bg-white/5 border border-white/10 text-cognitive-cyan">
                {eyebrow}
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-7xl font-bold tracking-tight mb-6"
            >
              <span className="block text-white">{title.line1}</span>
              <span className="block text-gradient-cyan mt-2">{title.line2}</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg sm:text-xl md:text-2xl font-light text-white/80 mb-6"
            >
              {subtitle.map((line, i) => (
                <span key={i} className="inline-block">
                  {i > 0 && <span className="mx-2 text-cognitive-cyan">•</span>}
                  {line}
                </span>
              ))}
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg text-white/60 mb-10"
            >
              {description}
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
                href={ctas.primary.href}
                className="group px-8 py-3 rounded-lg bg-cognitive-cyan/10 border border-cognitive-cyan/30 text-cognitive-cyan font-medium hover:bg-cognitive-cyan/20 hover:border-cognitive-cyan/50 transition-all duration-300 shadow-[0_0_20px_-8px_rgba(0,240,255,0.25)]"
              >
                {ctas.primary.label}
              </a>
              <a
                href={ctas.secondary.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 rounded-lg bg-white/5 border border-white/10 text-white/80 font-medium hover:bg-white/10 hover:text-white transition-all duration-300 flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                {ctas.secondary.label}
              </a>
              <EmailLink
                email="ai@rosclaw.io"
                className="px-6 py-3 rounded-lg text-white/60 font-medium hover:text-white hover:bg-white/5 transition-all duration-300"
              >
                {ctas.tertiary.label}
              </EmailLink>
            </motion.div>
          </div>

          {/* Right: Runtime Mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="hidden lg:flex items-center justify-center"
          >
            <RuntimeMark />
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
