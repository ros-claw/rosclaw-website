import { createClient } from "@supabase/supabase-js";

/**
 * Creates the two private Storage buckets required by the feedback module.
 *
 * Usage:
 *   NEXT_PUBLIC_SUPABASE_URL=https://ptzizfbreytzetyelxiv.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxx \
 *   npx tsx scripts/create-feedback-buckets.ts
 */

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const admin = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const buckets = [
    { id: "feedback-bundles", name: "feedback-bundles" },
    { id: "feedback-attachments", name: "feedback-attachments" },
  ];

  for (const { id, name } of buckets) {
    const { data: existing } = await admin.storage.getBucket(id);
    if (existing) {
      console.log(`Bucket "${name}" already exists.`);
      continue;
    }

    const { data, error } = await admin.storage.createBucket(id, {
      public: false,
    });

    if (error) {
      console.error(`Failed to create bucket "${name}":`, error.message);
      process.exit(1);
    }

    console.log(`Created private bucket "${name}".`, data ? "" : "");
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
