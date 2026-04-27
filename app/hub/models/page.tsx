"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Brain, ArrowLeft, Cpu, Gauge, Eye, Activity } from "lucide-react";

const models = [
  {
    name: "π0",
    fullName: "Physical Intelligence Zero",
    architecture: "VLA (Vision-Language-Action)",
    description: "A general-purpose robotic foundation model trained on diverse physical tasks.",
    vram: "24GB",
    latency: "~120ms on RTX 4090",
    observations: ["RGB", "Depth", "Proprioception"],
    tags: ["Diffusion Policy", "Transformer"],
  },
  {
    name: "RT-2",
    fullName: "Robotic Transformer 2",
    architecture: "VLA (Vision-Language-Action)",
    description: "Google DeepMind's vision-language-action model for general robotic control.",
    vram: "16GB",
    latency: "~85ms on RTX 4090",
    observations: ["RGB", "Language Instructions"],
    tags: ["PaLM-E", "End-to-End"],
  },
  {
    name: "ACT",
    fullName: "Action Chunking with Transformers",
    architecture: "Imitation Learning",
    description: "Efficient imitation learning with action chunking for smooth robot motions.",
    vram: "8GB",
    latency: "~45ms on RTX 4090",
    observations: ["RGB", "Joint States"],
    tags: ["Behavior Cloning", "Efficient"],
  },
  {
    name: "Diffusion Policy",
    fullName: "Diffusion Policy for Visuomotor Learning",
    architecture: "Diffusion Model",
    description: "State-of-the-art visuomotor policy using diffusion models for multi-modal action distributions.",
    vram: "12GB",
    latency: "~95ms on RTX 4090",
    observations: ["RGB", "Depth", "Force"],
    tags: ["Diffusion", "Multi-modal"],
  },
];

function ModelCard({ model }: { model: typeof models[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 hover:border-white/20 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground group-hover:text-cognitive-cyan transition-colors">
            {model.name}
          </h3>
          <p className="text-text-secondary text-sm">{model.fullName}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-cognitive-cyan/10 border border-cognitive-cyan/20 flex items-center justify-center">
          <Brain className="w-5 h-5 text-cognitive-cyan" />
        </div>
      </div>

      <p className="text-text-secondary text-sm mb-4">{model.description}</p>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Gauge className="w-4 h-4 text-text-muted" />
          <span className="text-text-secondary">Min VRAM: </span>
          <span className="text-physical-orange font-medium">{model.vram}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Activity className="w-4 h-4 text-text-muted" />
          <span className="text-text-secondary">Latency: </span>
          <span className="text-cognitive-cyan font-medium">{model.latency}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Eye className="w-4 h-4 text-text-muted" />
          <span className="text-text-secondary">Observations: </span>
          <span className="text-foreground">{model.observations.join(", ")}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {model.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 rounded-full bg-cognitive-cyan/10 text-cognitive-cyan text-xs"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="pt-4 border-t border-white/5">
        <code className="text-sm text-text-muted font-mono">
          $ rosclaw mount model {model.name.toLowerCase()}
        </code>
      </div>
    </motion.div>
  );
}

export default function ModelsPage() {
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
            <div className="w-14 h-14 rounded-xl bg-cognitive-cyan/10 border border-cognitive-cyan/20 flex items-center justify-center">
              <Brain className="w-7 h-7 text-cognitive-cyan" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Foundation Models
              </h1>
              <p className="text-cognitive-cyan">The Cognitive Brain.</p>
            </div>
          </div>

          <p className="text-text-secondary max-w-2xl">
            Mount the world&apos;s most powerful Vision-Language-Action (VLA) models.
            Plug-and-play intelligence optimized for robotic inference.
          </p>
        </motion.div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {models.map((model) => (
            <ModelCard key={model.name} model={model} />
          ))}
        </div>

        {/* Coming Soon Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-text-muted">
            More models coming soon. Submit yours via{" "}
            <Link href="https://github.com/ros-claw" className="text-cognitive-cyan hover:underline">
              GitHub
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
