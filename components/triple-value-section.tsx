"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";
import { ShieldCheck, Database, GitBranch } from "lucide-react";
import { tripleCardCommands } from "@/content/cli";
import { fadeInUp, staggerContainer, statusBadgeClasses } from "@/content/shared";

const cards = [
  {
    key: "guard" as const,
    icon: ShieldCheck,
    ...tripleCardCommands.guard,
  },
  {
    key: "remember" as const,
    icon: Database,
    ...tripleCardCommands.remember,
  },
  {
    key: "evolve" as const,
    icon: GitBranch,
    ...tripleCardCommands.evolve,
  },
];

function StatusBadge({ status }: { status: keyof typeof statusBadgeClasses }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider ${statusBadgeClasses[status]}`}
    >
      {status}
    </span>
  );
}

function SafetyBadgeCycler() {
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const states = ["ALLOW", "MODIFY", "BLOCK"];
  const colors = [
    "bg-green-500/10 border-green-500/30 text-green-400",
    "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
    "bg-red-500/10 border-red-500/30 text-red-400",
  ];

  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % states.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-white/40 text-xs font-mono">Decision:</span>
      <motion.span
        key={states[index]}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`px-2 py-0.5 rounded-md border text-xs font-mono font-medium ${colors[index]}`}
      >
        {states[index]}
      </motion.span>
    </div>
  );
}

export function TripleValueSection() {
  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <motion.p
            variants={fadeInUp}
            className="text-cognitive-cyan text-sm uppercase tracking-widest mb-4 font-mono"
          >
            Ground • Guard • Evolve
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6"
          >
            One Runtime, Three Values
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.key}
                variants={fadeInUp}
                className="group rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 md:p-8 hover:border-white/[0.15] hover:bg-white/[0.05] transition-all duration-300 flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-cognitive-cyan/10 border border-cognitive-cyan/30 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-cognitive-cyan" />
                </div>

                <h3 className="text-xl font-semibold text-white mb-2">{card.title}</h3>
                <p className="text-white/80 font-medium mb-2">{card.headline}</p>
                <p className="text-white/60 text-sm leading-relaxed mb-5">{card.description}</p>

                <div className="mt-auto space-y-3">
                  {"command" in card && card.command && (
                    <div className="rounded-lg bg-black/40 border border-white/10 p-3 font-mono text-xs text-cognitive-cyan overflow-x-auto">
                      {card.command.command}
                    </div>
                  )}
                  {"commands" in card && card.commands && (
                    <div className="space-y-2">
                      {card.commands.map((cmd) => (
                        <div
                          key={cmd.command}
                          className="rounded-lg bg-black/40 border border-white/10 p-3 font-mono text-xs text-cognitive-cyan overflow-x-auto"
                        >
                          {cmd.command}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    {card.key === "guard" ? (
                      <SafetyBadgeCycler />
                    ) : "command" in card && card.command ? (
                      <StatusBadge status={card.command.status} />
                    ) : "commands" in card && card.commands ? (
                      <StatusBadge status={card.commands[0].status} />
                    ) : null}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
