"use client";

import { motion } from "framer-motion";
import {
  Anchor,
  ShieldCheck,
  Route,
  ClipboardList,
  Database,
  AlertTriangle,
  GitBranch,
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

type Status = "Current" | "Experimental" | "Research" | "Planned";

const modules: {
  title: string;
  icon: React.ReactNode;
  oneLiner: string;
  command: string;
  status: Status;
}[] = [
  {
    title: "Embodiment Grounding",
    icon: <Anchor className="w-6 h-6 text-cognitive-cyan" />,
    oneLiner:
      "Describe robot bodies, sensors, actuators, safety limits, capabilities, tool frames, and simulation metadata through e-URDF and body.yaml.",
    command: "rosclaw body init --robot unitree-g1",
    status: "Current",
  },
  {
    title: "Sandbox-before-Reality",
    icon: <ShieldCheck className="w-6 h-6 text-physical-orange" />,
    oneLiner:
      "Validate action proposals in digital twins before they touch real hardware.",
    command: "rosclaw sandbox run --robot sim_g1 --task stand_balance",
    status: "Current",
  },
  {
    title: "Capability Routing",
    icon: <Route className="w-6 h-6 text-cognitive-cyan" />,
    oneLiner:
      "Route tasks across LLMs, VLMs, VLAs, VLNs, world models, critics, embeddings, classical robotics algorithms, and skill policies.",
    command: "rosclaw route --intent pick --body unitree-g1",
    status: "Experimental",
  },
  {
    title: "Praxis Capture",
    icon: <ClipboardList className="w-6 h-6 text-physical-orange" />,
    oneLiner:
      "Record robot states, sensor streams, action proposals, tool calls, sandbox decisions, failures, and recoveries.",
    command: "rosclaw trace start --session pick_cup_001",
    status: "Current",
  },
  {
    title: "Physical Memory",
    icon: <Database className="w-6 h-6 text-cognitive-cyan" />,
    oneLiner:
      "Turn physical traces into spatiotemporal memory, failure evidence, success patterns, and reusable experience.",
    command: "rosclaw memory query --near red_cup --failure grasp",
    status: "Experimental",
  },
  {
    title: "Runtime Intervention",
    icon: <AlertTriangle className="w-6 h-6 text-physical-orange" />,
    oneLiner:
      "Inject minimal, evidence-backed corrections when an embodied agent is stuck, unsafe, or regressing.",
    command: "rosclaw intervene --session-id pick_cup_001 --reason overshoot",
    status: "Research",
  },
  {
    title: "Skill Evolution",
    icon: <GitBranch className="w-6 h-6 text-cognitive-cyan" />,
    oneLiner:
      "Evaluate, patch, benchmark, promote, and roll back skills through Darwin-style validation loops.",
    command: "rosclaw skill evolve --task pick_cup --champion-threshold 0.95",
    status: "Research",
  },
];

function StatusBadge({ status }: { status: Status }) {
  const colors = {
    Current: "bg-green-500/10 border-green-500/30 text-green-400",
    Experimental: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
    Research: "bg-purple-500/10 border-purple-500/30 text-purple-400",
    Planned: "bg-white/5 border-white/20 text-white/60",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider ${colors[status]}`}
    >
      {status}
    </span>
  );
}

export function CoreRuntimeModules() {
  return (
    <section id="runtime-modules" className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-cognitive-cyan text-sm uppercase tracking-widest mb-4 font-mono"
          >
            Core Runtime Capabilities
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6"
          >
            One Runtime. Seven Physical-AI Primitives.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg max-w-3xl mx-auto"
          >
            ROSClaw turns the requirements of physical intelligence into a
            coherent runtime: grounding, validation, routing, capture, memory,
            intervention, and evolution.
          </motion.p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {modules.map((module) => (
            <motion.div
              key={module.title}
              variants={fadeInUp}
              className="group rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 hover:border-white/[0.15] hover:bg-white/[0.05] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  {module.icon}
                </div>
                <StatusBadge status={module.status} />
              </div>

              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cognitive-cyan transition-colors">
                {module.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                {module.oneLiner}
              </p>

              <div className="rounded-lg bg-black/40 border border-white/10 p-3 font-mono text-xs text-cognitive-cyan overflow-x-auto">
                {module.command}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
