import { ArrowUpRight, CheckCircle2, Construction, FlaskConical, Github, Mail } from "lucide-react";
import { CONTACT_EMAIL, GITHUB_URL } from "@/content/shared";

const roadmap = [
  {
    icon: CheckCircle2,
    label: "Ready today",
    tone: "green",
    items: ["Body contexts", "Sandbox validation", "Praxis trace capture"],
  },
  {
    icon: Construction,
    label: "Experimental",
    tone: "amber",
    items: ["Provider lifecycle", "Physical memory", "Hardware MCP install"],
  },
  {
    icon: FlaskConical,
    label: "Research",
    tone: "purple",
    items: ["Darwin promotion", "Cross-body transfer", "Long-horizon memory"],
  },
] as const;

const audiences = ["Robotics researchers", "Robot developers", "Physical-AI teams"];

export function BuiltForSection() {
  return (
    <section id="community" className="runtime-grid px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.55fr)]">
          <div className="border border-white/10 bg-[#070a0b]/90">
            <div className="border-b border-white/10 px-5 py-6 sm:px-8 sm:py-8">
              <p className="section-kicker">06 / Current status</p>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
                An honest path from runtime to research.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/50 sm:text-base">
                ROSClaw is under active development. The roadmap separates usable foundations from modules that still need evaluation and research.
              </p>
            </div>
            <div className="grid md:grid-cols-3">
              {roadmap.map(({ icon: Icon, label, tone, items }, index) => {
                const toneClasses = tone === "green"
                  ? "text-emerald-400 border-emerald-400/30"
                  : tone === "amber"
                  ? "text-amber-300 border-amber-300/30"
                  : "text-purple-300 border-purple-300/30";
                return (
                  <div key={label} className={`px-5 py-6 sm:px-8 md:min-h-[230px] ${index < roadmap.length - 1 ? "border-b border-white/10 md:border-b-0 md:border-r" : ""}`}>
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${toneClasses.split(" ")[0]}`} />
                      <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/65">{label}</h3>
                    </div>
                    <ul className="mt-6 space-y-4">
                      {items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-white/[0.48]">
                          <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border ${toneClasses}`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="flex flex-col border border-physical-orange/25 bg-[linear-gradient(145deg,rgba(255,62,0,0.075),rgba(255,255,255,0.015))] p-6 sm:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-physical-orange">Build with us</p>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Bring the next body into the loop.</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              We are looking for collaborators who care about real execution, safety evidence, and reusable physical experience.
            </p>
            <ul className="mt-6 space-y-3 border-y border-white/10 py-5">
              {audiences.map((audience, index) => (
                <li key={audience} className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.1em] text-white/[0.52]">
                  <span className="text-physical-orange">0{index + 1}</span> {audience}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-7">
              <a href={`mailto:${CONTACT_EMAIL}`} className="focus-ring flex min-h-11 items-center justify-center gap-2 bg-physical-orange px-4 text-sm font-semibold text-white transition-colors hover:bg-[#ff6335]">
                <Mail className="h-4 w-4" /> Contact the team
              </a>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="focus-ring mt-3 flex min-h-11 items-center justify-between border border-white/[0.12] px-4 text-sm text-white/60 transition-colors hover:border-white/25 hover:text-white">
                <span className="flex items-center gap-2"><Github className="h-4 w-4" /> Open source on GitHub</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-cognitive-cyan" />
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
