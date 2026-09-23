"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { ArrowDownRight, ChevronDown, Github, Menu, X } from "lucide-react";
import { GITHUB_URL } from "@/content/shared";

const navLinks = [
  { name: "Robots", href: "/robots" },
  { name: "Hub", href: "/hub" },
  { name: "Docs", href: "/docs" },
  { name: "Status", href: "/status" },
] as const;

const productLinks = [
  { name: "Runtime", href: "/runtime", detail: "Cognitive and physical lanes" },
  { name: "Safety", href: "/safety", detail: "Authority, policy, approvals" },
  { name: "Integrations", href: "/integrations", detail: "Models, agents, robots" },
  { name: "Native Agent", href: "/native-agent", detail: "Optional TUI agent client + workers" },
  { name: "Apps", href: "/apps", detail: "Operator-facing workflows" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const isChinese = pathname === "/zh" || pathname.startsWith("/zh/");
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
            <span className="text-base font-semibold text-white">ROSClaw</span>
          </Link>

          <div className="hidden items-center gap-5 lg:flex">
            <div className="group relative">
              <Link
                href="/runtime"
                className={`focus-ring inline-flex items-center gap-1 py-2 text-sm transition-colors ${["/native-agent", "/runtime", "/safety", "/integrations", "/apps"].some((href) => isActive(href)) ? "text-white" : "text-white/[0.52] hover:text-white"}`}
              >
                {isChinese ? "产品" : "Product"} <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
              </Link>
              <div className="invisible absolute left-1/2 top-full w-[620px] -translate-x-1/2 translate-y-2 border border-white/10 bg-[#060809]/[0.98] p-3 opacity-0 shadow-2xl backdrop-blur-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="grid grid-cols-2 gap-px bg-white/10">
                  {productLinks.map((link, index) => (
                    <Link key={link.name} href={link.href} className={`focus-ring group/item bg-[#090c0d] px-5 py-4 transition-colors hover:bg-[#0c1214] ${index === 0 ? "col-span-2" : ""}`}>
                      <span className="flex items-center justify-between text-sm font-medium text-white/78 group-hover/item:text-cognitive-cyan"><span>{link.name}</span><span aria-hidden="true">→</span></span>
                      <span className="mt-1 block text-xs text-white/34">{link.detail}</span>
                    </Link>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-white/30"><span>Native Agent: Main Experimental</span><Link href="/start?path=native-agent" className="text-cognitive-cyan hover:text-white">Start frontier →</Link></div>
              </div>
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`focus-ring relative py-2 text-sm transition-colors ${isActive(link.href) ? "text-white" : "text-white/[0.52] hover:text-white"}`}
              >
                {isChinese ? ({ Robots: "机器人", Hub: "资源中心", Docs: "文档", Status: "状态" } as Record<string, string>)[link.name] : link.name}
                {isActive(link.href) && <span className="absolute inset-x-0 -bottom-[15px] h-px bg-cognitive-cyan" />}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1 font-mono text-[10px] sm:flex" aria-label="Language">
              <Link href="/" hrefLang="en" aria-current={!isChinese ? "page" : undefined} className={`focus-ring px-1.5 py-2 ${isChinese ? "text-white/40" : "text-cognitive-cyan"}`}>EN</Link>
              <span className="text-white/20">/</span>
              <Link href="/zh" hrefLang="zh-CN" aria-current={isChinese ? "page" : undefined} className={`focus-ring px-1.5 py-2 ${isChinese ? "text-cognitive-cyan" : "text-white/40"}`}>中文</Link>
            </div>
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
              href="/start?path=simulation"
              className="focus-ring hidden min-h-9 items-center gap-1.5 bg-cognitive-cyan px-4 text-xs font-semibold text-[#021012] transition-colors hover:bg-[#6af7ff] sm:flex"
            >
              Start <ArrowDownRight className="h-3.5 w-3.5" />
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
            <div className="border-y border-white/[0.08]">
              <p className="px-1 pb-2 pt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-white/30">Product</p>
              <div className="grid grid-cols-2 gap-px bg-white/[0.08]">
                {productLinks.map((link) => (
                  <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="focus-ring bg-[#060809] p-3 text-sm text-white/65 hover:text-white">
                    {link.name}<span className="mt-1 block text-[10px] leading-snug text-white/25">{link.detail}</span>
                  </Link>
                ))}
              </div>
              <div className="mt-3 divide-y divide-white/[0.08] border-t border-white/[0.08]">
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
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="focus-ring flex min-h-11 items-center justify-center gap-2 border border-white/[0.12] text-sm text-white/65">
                <Github className="h-4 w-4" /> GitHub
              </a>
              <Link href="/start?path=simulation" onClick={() => setIsMobileMenuOpen(false)} className="focus-ring flex min-h-11 items-center justify-center gap-2 bg-cognitive-cyan text-sm font-semibold text-[#021012]">
                Start <ArrowDownRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-4 flex items-center gap-3 font-mono text-xs"><Link href="/" hrefLang="en" className={!isChinese ? "text-cognitive-cyan" : "text-white/45"}>EN</Link><span className="text-white/25">/</span><Link href="/zh" hrefLang="zh-CN" className={isChinese ? "text-cognitive-cyan" : "text-white/45"}>中文</Link></div>
          </div>
        </div>
      )}
    </header>
  );
}
