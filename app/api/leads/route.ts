import { NextResponse } from "next/server";
import { getTenant } from "@/tenants";
import { CONSENT_TEXT, HONEYPOT_FIELD, TIME_TRAP_FIELD } from "@/lib/situations";
import { isRateLimited } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

// Lead ingest (§7.2). Accepts a plain `<form method="POST">` submission
// (no-JS path -> 303 redirect to /thank-you) and the same endpoint hit
// via fetch() from LeadForm's progressive-enhancement script (JS path ->
// JSON response, no redirect).
//
// Full request-side pipeline (honeypot, time-trap, UTM + referrer
// capture, consent capture, rate limiting) runs unconditionally. The
// insert itself uses the service-role client (§5: "used only
// server-side") so it bypasses RLS as a trusted write — the anon
// insert-only policy stays in place as the safety net for anyone who
// bypasses this route and hits Supabase directly. Deliberately never
// chains `.select()` after `.insert()`; see DECISIONS.md's Phase 2 entry
// on RLS + RETURNING for why that's a hard rule, not a style choice.
// Scoring itself is computed entirely by the Postgres trigger
// fn_score_lead() (§5) — this route never duplicates that logic, it only
// supplies raw inputs.
//
// When Supabase env vars aren't set (local dev with no project
// configured yet), falls back to the same console-log stub Phase 1
// shipped — the lead still "saves" (to the log) and the user still sees
// success, consistent with the graceful-degradation rule in §3.

function wantsJson(request: Request): boolean {
  return (request.headers.get("accept") ?? "").includes("application/json");
}

function errorPage(message: string): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Something went wrong</title></head><body style="font-family: Helvetica, Arial, sans-serif; padding: 3rem; max-width: 40rem; margin: 0 auto;"><h1>Something went wrong</h1><p>${message}</p><p><a href="javascript:history.back()">Go back</a></p></body></html>`;
}

export async function POST(request: Request) {
  const tenant = getTenant();
  const formData = await request.formData();

  const get = (key: string) => (formData.get(key) as string | null)?.trim() ?? "";

  const name = get("name");
  const phone = get("phone");
  const email = get("email");
  const propertyAddress = get("property_address");
  const situation = get("situation");
  const timeline = get("timeline");
  const consent = get("consent");
  const source = get("source") || "home";
  const honeypot = get(HONEYPOT_FIELD);
  const openedAtRaw = get(TIME_TRAP_FIELD);

  const missingRequired =
    !name || !phone || !email || !propertyAddress || !situation || !timeline || consent !== "1";

  if (missingRequired) {
    const message = "Please fill in every field and check the consent box, then submit again.";
    if (wantsJson(request)) {
      return NextResponse.json({ ok: false, error: message }, { status: 400 });
    }
    return new NextResponse(errorPage(message), {
      status: 400,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    const message = "Too many submissions from this connection. Please call directly instead.";
    if (wantsJson(request)) {
      return NextResponse.json({ ok: false, error: message }, { status: 429 });
    }
    return new NextResponse(errorPage(message), {
      status: 429,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  const userAgent = request.headers.get("user-agent") ?? "";
  const referrer = request.headers.get("referer") ?? "";

  let formSecondsOpen: number | null = null;
  const openedAtMs = Number(openedAtRaw);
  if (openedAtRaw && Number.isFinite(openedAtMs) && openedAtMs > 0) {
    formSecondsOpen = Math.max(0, Math.round((Date.now() - openedAtMs) / 1000));
  }

  const isHoneypotTriggered = honeypot.length > 0;
  const isTooFast =
    formSecondsOpen !== null && formSecondsOpen < tenant.scoring.minFormSeconds;
  const flaggedSpam = isHoneypotTriggered || isTooFast;

  const leadInput = {
    source,
    name,
    phone,
    email,
    property_address: propertyAddress,
    situation,
    timeline,
    consent_text: CONSENT_TEXT,
    consent_at: new Date().toISOString(),
    ip,
    user_agent: userAgent,
    form_seconds_open: formSecondsOpen,
    flagged_spam: flaggedSpam,
    utm: {
      source: get("utm_source") || null,
      medium: get("utm_medium") || null,
      campaign: get("utm_campaign") || null,
      referrer: referrer || null,
    },
  };

  const admin = getSupabaseAdmin();

  if (!admin) {
    console.log(
      "[leads:stub] Supabase not configured — would insert lead",
      JSON.stringify({ tenant_slug: tenant.slug, ...leadInput }),
    );
  } else {
    const { data: tenantRow, error: tenantError } = await admin
      .from("tenants")
      .select("id")
      .eq("slug", tenant.slug)
      .single();

    if (tenantError || !tenantRow) {
      // No tenant row for this slug yet — e.g. Supabase is configured
      // but the operator hasn't provisioned their tenant row (see
      // README). Never lose the lead over this: fall back to the same
      // stub log Phase 1 used, and let the response continue normally.
      console.error(
        `[leads] no tenant row found for slug "${tenant.slug}" — falling back to stub log`,
        tenantError,
      );
      console.log(
        "[leads:stub] would insert lead",
        JSON.stringify({ tenant_slug: tenant.slug, ...leadInput }),
      );
    } else {
      const { error: insertError } = await admin
        .from("leads")
        .insert({ tenant_id: tenantRow.id, ...leadInput });

      if (insertError) {
        console.error("[leads] insert failed", insertError);
      }
    }
  }

  if (wantsJson(request)) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.redirect(new URL("/thank-you?ok=1", request.url), 303);
}
