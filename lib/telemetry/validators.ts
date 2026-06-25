import { FORBIDDEN_FIELDS } from "./constants";

/**
 * Recursively scans a JSON-like value for forbidden field names.
 * Returns the first forbidden field found, or null if clean.
 */
export function findForbiddenField(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findForbiddenField(item);
      if (found) return found;
    }
    return null;
  }

  if (typeof value === "object") {
    for (const [key, nestedValue] of Object.entries(value as Record<string, unknown>)) {
      if (FORBIDDEN_FIELDS.has(key)) {
        return key;
      }
      const found = findForbiddenField(nestedValue);
      if (found) return found;
    }
    return null;
  }

  return null;
}

/**
 * Validates that a string matches the anonymous installation id format.
 */
export function isAnonymousInstallationId(value: string): boolean {
  return typeof value === "string" && /^rci_[a-f0-9]{32}$/.test(value);
}
