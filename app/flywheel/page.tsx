"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Database,
  Clock,
  FileJson,
  HardDrive,
  RotateCcw,
  BrainCircuit,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

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
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const sources = [
  "DDS",
  "ROS 2 topics",
  "Camera streams",
  "Audio",
  "Agent plans",
  "Provider outputs",
  "Sandbox decisions",
  "Runtime actions",
  "Robot states",
  "Critic results",
  "Failure events",
  "Memory writes",
];

const traceEvents = [
  { t: "0.0", label: "user task" },
  { t: "0.2", label: "agent plan" },
  { t: "0.4", label: "provider output" },
  { t: "0.6", label: "sandbox decision" },
  { t: "0.8", label: "robot state" },
  { t: "1.1", label: "critic result" },
  { t: "1.3", label: "memory write" },
  { t: "1.5", label: "skill patch candidate" },
];

const outputs = [
  { icon: HardDrive, label: "MCAP", desc: "Native ROS 2 bag replay" },
  { icon: Database, label: "Parquet", desc: "Columnar analytics" },
  { icon: FileJson, label: "JSONL", desc: "Event logs" },
  { icon: BrainCircuit, label: "RLDS / LeRobot", desc: "Training datasets" },
  { icon: ShieldCheck, label: "Failure Case Bundle", desc: "Audit + regression" },
  { icon: RotateCcw, label: "Skill Candidate Bundle", desc: "Evolution input" },
];

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
            <span>PRAXIS DATA FLYWHEEL</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Praxis Data Flywheel
          </h1>
          <p className="text-text-secondary text-lg max-w-3xl mx-auto">
            Turn every physical execution into replayable, queryable, and reusable
            evidence.
          </p>
        </motion.div>

        {/* Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">Sources</h2>
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6">
            <div className="flex flex-wrap gap-2">
              {sources.map((source) => (
                <span
                  key={source}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm"
                >
                  {source}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">Physical Trace Timeline</h2>
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 md:p-8 overflow-x-auto">
            <div className="flex items-center gap-3 min-w-max">
              {traceEvents.map((event, i) => (
                <div key={event.label} className="flex items-center gap-3">
                  <div className="px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-center min-w-[120px]">
                    <p className="text-cognitive-cyan font-mono text-xs mb-1">
                      t={event.t}s
                    </p>
                    <p className="text-white/80 text-sm">{event.label}</p>
                  </div>
                  {i < traceEvents.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-white/20 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Trace Schema + Outputs */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">Trace Schema</h2>
            <div className="rounded-2xl bg-black/60 border border-white/10 p-6 font-mono text-sm overflow-x-auto">
              <pre className="text-white/70">
                {`trace:
  session_id: pick_cup_001
  robot: unitree-g1
  events:
    - timestamp: 0.0
      type: user_task
      payload: { task: "pick red cup" }
    - timestamp: 0.2
      type: agent_plan
      payload: { plan: [...] }
    - timestamp: 0.6
      type: sandbox_decision
      payload: { decision: ALLOW }
    - timestamp: 1.3
      type: memory_write
      payload: { key: grasp_near_red_cup }`}
              </pre>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">Export Formats</h2>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {outputs.map(({ icon: Icon, label, desc }) => (
                <motion.div
                  key={label}
                  variants={fadeInUp}
                  className="rounded-xl bg-white/[0.03] border border-white/[0.08] p-4 flex items-start gap-3"
                >
                  <Icon className="w-5 h-5 text-cognitive-cyan flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-medium text-sm">{label}</p>
                    <p className="text-white/50 text-xs">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Memory Write + Replay */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <BrainCircuit className="w-6 h-6 text-cognitive-cyan" />
              <h2 className="text-xl font-bold text-foreground">Memory Write</h2>
            </div>
            <p className="text-text-secondary leading-relaxed">
              Physical traces are distilled into spatiotemporal memory: success
              patterns, failure evidence, and recovery strategies that persist
              across sessions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <RotateCcw className="w-6 h-6 text-physical-orange" />
              <h2 className="text-xl font-bold text-foreground">Replay</h2>
            </div>
            <p className="text-text-secondary leading-relaxed">
              Replay traces in simulation to reproduce failures, audit decisions,
              and validate fixes. Hardware revalidation must run through sandbox
              checks, runtime guards, and explicit human approval.
            </p>
          </motion.div>
        </div>

        {/* Safety & Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-8 mb-16"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-cognitive-cyan/10 border border-cognitive-cyan/30 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-cognitive-cyan" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">Safety & Privacy</h2>
              <p className="text-text-secondary leading-relaxed">
                Traces are stored locally by default. Cloud sync is optional and
                currently under active development. We record agent plans, tool
                calls, provider outputs, and runtime decisions for safety audit.
                We do not record private reasoning content or user prompts beyond
                what is required for audit and replay.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Back to Hub */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center"
        >
          <Link
            href="/hub"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-foreground transition-colors"
          >
            <span className="text-physical-orange">←</span>
            Back to Physical-AI Asset Hub
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
