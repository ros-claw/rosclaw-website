"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Cpu, Brain, Plug, Box, BookOpen, ArrowUpRight } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.23, 1, 0.32, 1],
    },
  },
};

const hubCards = [
  {
    id: "skills",
    title: "e-Skill Market",
    subtitle: "Teach Once, Embody Anywhere.",
    description:
      "Download, share, and deploy physics-grounded skills. Transform your hardware instantly with community-driven VLA weights and behavior trees.",
    cta: "Explore Skills",
    href: "/hub/skills",
    icon: Cpu,
    span: "col-span-1 md:col-span-2",
    gradient: "from-physical-orange/20 to-cognitive-cyan/10",
  },
  {
    id: "models",
    title: "Foundation Models",
    subtitle: "The Cognitive Brain.",
    description:
      "Mount the world's most powerful Vision-Language-Action (VLA) models. Plug-and-play intelligence optimized for robotic inference.",
    cta: "Browse Models",
    href: "/hub/models",
    icon: Brain,
    span: "col-span-1",
    gradient: "from-cognitive-cyan/20 to-transparent",
  },
  {
    id: "mcps",
    title: "Hardware MCPs",
    subtitle: "Zero-Code Embodiment.",
    description:
      "Universal southbound drivers. Connect Unitree, UR5e, or ANY custom robot to AI agents instantly using the Model Context Protocol.",
    cta: "View Drivers",
    href: "/hub/mcps",
    icon: Plug,
    span: "col-span-1",
    gradient: "from-physical-orange/20 to-transparent",
  },
  {
    id: "twins",
    title: "Digital Twins",
    subtitle: "The Subconscious Sandbox.",
    description:
      "Predict the future. Intercept AI hallucinations before they break physical hardware with 100x-speed MuJoCo kinematic simulations.",
    cta: "Enter Sandbox",
    href: "/hub/twins",
    icon: Box,
    span: "col-span-1",
    gradient: "from-green-500/20 to-transparent",
  },
  {
    id: "wiki",
    title: "Cognitive Wiki",
    subtitle: "The Shared Memory.",
    description:
      "A persistent, LLM-generated knowledge graph of robotic physics, limits, and control theory. Endowing agents with lifelong memory.",
    cta: "Read the Wiki",
    href: "/hub/wiki",
    icon: BookOpen,
    span: "col-span-1",
    gradient: "from-purple-500/20 to-transparent",
  },
];

export default function HubPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 text-cognitive-cyan font-mono text-sm mb-4">
            <span className="text-physical-orange">&gt;_</span>
            <span>THE EMBODIED ECOSYSTEM</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            The ROSClaw Universe
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl">
            Five pillars bridging artificial intelligence with the physical universe.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {hubCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                variants={itemVariants}
                className={`group relative ${card.span}`}
              >
                <Link href={card.href}>
                  <div
                    className={`
                      relative h-full min-h-[280px] p-6 md:p-8 rounded-2xl
                      bg-white/5 backdrop-blur-md
                      border border-white/10
                      transition-all duration-500
                      hover:border-white/30 hover:bg-white/10
                      hover:shadow-[0_0_40px_rgba(0,240,255,0.1)]
                      overflow-hidden
                    `}
                  >
                    {/* Background Gradient */}
                    <div
                      className={`
                        absolute inset-0 bg-gradient-to-br ${card.gradient}
                        opacity-0 group-hover:opacity-100
                        transition-opacity duration-500
                      `}
                    />

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col">
                      {/* Icon & Title */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-cognitive-cyan/30 transition-colors">
                          <Icon className="w-6 h-6 text-cognitive-cyan" />
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-text-muted group-hover:text-cognitive-cyan transition-colors transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </div>

                      <div className="flex-1">
                        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">
                          {card.title}
                        </h2>
                        <p className="text-cognitive-cyan text-sm font-medium mb-3">
                          {card.subtitle}
                        </p>
                        <p className="text-text-secondary text-sm leading-relaxed">
                          {card.description}
                        </p>
                      </div>

                      {/* CTA */}
                      <div className="mt-6 pt-4 border-t border-white/5">
                        <span className="inline-flex items-center gap-2 text-sm text-cognitive-cyan group-hover:text-physical-orange transition-colors">
                          {card.cta}
                          <ArrowUpRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-foreground transition-colors"
          >
            <span className="text-physical-orange">←</span>
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
