import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Service-role client — bypasses RLS entirely (§5: "Service role: used
 * only server-side"). Import this ONLY from route handlers and cron
 * jobs, never from anything that could run in or be bundled for the
 * browser. The `server-only` import above turns an accidental
 * client-bundle import into a build error rather than a leaked key.
 *
 * Returns null when the required env vars aren't set, so callers can
 * degrade gracefully (console-log stub) instead of crashing — same
 * philosophy as the Resend/Twilio fallback (§3), extended to local dev
 * without a Supabase project set up yet.
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
