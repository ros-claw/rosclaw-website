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
      {/* Radial Gradient Background - Deep Tech */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse at top, rgba(22, 93, 255, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at bottom, rgba(0, 212, 255, 0.05) 0%, transparent 50%),
            linear-gradient(to bottom, #0a0a0f 0%, #050505 50%, #050505 100%)
          `,
        }}
      />
      
      {/* Fine Grid Texture - Tech Feel */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Dot Matrix Grid - Subtle Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0, 240, 255, 0.08) 1px, transparent 0)`,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Mouse-Tracking Glow - Enhanced */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          className="absolute w-[700px] h-[700px] rounded-full opacity-[0.06]"
          style={{
            background: 'radial-gradient(circle, rgba(0, 240, 255, 0.3) 0%, transparent 70%)',
            left: mouseX,
            top: mouseY,
            x: '-50%',
            y: '-50%',
          }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{
            background: 'radial-gradient(circle, rgba(0, 212, 255, 0.25) 0%, transparent 70%)',
            left: mouseX,
            top: mouseY,
            x: '-30%',
            y: '-30%',
          }}
        />
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full opacity-[0.03]"
          style={{
            background: 'radial-gradient(circle, rgba(255, 125, 0, 0.2) 0%, transparent 70%)',
            left: mouseX,
            top: mouseY,
            x: '-20%',
            y: '-20%',
          }}
        />
      </div>

      {/* Dynamic Gradient Overlay - Mouse Responsive */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(
              circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(0, 240, 255, 0.05) 0%, 
              transparent 60%
            ),
            radial-gradient(
              circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, 
              rgba(22, 93, 255, 0.04) 0%, 
              transparent 60%
            )
          `,
        }}
      />
    </>
  );
}
