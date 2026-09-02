import "server-only";

// Twilio isn't wired up yet — by operator request, the missed-call
// text-back feature (§7.4) ships as a working example against mock
// data: real lead creation, real STOP-suppression logic
// (lib/suppression.ts), real outreach_log rows — only the actual SMS
// send is mocked out. When a Twilio account exists, re-introduce the
// `twilio` npm package and swap the body of sendSms() for a real
// `client.messages.create(...)` call (see git history — this file
// carried that implementation before this simplification, plus
// `verifyTwilioSignature()` for authenticating inbound webhooks). See
// DECISIONS.md.

/**
 * Always logs the would-be text instead of sending one. Callers handle
 * outreach_log bookkeeping and suppression checks (§8 STOP handling) —
 * this function only "sends."
 */
export async function sendSms(to: string, body: string): Promise<{ sent: boolean }> {
  console.log("[sms:mock] would send", JSON.stringify({ to, body }));
  return { sent: false };
}
