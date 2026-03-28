"use client";

import { motion } from "framer-motion";

const logos = [
  { name: "Claude", color: "#D4A574" },
  { name: "OpenAI", color: "#10A37F" },
  { name: "OpenClaw", color: "#FF6B6B" },
  { name: "ROS 2", color: "#FF3E00" },
  { name: "MuJoCo", color: "#00D4AA" },
  { name: "LeRobot", color: "#FF9F43" },
  { name: "HuggingFace", color: "#FFD21E" },
];

export function LogoTicker() {
  return (
    <section className="py-12 border-y border-white/5 bg-black/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <p className="text-center text-xs uppercase tracking-widest text-white/40">
          Compatible with
        </p>
      </div>

      <div className="relative overflow-hidden">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        {/* Ticker */}
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex gap-16 items-center"
        >
          {/* Double the logos for seamless loop */}
          {[...logos, ...logos].map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="flex items-center gap-3 shrink-0"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                style={{ backgroundColor: `${logo.color}20`, color: logo.color }}
              >
                {logo.name[0]}
              </div>
              <span className="text-white/60 font-medium whitespace-nowrap">
                {logo.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
