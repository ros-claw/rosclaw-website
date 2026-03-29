"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "./theme-provider";
import { useState, useRef, useEffect } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent hydration mismatch - render placeholder before mount
  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
        <div className="w-5 h-5 bg-white/20 rounded-full" />
      </div>
    );
  }

  const options = [
    { value: "light" as const, icon: Sun, label: "Light" },
    { value: "dark" as const, icon: Moon, label: "Dark" },
    { value: "system" as const, icon: Monitor, label: "System" },
  ];

  const CurrentIcon = resolvedTheme === "dark" ? Moon : Sun;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
        aria-label="Toggle theme"
      >
        <motion.div
          key={resolvedTheme}
          initial={{ scale: 0.8, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0.8, rotate: 90 }}
          transition={{ duration: 0.2 }}
        >
          <CurrentIcon className="w-5 h-5" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-36 rounded-lg bg-black/90 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden z-50"
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setTheme(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  theme === option.value
                    ? "bg-cognitive-cyan/10 text-cognitive-cyan"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <option.icon className="w-4 h-4" />
                <span>{option.label}</span>
                {theme === option.value && (
                  <motion.div
                    layoutId="activeTheme"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-cognitive-cyan"
                  />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
