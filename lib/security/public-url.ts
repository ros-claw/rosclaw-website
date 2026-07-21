export function normalizePublicHttpsUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;

  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return undefined;

    const hostname = url.hostname.toLowerCase();
    const unbracketedHostname = hostname.replace(/^\[|\]$/g, "");
    if (
      /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname) ||
      unbracketedHostname.includes(":") ||
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname.endsWith(".local") ||
      hostname === "0.0.0.0" ||
      hostname === "127.0.0.1" ||
      unbracketedHostname === "::1" ||
      /^(?:fc|fd|fe8|fe9|fea|feb)[0-9a-f]*:/i.test(unbracketedHostname) ||
      /^10\./.test(hostname) ||
      /^192\.168\./.test(hostname) ||
      /^169\.254\./.test(hostname)
    ) {
      return undefined;
    }

    const private172 = hostname.match(/^172\.(\d{1,3})\./);
    if (private172) {
      const secondOctet = Number(private172[1]);
      if (secondOctet >= 16 && secondOctet <= 31) return undefined;
    }

    return url.toString();
  } catch {
    return undefined;
  }
}
