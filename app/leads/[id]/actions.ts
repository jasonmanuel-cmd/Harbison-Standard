"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getTenant } from "@/tenants";
import { sendEmail } from "@/lib/resend";
import { nurtureCheckInEmail } from "@/lib/email/templates";
import { resolveFromAddress } from "@/lib/email/from-address";

const STATUS_VALUES = ["new", "contacted", "appointment", "offer_out", "dead", "closed"];

export async function updateLeadStatus(leadId: string, status: string) {
  if (!STATUS_VALUES.includes(status)) return;

  const supabase = await getSupabaseServerClient();
  if (!supabase) return;

  const { error } = await supabase.from("leads").update({ status }).eq("id", leadId);
  if (error) console.error("[leads/[id]] status update failed", error);

  revalidatePath(`/leads/${leadId}`);
  revalidatePath("/dashboard");
}

export async function updateLeadNotes(leadId: string, agentNotes: string) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return;

  const { data: existing } = await supabase.from("leads").select("notes").eq("id", leadId).maybeSingle();
  const notes = { ...(existing?.notes as Record<string, unknown> | undefined), agent_notes: agentNotes };

  const { error } = await supabase.from("leads").update({ notes }).eq("id", leadId);
  if (error) console.error("[leads/[id]] notes update failed", error);

  revalidatePath(`/leads/${leadId}`);
}

/**
 * Generates the lead's /v/[slug] video page (§7.4). There's no video-
 * generation service wired up — "generate" means creating the unique
 * slug and, if the lead doesn't already have a video_url, pointing it at
 * the tenant's default hero footage (public/media/hero.mp4) so the page
 * has something to show immediately. An agent can record and paste a
 * real per-lead video URL afterward via updateLeadVideoUrl.
 */
export async function generateVideoPage(leadId: string) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return;

  const { data: lead } = await supabase.from("leads").select("video_slug, video_url").eq("id", leadId).maybeSingle();
  if (!lead) return;

  const slug = lead.video_slug ?? crypto.randomUUID().split("-")[0];
  const videoUrl = lead.video_url ?? "/media/hero.mp4";

  const { error } = await supabase
    .from("leads")
    .update({ video_slug: slug, video_url: videoUrl })
    .eq("id", leadId);

  if (error) console.error("[leads/[id]] video page generation failed", error);

  revalidatePath(`/leads/${leadId}`);
}

export async function updateLeadVideoUrl(leadId: string, videoUrl: string) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return;

  const { error } = await supabase
    .from("leads")
    .update({ video_url: videoUrl || null })
    .eq("id", leadId);

  if (error) console.error("[leads/[id]] video url update failed", error);

  revalidatePath(`/leads/${leadId}`);
}

/**
 * NURTURE-bucket monthly check-in (§7.4 v1 scope): manual send only, one
 * button, no automated sequence. Requires an email on file — a
 * missed-call-sourced lead may not have one, in which case the button
 * simply isn't shown (see the lead-detail page).
 */
export async function sendNurtureCheckIn(leadId: string) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return;

  const { data: lead } = await supabase
    .from("leads")
    .select("id, tenant_id, name, email, property_address")
    .eq("id", leadId)
    .maybeSingle();

  if (!lead || !lead.email) return;

  const tenant = getTenant();
  const email = nurtureCheckInEmail(lead, tenant);
  const result = await sendEmail({
    to: lead.email,
    from: resolveFromAddress(tenant),
    subject: email.subject,
    text: email.text,
  });

  const { error } = await supabase.from("outreach_log").insert({
    tenant_id: lead.tenant_id,
    lead_id: lead.id,
    channel: "email",
    direction: "out",
    body: email.text,
    ai_generated: true,
    disclosed_ai: false,
    outcome: result.sent ? "sent" : "stub-logged",
  });

  if (error) console.error("[leads/[id]] nurture check-in log failed", error);

  revalidatePath(`/leads/${leadId}`);
}
