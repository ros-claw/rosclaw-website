"use client";

import { motion } from "framer-motion";
import { Download, Star, User, ArrowRight, Sparkles, Brain, Workflow, Coffee, Music, Wrench } from "lucide-react";
import Link from "next/link";

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

// Skill Definition Card
interface SkillComponentProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

function SkillComponent({ icon, title, description, color }: SkillComponentProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className="relative p-6 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] transition-all duration-300"
    >
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
        style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
      >
        {icon}
      </div>
      <h4 className="text-white font-semibold mb-2">{title}</h4>
      <p className="text-white/60 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

// Skill Card Component
interface SkillCardProps {
  title: string;
  author: string;
  description: string;
  downloads: string;
  rating: number;
  compatible: string[];
  icon: React.ReactNode;
  color: string;
  featured?: boolean;
}

function SkillCard({
  title,
  author,
  description,
  downloads,
  rating,
  compatible,
  icon,
  color,
  featured,
}: SkillCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className={`group relative rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${
        featured
          ? "bg-gradient-to-br from-cognitive-cyan/10 to-physical-orange/5 border border-cognitive-cyan/30"
          : "bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15]"
      }`}
    >
      {/* Featured badge */}
      {featured && (
        <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full bg-cognitive-cyan/20 border border-cognitive-cyan/40">
          <Sparkles className="w-3 h-3 text-cognitive-cyan" />
          <span className="text-[10px] text-cognitive-cyan font-medium">Featured</span>
        </div>
      )}

      <div className="p-6">
        {/* Icon & Title */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
          >
            {icon}
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-cognitive-cyan transition-colors">
              {title}
            </h3>
            <div className="flex items-center gap-2 text-white/40 text-xs">
              <User className="w-3 h-3" />
              <span>{author}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-2">{description}</p>

        {/* Compatible hardware */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {compatible.map((hw) => (
            <span key={hw} className="px-2 py-0.5 rounded-full bg-white/5 text-white/50 text-[10px]">
              {hw}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-white/50 text-xs">
              <Download className="w-3.5 h-3.5" />
              <span>{downloads}</span>
            </div>
            <div className="flex items-center gap-1 text-white/50 text-xs">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <span>{rating}</span>
            </div>
          </div>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-white/70 text-xs hover:bg-cognitive-cyan/20 hover:text-cognitive-cyan transition-all">
            <span>Install</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function SkillMarketSection() {
  const skillComponents = [
    {
      icon: <Brain className="w-6 h-6" style={{ color: "#00F0FF" }} />,
      title: "Prompt & Chain-of-Thought",
      description: "Large model reasoning instructions and task decomposition logic for embodied intelligence.",
      color: "#00F0FF",
    },
    {
      icon: <Sparkles className="w-6 h-6" style={{ color: "#FF3E00" }} />,
      title: "LoRA Weights",
      description: "Fine-tuned VLA model weights for specific manipulation skills and domain adaptation.",
      color: "#FF3E00",
    },
    {
      icon: <Workflow className="w-6 h-6" style={{ color: "#00F0FF" }} />,
      title: "Auto-EAP Logic",
      description: "Exception handling behavior trees and fault recovery strategies for robust execution.",
      color: "#00F0FF",
    },
  ];

  const featuredSkills = [
    {
      title: "Zero-Shot Pour Coffee",
      author: "MIT Robotics Lab",
      description: "Pour from any container to any cup without calibration. Includes spill detection and recovery.",
      downloads: "12.4k",
      rating: 4.9,
      compatible: ["Dual-Arm", "Franka", "UR5"],
      icon: <Coffee className="w-7 h-7" style={{ color: "#D4A574" }} />,
      color: "#D4A574",
      featured: true,
    },
    {
      title: "UR5e Precision Screwing",
      author: "ROSClaw Official",
      description: "High-precision flexible screwing with force feedback and cross-thread detection.",
      downloads: "45.2k",
      rating: 4.8,
      compatible: ["UR5", "UR10", "UR3"],
      icon: <Wrench className="w-7 h-7" style={{ color: "#00F0FF" }} />,
      color: "#00F0FF",
      featured: false,
    },
    {
      title: "10-Gimbal Cyberpunk Choreo",
      author: "DanceBots Studio",
      description: "Multi-robot synchronized dance with audio analysis and beat-matched movement generation.",
      downloads: "8.7k",
      rating: 5.0,
      compatible: ["DJI RS3", "DJI RS4", "Ronin"],
      icon: <Music className="w-7 h-7" style={{ color: "#FF3E00" }} />,
      color: "#FF3E00",
      featured: false,
    },
  ];

  return (
    <section id="skill-market" className="py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-cognitive-cyan/5 to-background pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-physical-orange/10 border border-physical-orange/30 text-physical-orange text-xs font-mono">
              CLAWHUB
            </span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Teach Once. <span className="text-physical-orange">Share Everywhere.</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
            Don&apos;t train your robot from scratch. Download skills from top labs worldwide and deploy to your workshop
            in minutes.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 rounded-lg bg-cognitive-cyan/10 border border-cognitive-cyan/30 text-cognitive-cyan hover:bg-cognitive-cyan/20 transition-all">
              Browse Skills
            </button>
            <button className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
              Upload Skill
            </button>
          </motion.div>
        </motion.div>

        {/* What is a Skill? */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mb-20"
        >
          <motion.h3 variants={fadeInUp} className="text-xl font-semibold text-white text-center mb-8">
            What Makes a ROSClaw Skill?
          </motion.h3>

          <div className="grid md:grid-cols-3 gap-4">
            {skillComponents.map((component) => (
              <SkillComponent key={component.title} {...component} />
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-16" />

        {/* Featured Skills */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Featured Skills</h3>
              <p className="text-white/60 text-sm">Curated by the ROSClaw team</p>
            </div>
            <button className="flex items-center gap-1 text-cognitive-cyan text-sm hover:underline">
              <span>View all</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredSkills.map((skill) => (
              <SkillCard key={skill.title} {...skill} />
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: "2,847", label: "Published Skills" },
            { value: "156k", label: "Total Downloads" },
            { value: "420", label: "Contributors" },
            { value: "89", label: "Labs & Teams" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-white/40 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
