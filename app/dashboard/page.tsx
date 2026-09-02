import { getTenant } from "@/tenants";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { LeadCard } from "@/components/crm/LeadCard";
import { fetchLeadList } from "@/lib/leads-query";
import { SOURCE_LABELS, STATUS_LABELS } from "@/lib/format";
import type { LeadRow } from "@/lib/supabase/types";

// The 3-column HOT/WARM/NURTURE board (§7.3). Deliberately plain: a
// search box, three filter dropdowns, three columns of cards. Nothing
// else on the screen — this is the view a non-technical agent lives in
// every day, so it stays boring on purpose.
export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    demo?: string;
    search?: string;
    status?: string;
    source?: string;
    pillar?: string;
  }>;
}) {
  const tenant = getTenant();
  const params = await searchParams;
  const demo = params.demo === "1";

  const { leads, configured } = await fetchLeadList({
    demo,
    filters: {
      search: params.search,
      status: params.status,
      source: params.source,
      pillar: params.pillar,
    },
  });

  const columns: { key: LeadRow["bucket"]; label: string }[] = [
    { key: "hot", label: "HOT" },
    { key: "warm", label: "WARM" },
    { key: "nurture", label: "NURTURE" },
  ];

  return (
    <div className="min-h-screen bg-paper">
      <CrmHeader tenant={tenant} demo={demo} />

      <div className="mx-auto max-w-6xl px-6 py-8">
        {!configured && (
          <p className="mb-6 border border-navy/20 bg-parchment p-4 text-sm text-navy">
            The CRM isn&rsquo;t connected to a database yet. See README.md
            for Supabase setup.
          </p>
        )}

        <form method="GET" className="mb-8 flex flex-wrap items-end gap-4">
          {demo && <input type="hidden" name="demo" value="1" />}
          <div>
            <label htmlFor="search" className="block text-xs font-semibold uppercase text-navy/60">
              Search
            </label>
            <input
              type="text"
              id="search"
              name="search"
              defaultValue={params.search ?? ""}
              placeholder="Name or address"
              className="mt-1 border border-navy/30 bg-white px-3 py-2 text-sm text-navy"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-xs font-semibold uppercase text-navy/60">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={params.status ?? ""}
              className="mt-1 border border-navy/30 bg-white px-3 py-2 text-sm text-navy"
            >
              <option value="">All</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="source" className="block text-xs font-semibold uppercase text-navy/60">
              Source
            </label>
            <select
              id="source"
              name="source"
              defaultValue={params.source ?? ""}
              className="mt-1 border border-navy/30 bg-white px-3 py-2 text-sm text-navy"
            >
              <option value="">All</option>
              {Object.entries(SOURCE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="pillar" className="block text-xs font-semibold uppercase text-navy/60">
              Pillar
            </label>
            <select
              id="pillar"
              name="pillar"
              defaultValue={params.pillar ?? ""}
              className="mt-1 border border-navy/30 bg-white px-3 py-2 text-sm text-navy"
            >
              <option value="">All</option>
              <option value="build">Build</option>
              <option value="update">Update</option>
              <option value="invest">Invest</option>
              <option value="flip">Flip</option>
            </select>
          </div>
          <button
            type="submit"
            className="border border-navy/30 bg-white px-4 py-2 text-sm font-semibold text-navy"
          >
            Filter
          </button>
        </form>

        <div className="grid gap-6 md:grid-cols-3">
          {columns.map((column) => {
            const columnLeads = leads.filter((lead) => lead.bucket === column.key);
            return (
              <div key={column.key}>
                <h2 className="mb-3 font-serif text-lg text-navy">
                  {column.label}{" "}
                  <span className="text-sm text-navy/50">({columnLeads.length})</span>
                </h2>
                <div className="space-y-3">
                  {columnLeads.map((lead) => (
                    <LeadCard key={lead.id} lead={lead} demo={demo} />
                  ))}
                  {columnLeads.length === 0 && (
                    <p className="text-sm text-navy/40">No leads here.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
