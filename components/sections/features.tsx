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
    <div className="w-full" suppressHydrationWarning>
      <div className="text-center mb-16" suppressHydrationWarning>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight" suppressHydrationWarning>
            One Unified Standard. Zero Fragmentation.
          </h2>
          <p className="text-lg text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed" suppressHydrationWarning>
            Breaking down silos. Establishing a unified embodied AI standard.
          </p>
        </motion.div>
      </div>

      {/* Bento Grid - Asymmetric Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" suppressHydrationWarning>
        {/* Cross-Embodiment - Spans 2 columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-2 group relative p-8 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.08] hover:border-white/[0.20] transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
          suppressHydrationWarning
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00F0FF]/20 to-[#00F0FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
          
          <div className="relative" suppressHydrationWarning>
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br from-[#00F0FF]/20 to-[#00F0FF]/5 border border-[#00F0FF]/30 shadow-[0_0_30px_rgba(0,240,255,0.15)]"
            >
              <Cpu className="w-7 h-7" style={{ color: '#00F0FF' }} />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight" suppressHydrationWarning>
              Cross-Embodiment
            </h3>
            <p className="text-sm font-medium mb-4" style={{ color: '#00F0FF' }} suppressHydrationWarning>
              Semantic-HAL
            </p>
            <p className="text-[#A1A1AA] leading-relaxed text-base" suppressHydrationWarning>
              Powered by e-URDF. Map high-level semantic intents to local hardware dynamics automatically. Your code runs seamlessly on wheeled, quadruped, or bipedal robots without modification.
            </p>
          </div>
        </motion.div>

        {/* Cross-Tool */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
          className="group relative p-8 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.08] hover:border-white/[0.20] transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
          suppressHydrationWarning
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF3E00]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative" suppressHydrationWarning>
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br from-[#FF3E00]/20 to-[#FF3E00]/5 border border-[#FF3E00]/30 shadow-[0_0_30px_rgba(255,62,0,0.15)]"
            >
              <Waypoints className="w-7 h-7" style={{ color: '#FF3E00' }} />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2 tracking-tight" suppressHydrationWarning>
              Cross-Tool
            </h3>
            <p className="text-sm font-medium mb-3" style={{ color: '#FF3E00' }} suppressHydrationWarning>
              Embodied MCP
            </p>
            <p className="text-[#A1A1AA] leading-relaxed text-sm" suppressHydrationWarning>
              Native Model Context Protocol (MCP) integration. Every camera, LIDAR, and robotic arm API is instantly translated into standard JSON schemas.
            </p>
          </div>
        </motion.div>

        {/* Cross-Algorithm */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="group relative p-8 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.08] hover:border-white/[0.20] transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
          suppressHydrationWarning
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#4ADE80]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative" suppressHydrationWarning>
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br from-[#4ADE80]/20 to-[#4ADE80]/5 border border-[#4ADE80]/30 shadow-[0_0_30px_rgba(74,222,128,0.15)]"
            >
              <Network className="w-7 h-7" style={{ color: '#4ADE80' }} />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2 tracking-tight" suppressHydrationWarning>
              Cross-Algorithm
            </h3>
            <p className="text-sm font-medium mb-3" style={{ color: '#4ADE80' }} suppressHydrationWarning>
              Brain-Cerebellum Router
            </p>
            <p className="text-[#A1A1AA] leading-relaxed text-sm" suppressHydrationWarning>
              The ultimate bus linking 1Hz LLM reasoning with 100Hz+ VLA control policies with dynamic authority handovers.
            </p>
          </div>
        </motion.div>

        {/* Cross-Format - Spans 2 columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="md:col-span-2 group relative p-8 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.08] hover:border-white/[0.20] transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
          suppressHydrationWarning
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#A78BFA]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative" suppressHydrationWarning>
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br from-[#A78BFA]/20 to-[#A78BFA]/5 border border-[#A78BFA]/30 shadow-[0_0_30px_rgba(167,139,250,0.15)]"
            >
              <Database className="w-7 h-7" style={{ color: '#A78BFA' }} />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight" suppressHydrationWarning>
              Cross-Format
            </h3>
            <p className="text-sm font-medium mb-4" style={{ color: '#A78BFA' }} suppressHydrationWarning>
              Unified Trajectory Engine
            </p>
            <p className="text-[#A1A1AA] leading-relaxed text-base" suppressHydrationWarning>
              OS-level data interception. ROSClaw automatically time-syncs and packages heterogeneous sensor data and LLM CoT into standard RLDS/HDF5 formats. Ready for Open X-Embodiment training.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
