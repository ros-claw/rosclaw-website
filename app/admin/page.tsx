import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { RegistryAdminClient } from "@/components/admin/registry-admin-client";
import { requireAdmin } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let admin: Awaited<ReturnType<typeof requireAdmin>>;
  try {
    admin = await requireAdmin(await cookies());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    if (message === "Forbidden") {
      return (
        <main className="flex min-h-screen items-center justify-center bg-background px-4 py-24">
          <section className="w-full max-w-lg border border-white/15 bg-[#080b0c] p-8">
            <p className="section-kicker">Registry operations</p>
            <h1 className="mt-4 text-2xl font-semibold text-white">Access denied</h1>
            <p className="mt-3 text-sm leading-relaxed text-white/55">
              This account is authenticated but is not in the Registry administrator allowlist.
            </p>
          </section>
        </main>
      );
    }
    redirect("/login?redirect=/admin");
  }

  return <RegistryAdminClient adminEmail={admin.user.email} />;
}
