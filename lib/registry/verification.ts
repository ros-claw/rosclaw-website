type RegistryVerificationRow = Record<string, unknown>;

export function hasManifestValidationEvidence(
  row: RegistryVerificationRow,
): boolean {
  return (
    row.is_verified === true &&
    typeof row.manifest_validated_at === "string" &&
    row.manifest_validated_at.length > 0 &&
    typeof row.manifest_validation_evidence === "string" &&
    row.manifest_validation_evidence.length > 0
  );
}
