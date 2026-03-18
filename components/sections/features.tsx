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
  },
  {
    icon: Waypoints,
    title: 'Cross-Tool',
    subtitle: 'Embodied MCP',
    description: 'Native Model Context Protocol (MCP) integration. Every camera, LIDAR, and robotic arm API is instantly translated into standard JSON schemas for LLMs to consume and command.',
    color: '#FF3E00',
  },
  {
    icon: Network,
    title: 'Cross-Algorithm',
    subtitle: 'Brain-Cerebellum Router',
    description: 'The ultimate bus linking 1Hz LLM reasoning with 100Hz+ VLA control policies. Ensure soft-real-time execution with dynamic authority handovers.',
    color: '#4ADE80',
  },
  {
    icon: Database,
    title: 'Cross-Format',
    subtitle: 'Unified Trajectory Engine',
    description: 'OS-level data interception. ROSClaw automatically time-syncs and packages heterogeneous sensor data and LLM CoT into standard RLDS/HDF5 formats. Ready for Open X-Embodiment training.',
    color: '#A78BFA',
  },
];

export function FeaturesGrid() {
  return (
    <div className="w-full" suppressHydrationWarning>
      <div className="text-center mb-12" suppressHydrationWarning>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" suppressHydrationWarning>
          One Unified Standard. Zero Fragmentation.
        </h2>
        <p className="text-lg text-[#A1A1AA] max-w-2xl mx-auto" suppressHydrationWarning>
          Breaking down silos. Establishing a unified embodied AI standard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" suppressHydrationWarning>
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.15] transition-all duration-300"
            suppressHydrationWarning
          >
            {/* Glow effect on hover */}
            <div 
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at 50% 0%, ${feature.color}10 0%, transparent 70%)`,
              }}
            />
            
            <div className="relative" suppressHydrationWarning>
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${feature.color}15` }}
              >
                <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-1" suppressHydrationWarning>
                {feature.title}
              </h3>
              <p className="text-sm mb-3" style={{ color: feature.color }} suppressHydrationWarning>
                {feature.subtitle}
              </p>
              <p className="text-[#A1A1AA] leading-relaxed" suppressHydrationWarning>
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
