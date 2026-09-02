# Tests

Walkthrough of every §9 acceptance test: what it checks, how to run it,
and its current status. Updated as each phase lands — this is not a
retroactive audit, it's maintained alongside the code.

Run the automated suite with:
```bash
npm test
```
See README's "Running the test suite" for the local-Postgres setup
`tests/rls.test.mjs` needs.

---

**1. JS disabled → submit `/sell` form → 303 → lead row exists with
consent + UTM fields; no auto-reply if honeypot filled or
`form_seconds_open` < 3.**
Status: manually verified (Phase 1, repeated in later phases), not yet a
scripted `npm test`. `curl -X POST /api/leads` with a plain
`application/x-www-form-urlencoded` body (no `Accept: application/json`,
matching a no-JS browser) returns `303` to `/thank-you?ok=1`; honeypot
filled or `form_seconds_open < 3` sets `flagged_spam: true` and forces
score 0 (verified against the console stub in this environment; against a
real Supabase project the same fields land in the `leads` row — see
`app/api/leads/route.ts`). The auto-reply gate (`!inserted.flagged_spam`)
is code-reviewable directly in that file.
Gap: no live Resend send was possible in this environment (no API key) —
see test 5.

**2. Anon API key can INSERT a lead and cannot SELECT/UPDATE/DELETE
anything (RLS proof script).**
Status: ✅ automated — `tests/rls.test.mjs` ("anon can INSERT a lead",
"anon SELECT on leads returns zero rows", "anon UPDATE on leads affects
zero rows", "anon has no access to tenants, profiles, or outreach_log").
Also caught a real Postgres behavior worth knowing: RLS enforces the
SELECT policy on `INSERT ... RETURNING` too — see `DECISIONS.md`.

**3. Authenticated user in tenant A sees zero tenant B rows (seed second
tenant in test).**
Status: ✅ automated — `tests/rls.test.mjs` ("authenticated user sees
only their own tenant's leads"), two tenants seeded in the test itself.

**4. probate + asap + phone → score ≥ 80 → HOT column on dashboard.**
Status: ✅ scoring automated — `tests/rls.test.mjs` ("probate + asap +
phone scores >= 80 (HOT)"). Dashboard HOT-column rendering verified
manually (Phase 2): `supabase/seed.sql` loaded against the local test
Postgres produces exactly 3 HOT / 3 WARM / 2 NURTURE, matching hand-
computed weights, and `app/dashboard/page.tsx` buckets by `lead.bucket`
directly from the DB column (no client-side re-computation to drift).

**5. Missing Resend key → console log + outreach_log row, lead still
saved, build does not crash.**
Status: ✅ verified. `lib/resend.ts` returns `{sent: false}` and logs to
console when `RESEND_API_KEY` is absent; the lead insert in
`app/api/leads/route.ts` happens before the email send and doesn't depend
on its result. `npm run build` succeeds with zero Resend/Twilio/Supabase
env vars set (this is this environment's actual state).
Gap: no live Resend send was possible here to compare against — the
"absent key" path is proven, the "present key" path is code-reviewable
but unexercised.

**6. Twilio webhook simulation → lead + exactly one SMS logged; STOP
suppresses future sends.**
Status: verified via `/dev/simulate-missed-call`, which calls the exact
same `lib/missed-call.ts` logic the real webhook does. `/dev/stop-simulator`
logs an inbound STOP against a phone's most recent lead;
`lib/suppression.ts`'s query is code-reviewable and follows the same
`tests/rls.test.mjs` DB-testing pattern used elsewhere, but isn't yet a
scripted `npm test` itself — it depends on the Supabase admin client
(real HTTP calls to a PostgREST endpoint), which this environment can't
run without Docker (see README). Signature verification
(`lib/twilio.ts`'s `verifyTwilioSignature`) is unexercised against a real
Twilio signature for the same reason.

**7. copy-lint passes on all pages; intentionally adding "safe
neighborhood" fails the build.**
Status: ✅ automated both directions — `npm run copy-lint` passes on the
real codebase (CI gate, `.github/workflows/ci.yml`); `tests/copy-lint.test.mjs`
proves the detection logic itself catches "safe neighborhood" (the exact
phrase this test names — an earlier gap where the banned list didn't
actually include it verbatim, found and fixed while writing this test;
see `DECISIONS.md`).

**8. Lighthouse (ci, mobile) ≥ 95 ×4 on `/`, `/sell`, `/build`, `/land`,
`/press`, `/faq`.**
Status: ✅ automated — `lighthouserc.json` + `npx @lhci/cli autorun` in
CI. Re-verified after every phase's changes, not just once: performance
≥0.98, accessibility 1.0, best-practices 0.96, SEO 1.0 on all six pages
as of Phase 3.

**9. `/v/test-slug` returns 200 with noindex meta and is absent from
sitemap.xml + robots-disallowed.**
Status: partially verified. `/v/[slug]` 404s for a slug with no matching
lead (verified: `/v/nonexistent` → `404`) rather than always returning
200 — correct behavior, since a real slug only exists once a lead's video
page has been generated. `robots.ts` disallows `/v/` (verified via
`curl /robots.txt`); `sitemap.ts` never references `/v/` at all (static
route list, code-reviewable). `generateMetadata` in `app/v/[slug]/page.tsx`
sets `robots: {index: false, follow: false}` unconditionally.
Gap: the literal "`/v/test-slug` returns 200" case needs a seeded lead
with `video_slug = 'test-slug'` and a live Supabase connection — not
exercised end-to-end here.

**10. `make-tenant.mjs` scaffolds a new tenant whose pages render with
zero Harbison strings and pass the same Lighthouse gate.**
Status: ❌ not built yet. `scripts/make-tenant.mjs` is Phase 4 scope
(§10). Tracked, not forgotten.

**11. JSON-LD on every public page parses and contains required
`@type`/`sameAs`.**
Status: verified manually (Phase 1): fetched `/sell`'s rendered HTML,
extracted the `<script type="application/ld+json">` block, parsed it with
`json.loads`, confirmed `@type` values
(`Person/Brand/RealEstateAgent/WebSite/BreadcrumbList/Service`) matched
§7.5. `sameAs` renders as an empty array (no confirmed social profile
URLs yet — see `tenants/harbison.ts`), which is valid JSON-LD, not a
failure. Not yet a scripted `npm test`.

**12. `?demo=1` always shows 8 seeded DEMO leads across buckets.**
Status: the 8-lead, 3/3/2-bucket seed data is verified directly against
Postgres (`psql -f supabase/seed.sql` + a `select bucket, count(*) ...`
query, Phase 2) — the numbers are real, not asserted. The
`/dashboard?demo=1` route itself was verified against its "Supabase not
configured" fallback path (returns `200`, renders the expected message)
since this environment has no live Supabase project to query end-to-end.
`lib/leads-query.ts`'s demo-mode filter (`notes->>'demo' is not null`,
hardcoded, not influenced by request input) is code-reviewable.

---

## Summary

| # | Test | Status |
|---|------|--------|
| 1 | No-JS form submit → 303, consent+UTM captured | Manually verified |
| 2 | Anon insert-only RLS | ✅ Automated |
| 3 | Tenant isolation | ✅ Automated |
| 4 | Scoring → HOT bucket | ✅ Automated (scoring); dashboard manually verified |
| 5 | Missing Resend key degrades gracefully | Manually verified |
| 6 | Twilio webhook + STOP suppression | Manually verified (no live Twilio) |
| 7 | copy-lint catches banned phrases | ✅ Automated |
| 8 | Lighthouse ≥95 ×4 on 6 pages | ✅ Automated |
| 9 | `/v/[slug]` noindex + excluded | Partially verified (no live Supabase) |
| 10 | `make-tenant.mjs` | ❌ Phase 4 |
| 11 | JSON-LD validity | Manually verified |
| 12 | `?demo=1` shows 8 leads | Manually verified (no live Supabase) |

The common thread in every "manually verified, not automated" row: this
build environment has no live Supabase/Resend/Twilio credentials and no
Docker, so anything requiring a real PostgREST-backed database connection
or a real third-party API call was proven through its graceful-
degradation path and direct code review instead. **Before trusting this
in production, the operator should run the live-credential half of tests
1, 5, 6, 9, and 12 against a real deployment** — send one real lead
through the form, one real missed call, and check `/dashboard?demo=1`
against the real seeded data.
