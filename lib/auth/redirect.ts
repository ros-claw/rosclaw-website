export function safeInternalRedirect(
  value: string | null | undefined,
  fallback = "/profile",
): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }
  if (value.includes("\\") || /[\r\n]/.test(value)) return fallback;

  try {
    const parsed = new URL(value, "https://rosclaw.local");
    if (parsed.origin !== "https://rosclaw.local") return fallback;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}
