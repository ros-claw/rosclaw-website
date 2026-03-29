"use client";

import { motion } from "framer-motion";
import { Cpu, Shield, Zap, Database } from "lucide-react";

// Animation variants for staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.23, 1, 0.32, 1],
    },
  },
};

// MCP Hub Animation - Agent logos converging into a slot
function MCPHubAnimation() {
  const agents = [
    { name: "Claude", color: "#D4A574", delay: 0 },
    { name: "OpenAI", color: "#10A37F", delay: 0.2 },
    { name: "OpenClaw", color: "#00F0FF", delay: 0.4 },
    { name: "QClaw", color: "#FF3E00", delay: 0.6 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        {/* Central MCP Slot */}
        <motion.g
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <rect
            x="160"
            y="120"
            width="80"
            height="60"
            rx="8"
            fill="none"
            stroke="#00F0FF"
            strokeWidth="2"
            className="drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]"
          />
          <text x="200" y="155" textAnchor="middle" fill="#00F0FF" fontSize="12" fontFamily="var(--font-jetbrains-mono)">
            MCP
          </text>
        </motion.g>

        {/* Agent logos converging */}
        {agents.map((agent, i) => {
          const startPositions = [
            { x: 50, y: 50 },   // top-left
            { x: 350, y: 50 },  // top-right
            { x: 50, y: 250 },  // bottom-left
            { x: 350, y: 250 }, // bottom-right
          ];
          const start = startPositions[i];

          return (
            <motion.g key={agent.name}>
              {/* Connection line */}
              <motion.line
                x1={start.x}
                y1={start.y}
                x2="200"
                y2="150"
                stroke={agent.color}
                strokeWidth="1"
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{ duration: 1.5, delay: agent.delay, repeat: Infinity, repeatDelay: 1 }}
              />
              {/* Agent node */}
              <motion.circle
                cx={start.x}
                cy={start.y}
                r="20"
                fill="rgba(5, 5, 5, 0.9)"
                stroke={agent.color}
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: agent.delay }}
              />
              <motion.text
                x={start.x}
                y={start.y + 4}
                textAnchor="middle"
                fill={agent.color}
                fontSize="8"
                fontFamily="var(--font-jetbrains-mono)"
              >
                {agent.name.slice(0, 2)}
              </motion.text>
              {/* Particle moving toward center */}
              <motion.circle
                r="4"
                fill={agent.color}
                initial={{ cx: start.x, cy: start.y, opacity: 1 }}
                animate={{ cx: 200, cy: 150, opacity: 0 }}
                transition={{ duration: 1.2, delay: agent.delay + 0.5, repeat: Infinity, repeatDelay: 1.5 }}
              />
            </motion.g>
          );
        })}

        {/* Output waves */}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx="200"
            cy="150"
            r="40"
            fill="none"
            stroke="#00F0FF"
            strokeWidth="1"
            initial={{ scale: 0.5, opacity: 0.8 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 2, delay: i * 0.6, repeat: Infinity }}
          />
        ))}
      </svg>
    </div>
  );
}

// Digital Twin Animation - MuJoCo wireframe intercepting collision
function DigitalTwinAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice">
        {/* MuJoCo Wireframe - UR5 Arm */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Base */}
          <rect x="40" y="180" width="40" height="40" fill="none" stroke="#00F0FF" strokeWidth="1.5" opacity="0.6" />
          {/* Joint 1 */}
          <circle cx="60" cy="170" r="8" fill="none" stroke="#00F0FF" strokeWidth="1.5" opacity="0.6" />
          {/* Link 1 */}
          <line x1="60" y1="170" x2="120" y2="130" stroke="#00F0FF" strokeWidth="1.5" opacity="0.6" />
          {/* Joint 2 */}
          <circle cx="120" cy="130" r="6" fill="none" stroke="#00F0FF" strokeWidth="1.5" opacity="0.6" />
          {/* Link 2 */}
          <line x1="120" y1="130" x2="180" y2="100" stroke="#00F0FF" strokeWidth="1.5" opacity="0.6" />
          {/* Joint 3 */}
          <circle cx="180" cy="100" r="5" fill="none" stroke="#00F0FF" strokeWidth="1.5" opacity="0.6" />
          {/* End effector */}
          <motion.g
            animate={{ x: [0, 30, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <line x1="180" y1="100" x2="220" y2="80" stroke="#00F0FF" strokeWidth="1.5" opacity="0.6" />
            <circle cx="220" cy="80" r="4" fill="#00F0FF" opacity="0.8" />
          </motion.g>
        </motion.g>

        {/* Wall/Obstacle */}
        <motion.rect
          x="280"
          y="40"
          width="60"
          height="120"
          fill="none"
          stroke="#FF3E00"
          strokeWidth="2"
          strokeDasharray="8 4"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <text x="310" y="185" textAnchor="middle" fill="#FF3E00" fontSize="10" fontFamily="var(--font-jetbrains-mono)" opacity="0.8">
          COLLISION
        </text>

        {/* Interception indicator */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
          transition={{ duration: 1, delay: 1.5, repeat: Infinity, repeatDelay: 1.5 }}
        >
          <circle cx="240" cy="70" r="25" fill="none" stroke="#FF3E00" strokeWidth="2" />
          <line x1="225" y1="55" x2="255" y2="85" stroke="#FF3E00" strokeWidth="2" />
          <line x1="255" y1="55" x2="225" y2="85" stroke="#FF3E00" strokeWidth="2" />
        </motion.g>

        {/* Firewall barrier */}
        <motion.rect
          x="250"
          y="30"
          width="4"
          height="190"
          fill="#FF3E00"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0.4] }}
          transition={{ duration: 2, delay: 1.5, repeat: Infinity, repeatDelay: 1.5 }}
          className="drop-shadow-[0_0_15px_rgba(255,62,0,0.8)]"
        />

        {/* Safe zone label */}
        <text x="140" y="220" textAnchor="middle" fill="#00F0FF" fontSize="10" fontFamily="var(--font-jetbrains-mono)" opacity="0.6">
          SAFE ZONE
        </text>
      </svg>
    </div>
  );
}

// Brain-Cerebellum Animation - Two waveforms intertwining
function BrainCerebellumAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice">
        {/* Grid background */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* 1Hz Brain Wave - Slow cognitive processing */}
        <motion.path
          d="M 20 80 Q 70 80, 95 50 T 170 80 T 245 50 T 320 80 T 380 80"
          fill="none"
          stroke="#00F0FF"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]"
        />
        <text x="30" y="70" fill="#00F0FF" fontSize="10" fontFamily="var(--font-jetbrains-mono)" opacity="0.8">
          BRAIN 1Hz
        </text>

        {/* 1000Hz Cerebellum Wave - Fast motor control */}
        <motion.path
          d="M 20 160 L 380 160"
          fill="none"
          stroke="#FF3E00"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{
            d: [
              "M 20 160 L 380 160",
              "M 20 160 Q 40 140, 60 160 T 100 160 T 140 160 T 180 160 T 220 160 T 260 160 T 300 160 T 340 160 T 380 160",
              "M 20 160 L 380 160",
            ],
            pathLength: 1,
          }}
          transition={{ duration: 0.05, repeat: Infinity, repeatType: "reverse" }}
          className="drop-shadow-[0_0_8px_rgba(255,62,0,0.5)]"
        />

        {/* High frequency oscillation overlay */}
        {[...Array(8)].map((_, i) => (
          <motion.line
            key={i}
            x1={50 + i * 40}
            y1={155}
            x2={50 + i * 40}
            y2={165}
            stroke="#FF3E00"
            strokeWidth="2"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 1, 0.3], y1: [155, 140, 155], y2: [165, 180, 165] }}
            transition={{ duration: 0.1, delay: i * 0.012, repeat: Infinity }}
          />
        ))}

        <text x="30" y="190" fill="#FF3E00" fontSize="10" fontFamily="var(--font-jetbrains-mono)" opacity="0.8">
          CEREBELLUM 1000Hz
        </text>

        {/* Async indicator */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <rect x="150" y="110" width="100" height="30" rx="4" fill="rgba(5,5,5,0.8)" stroke="rgba(255,255,255,0.2)" />
          <text x="200" y="130" textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="var(--font-jetbrains-mono)">
            ASYNC
          </text>
        </motion.g>

        {/* Intertwining arrows */}
        <motion.path
          d="M 360 80 Q 370 120, 360 160"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.polygon
          points="360,165 355,155 365,155"
          fill="rgba(255,255,255,0.3)"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </svg>
    </div>
  );
}

// Data Flywheel Animation - Failed data being auto-labeled
function DataFlywheelAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="xMidYMid slice">
        {/* Data stream flowing left to right */}
        <defs>
          <linearGradient id="dataGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#00F0FF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Main data flow line */}
        <line x1="20" y1="100" x2="580" y2="100" stroke="url(#dataGradient)" strokeWidth="2" />

        {/* Data packets */}
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.g key={i}>
            <motion.rect
              x={60 + i * 110}
              y="85"
              width="30"
              height="30"
              rx="4"
              fill="none"
              stroke="#00F0FF"
              strokeWidth="1.5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.3 }}
            />
            <motion.text
              x={75 + i * 110}
              y="105"
              textAnchor="middle"
              fill="#00F0FF"
              fontSize="8"
              fontFamily="var(--font-jetbrains-mono)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: i * 0.3 + 0.2 }}
            >
              {i === 2 ? "FAIL" : "DATA"}
            </motion.text>
          </motion.g>
        ))}

        {/* Failed data (packet 3) - turns orange and branches off */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {/* Branch line going down */}
          <motion.path
            d="M 290 115 L 290 150 L 350 150"
            fill="none"
            stroke="#FF3E00"
            strokeWidth="2"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 1.5, repeat: Infinity, repeatDelay: 2 }}
          />

          {/* Fail highlight */}
          <motion.rect
            x="275"
            y="85"
            width="30"
            height="30"
            rx="4"
            fill="rgba(255,62,0,0.2)"
            stroke="#FF3E00"
            strokeWidth="2"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, delay: 1.2, repeat: Infinity, repeatDelay: 2.5 }}
          />
          <text x="290" y="105" textAnchor="middle" fill="#FF3E00" fontSize="8" fontFamily="var(--font-jetbrains-mono)">
            FAIL
          </text>

          {/* Auto-label box */}
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            <rect x="360" y="135" width="80" height="30" rx="4" fill="rgba(5,5,5,0.9)" stroke="#FF3E00" strokeWidth="1.5" />
            <text x="400" y="155" textAnchor="middle" fill="#FF3E00" fontSize="9" fontFamily="var(--font-jetbrains-mono)">
              AUTO-LABEL
            </text>
          </motion.g>
        </motion.g>

        {/* RLDS Database icon */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <ellipse cx="520" cy="150" rx="40" ry="15" fill="none" stroke="#00F0FF" strokeWidth="2" />
          <ellipse cx="520" cy="140" rx="40" ry="15" fill="none" stroke="#00F0FF" strokeWidth="2" />
          <ellipse cx="520" cy="130" rx="40" ry="15" fill="none" stroke="#00F0FF" strokeWidth="2" />
          <path d="M 480 130 L 480 150" stroke="#00F0FF" strokeWidth="2" />
          <path d="M 560 130 L 560 150" stroke="#00F0FF" strokeWidth="2" />
          <text x="520" y="175" textAnchor="middle" fill="#00F0FF" fontSize="10" fontFamily="var(--font-jetbrains-mono)" opacity="0.8">
            RLDS
          </text>
        </motion.g>

        {/* Arrow to RLDS */}
        <motion.path
          d="M 440 150 L 475 150"
          fill="none"
          stroke="#FF3E00"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 2.8, duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
        />

        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#FF3E00" />
          </marker>
        </defs>

        {/* Success path label */}
        <text x="520" y="70" textAnchor="middle" fill="#00F0FF" fontSize="9" fontFamily="var(--font-jetbrains-mono)" opacity="0.6">
          SUCCESS
        </text>
      </svg>
    </div>
  );
}

// Individual Bento Card Component
interface BentoCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  animation: React.ReactNode;
  className?: string;
  gradient?: string;
}

function BentoCard({ title, subtitle, description, icon, animation, className = "", gradient }: BentoCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      className={`relative overflow-hidden rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08]
        hover:border-white/[0.15] transition-all duration-500 group ${className}`}
    >
      {/* Gradient overlay on hover */}
      {gradient && (
        <div
          className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${gradient}`}
        />
      )}

      {/* Animated background */}
      <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500">
        {animation}
      </div>

      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6">
        <div>
          {/* Icon */}
          <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-4">
            {icon}
          </div>

          {/* Subtitle */}
          <p className="text-xs uppercase tracking-wider text-white/40 mb-2 font-mono">{subtitle}</p>

          {/* Title */}
          <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">{title}</h3>

          {/* Description */}
          <p className="text-sm text-white/60 leading-relaxed">{description}</p>
        </div>

        {/* Glow effect on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
}

export function BentoGrid() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-cognitive-cyan text-sm uppercase tracking-widest mb-4 font-mono">Core Innovations</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Four Killers. One Platform.
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            ROSClaw reimagines embodied AI from the ground up with cutting-edge architecture.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[280px]"
        >
          {/* Card 1: MCP Hub - Large (2x2) */}
          <BentoCard
            title="Agent-Agnostic MCP Hub"
            subtitle="Universal Interface"
            description="Seamlessly connect Claude, OpenAI, OpenClaw, or any MCP-compatible agent to your robots. Zero vendor lock-in."
            icon={<Cpu className="w-5 h-5 text-cognitive-cyan" />}
            animation={<MCPHubAnimation />}
            className="md:col-span-2 md:row-span-2"
            gradient="bg-gradient-to-br from-cognitive-cyan/5 via-transparent to-transparent"
          />

          {/* Card 2: Digital Twin - Medium (1x1) */}
          <BentoCard
            title="Digital Twin Firewall"
            subtitle="Safety First"
            description="MuJoCo-powered physics validation stops dangerous commands before they reach hardware."
            icon={<Shield className="w-5 h-5 text-physical-orange" />}
            animation={<DigitalTwinAnimation />}
            gradient="bg-gradient-to-br from-physical-orange/5 via-transparent to-transparent"
          />

          {/* Card 3: Brain-Cerebellum - Medium (1x1) */}
          <BentoCard
            title="Brain-Cerebellum Asynchrony"
            subtitle="Real-time Control"
            description="1Hz cognitive planning meets 1000Hz motor control. No latency compromises."
            icon={<Zap className="w-5 h-5 text-cognitive-cyan" />}
            animation={<BrainCerebellumAnimation />}
            gradient="bg-gradient-to-br from-cognitive-cyan/5 via-transparent to-transparent"
          />

          {/* Card 4: Data Flywheel - Large (2x1) */}
          <BentoCard
            title="Auto-EAP Data Flywheel"
            subtitle="Continuous Learning"
            description="Failed executions auto-label and feed into RL training. Your robot gets smarter with every attempt."
            icon={<Database className="w-5 h-5 text-physical-orange" />}
            animation={<DataFlywheelAnimation />}
            className="md:col-span-2"
            gradient="bg-gradient-to-br from-physical-orange/5 via-transparent to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}
