import { NextResponse } from "next/server";
import { verifyTwilioSignature } from "@/lib/twilio";
import { handleMissedCall } from "@/lib/missed-call";

// Missed-call text-back (§7.4): Twilio's voice status callback POSTs
// here on every call-status change. Only `CallStatus=no-answer` does
// anything; everything else gets a 200 no-op (Twilio expects 200
// regardless of whether the status mattered to us).
//
// Signature verification (§8) runs whenever TWILIO_AUTH_TOKEN is set —
// real Twilio requests always carry a valid X-Twilio-Signature, so this
// only ever rejects spoofed requests, never legitimate ones. When the
// token isn't set (mock/dev mode, e.g. /dev/simulate-missed-call),
// verification is skipped by design — there's nothing to verify against,
// and that's exactly the state "mock mode without Twilio creds" means.
//
// Core logic (create the lead, check STOP suppression, send exactly one
// text) lives in lib/missed-call.ts, shared with the dev simulator.
export async function POST(request: Request) {
  const rawBody = await request.text();
  const params = new URLSearchParams(rawBody);
  const fields = Object.fromEntries(params.entries());

  if (process.env.TWILIO_AUTH_TOKEN) {
    const signature = request.headers.get("x-twilio-signature");
    if (!verifyTwilioSignature(signature, request.url, fields)) {
      console.error("[webhooks/twilio] signature verification failed");
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  if (fields.CallStatus !== "no-answer" || !fields.From) {
    return new NextResponse("", { status: 200 });
  }

  await handleMissedCall(fields.From);

  return new NextResponse("", { status: 200 });
}
