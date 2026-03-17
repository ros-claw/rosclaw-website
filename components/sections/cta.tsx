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
            className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
            suppressHydrationWarning
          >
            <Github className="w-5 h-5" />
            {t('github')}
          </a>
          <a
            href="https://discord.gg/E6nPCDu6KJ"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/5 transition-all flex items-center justify-center gap-2"
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
