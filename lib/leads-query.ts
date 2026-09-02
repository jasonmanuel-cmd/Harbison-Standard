import { getTenant } from "@/tenants";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { LeadRow, OutreachLogRow } from "@/lib/supabase/types";
import type { ScoringWeights } from "@/lib/scoring-breakdown";

export interface LeadFilters {
  search?: string;
  status?: string;
  source?: string;
  pillar?: string;
}

/**
 * Resolves which Supabase client + tenant scoping to use for a CRM read.
 *
 * Demo mode (`?demo=1`) deliberately does NOT require login (see
 * DECISIONS.md) — but it also can never see real lead data: it always
 * goes through the admin client with a hardcoded filter to rows carrying
 * the `notes->>'demo'` marker that only supabase/seed.sql ever sets.
 * Nothing about the request (query params, filters, anything
 * user-supplied) can widen that filter, so demo mode is safe to leave
 * reachable without auth.
 *
 * Non-demo mode always goes through the cookie-bound server client, so
 * every query is scoped by RLS to the signed-in agent's own tenant —
 * this function never bypasses that.
 */
async function resolveClientAndTenant(demo: boolean) {
  if (demo) {
    const admin = getSupabaseAdmin();
    if (!admin) return { client: null, tenantId: null, isDemo: true as const };
    const tenant = getTenant();
    const { data: tenantRow } = await admin.from("tenants").select("id").eq("slug", tenant.slug).single();
    return { client: admin, tenantId: tenantRow?.id ?? null, isDemo: true as const };
  }

  const client = await getSupabaseServerClient();
  return { client, tenantId: null, isDemo: false as const };
}

export async function fetchLeadList(opts: { demo: boolean; filters: LeadFilters }) {
  const { client, tenantId, isDemo } = await resolveClientAndTenant(opts.demo);
  if (!client) return { leads: [] as LeadRow[], configured: false };

  let query = client.from("leads").select("*").order("score", { ascending: false });

  if (isDemo) {
    if (!tenantId) return { leads: [] as LeadRow[], configured: true };
    query = query.eq("tenant_id", tenantId).not("notes->>demo", "is", null);
  }

  const { search, status, source, pillar } = opts.filters;
  if (search) {
    query = query.or(`name.ilike.%${search}%,property_address.ilike.%${search}%`);
  }
  if (status) query = query.eq("status", status);
  if (source) query = query.eq("source", source);
  if (pillar) query = query.eq("intent_pillar", pillar);

  const { data, error } = await query;
  if (error) {
    console.error("[dashboard] fetchLeadList failed", error);
    return { leads: [] as LeadRow[], configured: true };
  }

  return { leads: (data ?? []) as LeadRow[], configured: true };
}

export async function fetchLeadDetail(id: string, opts: { demo: boolean }) {
  const { client, tenantId, isDemo } = await resolveClientAndTenant(opts.demo);
  if (!client) return { lead: null, outreach: [] as OutreachLogRow[], weights: null, configured: false };

  let leadQuery = client.from("leads").select("*").eq("id", id);
  if (isDemo) {
    if (!tenantId) return { lead: null, outreach: [], weights: null, configured: true };
    leadQuery = leadQuery.eq("tenant_id", tenantId).not("notes->>demo", "is", null);
  }

  const { data: lead, error } = await leadQuery.maybeSingle();
  if (error || !lead) {
    if (error) console.error("[leads/[id]] fetch failed", error);
    return { lead: null, outreach: [], weights: null, configured: true };
  }

  const { data: outreach } = await client
    .from("outreach_log")
    .select("*")
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  const { data: tenantRow } = await client
    .from("tenants")
    .select("config")
    .eq("id", (lead as LeadRow).tenant_id)
    .maybeSingle();

  const weights =
    ((tenantRow?.config as { scoring?: ScoringWeights } | undefined)?.scoring) ?? null;

  return {
    lead: lead as LeadRow,
    outreach: (outreach ?? []) as OutreachLogRow[],
    weights,
    configured: true,
  };
}
