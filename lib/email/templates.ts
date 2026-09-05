import type { TenantConfig } from "@/tenants/types";

// Hand-written template functions rather than the react-email package
// (§3's "React Email-style" phrasing describes an approach — small,
// composable templates — not a mandated dependency; three short
// templates don't justify pulling in a rendering framework). See
// DECISIONS.md.

function signatureBlock(tenant: TenantConfig): string {
  return [
    tenant.contact.displayName,
    tenant.contact.roleLine,
    tenant.contact.phone,
    tenant.contact.email,
    "",
    tenant.contact.complianceFooter,
  ].join("\n");
}

/**
 * First-touch auto-reply to a new, non-spam web-form lead (§7.4).
 * Plain text ONLY, no `html` field at all — §3's deliverability rule for
 * the first email a lead receives.
 */
export function autoReplyEmail(
  lead: { name: string; property_address: string | null },
  tenant: TenantConfig,
): { subject: string; text: string } {
  const firstName = lead.name.trim().split(/\s+/)[0] || lead.name;
  const addressPhrase = lead.property_address ? `about ${lead.property_address}` : "about your property";

  const text = `Hi ${firstName},

Got your note ${addressPhrase}. I'll call you from ${tenant.contact.phone} — pick up.

${signatureBlock(tenant)}

Reply to this email any time to opt out of future messages.`;

  return {
    subject: lead.property_address ? `Got your note about ${lead.property_address}` : "Got your note",
    text,
  };
}

export interface BriefingLead {
  id: string;
  name: string;
  property_address: string | null;
  phone: string;
  score: number;
  bucket: "hot" | "warm" | "nurture";
}

export interface BriefingOutreach {
  leadName: string;
  channel: string;
  direction: "out" | "in";
  outcome: string | null;
}

export interface BriefingData {
  newLeads: BriefingLead[];
  overnightOutreach: BriefingOutreach[];
  totals: { hot: number; warm: number; nurture: number };
  dashboardUrl: string;
}

const BUCKET_LABEL: Record<BriefingLead["bucket"], string> = {
  hot: "HOT",
  warm: "WARM",
  nurture: "NURTURE",
};

/** Daily 07:00 America/Los_Angeles briefing (§7.4), sent to the agent —
 * not a lead, so no plain-text-only restriction applies. Includes a
 * minimal HTML version so tap-to-call links actually work. */
export function morningBriefingEmail(
  data: BriefingData,
  tenant: TenantConfig,
): { subject: string; text: string; html: string } {
  const sorted = [...data.newLeads].sort((a, b) => b.score - a.score);
  const dateLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "America/Los_Angeles",
  });

  const leadLinesText = sorted.length
    ? sorted
        .map(
          (l) =>
            `[${BUCKET_LABEL[l.bucket]} ${l.score}] ${l.name} — ${l.property_address ?? "address unknown"} — ${l.phone}`,
        )
        .join("\n")
    : "No new leads overnight.";

  const outreachLinesText = data.overnightOutreach.length
    ? data.overnightOutreach
        .map((o) => `${o.leadName}: ${o.channel} ${o.direction} — ${o.outcome ?? "no outcome logged"}`)
        .join("\n")
    : "No outreach logged overnight.";

  const text = `${dateLabel} — ${tenant.name} briefing

NEW LEADS (${sorted.length})
${leadLinesText}

OVERNIGHT OUTREACH
${outreachLinesText}

BOARD TOTALS
HOT: ${data.totals.hot}  WARM: ${data.totals.warm}  NURTURE: ${data.totals.nurture}

${data.dashboardUrl}`;

  const leadRowsHtml = sorted.length
    ? sorted
        .map(
          (l) => `<tr>
  <td style="padding:6px 8px;font-weight:${l.bucket === "hot" ? "bold" : "normal"};">${BUCKET_LABEL[l.bucket]} ${l.score}</td>
  <td style="padding:6px 8px;">${l.name}</td>
  <td style="padding:6px 8px;">${l.property_address ?? "address unknown"}</td>
  <td style="padding:6px 8px;"><a href="tel:${l.phone}">${l.phone}</a></td>
</tr>`,
        )
        .join("\n")
    : `<tr><td style="padding:6px 8px;">No new leads overnight.</td></tr>`;

  const outreachRowsHtml = data.overnightOutreach.length
    ? data.overnightOutreach
        .map(
          (o) =>
            `<li>${o.leadName}: ${o.channel} ${o.direction} — ${o.outcome ?? "no outcome logged"}</li>`,
        )
        .join("\n")
    : "<li>No outreach logged overnight.</li>";

  const html = `<div style="font-family:Helvetica,Arial,sans-serif;color:#12233F;">
<h1 style="font-size:18px;">${dateLabel} — ${tenant.name} briefing</h1>
<h2 style="font-size:14px;">New leads (${sorted.length})</h2>
<table style="border-collapse:collapse;width:100%;">${leadRowsHtml}</table>
<h2 style="font-size:14px;">Overnight outreach</h2>
<ul>${outreachRowsHtml}</ul>
<h2 style="font-size:14px;">Board totals</h2>
<p>HOT: ${data.totals.hot} &nbsp; WARM: ${data.totals.warm} &nbsp; NURTURE: ${data.totals.nurture}</p>
<p><a href="${data.dashboardUrl}">Open the dashboard</a></p>
</div>`;

  return { subject: `${dateLabel} briefing — ${sorted.length} new`, text, html };
}

/**
 * Monthly check-in draft for a NURTURE-bucket lead (§7.4 v1: draft only,
 * sent manually from the lead-detail screen — no automated sequence).
 */
export function nurtureCheckInEmail(
  lead: { name: string; property_address: string | null },
  tenant: TenantConfig,
): { subject: string; text: string } {
  const firstName = lead.name.trim().split(/\s+/)[0] || lead.name;
  const addressPhrase = lead.property_address ? `on ${lead.property_address}` : "on your property";

  const text = `Hi ${firstName},

Checking back in ${addressPhrase} — no news is fine, just wanted to see where things stand. If anything's changed, or you'd like an updated number, call or text any time.

${signatureBlock(tenant)}

Reply to this email any time to opt out of future messages.`;

  return {
    subject: lead.property_address ? `Checking in on ${lead.property_address}` : "Checking in",
    text,
  };
}
