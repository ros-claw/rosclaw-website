'use client';

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
  return (
    <main className="relative min-h-screen bg-[#050505] text-white overflow-x-hidden">
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
                Standardizing the Future of Robotics
              </motion.div>

              {/* Prevent hydration mismatch from browser extensions */}
              <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.classList.remove("keychainify-checked")' }} />
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              >
                Software-Defined
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#FF3E00]">
                  Embodied AI.
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-[#A1A1AA] mb-8 max-w-2xl mx-auto lg:mx-0"
              >
                The AUTOSAR + Android for the robotics industry. ROSClaw unifies hardware morphologies, 
                algorithms, and data formats into a single, scalable Operating System.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <button className="px-8 py-4 bg-gradient-to-r from-[#00F0FF] to-[#00C8D5] text-black font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all">
                  Start Building
                </button>
                <button className="px-8 py-4 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/5 transition-all">
                  Read the Manifesto
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
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Brain-Cerebellum Architecture
          </h2>
          <p className="text-[#A1A1AA] text-center mb-12">
            Dynamic routing between 1Hz LLM reasoning and 100Hz+ VLA control
          </p>
          <ArchitectureGraph />
        </div>
      </section>
      
      {/* Data Flywheel */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            The Built-in Data Flywheel
          </h2>
          <p className="text-[#A1A1AA] text-center mb-12">
            Self-evolving intelligence at the OS level
          </p>
          <DataFlywheel />
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
