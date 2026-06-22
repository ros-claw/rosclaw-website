"use client";

import { motion } from "framer-motion";
import {
  Database,
  Clock,
  FileJson,
  ArrowRight,
  Microscope,
  RotateCcw,
  BrainCircuit,
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
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const sources = [
  "DDS / ROS 2",
  "Camera streams",
  "Audio",
  "Agent plans",
  "Provider outputs",
  "Sandbox decisions",
  "Runtime actions",
  "Robot states",
  "Critic results",
  "Failure events",
];

const formats = [
  { name: "MCAP", desc: "Native ROS 2 bag format" },
  { name: "Parquet", desc: "Columnar analytical storage" },
  { name: "JSONL", desc: "Human-readable event logs" },
];

const outputs = [
  { icon: Database, label: "Memory" },
  { icon: RotateCcw, label: "Replay" },
  { icon: BrainCircuit, label: "RLDS / LeRobot" },
  { icon: Microscope, label: "Failure Cases" },
  { icon: FileJson, label: "Skill Candidates" },
];

export function PraxisFlywheelSection() {
  return (
    <section id="flywheel" className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-cognitive-cyan text-sm uppercase tracking-widest mb-4 font-mono"
          >
            Praxis Data Flywheel
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6"
          >
            Every Execution Becomes Structured Physical Evidence
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg max-w-3xl mx-auto"
          >
            ROSClaw captures what actually happened during embodied execution.
            The result is a physical trace that can be replayed, queried, audited,
            and converted into training or evaluation assets.
          </motion.p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid lg:grid-cols-12 gap-6"
        >
          {/* Sources */}
          <motion.div
            variants={fadeInUp}
            className="lg:col-span-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6"
          >
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-cognitive-cyan" />
              Sources
            </h3>
            <div className="flex flex-wrap gap-2">
              {sources.map((source) => (
                <span
                  key={source}
                  className="px-2 py-1 rounded-md bg-white/5 text-white/60 text-xs"
                >
                  {source}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Flow */}
          <motion.div
            variants={fadeInUp}
            className="lg:col-span-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-cognitive-cyan/10 border border-cognitive-cyan/30 flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-6 h-6 text-cognitive-cyan" />
                </div>
                <p className="text-white font-medium text-sm">Time Sync</p>
              </div>
              <ArrowRight className="hidden md:block w-5 h-5 text-white/20" />
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-physical-orange/10 border border-physical-orange/30 flex items-center justify-center mx-auto mb-2">
                  <FileJson className="w-6 h-6 text-physical-orange" />
                </div>
                <p className="text-white font-medium text-sm">Physical Trace</p>
              </div>
              <ArrowRight className="hidden md:block w-5 h-5 text-white/20" />
              <div className="w-full md:w-auto">
                <p className="text-white/40 text-xs uppercase tracking-wider mb-2 font-mono">Formats</p>
                <div className="space-y-2">
                  {formats.map((format) => (
                    <div
                      key={format.name}
                      className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-sm"
                    >
                      <span className="text-cognitive-cyan font-mono">{format.name}</span>
                      <span className="text-white/40 text-xs ml-2">{format.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Outputs */}
          <motion.div
            variants={fadeInUp}
            className="lg:col-span-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6"
          >
            <h3 className="text-white font-semibold mb-4">Outputs</h3>
            <div className="space-y-3">
              {outputs.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 text-white/70">
                  <Icon className="w-4 h-4 text-cognitive-cyan" />
                  <span className="text-sm">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
