"use client";

import { motion } from "framer-motion";
import { Microscope, Bot, Factory, CheckCircle2, Construction, FlaskConical } from "lucide-react";
import { builtForContent, currentStatusContent } from "@/content/home";
import { fadeInUp, staggerContainer, statusBadgeClasses } from "@/content/shared";

const icons = {
  "Robotics Researchers": Microscope,
  "Robot Developers": Bot,
  "Industrial Physical-AI Teams": Factory,
};

const statusIcons = {
  Stable: CheckCircle2,
  Experimental: Construction,
  Research: FlaskConical,
};

export function BuiltForSection() {
  return (
    <section id="built-for" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Built For */}
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
            {builtForContent.eyebrow}
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6"
          >
            {builtForContent.title}
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-white/60 text-lg max-w-3xl mx-auto mb-12"
          >
            {builtForContent.description}
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24"
        >
          {builtForContent.cards.map((card) => {
            const Icon = icons[card.title as keyof typeof icons] || Bot;
            return (
              <motion.div
                key={card.title}
                variants={fadeInUp}
                className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-8 hover:border-white/[0.15] hover:bg-white/[0.05] transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-cognitive-cyan/10 border border-cognitive-cyan/30 flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-cognitive-cyan" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{card.title}</h3>
                <p className="text-white/60 leading-relaxed">{card.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Current Status */}
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
            {currentStatusContent.eyebrow}
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6"
          >
            {currentStatusContent.title}
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-white/60 text-lg max-w-3xl mx-auto"
          >
            {currentStatusContent.description}
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {currentStatusContent.columns.map((column) => {
            const Icon = statusIcons[column.status];
            const badgeClass = statusBadgeClasses[column.status];
            return (
              <motion.div
                key={column.title}
                variants={fadeInUp}
                className={`rounded-2xl border ${badgeClass.replace(/text-\w+-400/, "").replace(/text-\w+-\d+\/\d+/, "")} p-6 md:p-8 bg-opacity-10`}
                style={{
                  backgroundColor: column.status === "Stable"
                    ? "rgba(34, 197, 94, 0.05)"
                    : column.status === "Experimental"
                    ? "rgba(234, 179, 8, 0.05)"
                    : "rgba(168, 85, 247, 0.05)",
                  borderColor: column.status === "Stable"
                    ? "rgba(34, 197, 94, 0.2)"
                    : column.status === "Experimental"
                    ? "rgba(234, 179, 8, 0.2)"
                    : "rgba(168, 85, 247, 0.2)",
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Icon className={`w-6 h-6 ${column.status === "Stable" ? "text-green-400" : column.status === "Experimental" ? "text-yellow-400" : "text-purple-400"}`} />
                  <h3 className="text-xl font-semibold text-white">{column.title}</h3>
                </div>
                <ul className="space-y-3">
                  {column.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-white/70">
                      <span className={`w-1.5 h-1.5 rounded-full mt-2 ${column.status === "Stable" ? "bg-green-400" : column.status === "Experimental" ? "bg-yellow-400" : "bg-purple-400"}`} />
                      <span className="text-sm md:text-base leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
