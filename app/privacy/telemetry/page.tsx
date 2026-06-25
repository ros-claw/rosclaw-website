import Link from "next/link";

export const metadata = {
  title: "Telemetry & Privacy | ROSClaw",
  description:
    "ROSClaw collects lightweight anonymous product telemetry by default. Rich diagnostics, prompts, logs, media, and traces are never uploaded by default.",
};

export default function TelemetryPrivacyPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex items-center gap-2 text-cognitive-cyan font-mono text-sm mb-4">
            <span className="text-physical-orange">&gt;_</span>
            <span>PRIVACY & TELEMETRY</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How ROSClaw Handles Your Data
          </h1>
          <p className="text-white/60 text-lg">
            ROSClaw collects lightweight anonymous product telemetry by default to
            understand installation success, active usage, version distribution, and
            command reliability. Rich diagnostics, prompts, logs, media, and traces are
            never uploaded by default and require explicit user action with redaction.
          </p>
        </div>

        <div className="space-y-8">
          <section className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 md:p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Tier 0: Product Telemetry</h2>
            <p className="text-white/60 mb-4">
              Enabled by default. Can be disabled anytime with:
            </p>
            <pre className="rounded-lg bg-black/40 border border-white/10 p-4 font-mono text-sm text-cognitive-cyan mb-4 overflow-x-auto">
              rosclaw feedback telemetry off
            </pre>
            <p className="text-white/60 mb-4">What we collect:</p>
            <ul className="list-disc list-inside text-white/60 space-y-1">
              <li>Anonymous installation ID</li>
              <li>ROSClaw / CLI version</li>
              <li>OS family, architecture, Python version</li>
              <li>Install channel and deployment mode</li>
              <li>Command name, status, and duration bucket</li>
              <li>Module usage and heartbeat signals</li>
            </ul>
          </section>

          <section className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 md:p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Tier 1: Diagnostic Telemetry</h2>
            <p className="text-white/60 mb-4">
              Collected locally by default. Uploaded only after you explicitly consent.
              Always redacted before upload.
            </p>
            <ul className="list-disc list-inside text-white/60 space-y-1">
              <li>Crash summaries and failure statistics</li>
              <li>Sandbox block reports</li>
              <li>Provider performance summaries</li>
            </ul>
          </section>

          <section className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 md:p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Tier 2: Rich Feedback Bundle</h2>
            <p className="text-white/60 mb-4">
              Only uploaded when you manually run:
            </p>
            <pre className="rounded-lg bg-black/40 border border-white/10 p-4 font-mono text-sm text-cognitive-cyan mb-4 overflow-x-auto">
              rosclaw feedback upload --redact
            </pre>
            <p className="text-white/60">
              Bundles are redacted, hashed, and stored privately. Media and MCAP require
              additional explicit flags and are never uploaded by default.
            </p>
          </section>

          <section className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 md:p-8">
            <h2 className="text-xl font-semibold text-white mb-4">What We Never Collect</h2>
            <ul className="list-disc list-inside text-white/60 space-y-1">
              <li>Prompts, system prompts, or tool arguments</li>
              <li>Full commands or command arguments</li>
              <li>Local file paths, hostnames, usernames, or IP addresses</li>
              <li>API keys, secrets, or robot serial numbers</li>
              <li>Camera, video, audio, or raw MCAP/trace files by default</li>
            </ul>
          </section>

          <section className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 md:p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Data Retention & Deletion</h2>
            <p className="text-white/60 mb-4">
              Product telemetry is retained for product improvement. You can request
              deletion of data associated with your anonymous installation ID by
              contacting us or using the CLI delete request flow.
            </p>
            <Link
              href="mailto:ai@rosclaw.io"
              className="text-cognitive-cyan hover:text-physical-orange transition-colors"
            >
              Contact privacy@rosclaw.io
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
