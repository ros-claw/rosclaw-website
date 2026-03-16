'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export function AmbientBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  
  const mouseX = useSpring(0, { damping: 30, stiffness: 200 });
  const mouseY = useSpring(0, { damping: 30, stiffness: 200 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Dot Matrix Grid */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Mouse-Tracking Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{
            background: 'radial-gradient(circle, #00F0FF 0%, transparent 70%)',
            left: mouseX,
            top: mouseY,
            x: '-50%',
            y: '-50%',
          }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full opacity-[0.03]"
          style={{
            background: 'radial-gradient(circle, #FF3E00 0%, transparent 70%)',
            left: mouseX,
            top: mouseY,
            x: '-30%',
            y: '-30%',
          }}
        />
      </div>

      {/* Gradient Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(
              circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(0, 240, 255, 0.03) 0%, 
              transparent 50%
            ),
            radial-gradient(
              circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, 
              rgba(255, 62, 0, 0.02) 0%, 
              transparent 50%
            )
          `,
        }}
      />
    </>
  );
}
