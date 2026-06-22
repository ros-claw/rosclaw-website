"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";

const pipeline = [
  { id: "intent", label: "Agent Intent" },
  { id: "schema", label: "Provider Schema" },
  { id: "constraints", label: "Embodiment Constraints" },
  { id: "sandbox", label: "Sandbox Validation" },
  { id: "guard", label: "Runtime Guard" },
  { id: "controller", label: "Robot Controller" },
];

const scenarios: {
  decision: "ALLOW" | "MODIFY" | "BLOCK";
  proposal: string;
  reasons: string[];
  intervention: string;
}[] = [
  {
    decision: "ALLOW",
    proposal: "move_joint(elbow, +30deg)",
    reasons: ["within_joint_limits", "no_collision_risk"],
    intervention: "execute with default velocity",
  },
  {
    decision: "MODIFY",
    proposal: "move_joint(elbow, +90deg)",
    reasons: ["within_joint_limits", "high_velocity_detected"],
    intervention: "reduce velocity_scale to 0.35 and retry",
  },
  {
    decision: "BLOCK",
    proposal: "move_joint(elbow, +180deg)",
    reasons: ["joint_limit_violation", "self_collision_risk"],
    intervention: "reduce target angle to +42deg and retry",
  },
];

const decisionColors = {
  ALLOW: "bg-green-500/10 border-green-500/30 text-green-400",
  MODIFY: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
  BLOCK: "bg-red-500/10 border-red-500/30 text-red-400",
};

function SafetyPipeline() {
  const prefersReducedMotion = useReducedMotion();
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const scenario = scenarios[scenarioIndex];

  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setScenarioIndex((prev) => (prev + 1) % scenarios.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <div className="relative rounded-2xl bg-black/40 border border-white/10 p-6 md:p-8 overflow-hidden">
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        {pipeline.map((stage, i) => (
          <div key={stage.id} className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative px-4 py-3 rounded-xl border text-center min-w-[140px] ${
                stage.id === "sandbox"
                  ? "bg-physical-orange/10 border-physical-orange/30"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <span
                className={`text-sm font-medium ${
                  stage.id === "sandbox" ? "text-physical-orange" : "text-white"
                }`}
              >
                {stage.label}
              </span>

              {/* Connection arrow */}
              {!prefersReducedMotion && i < pipeline.length - 1 && (
                <motion.div
                  className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 text-white/30"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.div>
              )}
            </motion.div>

            {i < pipeline.length - 1 && (
              <div className="md:hidden text-white/30">↓</div>
            )}
          </div>
        ))}
      </div>

      {/* Scenario card */}
      <motion.div
        key={scenario.decision}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-8 grid md:grid-cols-2 gap-4"
      >
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.08] p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2 font-mono">
            Action Proposal
          </p>
          <code className="text-sm font-mono text-white/80">{scenario.proposal}</code>
        </div>
        <div className={`rounded-xl border p-4 ${decisionColors[scenario.decision]}`}>
          <p className="text-xs uppercase tracking-wider mb-2 font-mono opacity-80">
            Sandbox Decision
          </p>
          <div className="space-y-1 text-sm">
            <p className="font-mono font-medium">{scenario.decision}</p>
            <p className="opacity-70">Reason: {scenario.reasons.join(", ")}</p>
            <p className="opacity-90">Intervention: {scenario.intervention}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function SandboxSafetySection() {
  return (
    <section id="safety" className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-physical-orange text-sm uppercase tracking-widest mb-4 font-mono"
          >
            Sandbox Before Reality
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6"
          >
            No Model Output Should Directly Control a Robot.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg max-w-3xl mx-auto"
          >
            ROSClaw treats model outputs as proposals, not commands. Before an
            action reaches hardware, it passes through provider schemas,
            embodiment constraints, sandbox validation, and runtime guards.
          </motion.p>
        </div>

        <SafetyPipeline />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          {[
            "simulation-first validation",
            "runtime guard",
            "risk reduction",
            "known unsafe action blocking",
            "traceable safety decisions",
          ].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
