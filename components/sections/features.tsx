'use client';

import { motion } from 'framer-motion';
import { Cpu, Waypoints, Network, Database } from 'lucide-react';

const features = [
  {
    icon: Cpu,
    title: 'Cross-Embodiment',
    subtitle: 'Semantic-HAL',
    description: 'Powered by e-URDF. Map high-level semantic intents to local hardware dynamics automatically. Your code runs seamlessly on wheeled, quadruped, or bipedal robots without modification.',
    color: '#00F0FF',
    gradient: 'from-[#00F0FF]/20 to-[#00F0FF]/5',
  },
  {
    icon: Waypoints,
    title: 'Cross-Tool',
    subtitle: 'Embodied MCP',
    description: 'Native Model Context Protocol (MCP) integration. Every camera, LIDAR, and robotic arm API is instantly translated into standard JSON schemas for LLMs to consume and command.',
    color: '#FF3E00',
    gradient: 'from-[#FF3E00]/20 to-[#FF3E00]/5',
  },
  {
    icon: Network,
    title: 'Cross-Algorithm',
    subtitle: 'Brain-Cerebellum Router',
    description: 'The ultimate bus linking 1Hz LLM reasoning with 100Hz+ VLA control policies. Ensure soft-real-time execution with dynamic authority handovers.',
    color: '#4ADE80',
    gradient: 'from-[#4ADE80]/20 to-[#4ADE80]/5',
  },
  {
    icon: Database,
    title: 'Cross-Format',
    subtitle: 'Unified Trajectory Engine',
    description: 'OS-level data interception. ROSClaw automatically time-syncs and packages heterogeneous sensor data and LLM CoT into standard RLDS/HDF5 formats. Ready for Open X-Embodiment training.',
    color: '#A78BFA',
    gradient: 'from-[#A78BFA]/20 to-[#A78BFA]/5',
  },
];

export function FeaturesGrid() {
  return (
    <div className="w-full max-w-6xl mx-auto" suppressHydrationWarning>
      <div className="text-center mb-12" suppressHydrationWarning>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" suppressHydrationWarning>
            One Unified Standard. Zero Fragmentation.
          </h2>
          <p className="text-lg text-[#A1A1AA] max-w-2xl mx-auto" suppressHydrationWarning>
            Breaking down silos. Establishing a unified embodied AI standard.
          </p>
        </motion.div>
      </div>

      {/* Bento Grid - CSS Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full" suppressHydrationWarning>
        {/* Cross-Embodiment - Spans 2 columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="col-span-1 md:col-span-2 bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20"
          suppressHydrationWarning
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center flex-shrink-0">
              <Cpu className="w-6 h-6" style={{ color: '#00F0FF' }} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Cross-Embodiment</h3>
              <p className="text-sm text-[#00F0FF] mb-3">Semantic-HAL</p>
              <p className="text-[#A1A1AA] text-sm">Powered by e-URDF. Map high-level semantic intents to local hardware dynamics automatically.</p>
            </div>
          </div>
        </motion.div>

        {/* Cross-Tool */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
          className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20"
          suppressHydrationWarning
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#FF3E00]/10 border border-[#FF3E00]/30 flex items-center justify-center flex-shrink-0">
              <Waypoints className="w-6 h-6" style={{ color: '#FF3E00' }} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Cross-Tool</h3>
              <p className="text-sm text-[#FF3E00] mb-3">Embodied MCP</p>
              <p className="text-[#A1A1AA] text-sm">Native MCP integration for cameras, LIDAR, and robotic arms.</p>
            </div>
          </div>
        </motion.div>

        {/* Cross-Algorithm */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20"
          suppressHydrationWarning
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#4ADE80]/10 border border-[#4ADE80]/30 flex items-center justify-center flex-shrink-0">
              <Network className="w-6 h-6" style={{ color: '#4ADE80' }} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Cross-Algorithm</h3>
              <p className="text-sm text-[#4ADE80] mb-3">Brain-Cerebellum Router</p>
              <p className="text-[#A1A1AA] text-sm">Linking 1Hz LLM reasoning with 100Hz+ VLA control policies.</p>
            </div>
          </div>
        </motion.div>

        {/* Cross-Format - Spans 2 columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="col-span-1 md:col-span-2 bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20"
          suppressHydrationWarning
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#A78BFA]/10 border border-[#A78BFA]/30 flex items-center justify-center flex-shrink-0">
              <Database className="w-6 h-6" style={{ color: '#A78BFA' }} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Cross-Format</h3>
              <p className="text-sm text-[#A78BFA] mb-3">Unified Trajectory Engine</p>
              <p className="text-[#A1A1AA] text-sm">OS-level data interception and time-sync for RLDS/HDF5 formats.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
