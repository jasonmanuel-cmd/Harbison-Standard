import type { Pillar } from "@/tenants/types";

// Canonical option lists matching the `leads.situation` and
// `leads.timeline` check constraints in supabase/migrations (§5). Shared
// across all tenants — this is schema-tied business logic, not brand
// copy, so it does not live in tenants/*.ts.

export interface SituationOption {
  value: string;
  label: string;
  pillar: Pillar;
  group: "Sell" | "Build" | "Land";
}

export const SITUATION_OPTIONS: SituationOption[] = [
  { value: "sell-probate", label: "Probate sale", pillar: "flip", group: "Sell" },
  { value: "sell-inherited", label: "Inherited property", pillar: "flip", group: "Sell" },
  { value: "sell-nod", label: "Notice of default", pillar: "flip", group: "Sell" },
  { value: "sell-landlord", label: "Tired landlord / tenant-occupied", pillar: "flip", group: "Sell" },
  { value: "build", label: "Interested in a new spec home", pillar: "build", group: "Build" },
  { value: "update", label: "Renovating before selling", pillar: "update", group: "Build" },
  { value: "land", label: "I own land or a lot", pillar: "invest", group: "Land" },
  { value: "invest", label: "Investment property evaluation", pillar: "invest", group: "Land" },
];

export const TIMELINE_OPTIONS: { value: string; label: string }[] = [
  { value: "asap", label: "As soon as possible" },
  { value: "1-3months", label: "1–3 months" },
  { value: "3plus", label: "3+ months / just exploring" },
];

// Exact TCPA consent copy from §7.2. Do not edit without legal review —
// this string is stored verbatim per submission (leads.consent_text).
export const CONSENT_TEXT =
  "I agree to be contacted by call, text, or email about my property, including by automated systems. Consent is not a condition of any purchase. Message/data rates may apply. Reply STOP to opt out at any time.";

// Hidden field names the route handler (app/api/leads/route.ts) expects.
export const HONEYPOT_FIELD = "company";
export const TIME_TRAP_FIELD = "opened_at";
