import { NextResponse } from "next/server";
import { getTenant } from "@/tenants";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/resend";
import { morningBriefingEmail, type BriefingData } from "@/lib/email/templates";
import { resolveFromAddress } from "@/lib/email/from-address";
import type { LeadRow, OutreachLogRow, TenantRow } from "@/lib/supabase/types";

// Daily 07:00 America/Los_Angeles morning briefing (§7.4). Scheduled by
// vercel.json; protected by CRON_SECRET the way Vercel's own docs
// describe — Vercel automatically sends `Authorization: Bearer
// $CRON_SECRET` on cron-triggered requests when that env var is set, so
// this is also exactly what stops anyone else from hitting the route.
//
// Iterates every row in `tenants` (not just the one tenant this
// deployment's NEXT_PUBLIC_TENANT points at) so this keeps working
// unchanged once Phase 4 adds more tenants — each DB tenant row is
// matched back to its TS config by slug via getTenant(slug).
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    console.log("[cron:briefing] Supabase not configured — nothing to send");
    return NextResponse.json({ ok: true, sent: 0, reason: "supabase not configured" });
  }

  const { data: tenantRows, error: tenantsError } = await admin.from("tenants").select("*");
  if (tenantsError || !tenantRows) {
    console.error("[cron:briefing] failed to list tenants", tenantsError);
    return NextResponse.json({ ok: false, error: "failed to list tenants" }, { status: 500 });
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  let sent = 0;

  for (const tenantRow of tenantRows as TenantRow[]) {
    let tenantConfig;
    try {
      tenantConfig = getTenant(tenantRow.slug);
    } catch {
      console.warn(`[cron:briefing] no tenant config registered for slug "${tenantRow.slug}", skipping`);
      continue;
    }

    const { data: newLeads } = await admin
      .from("leads")
      .select("*")
      .eq("tenant_id", tenantRow.id)
      .gte("created_at", since)
      .order("score", { ascending: false });

    const { data: overnightOutreach } = await admin
      .from("outreach_log")
      .select("*, leads(name)")
      .eq("tenant_id", tenantRow.id)
      .gte("created_at", since)
      .order("created_at", { ascending: false });

    const { data: allLeads } = await admin
      .from("leads")
      .select("bucket")
      .eq("tenant_id", tenantRow.id);

    const totals = { hot: 0, warm: 0, nurture: 0 };
    for (const lead of (allLeads ?? []) as Pick<LeadRow, "bucket">[]) {
      totals[lead.bucket] += 1;
    }

    const briefingData: BriefingData = {
      newLeads: ((newLeads ?? []) as LeadRow[]).map((l) => ({
        id: l.id,
        name: l.name,
        property_address: l.property_address,
        phone: l.phone,
        score: l.score,
        bucket: l.bucket,
      })),
      overnightOutreach: (
        (overnightOutreach ?? []) as (OutreachLogRow & { leads: { name: string } | null })[]
      ).map((o) => ({
        leadName: o.leads?.name ?? "Unknown lead",
        channel: o.channel,
        direction: o.direction,
        outcome: o.outcome,
      })),
      totals,
      dashboardUrl: `${tenantConfig.siteUrl}/dashboard`,
    };

    const email = morningBriefingEmail(briefingData, tenantConfig);
    const result = await sendEmail({
      to: tenantConfig.contact.email,
      from: resolveFromAddress(tenantConfig),
      subject: email.subject,
      text: email.text,
      html: email.html,
    });

    if (result.sent) sent += 1;
  }

  return NextResponse.json({ ok: true, sent, tenants: tenantRows.length });
}
