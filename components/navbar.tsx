"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Github, Menu, X, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./theme-toggle";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase/client";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "ROSClaw Hub", href: "/hub" },
  { name: "Data Flywheel", href: "/flywheel" },
  { name: "Docs", href: "/#docs" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  useEffect(() => {
    const supabase = getSupabaseClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/80 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cognitive-cyan to-physical-orange flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-foreground font-semibold tracking-tight">ROSClaw</span>
            </Link>

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

            <div className="flex items-center gap-2 sm:gap-4">
              <ThemeToggle />
              <a
                href="https://github.com/ros-claw"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 text-text-secondary hover:text-foreground transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>

              {!loading && (
                <>
                  {user ? (
                    <div className="flex items-center gap-2">
                      <Link
                        href="/profile"
                        className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-foreground text-sm hover:bg-white/10 transition-all"
                      >
                        <User className="w-4 h-4" />
                        <span className="max-w-[100px] truncate">
                          {user.user_metadata?.full_name || user.email?.split("@")[0] || "User"}
                        </span>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="p-2 rounded-lg text-text-secondary hover:text-foreground hover:bg-white/5 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="hidden md:inline-flex items-center px-4 py-2 rounded-lg bg-cognitive-cyan/10 border border-cognitive-cyan/30 text-cognitive-cyan text-sm font-medium hover:bg-cognitive-cyan/20 transition-all"
                    >
                      Sign In
                    </Link>
                  )}
                </>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-text-secondary hover:text-foreground"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isMobileMenuOpen ? 1 : 0, y: isMobileMenuOpen ? 0 : -20 }}
        transition={{ duration: 0.2 }}
        className={`fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-b border-white/10 md:hidden ${
          isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div className="px-4 py-6 space-y-4">
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

          {!loading && (
            <>
              {user ? (
                <>
                  <div className="flex items-center gap-2 py-2 border-t border-white/10">
                    <User className="w-5 h-5 text-text-secondary" />
                    <span className="text-foreground">
                      {user.user_metadata?.full_name || user.email?.split("@")[0]}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-text-secondary hover:text-foreground py-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-3 rounded-lg bg-cognitive-cyan/10 border border-cognitive-cyan/30 text-cognitive-cyan font-medium"
                >
                  Sign In
                </Link>
              )}
            </>
          )}
        </div>
      </motion.div>
    </>
  );
}
