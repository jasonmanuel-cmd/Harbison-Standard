import { NextResponse } from "next/server";
import { handleMissedCall } from "@/lib/missed-call";

// Missed-call text-back (§7.4): this is where Twilio's voice status
// callback would POST on every call-status change, once a Twilio
// account exists. Twilio isn't wired up yet (mocked by operator request
// — see DECISIONS.md and lib/twilio.ts), so this route currently only
// ever receives traffic from /dev/simulate-missed-call, which posts the
// same shape of form data a real Twilio callback would.
//
// Only `CallStatus=no-answer` does anything; everything else gets a 200
// no-op (a real Twilio callback expects 200 regardless of whether the
// status mattered to us).
//
// NOT YET DONE, for when a Twilio account exists: verify the
// `X-Twilio-Signature` header (§8 requires webhooks be authenticated,
// not just trusted by URL secrecy) before trusting `fields` below — see
// the git history for this file's previous `verifyTwilioSignature` call.
//
// Core logic (create the lead, check STOP suppression, send exactly one
// text) lives in lib/missed-call.ts, shared with the dev simulator.
export async function POST(request: Request) {
  const rawBody = await request.text();
  const params = new URLSearchParams(rawBody);
  const fields = Object.fromEntries(params.entries());

  if (fields.CallStatus !== "no-answer" || !fields.From) {
    return new NextResponse("", { status: 200 });
  }

  await handleMissedCall(fields.From);

  return new NextResponse("", { status: 200 });
}
