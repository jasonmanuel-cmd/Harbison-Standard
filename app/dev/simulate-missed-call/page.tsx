import { redirect } from "next/navigation";
import { handleMissedCall, type MissedCallResult } from "@/lib/missed-call";

export const dynamic = "force-dynamic";

const RESULT_LABELS: Record<MissedCallResult["status"], string> = {
  "not-configured": "Supabase isn't configured — nothing was saved. See README.md.",
  "no-tenant-row": "No tenant row found for this slug — provision one first (see README.md).",
  "lead-create-failed": "Lead creation failed — check server logs.",
  suppressed: "Lead created. Text suppressed — this phone number has a prior STOP on file.",
  sent: "Lead created and the text was sent via Twilio.",
  "stub-logged": "Lead created. The text was logged to the console (mock — see below).",
};

export default async function SimulateMissedCallPage({
  searchParams,
}: {
  searchParams: Promise<{ result?: string }>;
}) {
  const { result } = await searchParams;

  async function simulate(formData: FormData) {
    "use server";
    const phone = String(formData.get("phone") ?? "").trim();
    if (!phone) redirect("/dev/simulate-missed-call");
    const outcome = await handleMissedCall(phone);
    redirect(`/dev/simulate-missed-call?result=${outcome.status}`);
  }

  return (
    <div className="min-h-screen bg-paper px-6 py-12">
      <div className="mx-auto max-w-xl">
        <h1 className="font-serif text-2xl text-navy">Simulate a missed call</h1>
        <p className="mt-2 text-sm text-navy/60">
          Twilio isn&rsquo;t connected yet — this is a working example of
          the missed-call flow (§7.4) against mock data. The lead gets
          created for real (if Supabase is configured) and the
          text-back logic runs exactly as it would with Twilio; only the
          actual SMS send is mocked, logged to the server console instead
          of sent. Add a Twilio account later and this becomes live with
          no changes to this page.
        </p>

        <form action={simulate} className="mt-6 flex gap-3">
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
            Simulate
          </button>
        </form>
        {result && (
          <p className="mt-4 border border-navy/20 bg-white p-4 text-sm text-navy">
            {RESULT_LABELS[result as MissedCallResult["status"]] ?? result}
          </p>
        )}
      </div>
    </div>
  );
}
