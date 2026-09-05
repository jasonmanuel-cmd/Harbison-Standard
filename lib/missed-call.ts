import "server-only";
import { getTenant } from "@/tenants";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sendSms } from "@/lib/twilio";
import { missedCallText } from "@/lib/sms/templates";
import { isPhoneSuppressed } from "@/lib/suppression";

export type MissedCallResult =
  | { status: "not-configured" }
  | { status: "no-tenant-row" }
  | { status: "lead-create-failed" }
  | { status: "suppressed" }
  | { status: "sent" }
  | { status: "stub-logged" };

/**
 * Core missed-call text-back logic (§7.4), shared by the real Twilio
 * webhook (app/api/webhooks/twilio/route.ts) and the /dev/simulate-
 * missed-call page — the latter calls this directly instead of making a
 * self-HTTP round trip back into this same app.
 */
export async function handleMissedCall(fromPhone: string): Promise<MissedCallResult> {
  const tenant = getTenant();
  const admin = getSupabaseAdmin();

  if (!admin) {
    console.log("[missed-call:stub] would create lead + text", JSON.stringify({ from: fromPhone }));
    return { status: "not-configured" };
  }

  const { data: tenantRow } = await admin.from("tenants").select("id").eq("slug", tenant.slug).single();
  if (!tenantRow) {
    console.error(`[missed-call] no tenant row for slug "${tenant.slug}"`);
    return { status: "no-tenant-row" };
  }

  const { data: lead, error: insertError } = await admin
    .from("leads")
    .insert({ tenant_id: tenantRow.id, source: "missed-call", name: fromPhone, phone: fromPhone })
    .select("id")
    .single();

  if (insertError || !lead) {
    console.error("[missed-call] failed to create lead", insertError);
    return { status: "lead-create-failed" };
  }

  const suppressed = await isPhoneSuppressed(admin, tenantRow.id, fromPhone);
  const body = missedCallText(tenant);

  if (suppressed) {
    await admin.from("outreach_log").insert({
      tenant_id: tenantRow.id,
      lead_id: lead.id,
      channel: "text",
      direction: "out",
      body,
      ai_generated: true,
      disclosed_ai: false,
      outcome: "suppressed (prior STOP on file)",
    });
    return { status: "suppressed" };
  }

  // Exactly one automated text — no further automation queued, matching
  // §7.4: with consent_at left NULL on this lead, this is the compliant
  // first-touch informational message, not an ongoing sequence.
  const result = await sendSms(fromPhone, body);

  await admin.from("outreach_log").insert({
    tenant_id: tenantRow.id,
    lead_id: lead.id,
    channel: "text",
    direction: "out",
    body,
    ai_generated: true,
    disclosed_ai: false,
    outcome: result.sent ? "sent" : "stub-logged",
  });

  return { status: result.sent ? "sent" : "stub-logged" };
}
