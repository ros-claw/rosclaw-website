import { Client } from "pg";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * Applies the telemetry/feedback migration directly to Postgres.
 *
 * Usage:
 *   DATABASE_URL=postgresql://postgres:password@db.ptzizfbreytzetyelxiv.supabase.co:5432/postgres \
 *   npx tsx scripts/apply-telemetry-migration.ts
 */

async function main() {
  const databaseUrl =
    process.env.DATABASE_URL ||
    "postgresql://postgres:84854582@qq.com@db.ptzizfbreytzetyelxiv.supabase.co:5432/postgres";

  const sqlPath = resolve(process.cwd(), "supabase/migrations/004_telemetry_feedback_schema.sql");
  const sql = readFileSync(sqlPath, "utf-8");

  const client = new Client({ connectionString: databaseUrl });

  try {
    await client.connect();
    await client.query(sql);
    console.log("Migration applied successfully.");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
