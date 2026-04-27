"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Box, ArrowLeft, Shield, Cpu, Play, Pause } from "lucide-react";
import { useState } from "react";

const safetyPolicies = [
  { name: "Max_TCP_Velocity", value: "1.0 m/s", enabled: true },
  { name: "Self_Collision", value: "Disabled", enabled: false },
  { name: "ZMP_Stability_Check", value: "Enabled", enabled: true },
  { name: "Joint_Limit_Enforcement", value: "Enabled", enabled: true },
  { name: "Force_Torque_Monitoring", value: "Active", enabled: true },
];

export default function TwinsPage() {
  const [isSimulating, setIsSimulating] = useState(false);

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link
            href="/hub"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Hub
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <Box className="w-7 h-7 text-green-500" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Digital Twins
              </h1>
              <p className="text-green-500">The Subconscious Sandbox.</p>
            </div>
          </div>

          <p className="text-text-secondary max-w-2xl">
            Predict the future. Intercept AI hallucinations before they break
            physical hardware with 100x-speed MuJoCo kinematic simulations.
          </p>
        </motion.div>

        {/* 3D Viewer Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative aspect-video bg-gradient-to-br from-green-500/10 via-cognitive-cyan/5 to-transparent rounded-2xl border border-white/10 overflow-hidden">
            {/* Grid Background */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
              }}
            />

            {/* Robot Representation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Simple Robot Arm Visualization */}
                <svg
                  width="300"
                  height="300"
                  viewBox="0 0 300 300"
                  className="opacity-50"
                >
                  {/* Base */}
                  <circle
                    cx="150"
                    cy="250"
                    r="30"
                    fill="none"
                    stroke="#00F0FF"
                    strokeWidth="2"
                  />
                  {/* Arm Segments */}
                  <line
                    x1="150"
                    y1="250"
                    x2="150"
                    y2="150"
                    stroke="#00F0FF"
                    strokeWidth="3"
                  />
                  <line
                    x1="150"
                    y1="150"
                    x2="220"
                    y2="100"
                    stroke="#00F0FF"
                    strokeWidth="3"
                  />
                  <line
                    x1="220"
                    y1="100"
                    x2="280"
                    y2="140"
                    stroke="#00F0FF"
                    strokeWidth="3"
                  />
                  {/* Joints */}
                  <circle cx="150" cy="150" r="8" fill="#FF3E00" />
                  <circle cx="220" cy="100" r="8" fill="#FF3E00" />
                  <circle cx="280" cy="140" r="6" fill="#00F0FF" />
                </svg>

                {/* Status Indicator */}
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isSimulating ? "bg-green-500 animate-pulse" : "bg-text-muted"
                    }`}
                  />
                  <span className="text-sm text-text-secondary font-mono">
                    {isSimulating ? "SIMULATION RUNNING" : "STANDBY"}
                  </span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsSimulating(!isSimulating)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
                >
                  {isSimulating ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span className="text-sm">Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span className="text-sm">Simulate</span>
                    </>
                  )}
                </button>
              </div>
              <div className="text-xs text-text-muted font-mono">
                MuJoCo WebGL Renderer
              </div>
            </div>
          </div>
        </motion.div>

        {/* Safety Policies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold text-foreground">
                e-URDF Safety Policies
              </h3>
            </div>

            <div className="space-y-3">
              {safetyPolicies.map((policy) => (
                <div
                  key={policy.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5"
                >
                  <code className="text-sm text-text-secondary">
                    {policy.name}
                  </code>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm ${
                        policy.enabled ? "text-green-500" : "text-text-muted"
                      }`}
                    >
                      {policy.value}
                    </span>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        policy.enabled ? "bg-green-500" : "bg-text-muted"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Cpu className="w-5 h-5 text-cognitive-cyan" />
              <h3 className="text-lg font-semibold text-foreground">
                Simulation Stats
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-text-secondary">Physics Steps</span>
                  <span className="text-cognitive-cyan font-mono">1000 Hz</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-cognitive-cyan rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-text-secondary">Collision Checks</span>
                  <span className="text-physical-orange font-mono">Active</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-physical-orange rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-text-secondary">Real-time Factor</span>
                  <span className="text-green-500 font-mono">100x</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-green-500 rounded-full" />
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <code className="text-sm text-text-muted font-mono block">
                  $ rosclaw twin launch ur5e_workcell.xml
                </code>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
