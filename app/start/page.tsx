import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import {
  StartPathSelector,
  type StartPath,
} from "@/components/start-path-selector";

export const metadata: Metadata = {
  title: "Start | ROSClaw",
  description:
    "Choose a verified simulation, sensor, robot, Agent, or publisher path for ROSClaw.",
};

const allowedPaths = new Set<StartPath>([
  "simulation",
  "sensor",
  "robot",
  "agent",
  "publisher",
]);

export default async function StartPage({
  searchParams,
}: {
  searchParams?: Promise<{ path?: string }>;
}) {
  const requested = (await searchParams)?.path as StartPath | undefined;
  const initialPath =
    requested && allowedPaths.has(requested) ? requested : "simulation";

  return (
    <main className="min-h-screen bg-[#060809]">
      <section className="runtime-grid border-b border-white/[0.08] px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <p className="section-kicker">Start ROSClaw</p>
              <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
                Choose what you have.
              </h1>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-white/55 lg:justify-self-end lg:text-lg">
              Start from a task, not a module list. Each path shows only current
              commands and states its evidence boundary before you run anything.
            </p>
          </div>
          <StartPathSelector initialPath={initialPath} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
