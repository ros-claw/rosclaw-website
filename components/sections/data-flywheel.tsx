'use client';

import { motion } from 'framer-motion';

const flywheelSteps = [
  { 
    id: 'deploy', 
    label: 'Deployment', 
    icon: '▶️',
    dataFormat: 'Task Intent (NL)',
    color: '#00F0FF'
  },
  { 
    id: 'supervise', 
    label: 'Supervision', 
    icon: '👁️',
    dataFormat: '/rosbag2 Stream',
    color: '#60A5FA'
  },
  { 
    id: 'recover', 
    label: 'Auto-EAP', 
    icon: '↩️',
    dataFormat: 'Inverse Policy',
    color: '#FBBF24'
  },
  { 
    id: 'label', 
    label: 'Labeling', 
    icon: '🏷️',
    dataFormat: 'Negative Sample',
    color: '#A78BFA'
  },
  { 
    id: 'ota', 
    label: 'OTA Update', 
    icon: '☁️',
    dataFormat: 'RLDS → VLA',
    color: '#FF3E00'
  }
];

export function DataFlywheel() {
  return (
    <div className="relative w-full max-w-5xl mx-auto py-12 px-4" suppressHydrationWarning>
      {/* Mobius Strip SVG */}
      <svg viewBox="0 0 800 400" className="w-full" suppressHydrationWarning>
        <defs>
          <linearGradient id="flywheelGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00F0FF" />
            <stop offset="25%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="75%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#FF3E00" />
          </linearGradient>
          
          <filter id="flywheelGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Mobius path */}
        <motion.path
          d="M 100 200 C 100 100, 300 100, 400 200 C 500 300, 700 300, 700 200 C 700 100, 500 100, 400 200 C 300 300, 100 300, 100 200"
          fill="none"
          stroke="url(#flywheelGradient)"
          strokeWidth="4"
          filter="url(#flywheelGlow)"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
          viewport={{ once: true }}
        />
        
        {/* Flowing particle - using native SVG animateMotion */}
        <circle r="8" fill="#00F0FF" filter="url(#flywheelGlow)">
          <animateMotion
            dur="10s"
            repeatCount="indefinite"
            path="M 100 200 C 100 100, 300 100, 400 200 C 500 300, 700 300, 700 200 C 700 100, 500 100, 400 200 C 300 300, 100 300, 100 200"
          />
        </circle>
        
        {/* Step nodes */}
        {flywheelSteps.map((step, index) => {
          const positions = [
            { x: 100, y: 200 },
            { x: 250, y: 120 },
            { x: 400, y: 200 },
            { x: 550, y: 280 },
            { x: 700, y: 200 }
          ];
          const pos = positions[index];
          
          return (
            <g key={step.id}>
              {/* Node circle */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r="35"
                fill="#050505"
                stroke={step.color}
                strokeWidth="3"
                filter="url(#flywheelGlow)"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.2 }}
                viewport={{ once: true }}
              />
              
              {/* Icon */}
              <text
                x={pos.x}
                y={pos.y + 8}
                textAnchor="middle"
                fontSize="24"
              >
                {step.icon}
              </text>
              
              {/* Label */}
              <text
                x={pos.x}
                y={pos.y + 60}
                textAnchor="middle"
                fill="#fff"
                fontSize="14"
                fontWeight="bold"
              >
                {step.label}
              </text>
              
              {/* Data format */}
              <text
                x={pos.x}
                y={pos.y + 80}
                textAnchor="middle"
                fill={step.color}
                fontSize="11"
                fontFamily="monospace"
              >
                {step.dataFormat}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Center title */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center bg-[#050505]/80 backdrop-blur-sm px-8 py-4 rounded-2xl border border-white/10">
          <div className="text-2xl font-bold text-white mb-1">Data Flywheel</div>
          <div className="text-sm text-[#A1A1AA]">Self-Evolving at OS Level</div>
        </div>
      </div>
    </div>
  );
}
