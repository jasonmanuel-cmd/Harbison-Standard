import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * Looks up a lead by its /v/[slug] video_slug. Uses the service-role
 * client deliberately — the visitor here is the lead themselves,
 * following a link texted or emailed to them, with no session and no
 * reason to have one. Only the handful of fields the video page and its
 * OG image actually render are selected.
 */
export async function findLeadByVideoSlug(slug: string) {
  const admin = getSupabaseAdmin();
  if (!admin) return null;

  const { data } = await admin
    .from("leads")
    .select("name, property_address, video_url, tenant_id")
    .eq("video_slug", slug)
    .maybeSingle();

  return data;
}
