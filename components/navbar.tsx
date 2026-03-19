'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, MessageCircle, Book } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function Navbar() {
  const t = useTranslations('nav');

  const navLinks = [
    { label: t('docs'), href: '#', icon: Book },
    { label: 'GitHub', href: 'https://github.com/ros-claw/rosclaw', icon: Github },
    { label: 'Discord', href: 'https://discord.gg/E6nPCDu6KJ', icon: MessageCircle },
  ];

  return (
    <nav className="fixed top-0 w-full flex items-center justify-between px-8 py-4 bg-black/50 backdrop-blur-md z-50 border-b border-white/10" suppressHydrationWarning>
      {/* Logo */}
      <a href="#" className="flex items-center gap-2" suppressHydrationWarning>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00F0FF] to-[#FF3E00] flex items-center justify-center">
          <span className="text-black font-bold text-sm">R</span>
        </div>
        <span className="text-white font-bold text-xl">ROSClaw</span>
      </a>

      {/* Desktop Links - Horizontal */}
      <div className="hidden md:flex items-center gap-6 text-sm text-white/70" suppressHydrationWarning>
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="flex items-center gap-2 hover:text-white transition-colors"
            suppressHydrationWarning
          >
            <link.icon className="w-4 h-4" />
            <span>{link.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
