import { redirect } from "next/navigation";
import { getTenant } from "@/tenants";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const RESULT_LABELS: Record<string, string> = {
  "not-configured": "Supabase isn't configured — nothing was saved. See README.md.",
  "no-lead": "No lead on file with that phone number yet — send a missed-call text first.",
  ok: "Logged an inbound STOP for that phone number. Future automated sends to it will be suppressed.",
};

export default async function StopSimulatorPage({
  searchParams,
}: {
  searchParams: Promise<{ result?: string }>;
}) {
  const { result } = await searchParams;

  async function simulateStop(formData: FormData) {
    "use server";
    const phone = String(formData.get("phone") ?? "").trim();
    if (!phone) redirect("/dev/stop-simulator");

    const tenant = getTenant();
    const admin = getSupabaseAdmin();
    if (!admin) redirect("/dev/stop-simulator?result=not-configured");

    const { data: tenantRow } = await admin.from("tenants").select("id").eq("slug", tenant.slug).single();
    if (!tenantRow) redirect("/dev/stop-simulator?result=not-configured");

    const { data: lead } = await admin
      .from("leads")
      .select("id")
      .eq("tenant_id", tenantRow!.id)
      .eq("phone", phone)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!lead) redirect("/dev/stop-simulator?result=no-lead");

    await admin.from("outreach_log").insert({
      tenant_id: tenantRow!.id,
      lead_id: lead!.id,
      channel: "text",
      direction: "in",
      body: "STOP",
      ai_generated: false,
      disclosed_ai: false,
      outcome: "STOP",
    });

    redirect("/dev/stop-simulator?result=ok");
  }

  return (
    <div className="min-h-screen bg-paper px-6 py-12">
      <div className="mx-auto max-w-xl">
        <h1 className="font-serif text-2xl text-navy">Simulate a STOP reply</h1>
        <p className="mt-2 text-sm text-navy/60">
          Twilio isn&rsquo;t connected yet (see /dev/simulate-missed-call).
          This logs a real inbound STOP against a phone number&rsquo;s
          most recent lead so you can confirm suppression actually holds
          on the next simulated missed call — the same
          <code className="mx-1">lib/suppression.ts</code>
          check that will run against real inbound texts once Twilio is
          connected. In production, Twilio&rsquo;s own Advanced Opt-Out
          also intercepts real STOP replies before they reach this app;
          this check is defense in depth, not the only line of defense.
        </p>

        <form action={simulateStop} className="mt-6 flex gap-3">
          <input
            type="tel"
            name="phone"
            required
            placeholder="+16615550101"
            className="flex-1 border border-navy/30 bg-white px-4 py-3 text-navy"
          />
          <button
            type="submit"
            className="bg-brass px-4 py-3 text-sm font-semibold uppercase tracking-wide text-navy-deep"
          >
            Simulate STOP
          </button>
        </form>
        {result && (
          <p className="mt-4 border border-navy/20 bg-white p-4 text-sm text-navy">
            {RESULT_LABELS[result] ?? result}
          </p>
        )}
      </div>
    </div>
  );
}
