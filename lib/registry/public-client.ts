import { createClient } from "@supabase/supabase-js";

const REGISTRY_TIMEOUT_MS = 8000;

export function createPublicRegistryClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Registry configuration is missing");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, {
        ...init,
        cache: "no-store",
        signal: AbortSignal.any([
          init?.signal ?? new AbortController().signal,
          AbortSignal.timeout(REGISTRY_TIMEOUT_MS),
        ]),
      }),
    },
  });
}

export function registryErrorKind(error: unknown): "configuration" | "timeout" | "network" | "upstream" {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("configuration is missing")) return "configuration";
  if (/abort|timeout/i.test(message)) return "timeout";
  if (/fetch|network|dns|resolve|connect/i.test(message)) return "network";
  return "upstream";
}
