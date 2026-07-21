import { z } from "zod";
import { normalizePublicHttpsUrl } from "@/lib/security/public-url";

const assetIdSchema = z.string().uuid();

export const manifestEvidenceSchema = z
  .string()
  .trim()
  .min(1, "Evidence URL is required")
  .max(2048, "Evidence URL is too long")
  .refine(
    (value) => normalizePublicHttpsUrl(value) !== undefined,
    "Evidence must be a public HTTPS URL",
  )
  .transform((value) => normalizePublicHttpsUrl(value)!);

export const registryAdminActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("approve"),
    assetType: z.enum(["mcp", "skill"]),
    id: assetIdSchema,
  }),
  z.object({
    action: z.literal("reject"),
    assetType: z.enum(["mcp", "skill"]),
    id: assetIdSchema,
  }),
  z.object({
    action: z.literal("attest_manifest"),
    assetType: z.literal("mcp"),
    id: assetIdSchema,
    evidence: manifestEvidenceSchema,
  }),
  z.object({
    action: z.literal("revoke_manifest"),
    assetType: z.literal("mcp"),
    id: assetIdSchema,
  }),
]);

export type RegistryAdminAction = z.infer<typeof registryAdminActionSchema>;
