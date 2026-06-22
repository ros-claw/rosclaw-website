"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Github, Menu, X, Mail } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import Link from "next/link";
import { EmailLink } from "./email-link";

const navLinks = [
  { name: "Runtime", href: "/runtime" },
  { name: "First Embodiment", href: "/#first-embodiment" },
  { name: "Hub", href: "/hub" },
  { name: "Flywheel", href: "/flywheel" },
  { name: "Docs", href: "/docs" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-white p-0.5 flex items-center justify-center overflow-hidden">
                <img
                  src="/rosclaw_logo.png"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-foreground font-semibold tracking-tight text-lg">ROSClaw</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-text-secondary hover:text-foreground transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <a
                href="https://github.com/ros-claw/rosclaw"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center justify-center w-9 h-9 rounded-lg text-text-secondary hover:text-foreground hover:bg-white/5 transition-all"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <EmailLink
                email="ai@rosclaw.io"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-secondary text-sm hover:text-foreground hover:bg-white/10 transition-all"
              >
                <Mail className="w-4 h-4" />
                Contact
              </EmailLink>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-text-secondary hover:text-foreground"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          y: isMobileMenuOpen ? 0 : -20,
        }}
        transition={{ duration: 0.2 }}
        className={`fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-b border-white/10 md:hidden ${
          isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div className="px-4 py-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-lg text-text-secondary hover:text-foreground py-2"
            >
              {link.name}
            </Link>
          ))}
          <EmailLink
            email="ai@rosclaw.io"
            className="flex items-center gap-2 py-3 text-lg text-cognitive-cyan"
          >
            <Mail className="w-5 h-5" />
            Contact
          </EmailLink>
        </div>
      </motion.div>
    </>
  );
}
