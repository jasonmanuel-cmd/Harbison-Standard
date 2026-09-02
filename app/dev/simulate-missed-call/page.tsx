import { redirect } from "next/navigation";
import { handleMissedCall, type MissedCallResult } from "@/lib/missed-call";

export const dynamic = "force-dynamic";

function twilioConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER,
  );
}

const RESULT_LABELS: Record<MissedCallResult["status"], string> = {
  "not-configured": "Supabase isn't configured — nothing was saved. See README.md.",
  "no-tenant-row": "No tenant row found for this slug — provision one first (see README.md).",
  "lead-create-failed": "Lead creation failed — check server logs.",
  suppressed: "Lead created. Text suppressed — this phone number has a prior STOP on file.",
  sent: "Lead created and the text was sent via Twilio.",
  "stub-logged": "Lead created. Twilio isn't configured, so the text was only logged to the console.",
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
          Dev-only tool (§7.4): exercises the same lead-creation and
          text-back logic as the real Twilio webhook, without needing a
          real phone call.
        </p>

        {twilioConfigured() ? (
          <p className="mt-6 border border-navy/20 bg-parchment p-4 text-sm text-navy">
            Twilio is configured on this deployment — this simulator is
            disabled so it can&rsquo;t create fake leads or send real
            texts by mistake. Place a real test call and let it go to
            voicemail instead.
          </p>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
