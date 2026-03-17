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
    <main className="relative min-h-screen bg-[#050505] text-white overflow-x-hidden" suppressHydrationWarning>
      <AmbientBackground />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left: Text */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-sm mb-6"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F0FF]"></span>
                </span>
                {t('hero.badge')}
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                suppressHydrationWarning
              >
                {t('hero.title')}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-[#A1A1AA] mb-8 max-w-2xl mx-auto lg:mx-0"
                suppressHydrationWarning
              >
                {t('hero.subtitle')}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <button className="px-8 py-4 bg-gradient-to-r from-[#00F0FF] to-[#00C8D5] text-black font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all">
                  {t('hero.cta_primary')}
                </button>
                <button className="px-8 py-4 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/5 transition-all">
                  {t('hero.cta_secondary')}
                </button>
              </motion.div>
            </div>
            
            {/* Right: Terminal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex-1 w-full max-w-full"
            >
              <AuthenticTerminal />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Embodiment Demo */}
      <section className="relative z-10 py-20 px-4">
        <EmbodimentDemo />
      </section>
      
      {/* Features */}
      <section className="relative z-10 py-20 px-4">
        <FeaturesGrid />
      </section>
      
      {/* Architecture */}
      <section className="relative z-10 py-20 px-4 w-full">
        <div className="max-w-6xl mx-auto w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" suppressHydrationWarning>
            {t('architecture.title')}
          </h2>
          <p className="text-[#A1A1AA] text-center mb-12" suppressHydrationWarning>
            {t('architecture.subtitle')}
          </p>
          <div className="w-full flex justify-center">
            <ArchitectureGraph />
          </div>
        </div>
      </section>
      
      {/* Data Flywheel */}
      <section className="relative z-10 py-20 px-4 w-full">
        <div className="max-w-6xl mx-auto w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" suppressHydrationWarning>
            {t('flywheel.title')}
          </h2>
          <p className="text-[#A1A1AA] text-center mb-12" suppressHydrationWarning>
            {t('flywheel.subtitle')}
          </p>
          <div className="w-full flex justify-center">
            <DataFlywheel />
          </div>
        </div>
      </section>
      
      {/* Installation */}
      <section className="relative z-10 py-20 px-4">
        <InstallationBlock />
      </section>
      
      {/* CTA */}
      <CTASection />
      
      <Footer />
    </main>
  );
}
