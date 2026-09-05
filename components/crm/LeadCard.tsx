import Link from "next/link";
import type { LeadRow } from "@/lib/supabase/types";
import { relativeAge, SOURCE_LABELS } from "@/lib/format";
import { PillarBadge } from "./PillarBadge";

export function LeadCard({ lead, demo }: { lead: LeadRow; demo: boolean }) {
  const isDemo = Boolean((lead.notes as { demo?: unknown })?.demo);
  const href = `/leads/${lead.id}${demo ? "?demo=1" : ""}`;

  return (
    <div className="border border-navy/10 bg-white p-4">
      <Link href={href} className="block hover:opacity-80">
        <div className="flex items-start justify-between gap-2">
          <p className="font-serif text-lg text-navy">{lead.name}</p>
          <p className="font-serif text-lg text-navy">{lead.score}</p>
        </div>
        <p className="mt-1 text-sm text-navy/70">{lead.property_address ?? "Address unknown"}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-navy/60">
          <PillarBadge pillar={lead.intent_pillar} />
          <span>{SOURCE_LABELS[lead.source] ?? lead.source}</span>
          <span>{relativeAge(lead.created_at)}</span>
          {isDemo && (
            <span className="border border-brass px-1.5 py-0.5 font-semibold uppercase tracking-wide text-brass">
              Demo
            </span>
          )}
        </div>
      </Link>

      <div className="mt-3 flex gap-4 text-sm">
        <a href={`tel:${lead.phone}`} className="text-navy underline decoration-brass">
          Call
        </a>
        {lead.email && (
          <a href={`mailto:${lead.email}`} className="text-navy underline decoration-brass">
            Email
          </a>
        )}
        <Link href={href} className="ml-auto text-navy/60 underline decoration-navy/30">
          Details →
        </Link>
      </div>
    </div>
  );
}
