import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

function getAdminEmails(): string[] {
  const emails = process.env.ROSCLAW_ADMIN_EMAILS || "";
  return emails
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Creates a Supabase server client for admin routes.
 * Callers must pass the cookie store from next/headers.
 */
export function createAdminSupabaseClient(cookieStore: ReturnType<typeof cookies>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set() {
        // Server components / API routes do not set auth cookies here.
      },
      remove() {
        // Server components / API routes do not remove auth cookies here.
      },
    },
  });
}

/**
 * Verifies the current request is from an admin email.
 * Use in API routes and server components.
 */
export async function requireAdmin(cookieStore: ReturnType<typeof cookies>): Promise<{
  user: { id: string; email: string };
}> {
  const supabase = createAdminSupabaseClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || !user.email) {
    throw new Error("Unauthorized");
  }

  const adminEmails = getAdminEmails();
  if (adminEmails.length === 0) {
    throw new Error("Admin access not configured");
  }

  if (!adminEmails.includes(user.email.toLowerCase())) {
    throw new Error("Forbidden");
  }

  return { user: { id: user.id, email: user.email } };
}

/**
 * Async wrapper to create a cookie store and require admin.
 * Convenience for server components.
 */
export async function requireAdminServerComponent(): Promise<{
  user: { id: string; email: string };
}> {
  const cookieStore = cookies();
  return requireAdmin(cookieStore);
}

/**
 * Checks if an email is in the admin allowlist.
 */
export function isAdminEmail(email: string): boolean {
  return getAdminEmails().includes(email.toLowerCase());
}
