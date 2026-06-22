"use client";

import { motion } from "framer-motion";
import { Microscope, Bot, Factory } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const audiences = [
  {
    icon: Microscope,
    title: "For Embodied Agent Researchers",
    description:
      "Evaluate long-horizon memory, runtime repair, VLA/VLN routing, world-model feedback, and self-evolving skills.",
  },
  {
    icon: Bot,
    title: "For Robot Developers",
    description:
      "Connect robot bodies, sensors, skills, digital twins, and safety policies into an agent-readable runtime.",
  },
  {
    icon: Factory,
    title: "For Industrial Teams",
    description:
      "Capture physical traces, replay failures, audit sandbox decisions, and gradually promote validated skills from simulation to hardware.",
  },
];

export function BuiltForSection() {
  return (
    <section id="built-for" className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-cognitive-cyan text-sm uppercase tracking-widest mb-4 font-mono"
          >
            Built for Physical-AI Builders
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6"
          >
            Who ROSClaw Is For
          </motion.h2>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {audiences.map((audience) => {
            const Icon = audience.icon;
            return (
              <motion.div
                key={audience.title}
                variants={fadeInUp}
                className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-8 hover:border-white/[0.15] hover:bg-white/[0.05] transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-cognitive-cyan/10 border border-cognitive-cyan/30 flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-cognitive-cyan" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{audience.title}</h3>
                <p className="text-white/60 leading-relaxed">{audience.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
