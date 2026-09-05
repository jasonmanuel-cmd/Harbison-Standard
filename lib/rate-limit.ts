// In-memory per-IP rate limiter: 5 requests/hour, per §7.2.
//
// Phase 1 stub only. This is process-local state — it resets on cold
// start and does not share state across serverless instances. Once
// Supabase lands (Phase 2), replace this with a query against `leads`
// (count rows with the same ip in the last hour) so the limit is durable
// and correct under horizontal scaling. Tracked here rather than silently
// left as a "real" implementation — see DECISIONS.md.

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

const hits = new Map<string, number[]>();

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_PER_WINDOW) {
    hits.set(ip, timestamps);
    return true;
  }

  timestamps.push(now);
  hits.set(ip, timestamps);
  return false;
}
