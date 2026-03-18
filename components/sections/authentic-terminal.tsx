'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FULL_COMMAND = '$ ros2 run rosclaw core_agent --mode bridge';

const LOG_SEQUENCE = [
  { text: '[INFO] [rosclaw]: ROSClaw OS v0.1.0 initializing...', delay: 0 },
  { text: '[INFO] [rosclaw]: Loading e-URDF semantic mapper...', delay: 50 },
  { text: '[INFO] [rosclaw]: e-URDF loaded. 47 semantic joints mapped.', delay: 100 },
  { text: '[INFO] [rosclaw]: Connecting to LLM (Claude-3.5) via MCP...', delay: 150 },
  { text: '[INFO] [rosclaw]: MCP bridge established. 23 tools discovered.', delay: 200 },
  { text: '[INFO] [rosclaw]: VLA Policy (π0.5) loading...', delay: 250 },
  { text: '[INFO] [rosclaw]: Policy loaded. Ready for inference.', delay: 300 },
  { text: '[INFO] [rosclaw]: Auto-EAP recovery module activated.', delay: 350 },
  { text: '[INFO] [rosclaw]: Data flywheel initialized.', delay: 400 },
  { text: '[INFO] [rosclaw]: Received task: "Pick up the red bottle"', delay: 500 },
  { text: '[INFO] [rosclaw]: Planning trajectory...', delay: 550 },
  { text: '[INFO] [rosclaw]: Executing VLA policy...', delay: 600 },
];

const ERROR_LOGS = [
  { text: '[WARN] [rosclaw]: Grasp failed (slip detected).', delay: 0 },
  { text: '[INFO] [rosclaw]: Analyzing failure mode...', delay: 100 },
  { text: '[INFO] [rosclaw]: Triggering Auto-EAP recovery policy...', delay: 200 },
  { text: '[INFO] [rosclaw]: Executing inverse action: place -> pick', delay: 300 },
  { text: '[SUCCESS] [rosclaw]: Environment reset. Retrying...', delay: 400 },
  { text: '[INFO] [rosclaw]: Executing VLA policy (attempt 2)...', delay: 500 },
  { text: '[SUCCESS] [rosclaw]: Grasp successful!', delay: 600 },
  { text: '[DATA] [rosclaw]: RLDS trajectory saved: ep_001.h5 (4.2MB)', delay: 700 },
  { text: '[INFO] [rosclaw]: Task completed. Awaiting next instruction...', delay: 800 },
];

type Phase = 'typing' | 'executing' | 'pause' | 'error' | 'recovery' | 'complete';

export function AuthenticTerminal() {
  const [command, setCommand] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>('typing');
  const [showCursor, setShowCursor] = useState(true);

  // Phase 1: Type command character by character
  useEffect(() => {
    if (phase !== 'typing') return;
    
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index <= FULL_COMMAND.length) {
        setCommand(FULL_COMMAND.slice(0, index));
        index++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => setPhase('executing'), 500);
      }
    }, 80);

    return () => clearInterval(typeInterval);
  }, [phase]);

  // Phase 2: Execute - logs spew out rapidly
  useEffect(() => {
    if (phase !== 'executing') return;

    const timeouts: NodeJS.Timeout[] = [];
    
    LOG_SEQUENCE.forEach((log, index) => {
      const timeout = setTimeout(() => {
        setLogs(prev => [...prev, log.text]);
        
        if (index === LOG_SEQUENCE.length - 1) {
          const pauseTimeout = setTimeout(() => setPhase('pause'), 1000);
          timeouts.push(pauseTimeout);
        }
      }, log.delay);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [phase]);

  // Phase 3: DRAMATIC PAUSE (2.5 seconds - robot is actually trying to grasp!)
  useEffect(() => {
    if (phase !== 'pause') return;
    
    const pauseTimeout = setTimeout(() => {
      setPhase('error');
    }, 2500);

    return () => clearTimeout(pauseTimeout);
  }, [phase]);

  // Phase 4 & 5: Error and recovery
  useEffect(() => {
    if (phase !== 'error' && phase !== 'recovery') return;

    const logsToShow = phase === 'error' ? ERROR_LOGS.slice(0, 1) : ERROR_LOGS.slice(1);
    const timeouts: NodeJS.Timeout[] = [];

    logsToShow.forEach((log, index) => {
      const timeout = setTimeout(() => {
        setLogs(prev => [...prev, log.text]);
        
        if (phase === 'error' && index === 0) {
          setTimeout(() => setPhase('recovery'), 500);
        }
        
        if (phase === 'recovery' && index === logsToShow.length - 1) {
          setTimeout(() => setPhase('complete'), 1000);
        }
      }, log.delay);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [phase]);

  // Phase 6: Complete - reset after delay
  useEffect(() => {
    if (phase !== 'complete') return;
    
    const resetTimeout = setTimeout(() => {
      setCommand('');
      setLogs([]);
      setPhase('typing');
    }, 4000);

    return () => clearTimeout(resetTimeout);
  }, [phase]);

  // Blinking cursor
  useEffect(() => {
    const blink = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(blink);
  }, []);

  const getLogColor = (text: string) => {
    if (text.includes('[INFO]')) return 'text-[#60A5FA]';
    if (text.includes('[WARN]')) return 'text-[#FBBF24]';
    if (text.includes('[SUCCESS]')) return 'text-[#4ADE80]';
    if (text.includes('[DATA]')) return 'text-[#A78BFA]';
    if (text.startsWith('$')) return 'text-[#00F0FF]';
    return 'text-[#A1A1AA]';
  };

  const getLogGlow = (text: string) => {
    if (text.includes('[INFO]')) return 'shadow-[0_0_10px_rgba(96,165,250,0.3)]';
    if (text.includes('[WARN]')) return 'shadow-[0_0_10px_rgba(251,191,36,0.3)]';
    if (text.includes('[SUCCESS]')) return 'shadow-[0_0_10px_rgba(74,222,128,0.3)]';
    if (text.includes('[DATA]')) return 'shadow-[0_0_10px_rgba(167,139,250,0.3)]';
    if (text.startsWith('$')) return 'shadow-[0_0_10px_rgba(0,240,255,0.3)]';
    return '';
  };

  return (
    <div className="w-full md:w-[600px] backdrop-blur-md bg-black/60 rounded-xl border border-white/10 overflow-hidden font-mono text-sm shadow-[0_0_60px_-15px_rgba(0,240,255,0.2)]">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-white/10 to-transparent border-b border-white/5">
        <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-[0_0_10px_rgba(255,95,86,0.5)]" />
        <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-[0_0_10px_rgba(255,189,46,0.5)]" />
        <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-[0_0_10px_rgba(39,201,63,0.5)]" />
        <span className="ml-4 text-xs text-white/40 font-medium">rosclaw@agibot-g01: ~/ros2_ws</span>
      </div>

      {/* Terminal Body */}
      <div className="p-5 h-[400px] overflow-y-auto bg-black/40 backdrop-blur-sm">
        {/* Command being typed */}
        <div className="flex items-center mb-3 pb-3 border-b border-white/5">
          <span className="text-[#00F0FF] mr-2 font-bold">$</span>
          <span className="text-white font-medium tracking-wide">{command.slice(2)}</span>
          {phase === 'typing' && (
            <span 
              className={`inline-block w-2.5 h-5 bg-[#00F0FF] ml-1 transition-opacity duration-100 ${showCursor ? 'opacity-100' : 'opacity-0'} shadow-[0_0_10px_#00F0FF]`}
            />
          )}
        </div>

        {/* Logs */}
        <AnimatePresence>
          {logs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.08 }}
              className={`mt-2 font-medium ${getLogColor(log)} ${getLogGlow(log)}`}
            >
              {log}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Live cursor during execution */}
        {(phase === 'executing' || phase === 'pause') && logs.length > 0 && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.53, repeat: Infinity }}
            className="inline-block w-2.5 h-5 bg-[#00F0FF] mt-2 shadow-[0_0_10px_#00F0FF]"
          />
        )}

        {/* Phase indicator */}
        {phase === 'pause' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-white/20 text-xs font-mono"
          >
            ⚙️ [Robot executing physical action... VLA inference in progress...]
          </motion.div>
        )}
      </div>

      {/* Status bar */}
      <div className="px-4 py-2.5 bg-gradient-to-r from-white/5 to-transparent border-t border-white/5 flex justify-between text-xs font-mono">
        <span className="text-white/50">
          {phase === 'typing' && '⏳ Waiting for input...'}
          {phase === 'executing' && '🚀 Initializing ROSClaw OS...'}
          {phase === 'pause' && '⚙️ Executing task...'}
          {phase === 'error' && '⚠️ Error detected!'}
          {phase === 'recovery' && '🔄 Auto-recovery in progress...'}
          {phase === 'complete' && '✅ Ready'}
        </span>
        <span className="text-white/40">bash</span>
      </div>
    </div>
  );
}
