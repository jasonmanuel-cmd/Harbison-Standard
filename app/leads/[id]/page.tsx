import { notFound } from "next/navigation";
import { getTenant } from "@/tenants";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { PillarBadge } from "@/components/crm/PillarBadge";
import { fetchLeadDetail } from "@/lib/leads-query";
import { scoreBreakdown } from "@/lib/scoring-breakdown";
import { relativeAge, SOURCE_LABELS, STATUS_LABELS } from "@/lib/format";
import {
  updateLeadStatus,
  updateLeadNotes,
  generateVideoPage,
  updateLeadVideoUrl,
  sendNurtureCheckIn,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ demo?: string }>;
}) {
  const tenant = getTenant();
  const { id } = await params;
  const { demo: demoParam } = await searchParams;
  const demo = demoParam === "1";

  const { lead, outreach, weights, configured } = await fetchLeadDetail(id, { demo });

  if (!configured) {
    return (
      <div className="min-h-screen bg-paper">
        <CrmHeader tenant={tenant} demo={demo} />
        <div className="mx-auto max-w-3xl px-6 py-8">
          <p className="border border-navy/20 bg-parchment p-4 text-sm text-navy">
            The CRM isn&rsquo;t connected to a database yet. See README.md for Supabase setup.
          </p>
        </div>
      </div>
    );
  }

  if (!lead) {
    notFound();
  }

  const breakdown = scoreBreakdown(lead, weights ?? tenant.scoring);
  const isDemoLead = Boolean((lead.notes as { demo?: unknown } | null)?.demo);
  const agentNotes = (lead.notes as { agent_notes?: string } | null)?.agent_notes ?? "";
  const readOnly = demo;

  async function submitStatus(formData: FormData) {
    "use server";
    if (readOnly) return;
    await updateLeadStatus(id, String(formData.get("status") ?? ""));
  }

  async function submitNotes(formData: FormData) {
    "use server";
    if (readOnly) return;
    await updateLeadNotes(id, String(formData.get("agent_notes") ?? ""));
  }

  async function submitGenerateVideo() {
    "use server";
    if (readOnly) return;
    await generateVideoPage(id);
  }

  async function submitVideoUrl(formData: FormData) {
    "use server";
    if (readOnly) return;
    await updateLeadVideoUrl(id, String(formData.get("video_url") ?? ""));
  }

  async function submitNurtureCheckIn() {
    "use server";
    if (readOnly) return;
    await sendNurtureCheckIn(id);
  }

  return (
    <div className="min-h-screen bg-paper">
      <CrmHeader tenant={tenant} demo={demo} />

      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl text-navy">{lead.name}</h1>
            <p className="mt-1 text-navy/70">{lead.property_address ?? "Address unknown"}</p>
          </div>
          <div className="text-right">
            <p className="font-serif text-3xl text-navy">{lead.score}</p>
            <p className="text-xs uppercase text-navy/50">{lead.bucket}</p>
          </div>
        </div>

        {isDemoLead && (
          <span className="mt-3 inline-block border border-brass px-2 py-1 text-xs font-semibold uppercase tracking-wide text-brass">
            Demo lead
          </span>
        )}

        <div className="mt-6 flex flex-wrap gap-4">
          <a
            href={`tel:${lead.phone}`}
            className="bg-brass px-4 py-2 text-sm font-semibold uppercase tracking-wide text-navy-deep"
          >
            Call {lead.phone}
          </a>
          {lead.email && (
            <a
              href={`mailto:${lead.email}`}
              className="border border-navy/30 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-navy"
            >
              Email
            </a>
          )}
        </div>

        <section className="mt-10">
          <h2 className="font-serif text-xl text-navy">Details</h2>
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <dt className="text-navy/50">Situation</dt>
            <dd className="text-navy">{lead.situation ?? "—"}</dd>
            <dt className="text-navy/50">Timeline</dt>
            <dd className="text-navy">{lead.timeline ?? "—"}</dd>
            <dt className="text-navy/50">Pillar</dt>
            <dd><PillarBadge pillar={lead.intent_pillar} /></dd>
            <dt className="text-navy/50">Source</dt>
            <dd className="text-navy">{SOURCE_LABELS[lead.source] ?? lead.source}</dd>
            <dt className="text-navy/50">Received</dt>
            <dd className="text-navy">{relativeAge(lead.created_at)}</dd>
            <dt className="text-navy/50">City</dt>
            <dd className="text-navy">{lead.city ?? "—"}</dd>
          </dl>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-xl text-navy">Score breakdown</h2>
          <ul className="mt-4 space-y-1 text-sm">
            {breakdown.map((line) => (
              <li key={line.label} className="flex justify-between border-b border-navy/10 py-1">
                <span className="text-navy/70">{line.label}</span>
                <span className="text-navy">+{line.points}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-xl text-navy">Status</h2>
          <form action={submitStatus} className="mt-3 flex flex-wrap items-center gap-3">
            <select
              name="status"
              defaultValue={lead.status}
              disabled={readOnly}
              className="border border-navy/30 bg-white px-3 py-2 text-sm text-navy disabled:opacity-60"
            >
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {!readOnly && (
              <button
                type="submit"
                className="border border-navy/30 bg-white px-4 py-2 text-sm font-semibold text-navy"
              >
                Update
              </button>
            )}
          </form>
          {readOnly && (
            <p className="mt-2 text-xs text-navy/50">Read-only in demo mode.</p>
          )}
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-xl text-navy">Outreach timeline</h2>
          <div className="mt-4 space-y-3">
            {outreach.length === 0 && (
              <p className="text-sm text-navy/40">No outreach logged yet.</p>
            )}
            {outreach.map((entry) => (
              <div key={entry.id} className="border border-navy/10 bg-white p-4 text-sm">
                <div className="flex justify-between text-navy/50">
                  <span className="uppercase">
                    {entry.channel} · {entry.direction}
                    {entry.ai_generated ? " · automated" : ""}
                  </span>
                  <span>{relativeAge(entry.created_at)}</span>
                </div>
                {entry.body && <p className="mt-2 text-navy">{entry.body}</p>}
                {entry.outcome && (
                  <p className="mt-1 text-xs text-navy/50">Outcome: {entry.outcome}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-xl text-navy">Notes</h2>
          <form action={submitNotes} className="mt-3">
            <textarea
              name="agent_notes"
              defaultValue={agentNotes}
              disabled={readOnly}
              rows={4}
              className="w-full border border-navy/30 bg-white px-3 py-2 text-sm text-navy disabled:opacity-60"
            />
            {!readOnly && (
              <button
                type="submit"
                className="mt-2 border border-navy/30 bg-white px-4 py-2 text-sm font-semibold text-navy"
              >
                Save notes
              </button>
            )}
          </form>
        </section>

        {lead.bucket === "nurture" && (
          <section className="mt-10">
            <h2 className="font-serif text-xl text-navy">Monthly check-in</h2>
            <p className="mt-1 text-sm text-navy/60">
              Draft-only, sent manually — no automated sequence (§7.4 v1).
            </p>
            {lead.email ? (
              !readOnly && (
                <form action={submitNurtureCheckIn} className="mt-3">
                  <button
                    type="submit"
                    className="border border-navy/30 bg-white px-4 py-2 text-sm font-semibold text-navy"
                  >
                    Send check-in email
                  </button>
                </form>
              )
            ) : (
              <p className="mt-3 text-xs text-navy/50">No email on file — can&rsquo;t send.</p>
            )}
          </section>
        )}

        <section className="mt-10">
          <h2 className="font-serif text-xl text-navy">Video page</h2>
          {lead.video_slug ? (
            <div className="mt-3 space-y-3">
              <p className="text-sm text-navy">
                <a
                  href={`/v/${lead.video_slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-brass"
                >
                  {tenant.siteUrl}/v/{lead.video_slug}
                </a>
              </p>
              {!readOnly && (
                <form action={submitVideoUrl} className="flex flex-wrap gap-3">
                  <input
                    type="text"
                    name="video_url"
                    defaultValue={lead.video_url ?? ""}
                    placeholder="YouTube URL or /media/hero.mp4"
                    className="min-w-64 flex-1 border border-navy/30 bg-white px-3 py-2 text-sm text-navy"
                  />
                  <button
                    type="submit"
                    className="border border-navy/30 bg-white px-4 py-2 text-sm font-semibold text-navy"
                  >
                    Update video URL
                  </button>
                </form>
              )}
            </div>
          ) : readOnly ? (
            <p className="mt-3 text-xs text-navy/50">No video page generated yet.</p>
          ) : (
            <form action={submitGenerateVideo}>
              <button
                type="submit"
                className="mt-3 border border-navy/30 bg-white px-4 py-2 text-sm font-semibold text-navy"
              >
                Generate video page
              </button>
              <p className="mt-2 text-xs text-navy/50">
                Creates a shareable link with the tenant&rsquo;s default
                video — paste a real recorded video URL afterward if you
                have one.
              </p>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
