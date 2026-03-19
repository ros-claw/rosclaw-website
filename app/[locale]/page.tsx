'use client';

import { useTranslations } from 'next-intl';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AmbientBackground } from '@/components/ambient-background';
import { AuthenticTerminal } from '@/components/sections/authentic-terminal';
import { EmbodimentDemo } from '@/components/sections/embodiment-demo';
import { FeaturesGrid } from '@/components/sections/features';
import { ArchitectureGraph } from '@/components/sections/architecture-graph';
import { DataFlywheel } from '@/components/sections/data-flywheel';
import { InstallationBlock } from '@/components/sections/installation';
import { CTASection } from '@/components/sections/cta';
import { motion } from 'framer-motion';

export default function Home() {
  const t = useTranslations();

  return (
    <main className="relative min-h-screen bg-[#050505] text-white overflow-hidden" suppressHydrationWarning>
      <AmbientBackground />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left: Text */}
            <div className="flex-1 w-full text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#165DFF]/20 to-[#00D4FF]/20 border border-[#165DFF]/40 text-[#00D4FF] text-sm font-medium mb-8 shadow-[0_0_30px_rgba(22,93,255,0.3)]"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4FF] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D4FF] shadow-[0_0_10px_#00D4FF]"></span>
                </span>
                {t('hero.badge')}
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 tracking-tight bg-gradient-to-r from-white via-[#E0E7FF] to-[#A5B4FC] bg-clip-text text-transparent"
                suppressHydrationWarning
              >
                {t('hero.title')}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-[#A1A1AA] mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                suppressHydrationWarning
              >
                {t('hero.subtitle')}
              </motion.p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 rounded-lg bg-[#00F0FF] text-black font-semibold hover:scale-105 transition-transform w-auto"
                >
                  {t('hero.cta_primary')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 rounded-lg border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors w-auto"
                >
                  {t('hero.cta_secondary')}
                </motion.button>
              </div>
            </div>
            
            {/* Right: Terminal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full max-w-3xl mx-auto mt-12"
            >
              <div className="rounded-xl border border-white/10 bg-[#0A0A0A] shadow-2xl overflow-hidden">
                <div className="flex gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <AuthenticTerminal />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Embodiment Demo */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmbodimentDemo />
        </div>
      </section>
      
      {/* Features */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturesGrid />
        </div>
      </section>
      
      {/* Architecture */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" suppressHydrationWarning>
              {t('architecture.title')}
            </h2>
            <p className="text-lg text-[#A1A1AA] max-w-2xl mx-auto" suppressHydrationWarning>
              {t('architecture.subtitle')}
            </p>
          </div>
          <div className="w-full flex justify-center">
            <ArchitectureGraph />
          </div>
        </div>
      </section>
      
      {/* Data Flywheel */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" suppressHydrationWarning>
              {t('flywheel.title')}
            </h2>
            <p className="text-lg text-[#A1A1AA] max-w-2xl mx-auto" suppressHydrationWarning>
              {t('flywheel.subtitle')}
            </p>
          </div>
          <div className="w-full flex justify-center">
            <DataFlywheel />
          </div>
        </div>
      </section>
      
      {/* Installation */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <InstallationBlock />
        </div>
      </section>
      
      {/* CTA */}
      <CTASection />
      
      <Footer />
    </main>
  );
}
