"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { Terminal, Check, Copy } from "lucide-react";
import { firstEmbodimentSteps } from "@/content/cli";
import { fadeInUp, staggerContainer } from "@/content/shared";

const initialPassport = {
  CLI: "—",
  Workspace: "—",
  Mode: "—",
  Robot: "—",
  Profile: "—",
  Capabilities: "—",
  Safety: "—",
  Decision: "—",
  Trace: "—",
  Dashboard: "—",
  Viewer: "—",
  Status: "pending",
  Memory: "—",
};

function fieldHighlight(value: string) {
  if (value === "—" || value === "pending") return "text-white/30";
  if (value === "ready" || value === "enabled" || value.includes("ALLOW")) return "text-green-400";
  if (value.includes("local-only") || value.includes("envelope") || value.includes("loaded") || value.includes("open")) return "text-cognitive-cyan";
  return "text-white/80";
}

function TerminalOutput({ lines }: { lines: string[] }) {
  return (
    <div className="rounded-xl bg-black/80 border border-white/10 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="ml-2 text-xs text-white/40 font-mono">rosclaw-cli</span>
      </div>
      <div className="p-4 font-mono text-sm min-h-[280px]">
        {lines.map((line, i) => (
          <div
            key={`${line}-${i}`}
            className={`${
              line.startsWith("$")
                ? "text-cognitive-cyan"
                : line.startsWith("✓")
                ? "text-green-400"
                : line.startsWith("Next:") || line.startsWith("  ")
                ? "text-white/50"
                : "text-white/70"
            }`}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

function CodeCopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // silently fail
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors"
      aria-label={copied ? "Copied" : "Copy command"}
    >
      {copied ? (
        <span className="flex items-center gap-1 text-xs text-green-400 font-medium">
          <Check className="w-3.5 h-3.5" />
          Copied
        </span>
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Stable: "bg-green-500/10 border-green-500/30 text-green-400",
    Experimental: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
    Planned: "bg-white/5 border-white/20 text-white/60",
    Research: "bg-purple-500/10 border-purple-500/30 text-purple-400",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider ${colors[status] || colors.Stable}`}
    >
      {status}
    </span>
  );
}

function EmbodimentPassport({
  passport,
}: {
  passport: Record<string, string>;
}) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-cognitive-cyan/5 to-physical-orange/5 border border-white/10 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-cognitive-cyan/10 border border-cognitive-cyan/30 flex items-center justify-center">
          <span className="text-cognitive-cyan font-bold">EP</span>
        </div>
        <div>
          <h4 className="text-white font-semibold">Embodiment Passport</h4>
          <p className="text-white/40 text-xs">First body context</p>
        </div>
      </div>

      <div className="space-y-3 font-mono text-sm">
        {Object.entries(passport).map(([key, value]) => (
          <div
            key={key}
            className="flex justify-between items-center py-2 border-b border-white/5 last:border-0"
          >
            <span className="text-white/40">{key}</span>
            <span className={`text-right max-w-[60%] ${fieldHighlight(value)}`}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DocsSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const currentStep = firstEmbodimentSteps[activeStep];

  const buildPassport = useCallback(() => {
    const patches: Record<string, string> = {};
    for (let i = 0; i <= activeStep; i++) {
      Object.assign(patches, firstEmbodimentSteps[i].passport);
    }
    return { ...initialPassport, ...patches };
  }, [activeStep]);

  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % firstEmbodimentSteps.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [prefersReducedMotion, isPaused]);

  return (
    <section
      id="first-embodiment"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-background"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.p
            variants={fadeInUp}
            className="text-cognitive-cyan text-sm uppercase tracking-widest mb-4 font-mono"
          >
            First Embodiment
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6"
          >
            Give an AI Agent Its First Physical Body Context
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-white/60 text-lg max-w-3xl mx-auto"
          >
            First Embodiment turns a model-facing agent into a body-aware physical
            agent: body profile, safety envelope, sandbox, memory namespace, and
            trace stream.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid lg:grid-cols-12 gap-8"
        >
          {/* Stepper */}
          <motion.div variants={fadeInUp} className="lg:col-span-3 space-y-2">
            {firstEmbodimentSteps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                  activeStep === index
                    ? "bg-cognitive-cyan/10 border-cognitive-cyan/30"
                    : "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm ${
                      activeStep === index
                        ? "bg-cognitive-cyan/20 text-cognitive-cyan"
                        : "bg-white/5 text-white/40"
                    }`}
                  >
                    {index < activeStep ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium ${
                        activeStep === index ? "text-white" : "text-white/60"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </motion.div>

          {/* Terminal */}
          <motion.div variants={fadeInUp} className="lg:col-span-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-white/60">
                <Terminal className="w-4 h-4 text-cognitive-cyan" />
                <span className="text-sm">{currentStep.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={currentStep.command.status} />
                <CodeCopyButton code={currentStep.command.command} />
              </div>
            </div>
            <TerminalOutput lines={currentStep.terminalOutput} />
            <p className="text-white/40 text-sm mt-4">{currentStep.description}</p>
          </motion.div>

          {/* Passport */}
          <motion.div variants={fadeInUp} className="lg:col-span-3">
            <EmbodimentPassport passport={buildPassport()} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
