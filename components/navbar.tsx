"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { ArrowDownRight, Github, Menu, X } from "lucide-react";
import { GITHUB_URL } from "@/content/shared";

const navLinks = [
  { name: "Runtime", href: "/runtime" },
  { name: "Robots", href: "/#robots" },
  { name: "Hub", href: "/hub" },
  { name: "Docs", href: "/docs" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const firstLink = mobileMenuRef.current?.querySelector<HTMLElement>("a");
    firstLink?.focus();

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
      }
    };
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileMenuOpen]);

  const handleMenuKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const focusable = Array.from(mobileMenuRef.current?.querySelectorAll<HTMLElement>("a, button") ?? []);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const isActive = (href: string) => !href.includes("#") && (pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200 ${
        isScrolled || isMobileMenuOpen
          ? "border-white/10 bg-[#060809]/90 backdrop-blur-xl"
          : "border-transparent bg-gradient-to-b from-black/55 to-transparent"
      }`}
    >
      <nav aria-label="Primary navigation" className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="focus-ring group flex items-center gap-2.5" aria-label="ROSClaw home">
            <span className="flex h-8 w-8 items-center justify-center overflow-hidden bg-white transition-transform group-hover:-rotate-3">
              <Image src="/rosclaw-mark.webp" alt="" width={32} height={32} className="h-full w-full object-cover" priority />
            </span>
            <span className="text-base font-semibold tracking-[-0.02em] text-white">ROSClaw</span>
            <span className="hidden border-l border-white/15 pl-2 font-mono text-[8px] uppercase tracking-[0.16em] text-white/30 sm:inline">Physical AI OS</span>
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`focus-ring relative py-2 text-sm transition-colors ${isActive(link.href) ? "text-white" : "text-white/[0.52] hover:text-white"}`}
              >
                {link.name}
                {isActive(link.href) && <span className="absolute inset-x-0 -bottom-[15px] h-px bg-cognitive-cyan" />}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring hidden h-9 w-9 items-center justify-center text-white/[0.48] transition-colors hover:bg-white/[0.05] hover:text-white sm:flex"
              aria-label="ROSClaw on GitHub"
            >
              <Github className="h-[18px] w-[18px]" />
            </a>
            <Link
              href="/#first-embodiment"
              className="focus-ring hidden min-h-9 items-center gap-1.5 bg-cognitive-cyan px-4 text-xs font-semibold text-[#021012] transition-colors hover:bg-[#6af7ff] sm:flex"
            >
              Install ROSClaw <ArrowDownRight className="h-3.5 w-3.5" />
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="focus-ring flex h-10 w-10 items-center justify-center text-white/65 hover:bg-white/[0.05] hover:text-white lg:hidden"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          id="mobile-navigation"
          ref={mobileMenuRef}
          onKeyDown={handleMenuKeys}
          className="border-t border-white/10 bg-[#060809] px-4 py-5 lg:hidden"
        >
          <div className="mx-auto max-w-[1440px]">
            <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {navLinks.map((link, index) => (
                <Link
                  key={link.name}
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="focus-ring flex items-center justify-between py-4 text-base text-white/70 hover:text-white"
                >
                  <span><span className="mr-3 font-mono text-[9px] text-cognitive-cyan">0{index + 1}</span>{link.name}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="focus-ring flex min-h-11 items-center justify-center gap-2 border border-white/[0.12] text-sm text-white/65">
                <Github className="h-4 w-4" /> GitHub
              </a>
              <Link href="/#first-embodiment" onClick={() => setIsMobileMenuOpen(false)} className="focus-ring flex min-h-11 items-center justify-center gap-2 bg-cognitive-cyan text-sm font-semibold text-[#021012]">
                Install <ArrowDownRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
