"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Construction, FlaskConical } from "lucide-react";

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

const statusColumns = [
  {
    title: "Ready Today",
    icon: CheckCircle2,
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
    items: [
      "Local runtime workspace",
      "First Embodiment flow",
      "e-URDF profile structure",
      "Sandbox validation demos",
      "Hub manifest workflow",
      "Praxis trace schema",
      "Dashboard foundation",
    ],
  },
  {
    title: "In Progress",
    icon: Construction,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
    items: [
      "Provider container lifecycle",
      "Hardware MCP auto-install",
      "Physical memory closed-loop evaluation",
      "Darwin skill promotion",
    ],
  },
  {
    title: "Research",
    icon: FlaskConical,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    items: [
      "Cross-embodiment transfer",
      "Long-horizon physical memory",
      "Self-evolving VLA/VLN skills",
    ],
  },
];

export function CurrentStatusSection() {
  return (
    <section id="status" className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-cognitive-cyan text-sm uppercase tracking-widest mb-4 font-mono"
          >
            Current Status
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6"
          >
            What Is Ready Today
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg max-w-3xl mx-auto"
          >
            ROSClaw is under active development. Here is what you can try now,
            what is being built, and what remains research.
          </motion.p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {statusColumns.map((column) => {
            const Icon = column.icon;
            return (
              <motion.div
                key={column.title}
                variants={fadeInUp}
                className={`rounded-2xl border ${column.bg} p-6 md:p-8`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Icon className={`w-6 h-6 ${column.color}`} />
                  <h3 className="text-xl font-semibold text-white">{column.title}</h3>
                </div>
                <ul className="space-y-3">
                  {column.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-white/70">
                      <span className={`w-1.5 h-1.5 rounded-full ${column.color} flex-shrink-0 mt-2`} />
                      <span className="text-sm md:text-base leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
