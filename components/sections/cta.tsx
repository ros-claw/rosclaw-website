'use client';

import { motion } from 'framer-motion';
import { Github, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function CTASection() {
  const t = useTranslations('cta');

  return (
    <section className="py-20 px-4" suppressHydrationWarning>
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-4"
          suppressHydrationWarning
        >
          {t('title')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-[#A1A1AA] mb-8"
          suppressHydrationWarning
        >
          {t('description')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
          suppressHydrationWarning
        >
          <a
            href="https://github.com/ros-claw/rosclaw"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-[#165DFF] text-white font-semibold rounded-xl hover:bg-[#1456E6] transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(22,93,255,0.4)]"
            suppressHydrationWarning
          >
            <Github className="w-5 h-5" />
            {t('github')}
          </a>
          <a
            href="https://discord.gg/E6nPCDu6KJ"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-[#5865F2] text-white font-semibold rounded-xl hover:bg-[#4752C4] transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(88,101,242,0.4)]"
            suppressHydrationWarning
          >
            <MessageCircle className="w-5 h-5" />
            {t('discord')}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
