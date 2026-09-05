import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Cookie-bound Supabase client for Server Components, Server Actions,
 * and route handlers in the (crm) area. Runs as the logged-in agent —
 * every query goes through RLS scoped to their tenant via
 * current_tenant_id() (§5), never bypasses it. Returns null when
 * NEXT_PUBLIC_SUPABASE_URL/ANON_KEY aren't set, so the CRM can render a
 * clear "Supabase isn't configured yet" state instead of crashing.
 */
export async function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component that can't set cookies — the
          // middleware refresh path (below) handles session renewal
          // instead. Safe to ignore here.
        }
      },
    },
  });
}
