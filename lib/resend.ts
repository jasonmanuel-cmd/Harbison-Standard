import "server-only";
import { Resend } from "resend";

let cachedClient: Resend | null = null;

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!cachedClient) cachedClient = new Resend(apiKey);
  return cachedClient;
}

export interface SendEmailInput {
  to: string;
  from: string;
  subject: string;
  text: string;
  /** Omit for the plain-text-only first-touch auto-reply (§3 deliverability rule). */
  html?: string;
}

/**
 * Graceful-degradation email send, matching §3's rule for Resend/Twilio:
 * when RESEND_API_KEY is absent, logs the would-be email to console
 * instead of failing. Callers decide whether/how to record the attempt
 * in outreach_log — this function only ever sends (or logs) the email
 * itself, since not every email (e.g. the morning briefing, sent to the
 * agent, not a lead) has a lead_id to log against.
 */
export async function sendEmail(input: SendEmailInput): Promise<{ sent: boolean; error?: string }> {
  const resend = getResendClient();

  if (!resend) {
    console.log("[email:stub] would send", JSON.stringify(input));
    return { sent: false };
  }

  const { error } = await resend.emails.send({
    from: input.from,
    to: input.to,
    subject: input.subject,
    text: input.text,
    ...(input.html ? { html: input.html } : {}),
  });

  if (error) {
    console.error("[email] send failed", error);
    return { sent: false, error: error.message };
  }

  return { sent: true };
}
