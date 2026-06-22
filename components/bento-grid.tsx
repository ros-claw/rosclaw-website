"use client";

import { motion } from "framer-motion";
import { X, Check, Shield } from "lucide-react";

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

const problems = [
  "Agents produce actions without physical grounding.",
  "Robot state is scattered across logs and topics.",
  "Failures are forgotten after each run.",
  "Safety checks are bolted on late.",
  "Skills do not improve systematically.",
];

const solutions = [
  "Every action is grounded in body context.",
  "Every risky command passes sandbox validation.",
  "Every execution becomes a physical trace.",
  "Every failure can become memory.",
  "Every skill can be evaluated, patched, and promoted.",
];

const principles = [
  "Grounded.",
  "Validated.",
  "Recorded.",
  "Remembered.",
  "Repaired.",
  "Evolved.",
];

function Column({
  title,
  icon: Icon,
  items,
  variant,
}: {
  title: string;
  icon: React.ElementType;
  items: string[];
  variant: "problem" | "solution" | "principle";
}) {
  const borderColor =
    variant === "problem"
      ? "border-physical-orange/20"
      : variant === "solution"
      ? "border-cognitive-cyan/20"
      : "border-white/10";
  const iconColor =
    variant === "problem"
      ? "text-physical-orange"
      : variant === "solution"
      ? "text-cognitive-cyan"
      : "text-white";
  const bgColor =
    variant === "problem"
      ? "bg-physical-orange/5"
      : variant === "solution"
      ? "bg-cognitive-cyan/5"
      : "bg-white/[0.03]";

  return (
    <motion.div
      variants={fadeInUp}
      className={`rounded-2xl border ${borderColor} ${bgColor} p-6 md:p-8 h-full`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>

      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-white/70">
            {variant === "problem" ? (
              <X className="w-4 h-4 text-physical-orange flex-shrink-0 mt-1" />
            ) : variant === "solution" ? (
              <Check className="w-4 h-4 text-cognitive-cyan flex-shrink-0 mt-1" />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-cognitive-cyan flex-shrink-0 mt-2" />
            )}
            <span className="text-sm md:text-base leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function BentoGrid() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-cognitive-cyan text-sm uppercase tracking-widest mb-4 font-mono">
            Why Physical AI Needs Runtime Infrastructure
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            Tokens Are Not Enough.
          </h2>
          <p className="text-white/60 text-lg max-w-3xl mx-auto">
            Large models can reason, plan, and generate code. But physical
            intelligence requires a runtime that knows the body, validates every
            action, remembers what happened, and knows how to recover.
          </p>
        </motion.div>

        {/* Three columns */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Column
            title="Without ROSClaw"
            icon={X}
            items={problems}
            variant="problem"
          />
          <Column
            title="With ROSClaw"
            icon={Check}
            items={solutions}
            variant="solution"
          />
          <Column
            title="Core Principle"
            icon={Shield}
            items={principles}
            variant="principle"
          />
        </motion.div>
      </div>
    </section>
  );
}
