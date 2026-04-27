"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Database, GitBranch, Shield, Cpu, Rocket } from "lucide-react";

const pipelineStages = [
  {
    id: "physical",
    title: "Physical Interaction",
    description: "Real robot executes task",
    icon: Cpu,
    color: "#00F0FF",
  },
  {
    id: "firewall",
    title: "e-URDF Firewall",
    description: "Safety interception layer",
    icon: Shield,
    color: "#FF3E00",
  },
  {
    id: "kernel",
    title: "ROSClaw OS Kernel",
    description: "Event-driven ring buffer",
    icon: Database,
    color: "#00F0FF",
  },
  {
    id: "dataset",
    title: "LeRobot RLDS Format",
    description: "Standardized dataset packaging",
    icon: GitBranch,
    color: "#00F0FF",
  },
  {
    id: "huggingface",
    title: "Hugging Face Repo",
    description: "Community-shared training data",
    icon: Rocket,
    color: "#FF3E00",
  },
];

function ParticleFlow() {
  const [particles, setParticles] = useState<
    Array<{ id: number; stage: number; offset: number }>
  >([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => {
        const newParticles = prev
          .map((p) => ({ ...p, stage: p.stage + 0.02 }))
          .filter((p) => p.stage < pipelineStages.length - 1);

        if (Math.random() > 0.7) {
          newParticles.push({
            id: Date.now(),
            stage: 0,
            offset: Math.random() * 20 - 10,
          });
        }

        return newParticles.slice(-20);
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => {
        const stageIndex = Math.floor(particle.stage);
        const progress = particle.stage - stageIndex;
        const stageWidth = 100 / (pipelineStages.length - 1);
        const x = stageIndex * stageWidth + progress * stageWidth;

        return (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${x}%`,
              top: `calc(50% + ${particle.offset}px)`,
              backgroundColor:
                stageIndex === 1 ? "#FF3E00" : "#00F0FF",
              boxShadow: `0 0 10px ${
                stageIndex === 1 ? "#FF3E00" : "#00F0FF"
              }`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          />
        );
      })}
    </div>
  );
}

export default function FlywheelPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 text-cognitive-cyan font-mono text-sm mb-4">
            <span className="text-physical-orange">&gt;_</span>
            <span>THE AUTONOMOUS DATA FLYWHEEL</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Stop Manually Logging Data
          </h1>
          <p className="text-text-secondary text-lg max-w-3xl mx-auto">
            Let the OS build your dataset while it works.
          </p>
        </motion.div>

        {/* Pipeline Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative mb-16"
        >
          <div className="relative bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 md:p-12 overflow-hidden">
            <ParticleFlow />

            {/* Pipeline Stages */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-6">
              {pipelineStages.map((stage, index) => {
                const Icon = stage.icon;
                return (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    className="relative"
                  >
                    {/* Connection Line */}
                    {index < pipelineStages.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-cognitive-cyan/50 to-cognitive-cyan/20" />
                    )}

                    <div className="flex flex-col items-center text-center">
                      <div
                        className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 transition-all hover:scale-110"
                        style={{
                          borderColor: `${stage.color}30`,
                          boxShadow: `0 0 20px ${stage.color}10`,
                        }}
                      >
                        <Icon
                          className="w-8 h-8"
                          style={{ color: stage.color }}
                        />
                      </div>
                      <h3 className="text-foreground font-semibold mb-2">
                        {stage.title}
                      </h3>
                      <p className="text-text-secondary text-sm">
                        {stage.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8">
            <p className="text-text-secondary leading-relaxed text-center">
              Every physical movement, successful or blocked, is intercepted by
              the{" "}
              <span className="text-cognitive-cyan">Event-Driven Ring Buffer</span>
              . ROSClaw automatically time-syncs{" "}
              <span className="text-physical-orange">ROS 2 joint states</span>,{" "}
              <span className="text-physical-orange">RGB-D streams</span>, and{" "}
              <span className="text-physical-orange">LLM reasoning prompts</span>,
              outputting standard{" "}
              <span className="text-cognitive-cyan">RLDS datasets</span> for
              offline VLA fine-tuning.
            </p>
          </div>
        </motion.div>

        {/* Key Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              title: "Automatic Collection",
              description:
                "No manual logging required. Every interaction is captured.",
            },
            {
              title: "Time-Synchronized",
              description:
                "ROS 2 messages aligned with LLM chain-of-thought traces.",
            },
            {
              title: "Standard Format",
              description:
                "Native LeRobot RLDS export for immediate training.",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 + index * 0.1, duration: 0.5 }}
              className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 hover:border-white/20 transition-colors"
            >
              <h3 className="text-foreground font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-text-secondary text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Back to Hub */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <Link
            href="/hub"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-foreground transition-colors"
          >
            <span className="text-physical-orange">←</span>
            Back to ROSClaw Hub
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
