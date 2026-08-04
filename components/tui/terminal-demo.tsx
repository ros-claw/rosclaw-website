"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, CheckCircle2, Eye, ShieldCheck, Users } from "lucide-react";
import eventsJson from "@/content/demos/native-agent-first-mission.json";

type DemoEvent = {
  kind: "mission" | "tool" | "worker" | "approval" | "receipt";
  label: string;
  title: string;
  detail: string;
  state: string;
};

const events = eventsJson as DemoEvent[];
const icons = {
  mission: Bot,
  tool: Eye,
  worker: Users,
  approval: ShieldCheck,
  receipt: CheckCircle2,
};

export function TerminalDemo({ compact = false }: { compact?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(1);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(
      () => setVisible((count) => (count >= events.length ? 1 : count + 1)),
      1800,
    );
    return () => window.clearInterval(timer);
  }, [inView]);

  return (
    <div ref={root} className="overflow-hidden rounded-[6px] border border-white/15 bg-[#030506] shadow-2xl shadow-black/50">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-rose-400/70" />
          <span className="h-2 w-2 rounded-full bg-amber-300/70" />
          <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/35">rosclaw-tui · mission mode</span>
      </div>
      <div className={`space-y-2 p-3 sm:p-4 ${compact ? "min-h-[310px]" : "min-h-[390px]"}`}>
        {events.slice(0, visible).map((event, index) => {
          const Icon = icons[event.kind];
          const physical = event.kind === "approval";
          const complete = event.kind === "receipt";
          return (
            <article
              key={`${event.kind}-${index}`}
              className={`terminal-event-enter rounded-[4px] border p-3 ${
                complete
                  ? "border-emerald-400/25 bg-emerald-400/[0.04]"
                  : physical
                    ? "border-physical-orange/30 bg-physical-orange/[0.045]"
                    : "border-cognitive-cyan/20 bg-cognitive-cyan/[0.035]"
              }`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`mt-0.5 h-4 w-4 flex-none ${complete ? "text-emerald-300" : physical ? "text-physical-orange" : "text-cognitive-cyan"}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/38">{event.label}</span>
                    <span className="font-mono text-[10px] text-white/40">{event.state}</span>
                  </div>
                  <h3 className="mt-1 break-words font-mono text-xs font-medium text-white sm:text-sm">{event.title}</h3>
                  {!compact && <p className="mt-1.5 text-xs leading-relaxed text-white/45">{event.detail}</p>}
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <div className="grid grid-cols-3 border-t border-white/10 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.08em] text-white/35">
        <span>Body LIMO</span>
        <span className="text-center">Kimi K3</span>
        <span className="text-right text-cognitive-cyan">SIMULATION</span>
      </div>
    </div>
  );
}
