// Display-only re-derivation of how fn_score_lead() (§5, in
// supabase/migrations) arrived at a lead's score. NEVER used to compute
// or write a score — the Postgres trigger is the single source of truth
// for that. This exists purely so the lead-detail screen can show "why"
// a lead scored the way it did. Keep this in sync with the trigger's SQL
// by hand — same duplication tradeoff already accepted for
// leads.intent_pillar vs. lib/situations.ts, see DECISIONS.md.

export interface ScoringWeights {
  situationHigh: number;
  situationMid: number;
  situationPillar: number;
  timelineAsap: number;
  timelineSoon: number;
  hasPhone: number;
  engagementThresholdSeconds: number;
  engagementBonus: number;
  minFormSeconds: number;
}

export interface ScoreBreakdownLine {
  label: string;
  points: number;
}

const SITUATION_HIGH = new Set(["sell-probate", "sell-inherited", "sell-nod"]);
const SITUATION_MID = new Set(["land", "sell-landlord"]);
const SITUATION_PILLAR = new Set(["build", "invest"]);

export function scoreBreakdown(
  lead: {
    situation: string;
    timeline: string | null;
    phone: string;
    form_seconds_open: number | null;
    flagged_spam: boolean;
  },
  weights: ScoringWeights,
): ScoreBreakdownLine[] {
  if (lead.flagged_spam) {
    return [{ label: "Flagged as spam (honeypot or filled too fast)", points: 0 }];
  }

  const lines: ScoreBreakdownLine[] = [];

  if (SITUATION_HIGH.has(lead.situation)) {
    lines.push({ label: `Situation: ${lead.situation}`, points: weights.situationHigh });
  } else if (SITUATION_MID.has(lead.situation)) {
    lines.push({ label: `Situation: ${lead.situation}`, points: weights.situationMid });
  } else if (SITUATION_PILLAR.has(lead.situation)) {
    lines.push({ label: `Situation: ${lead.situation}`, points: weights.situationPillar });
  } else {
    lines.push({ label: `Situation: ${lead.situation}`, points: 0 });
  }

  if (lead.timeline === "asap") {
    lines.push({ label: "Timeline: ASAP", points: weights.timelineAsap });
  } else if (lead.timeline === "1-3months") {
    lines.push({ label: "Timeline: 1-3 months", points: weights.timelineSoon });
  }

  if (lead.phone && lead.phone.trim().length > 0) {
    lines.push({ label: "Provided a phone number", points: weights.hasPhone });
  }

  if (
    lead.form_seconds_open !== null &&
    lead.form_seconds_open >= weights.engagementThresholdSeconds
  ) {
    lines.push({
      label: `Spent ${weights.engagementThresholdSeconds}+ seconds on the form`,
      points: weights.engagementBonus,
    });
  }

  return lines;
}
