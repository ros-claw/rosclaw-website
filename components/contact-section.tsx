"use client";

import { motion } from "framer-motion";
import { Mail, Github, ArrowRight, FlaskConical, Cog, Cpu, Briefcase } from "lucide-react";
import { EmailLink } from "./email-link";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
  },
};

const contactCards = [
  {
    icon: FlaskConical,
    title: "Research Collaboration",
  },
  {
    icon: Cog,
    title: "Robot Platform Integration",
  },
  {
    icon: Cpu,
    title: "Provider Integration",
  },
  {
    icon: Briefcase,
    title: "Industrial Physical-AI Use Cases",
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-to-br from-cognitive-cyan/5 to-physical-orange/5 border border-white/10 p-8 md:p-16 text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-cognitive-cyan text-sm uppercase tracking-widest mb-4 font-mono"
          >
            Build Physical AI with Us
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6"
          >
            Let&apos;s Build the Runtime for Physical AI
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg max-w-3xl mx-auto mb-10"
          >
            We are looking for researchers, robot builders, embodied agent
            developers, foundation model teams, and industrial partners who care
            about Physical AI infrastructure.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <EmailLink
              email="ai@rosclaw.io"
              className="group px-8 py-3 rounded-lg bg-cognitive-cyan/10 border border-cognitive-cyan/30 text-cognitive-cyan font-medium hover:bg-cognitive-cyan/20 hover:border-cognitive-cyan/50 transition-all duration-300 flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Email ai@rosclaw.io
            </EmailLink>
            <a
              href="https://github.com/ros-claw/rosclaw"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-lg bg-white/5 border border-white/10 text-white/80 font-medium hover:bg-white/10 hover:text-white transition-all duration-300 flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
            <a
              href="/#first-embodiment"
              className="px-8 py-3 rounded-lg bg-white/5 border border-white/10 text-white/80 font-medium hover:bg-white/10 hover:text-white transition-all duration-300 flex items-center gap-2"
            >
              Start First Embodiment
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.4 },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {contactCards.map((card) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  variants={fadeInUp}
                  className="rounded-xl bg-white/[0.03] border border-white/[0.08] p-5 text-left hover:border-white/[0.15] transition-colors"
                >
                  <Icon className="w-5 h-5 text-cognitive-cyan mb-3" />
                  <p className="text-white/80 text-sm font-medium">{card.title}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
