import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Browser client for the (crm) area's client components — currently
 * just the login page's magic-link form. Returns null when Supabase
 * isn't configured, matching the server-side clients' fallback behavior.
 */
export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createBrowserClient<Database>(url, anonKey);
}
