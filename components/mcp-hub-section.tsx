"use client";

import { motion } from "framer-motion";
import { FileCode, ArrowRight, Check, Bot, Grip, Car, Camera } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

// Animation variants
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
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

// SDK to MCP Animation Component
function SdkToMcpAnimation() {
  const [step, setStep] = useState(0);

  // Auto-advance animation
  useState(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  });

  const codeLines = [
    { text: "class UR5Controller:", color: "#FF3E00" },
    { text: "    def __init__(self):", color: "#00F0FF" },
    { text: "        self.joints = 6", color: "var(--text-primary)" },
    { text: "        self.speed = 1.0", color: "var(--text-primary)" },
    { text: "", color: "" },
    { text: "    def move_joint(self, idx, pos):", color: "#00F0FF" },
    { text: "        # Safety check", color: "var(--text-muted)" },
    { text: "        if pos > self.limits[idx]:", color: "#FF3E00" },
    { text: "            return False", color: "#FF3E00" },
    { text: "        # Execute", color: "var(--text-muted)" },
    { text: "        return self._send(pos)", color: "var(--text-primary)" },
  ];

  return (
    <div className="relative bg-black/40 rounded-lg border border-white/10 p-4 font-mono text-xs overflow-hidden">
      {/* File header */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
        <FileCode className="w-4 h-4 text-physical-orange" />
        <span className="text-white/60">Unitree_SDK_Manual.pdf</span>
        <motion.div
          className="ml-auto flex items-center gap-1"
          animate={{ opacity: step >= 1 ? 1 : 0.3 }}
        >
          <div className="w-2 h-2 rounded-full bg-cognitive-cyan animate-pulse" />
          <span className="text-cognitive-cyan text-[10px]">AI PROCESSING</span>
        </motion.div>
      </div>

      {/* Code display */}
      <div className="space-y-1">
        {codeLines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: line.text ? 1 : 0.3, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex"
          >
            <span className="w-6 text-white/20 text-right mr-3">{i + 1}</span>
            <span style={{ color: line.color || "var(--text-secondary)" }}>{line.text || " "}</span>
          </motion.div>
        ))}
      </div>

      {/* Processing overlay */}
      <motion.div
        className="absolute inset-0 bg-cognitive-cyan/5 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: step === 1 ? 1 : 0 }}
      >
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-2 border-cognitive-cyan border-t-transparent rounded-full mx-auto mb-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-cognitive-cyan font-mono text-sm">Generating MCP Server...</p>
        </div>
      </motion.div>

      {/* Success overlay */}
      <motion.div
        className="absolute inset-0 bg-green-500/10 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: step >= 2 ? 1 : 0 }}
      >
        <motion.div
          className="text-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: step >= 2 ? 1 : 0.8 }}
        >
          <div className="w-16 h-16 rounded-full border-2 border-green-500 flex items-center justify-center mx-auto mb-2">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-green-500 font-mono text-sm">rosclaw-unitree-mcp Ready!</p>
          <p className="text-white/60 text-xs mt-1">342 lines generated in 0.8s</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Robot Card Component
interface RobotCardProps {
  name: string;
  description: string;
  category: string;
  installs: string;
  icon: React.ReactNode;
  verified?: boolean;
}

function RobotCard({ name, description, category, installs, icon, verified }: RobotCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-xl p-5
        hover:border-white/[0.15] hover:bg-white/[0.05] transition-all duration-300 cursor-pointer"
    >
      {/* Glow on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cognitive-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            {icon}
          </div>
          {verified && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-cognitive-cyan/10 border border-cognitive-cyan/30">
              <div className="w-2 h-2 rounded-full bg-cognitive-cyan" />
              <span className="text-[10px] text-cognitive-cyan font-medium">Official</span>
            </div>
          )}
        </div>

        {/* Name & Category */}
        <h3 className="text-white font-semibold mb-1 group-hover:text-cognitive-cyan transition-colors">{name}</h3>
        <p className="text-white/40 text-xs uppercase tracking-wider mb-2">{category}</p>

        {/* Description */}
        <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-2">{description}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <span className="text-white/40 text-xs">{installs} installs</span>
          <div className="flex items-center gap-1 text-cognitive-cyan text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Install</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Category Tab Component
interface CategoryTabProps {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

function CategoryTab({ label, icon, active, onClick }: CategoryTabProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
        active
          ? "bg-cognitive-cyan/10 border border-cognitive-cyan/30 text-cognitive-cyan"
          : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export function McpHubSection() {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "All", icon: <Bot className="w-4 h-4" /> },
    { id: "humanoids", label: "Humanoids", icon: <Bot className="w-4 h-4" /> },
    { id: "manipulators", label: "Manipulators", icon: <Grip className="w-4 h-4" /> },
    { id: "mobiles", label: "Mobiles", icon: <Car className="w-4 h-4" /> },
    { id: "sensors", label: "Sensors", icon: <Camera className="w-4 h-4" /> },
  ];

  const robots: RobotCardProps[] = [
    {
      name: "rosclaw-ur5-mcp",
      description: "Universal Robots UR5e collaborative arm with full e-URDF safety boundaries and trajectory planning.",
      category: "Manipulators",
      installs: "45.2k",
      icon: <Grip className="w-6 h-6 text-cognitive-cyan" />,
      verified: true,
    },
    {
      name: "rosclaw-g1-mcp",
      description: "Unitree G1 humanoid robot with 23 DoF, walking gait control, and manipulation primitives.",
      category: "Humanoids",
      installs: "12.8k",
      icon: <Bot className="w-6 h-6 text-physical-orange" />,
      verified: true,
    },
    {
      name: "rosclaw-go2-mcp",
      description: "Unitree Go2 quadruped with terrain adaptation, SLAM navigation, and voice commands.",
      category: "Mobiles",
      installs: "8.4k",
      icon: <Bot className="w-6 h-6 text-cognitive-cyan" />,
      verified: true,
    },
    {
      name: "rosclaw-franka-mcp",
      description: "Franka Emika Panda with Franka Control Interface (FCI) and force/torque feedback.",
      category: "Manipulators",
      installs: "6.2k",
      icon: <Grip className="w-6 h-6 text-physical-orange" />,
      verified: false,
    },
    {
      name: "rosclaw-realsense-mcp",
      description: "Intel RealSense D435/D455 depth cameras with point cloud streaming and object detection.",
      category: "Sensors",
      installs: "15.6k",
      icon: <Camera className="w-6 h-6 text-cognitive-cyan" />,
      verified: true,
    },
    {
      name: "rosclaw-turtlebot-mcp",
      description: "TurtleBot3/4 mobile base with navigation stack and multi-robot coordination support.",
      category: "Mobiles",
      installs: "22.1k",
      icon: <Car className="w-6 h-6 text-physical-orange" />,
      verified: true,
    },
  ];

  const filteredRobots =
    activeCategory === "all"
      ? robots
      : robots.filter((r) => r.category.toLowerCase() === activeCategory);

  return (
    <section id="mcp-hub" className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section - sdk_to_mcp Auto-Compiler */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mb-20"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-cognitive-cyan/10 border border-cognitive-cyan/30 text-cognitive-cyan text-xs font-mono">
                  NEW
                </span>
                <span className="text-white/40 text-sm">sdk_to_mcp Auto-Compiler</span>
              </motion.div>

              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                Can&apos;t Find Your Robot? <br />
                <span className="text-cognitive-cyan">Let AI Write the Driver.</span>
              </motion.h2>

              <motion.p variants={fadeInUp} className="text-white/60 text-lg mb-6 leading-relaxed">
                Upload your SDK manual PDF, and our AI generates a production-ready MCP server in seconds. Zero-code
                hardware integration.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-500" />
                  </div>
                  <span>PDF Parser</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-500" />
                  </div>
                  <span>Auto Code Gen</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-500" />
                  </div>
                  <span>Safety Validation</span>
                </div>
              </motion.div>
            </div>

            {/* Right: Animation */}
            <motion.div variants={fadeInUp}>
              <SdkToMcpAnimation />
            </motion.div>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-16" />

        {/* Hub Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mb-8"
        >
          <motion.h3 variants={fadeInUp} className="text-2xl font-bold text-white mb-2">
            MCP Hub
          </motion.h3>
          <motion.p variants={fadeInUp} className="text-white/60">
            Browse and install ROSClaw-compatible robot drivers. {robots.length} packages available.
          </motion.p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {categories.map((cat) => (
            <CategoryTab
              key={cat.id}
              label={cat.label}
              icon={cat.icon}
              active={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
            />
          ))}
        </motion.div>

        {/* Robot Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredRobots.map((robot) => (
            <RobotCard key={robot.name} {...robot} />
          ))}
        </motion.div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            href="/mcp-hub"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all"
          >
            <span>View All Packages</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
