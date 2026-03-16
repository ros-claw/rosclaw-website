'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Abstract Humanoid Wireframe
const HumanoidSVG = () => (
  <svg viewBox="0 0 200 300" className="w-full h-full">
    <defs>
      <linearGradient id="humanoidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.2" />
      </linearGradient>
      <filter id="glow-humanoid">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Head */}
    <motion.circle 
      cx="100" cy="40" r="25" 
      fill="none" 
      stroke="url(#humanoidGrad)" 
      strokeWidth="2"
      filter="url(#glow-humanoid)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1 }}
    />
    
    {/* Torso */}
    <motion.path
      d="M 70 70 L 130 70 L 120 160 L 80 160 Z"
      fill="none"
      stroke="url(#humanoidGrad)"
      strokeWidth="2"
      filter="url(#glow-humanoid)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.2, delay: 0.2 }}
    />
    
    {/* Arms */}
    <motion.path
      d="M 70 80 L 40 140 L 35 200"
      fill="none"
      stroke="url(#humanoidGrad)"
      strokeWidth="2"
      filter="url(#glow-humanoid)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 0.4 }}
    />
    <motion.path
      d="M 130 80 L 160 140 L 165 200"
      fill="none"
      stroke="url(#humanoidGrad)"
      strokeWidth="2"
      filter="url(#glow-humanoid)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    />
    
    {/* Legs */}
    <motion.path
      d="M 85 160 L 75 230 L 70 290"
      fill="none"
      stroke="url(#humanoidGrad)"
      strokeWidth="2"
      filter="url(#glow-humanoid)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.2, delay: 0.6 }}
    />
    <motion.path
      d="M 115 160 L 125 230 L 130 290"
      fill="none"
      stroke="url(#humanoidGrad)"
      strokeWidth="2"
      filter="url(#glow-humanoid)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.2, delay: 0.7 }}
    />
    
    {/* Joints */}
    {[
      { cx: 100, cy: 40 },
      { cx: 40, cy: 140 },
      { cx: 160, cy: 140 },
      { cx: 75, cy: 230 },
      { cx: 125, cy: 230 },
    ].map((joint, i) => (
      <motion.circle
        key={i}
        cx={joint.cx}
        cy={joint.cy}
        r="6"
        fill="#00F0FF"
        filter="url(#glow-humanoid)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8 + i * 0.1 }}
      />
    ))}
  </svg>
);

// Abstract Quadruped Wireframe
const QuadrupedSVG = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <defs>
      <linearGradient id="quadrupedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF3E00" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FF3E00" stopOpacity="0.2" />
      </linearGradient>
      <filter id="glow-quadruped">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Body */}
    <motion.rect
      x="60" y="80" width="80" height="50" rx="10"
      fill="none"
      stroke="url(#quadrupedGrad)"
      strokeWidth="2"
      filter="url(#glow-quadruped)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1 }}
    />
    
    {/* Head */}
    <motion.path
      d="M 140 90 L 170 80 L 175 110 L 140 105"
      fill="none"
      stroke="url(#quadrupedGrad)"
      strokeWidth="2"
      filter="url(#glow-quadruped)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    />
    
    {/* Legs */}
    {[
      { x1: 70, y1: 130, x2: 60, y2: 180 },
      { x1: 90, y1: 130, x2: 95, y2: 180 },
      { x1: 110, y1: 130, x2: 105, y2: 180 },
      { x1: 130, y1: 130, x2: 140, y2: 180 },
    ].map((leg, i) => (
      <motion.line
        key={i}
        x1={leg.x1}
        y1={leg.y1}
        x2={leg.x2}
        y2={leg.y2}
        stroke="url(#quadrupedGrad)"
        strokeWidth="2"
        filter="url(#glow-quadruped)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
      />
    ))}
    
    {/* Joints */}
    {[
      { cx: 70, cy: 130 },
      { cx: 90, cy: 130 },
      { cx: 110, cy: 130 },
      { cx: 130, cy: 130 },
    ].map((joint, i) => (
      <motion.circle
        key={i}
        cx={joint.cx}
        cy={joint.cy}
        r="5"
        fill="#FF3E00"
        filter="url(#glow-quadruped)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8 + i * 0.1 }}
      />
    ))}
  </svg>
);

// Abstract Wheeled Wireframe
const WheeledSVG = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <defs>
      <linearGradient id="wheeledGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4ADE80" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#4ADE80" stopOpacity="0.2" />
      </linearGradient>
      <filter id="glow-wheeled">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Chassis */}
    <motion.rect
      x="40" y="70" width="120" height="60" rx="5"
      fill="none"
      stroke="url(#wheeledGrad)"
      strokeWidth="2"
      filter="url(#glow-wheeled)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1 }}
    />
    
    {/* Wheels */}
    {[
      { cx: 50, cy: 150 },
      { cx: 150, cy: 150 },
    ].map((wheel, i) => (
      <motion.circle
        key={i}
        cx={wheel.cx}
        cy={wheel.cy}
        r="25"
        fill="none"
        stroke="url(#wheeledGrad)"
        strokeWidth="3"
        filter="url(#glow-wheeled)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.3 + i * 0.2 }}
      />
    ))}
    
    {/* Lidar */}
    <motion.circle
      cx="100"
      cy="85"
      r="15"
      fill="none"
      stroke="url(#wheeledGrad)"
      strokeWidth="2"
      filter="url(#glow-wheeled)"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.6 }}
    />
    
    {/* Lidar rays */}
    <motion.path
      d="M 100 85 L 130 60 M 100 85 L 140 85 M 100 85 L 130 110"
      stroke="url(#wheeledGrad)"
      strokeWidth="1"
      opacity="0.5"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    />
    
    {/* Center indicator */}
    <motion.circle
      cx="100"
      cy="100"
      r="4"
      fill="#4ADE80"
      filter="url(#glow-wheeled)"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1 }}
    />
  </svg>
);

// Main Embodiment Demo Component
export function EmbodimentDemo() {
  const [activeTab, setActiveTab] = useState<'humanoid' | 'quadruped' | 'wheeled'>('humanoid');

  const tabs = [
    { id: 'humanoid' as const, label: 'Humanoid', icon: '🤖', color: '#00F0FF', svg: HumanoidSVG },
    { id: 'quadruped' as const, label: 'Quadruped', icon: '🐕', color: '#FF3E00', svg: QuadrupedSVG },
    { id: 'wheeled' as const, label: 'Wheeled', icon: '🛞', color: '#4ADE80', svg: WheeledSVG },
  ];

  const pythonCode = `from rosclaw import EmbodiedAgent

# Connect to ANY robot running ROSClaw OS
agent = EmbodiedAgent.connect("robot_ip")

# Semantic task - no hardware specifics
task = "Navigate to kitchen, pick up cup, place on table"

# ROSClaw auto-maps to embodiment:
# 🤖 Humanoid | 🐕 Quadruped | 🛞 Wheeled
agent.execute(task)`;

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Write Once. Embody Anywhere.
        </h2>
        <p className="text-lg text-[#A1A1AA]">
          The same agent logic runs seamlessly across heterogeneous robot morphologies.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-stretch">
        {/* Left: Code Editor */}
        <div className="flex-1 bg-[#0D0D0D] rounded-xl border border-white/10 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <span className="text-sm text-white/40">agent.py</span>
          </div>
          <div className="p-6 font-mono text-sm overflow-x-auto">
            <pre className="text-gray-300">
              <code>{pythonCode}</code>
            </pre>
          </div>
        </div>

        {/* Right: Robot Showcase */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'bg-white/5 border-white/10 text-[#A1A1AA] hover:bg-white/10'
                }`}
                style={{
                  backgroundColor: activeTab === tab.id ? `${tab.color}15` : undefined,
                  borderColor: activeTab === tab.id ? tab.color : undefined,
                }}
              >
                <span>{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Robot Visualization */}
          <div className="relative h-[300px] md:h-[400px] bg-[#0D0D0D] rounded-xl border border-white/10 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 p-8"
              >
                {activeTab === 'humanoid' && <HumanoidSVG />}
                {activeTab === 'quadruped' && <QuadrupedSVG />}
                {activeTab === 'wheeled' && <WheeledSVG />}
              </motion.div>
            </AnimatePresence>

            {/* Overlay info */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10">
                <div className="text-sm text-white/60">
                  {activeTab === 'humanoid' && '20 DOF • e-URDF Semantic Mapping • VLA Policy'}
                  {activeTab === 'quadruped' && '12 DOF • Dynamic Balance • Terrain Adaptation'}
                  {activeTab === 'wheeled' && '2 DOF • SLAM Navigation • LIDAR Perception'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
