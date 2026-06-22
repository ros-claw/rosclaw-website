"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";
import { AlertTriangle, Database, Wrench, ShieldCheck, RotateCcw } from "lucide-react";

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

const steps = [
  {
    icon: AlertTriangle,
    title: "Failure Event",
    content: "torso_pitch_overshoot during G1 kick_ball",
    color: "text-physical-orange",
    bg: "bg-physical-orange/10 border-physical-orange/30",
  },
  {
    icon: Database,
    title: "Memory Recall",
    content: "3 similar traces found with successful recovery patterns",
    color: "text-cognitive-cyan",
    bg: "bg-cognitive-cyan/10 border-cognitive-cyan/30",
  },
  {
    icon: Wrench,
    title: "How Intervention",
    content:
      "reduce torso pitch gain by 15%; increase stabilization window by 0.4s; retry once in sandbox",
    color: "text-cognitive-cyan",
    bg: "bg-cognitive-cyan/10 border-cognitive-cyan/30",
  },
  {
    icon: ShieldCheck,
    title: "Sandbox Decision",
    content: "ALLOW_WITH_LIMITS",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/30",
  },
  {
    icon: RotateCcw,
    title: "Retry Outcome",
    content: "Action validated; trace updated; memory strengthened",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/30",
  },
];

export function PhysicalMemorySection() {
  const prefersReducedMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <section id="memory" className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-cognitive-cyan text-sm uppercase tracking-widest mb-4 font-mono"
          >
            Memory that Repairs Action
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6"
          >
            Physical Memory for Runtime Recovery
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg max-w-3xl mx-auto"
          >
            Physical memory is not chat history. It is structured evidence from
            embodied interaction: what was tried, what failed, what changed, what
            recovered, and when the lesson still applies.
          </motion.p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-5 gap-4"
        >
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                variants={fadeInUp}
                className={`relative rounded-2xl border ${step.bg} p-6 transition-all duration-500 ${
                  activeStep === i
                    ? "ring-1 ring-cognitive-cyan/40 shadow-[0_0_24px_-6px_rgba(0,240,255,0.2)]"
                    : ""
                } ${
                  i < steps.length - 1
                    ? "md:after:content-['→'] md:after:absolute md:after:-right-4 md:after:top-1/2 md:after:-translate-y-1/2 md:after:text-white/20 md:after:text-xl"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Icon className={`w-5 h-5 ${step.color}`} />
                  <h3 className={`font-semibold ${step.color}`}>{step.title}</h3>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">{step.content}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
