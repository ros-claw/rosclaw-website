import {
  ArrowUpRight,
  CircleDashed,
  Eye,
  Github,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { currentStatusContent } from "@/content/home";
import { CONTACT_EMAIL, GITHUB_URL } from "@/content/shared";

const presentation = {
  Verified: {
    icon: ShieldCheck,
    iconClass: "text-emerald-400",
    dotClass: "border-emerald-400/40 bg-emerald-400/20",
  },
  Observed: {
    icon: Eye,
    iconClass: "text-amber-300",
    dotClass: "border-amber-300/40 bg-amber-300/20",
  },
  "Not Verified": {
    icon: CircleDashed,
    iconClass: "text-white/45",
    dotClass: "border-white/25 bg-white/[0.04]",
  },
} as const;

const audiences = ["Robotics researchers", "Robot developers", "Physical-AI teams"];

export function BuiltForSection() {
  return (
    <section id="status" className="runtime-grid px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.55fr)]">
          <div className="border border-white/10 bg-[#070a0b]/90">
            <div className="border-b border-white/10 px-5 py-6 sm:px-8 sm:py-8">
              <p className="section-kicker">06 / {currentStatusContent.eyebrow}</p>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                {currentStatusContent.title}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/50 sm:text-base">
                {currentStatusContent.description}
              </p>
            </div>
            <div className="grid md:grid-cols-3">
              {currentStatusContent.columns.map((column, index) => {
                const state = presentation[column.status];
                const Icon = state.icon;
                return (
                  <div
                    key={column.title}
                    className={`px-5 py-6 sm:px-8 md:min-h-[260px] ${
                      index < currentStatusContent.columns.length - 1
                        ? "border-b border-white/10 md:border-b-0 md:border-r"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${state.iconClass}`} />
                      <h3 className="font-mono text-[10px] uppercase text-white/65">
                        {column.title}
                      </h3>
                    </div>
                    <ul className="mt-6 space-y-4">
                      {column.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-sm leading-relaxed text-white/[0.48]"
                        >
                          <span
                            className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border ${state.dotClass}`}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="flex flex-col border border-physical-orange/25 bg-physical-orange/[0.035] p-6 sm:p-8">
            <p className="font-mono text-[10px] uppercase text-physical-orange">Build with us</p>
            <h2 className="mt-5 text-2xl font-semibold text-white sm:text-3xl">
              Bring the next body into the evidence loop.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              We are looking for collaborators who care about guarded execution,
              physical evidence, and reusable capability contracts.
            </p>
            <ul className="mt-6 space-y-3 border-y border-white/10 py-5">
              {audiences.map((audience, index) => (
                <li key={audience} className="flex items-center gap-3 font-mono text-[10px] uppercase text-white/[0.52]">
                  <span className="text-physical-orange">0{index + 1}</span>
                  {audience}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-7">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="focus-ring flex min-h-11 items-center justify-center gap-2 bg-physical-orange px-4 text-sm font-semibold text-white transition-colors hover:bg-[#ff6335]"
              >
                <Mail className="h-4 w-4" />
                Contact the team
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring mt-3 flex min-h-11 items-center justify-between border border-white/[0.12] px-4 text-sm text-white/60 transition-colors hover:border-white/25 hover:text-white"
              >
                <span className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  Open source on GitHub
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-cognitive-cyan" />
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
