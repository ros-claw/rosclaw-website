import { normalizePublicHttpsUrl } from "@/lib/security/public-url";

type RegistryVerificationRow = Record<string, unknown>;

export interface ManifestValidationMetadata {
  validatedAt: string;
  evidence: string;
  evidenceUrl?: string;
}

export function getManifestValidationMetadata(
  row: RegistryVerificationRow,
): ManifestValidationMetadata | null {
  if (row.is_verified !== true) return null;
  if (typeof row.manifest_validated_at !== "string") return null;
  if (typeof row.manifest_validation_evidence !== "string") return null;

  const validatedAt = row.manifest_validated_at.trim();
  const evidence = row.manifest_validation_evidence.trim();
  const validatedAtMs = Date.parse(validatedAt);
  if (
    !validatedAt ||
    !evidence ||
    !Number.isFinite(validatedAtMs) ||
    validatedAtMs > Date.now() + 5 * 60 * 1000
  ) {
    return null;
  }

  return {
    validatedAt,
    evidence,
    evidenceUrl: normalizePublicHttpsUrl(evidence),
  };
}

export function hasManifestValidationEvidence(
  row: RegistryVerificationRow,
): boolean {
  return getManifestValidationMetadata(row) !== null;
}
