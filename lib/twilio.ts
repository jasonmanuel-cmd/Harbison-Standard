import "server-only";
import twilio from "twilio";

function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) return null;
  return twilio(accountSid, authToken);
}

/**
 * Graceful-degradation SMS send, matching §3's rule for Resend/Twilio:
 * when Twilio credentials are absent, logs the would-be text instead of
 * failing. Callers handle outreach_log bookkeeping and suppression
 * checks (§8 STOP handling) — this function only sends.
 */
export async function sendSms(to: string, body: string): Promise<{ sent: boolean; error?: string }> {
  const client = getTwilioClient();
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (!client || !from) {
    console.log("[sms:stub] would send", JSON.stringify({ to, body }));
    return { sent: false };
  }

  try {
    await client.messages.create({ to, from, body });
    return { sent: true };
  } catch (err) {
    console.error("[sms] send failed", err);
    return { sent: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Verifies the `X-Twilio-Signature` header on an inbound webhook request
 * (§8: webhooks must be authenticated, not just trusted by URL secrecy).
 * Returns false — never throws — when TWILIO_AUTH_TOKEN isn't configured,
 * since there's nothing to verify against; callers in that state are
 * expected to be the /dev/* simulators only, which don't call this.
 */
export function verifyTwilioSignature(
  signature: string | null,
  url: string,
  params: Record<string, string>,
): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken || !signature) return false;
  return twilio.validateRequest(authToken, signature, url, params);
}
