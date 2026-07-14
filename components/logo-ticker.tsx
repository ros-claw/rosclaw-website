import Link from "next/link";

const integrations = [
  { name: "ROS 2", status: "Supported" },
  { name: "MuJoCo", status: "Supported" },
  { name: "MCP", status: "Supported" },
  { name: "MCAP", status: "Supported" },
  { name: "SeekDB", status: "Supported" },
  { name: "Unitree", status: "Experimental" },
  { name: "Realman", status: "Experimental" },
  { name: "RLDS", status: "Experimental" },
] as const;

export function LogoTicker() {
  return (
    <section aria-labelledby="integration-heading" className="border-b border-white/[0.08] bg-[#050708]">
      <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
          <div className="flex shrink-0 items-center gap-3 xl:w-[190px]">
            <span className="h-px w-6 bg-white/25" />
            <h2 id="integration-heading" className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/[0.42]">
              Runtime context
            </h2>
          </div>
          <div className="flex flex-1 flex-wrap gap-x-5 gap-y-3">
            {integrations.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="text-sm font-medium text-white/[0.72]">{item.name}</span>
                <span className={`font-mono text-[8px] uppercase tracking-wider ${item.status === "Supported" ? "text-emerald-400/75" : "text-amber-300/70"}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
          <Link href="/hub" className="focus-ring shrink-0 font-mono text-[10px] uppercase tracking-[0.15em] text-cognitive-cyan transition-colors hover:text-white">
            View ecosystem →
          </Link>
        </div>
      </div>
    </section>
  );
}
