"use client";

import { motion } from "framer-motion";
import { Mail, Github, ArrowRight, FlaskConical, Cog, Cpu, Briefcase } from "lucide-react";
import { EmailLink } from "./email-link";
import { contactContent } from "@/content/home";
import { fadeInUp } from "@/content/shared";

const iconMap: Record<string, React.ElementType> = {
  "Research Collaboration": FlaskConical,
  "Robot Platform Integration": Cog,
  "Provider Integration": Cpu,
  "Industrial Physical-AI Use Cases": Briefcase,
};

export function ContactSection() {
  return (
    <section id="contact" className="py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-to-br from-cognitive-cyan/5 to-physical-orange/5 border border-white/10 p-8 md:p-14 text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-cognitive-cyan text-sm uppercase tracking-widest mb-4 font-mono"
          >
            {contactContent.eyebrow}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6"
          >
            {contactContent.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg max-w-3xl mx-auto mb-10"
          >
            {contactContent.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
          >
            <EmailLink
              email="ai@rosclaw.io"
              className="group px-8 py-3 rounded-lg bg-cognitive-cyan/10 border border-cognitive-cyan/30 text-cognitive-cyan font-medium hover:bg-cognitive-cyan/20 hover:border-cognitive-cyan/50 transition-all duration-300 flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Email ai@rosclaw.io
            </EmailLink>
            <a
              href={contactContent.ctas.github.href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-lg bg-white/5 border border-white/10 text-white/80 font-medium hover:bg-white/10 hover:text-white transition-all duration-300 flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              {contactContent.ctas.github.label}
            </a>
            <a
              href={contactContent.ctas.firstEmbodiment.href}
              className="px-8 py-3 rounded-lg bg-white/5 border border-white/10 text-white/80 font-medium hover:bg-white/10 hover:text-white transition-all duration-300 flex items-center gap-2"
            >
              {contactContent.ctas.firstEmbodiment.label}
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
            {contactContent.cards.map((card) => {
              const Icon = iconMap[card.title] || Briefcase;
              return (
                <motion.div
                  key={card.title}
                  variants={fadeInUp}
                  className="rounded-xl bg-white/[0.03] border border-white/[0.08] p-5 text-left hover:border-white/[0.15] transition-colors"
                >
                  <Icon className="w-5 h-5 text-cognitive-cyan mb-3" />
                  <p className="text-white/80 text-sm font-medium mb-1">{card.title}</p>
                  <p className="text-white/50 text-xs leading-relaxed">{card.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
