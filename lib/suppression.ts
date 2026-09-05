import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

// STOP suppression (§8): checked before every automated outbound text.
// There's no dedicated opt-out table in §5's schema — the outreach_log
// table already records every inbound message, so an inbound text whose
// body contains STOP (case-insensitive, matching the SMS keyword Twilio
// itself recognizes) is the suppression record. Scoped by phone number
// across every lead that shares it, not just one lead id, since the
// missed-call webhook creates a new lead row per call rather than
// reusing one — the same phone number can be attached to more than one
// lead over time, and a STOP applies to the person, not a single row.
//
// In production, Twilio's own Advanced Opt-Out feature intercepts STOP
// replies and suppresses sends at the carrier/Twilio layer before they
// ever reach this app — this check is defense in depth (and what makes
// the /dev/stop-simulator testable without a real Twilio number).
export async function isPhoneSuppressed(
  admin: SupabaseClient<Database>,
  tenantId: string,
  phone: string,
): Promise<boolean> {
  const { data: leadsForPhone } = await admin
    .from("leads")
    .select("id")
    .eq("tenant_id", tenantId)
    .eq("phone", phone);

  const leadIds = (leadsForPhone ?? []).map((l) => l.id);
  if (leadIds.length === 0) return false;

  const { data: stopMessages } = await admin
    .from("outreach_log")
    .select("id")
    .in("lead_id", leadIds)
    .eq("channel", "text")
    .eq("direction", "in")
    .ilike("body", "%stop%")
    .limit(1);

  return (stopMessages?.length ?? 0) > 0;
}
