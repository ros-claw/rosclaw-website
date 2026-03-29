"use client";

import { motion } from "framer-motion";
import { Book, Terminal, Cpu, Shield, Zap, ChevronRight, Copy, Check } from "lucide-react";
import { useState } from "react";

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

// Code block component with copy functionality
function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg bg-black/60 border border-white/10 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <span className="text-xs text-white/40 font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm font-mono text-white/80 whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

// Tutorial card component
interface TutorialCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  duration: string;
  level: string;
}

function TutorialCard({ icon, title, description, duration, level }: TutorialCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className="group p-5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.05] transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-cognitive-cyan/10 border border-cognitive-cyan/30 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold mb-1 group-hover:text-cognitive-cyan transition-colors">
            {title}
          </h3>
          <p className="text-white/60 text-sm mb-3">{description}</p>
          <div className="flex items-center gap-3 text-xs text-white/40">
            <span>{duration}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-cognitive-cyan">{level}</span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/60 transition-colors" />
      </div>
    </motion.div>
  );
}

// Interactive terminal component
function InteractiveTerminal() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string[]>([
    "Welcome to ROSClaw Interactive Terminal",
    "Type 'help' for available commands",
    "",
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newOutput = [...output, `$ ${input}`];

    // Simulate command responses
    switch (input.trim().toLowerCase()) {
      case "help":
        newOutput.push(
          "Available commands:",
          "  install <package>  - Install a robot driver",
          "  list               - List connected robots",
          "  skill <name>       - Load a skill",
          "  status             - Check system status",
          "  clear              - Clear terminal"
        );
        break;
      case "list":
        newOutput.push(
          "Connected robots:",
          "  [1] UR5e (192.168.1.100) - Ready",
          "  [2] Unitree G1 (192.168.1.101) - Standby"
        );
        break;
      case "status":
        newOutput.push(
          "ROSClaw System Status:",
          "  MCP Server: Running",
          "  Digital Twin: Active",
          "  Safety Guard: Enabled",
          "  Data Flywheel: Recording"
        );
        break;
      case "clear":
        newOutput.length = 0;
        break;
      case "install rosclaw-ur5-mcp":
        newOutput.push(
          "Installing rosclaw-ur5-mcp...",
          "  Downloading package...",
          "  Installing dependencies...",
          "  Configuring safety limits...",
          "  ✓ Installation complete!"
        );
        break;
      default:
        if (input.startsWith("install ")) {
          newOutput.push(`Installing ${input.slice(8)}...`, "  ✓ Package not found. Try 'rosclaw-ur5-mcp'");
        } else if (input.startsWith("skill ")) {
          newOutput.push(`Loading skill: ${input.slice(6)}...`, "  ✓ Skill loaded successfully");
        } else {
          newOutput.push(`Command not found: ${input}`, "Type 'help' for available commands");
        }
    }

    newOutput.push("");
    setOutput(newOutput);
    setInput("");
  };

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
      <div className="p-4 h-64 overflow-y-auto font-mono text-sm">
        {output.map((line, i) => (
          <div key={i} className={line.startsWith("$") ? "text-cognitive-cyan" : "text-white/70"}>
            {line}
          </div>
        ))}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
          <span className="text-cognitive-cyan">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-white outline-none font-mono"
            placeholder="Type a command..."
            autoFocus
          />
        </form>
      </div>
    </div>
  );
}

export function DocsSection() {
  const quickStartSteps = [
    {
      title: "Install ROSClaw",
      description: "Install the ROSClaw CLI tool with a single command.",
      code: "curl -sSL https://rosclaw.io/get | bash",
    },
    {
      title: "Connect Your Robot",
      description: "Install the MCP server for your robot hardware.",
      code: "rosclaw install rosclaw-ur5-mcp",
    },
    {
      title: "Start the Hub",
      description: "Launch the MCP Hub to connect AI agents to your robot.",
      code: "rosclaw hub start",
    },
  ];

  const tutorials = [
    {
      icon: <Zap className="w-5 h-5 text-cognitive-cyan" />,
      title: "5-Minute Quick Start",
      description: "Get your first robot moving with Claude Code in under 5 minutes.",
      duration: "5 min",
      level: "Beginner",
    },
    {
      icon: <Shield className="w-5 h-5 text-physical-orange" />,
      title: "Digital Twin Firewall",
      description: "Learn how e-URDF safety boundaries protect your hardware.",
      duration: "15 min",
      level: "Intermediate",
    },
    {
      icon: <Cpu className="w-5 h-5 text-cognitive-cyan" />,
      title: "Fine-tuning VLA Models",
      description: "Train your own visual-language-action model with ROSClaw-RL.",
      duration: "30 min",
      level: "Advanced",
    },
  ];

  return (
    <section id="docs" className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 mb-4">
            <Book className="w-4 h-4 text-cognitive-cyan" />
            <span className="text-cognitive-cyan text-sm uppercase tracking-widest font-mono">
              Documentation
            </span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Developer <span className="text-cognitive-cyan">Documentation</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="text-white/60 text-lg max-w-2xl mx-auto">
            Everything you need to build embodied AI applications with ROSClaw.
          </motion.p>
        </motion.div>

        {/* Quick Start - Two Column Layout */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mb-20"
        >
          <motion.h3 variants={fadeInUp} className="text-2xl font-bold text-white mb-8">
            Quick Start
          </motion.h3>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Steps */}
            <div className="space-y-6">
              {quickStartSteps.map((step, index) => (
                <motion.div key={step.title} variants={fadeInUp} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cognitive-cyan/10 border border-cognitive-cyan/30 flex items-center justify-center text-cognitive-cyan font-mono text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{step.title}</h4>
                    <p className="text-white/60 text-sm mb-3">{step.description}</p>
                    <CodeBlock code={step.code} />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right: Interactive Terminal */}
            <motion.div variants={fadeInUp} className="lg:sticky lg:top-24 h-fit">
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-4 h-4 text-cognitive-cyan" />
                <span className="text-white/60 text-sm">Try it now</span>
              </div>
              <InteractiveTerminal />
              <p className="text-white/40 text-xs mt-3">
                This is an interactive demo. Try typing &apos;help&apos;, &apos;list&apos;, or &apos;status&apos;.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-16" />

        {/* Tutorials */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Tutorials</h3>
              <p className="text-white/60">Step-by-step guides for every skill level</p>
            </div>
            <a
              href="#"
              className="hidden sm:flex items-center gap-1 text-cognitive-cyan hover:underline"
            >
              <span>View all</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tutorials.map((tutorial) => (
              <TutorialCard key={tutorial.title} {...tutorial} />
            ))}
          </div>
        </motion.div>

        {/* API Reference CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-cognitive-cyan/5 to-physical-orange/5 border border-white/10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">API Reference</h3>
              <p className="text-white/60">
                Complete API documentation for ROSClaw SDK, MCP tools, and skill development.
              </p>
            </div>
            <a
              href="#"
              className="px-6 py-3 rounded-lg bg-cognitive-cyan/10 border border-cognitive-cyan/30 text-cognitive-cyan font-medium hover:bg-cognitive-cyan/20 transition-all whitespace-nowrap"
            >
              Browse API Docs
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
