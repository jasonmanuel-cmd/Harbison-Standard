# Decisions

Judgment calls made where the spec was silent or ambiguous, newest first.
Each entry: what was decided, why, and what would change it.

## Post-Phase-3 (operator-supplied competitive audit: what got fixed, what didn't)

An operator-supplied third-party site audit (comparing this site to
tollbrothers.com) flagged real, verifiable issues alongside strategic
suggestions and some fabricated specifics. Handled as two different
categories, not one blanket "implement the report":

**Verified against the actual code and fixed** (all real, all zero-risk —
no business decision or invented data required):
- `[mark: verify with counsel]` was shipping in two public FAQ answers
  (and therefore in the FAQPage JSON-LD Google reads) — an internal
  scaffolding note that was never meant to ship. The `verifyWithCounsel`
  flag already existed on `FaqEntry` for exactly this case (renders "confirm
  specifics with an attorney" via `app/faq/page.tsx`) but wasn't set on
  either entry — set it, removed the bracket text from the answer strings.
- Every public page shared the homepage's `<title>`/description (root
  `layout.tsx` was the only file with a `metadata` export besides
  `/v/[slug]`) — added `lib/metadata.ts` (`buildMetadata()`) and a real,
  content-grounded title/description/canonical/OG/Twitter block per page.
  Canonical URLs read `tenant.siteUrl`, so they're correct the moment
  `NEXT_PUBLIC_SITE_URL` is set to a real domain — no hardcoding.
- No favicon and no OG/Twitter image existed anywhere. Added
  `app/icon.tsx` (generated PNG from the same benchmark-mark SVG already
  used as the brand watermark — its own comment already said "used as
  favicon source") and `app/opengraph-image.tsx` (site-wide default,
  same navy/brass frame as the existing `/v/[slug]` one). Both via
  `next/og`'s `ImageResponse`, no new dependency.
- No security headers. Added the four that are genuinely zero-config-risk
  (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`) via `next.config.js`. Deliberately did **not** add
  a Content-Security-Policy — LeadForm ships an inline script
  (`dangerouslySetInnerHTML`) and `next/image`/`next/og` both need real
  allowlisting; a CSP bolted on without testing it against every page risks
  silently breaking the site, which is worse than not having one yet.

**Flagged, not fixed — needs the operator, not fabrication:**
- The report's own copy-paste `RealEstateAgent` JSON-LD snippet included
  `aggregateRating: { ratingValue: "5.0", reviewCount: "12" }` and
  `sameAs` links to placeholder URLs (literal `"…"`). Did not add either —
  fabricated review counts in structured data is exactly the kind of thing
  Google's structured-data guidelines penalize, and placeholder `sameAs`
  URLs would 404. `sameAs` stays empty until real profile URLs exist (see
  the existing comment on `tenant.social.sameAs`); no rating schema until
  real reviews exist.
- Did not swap the domain/email in metadata to `harbisonstandard.com` /
  `nate@harbisonstandard.com` from the report's example snippets — that
  domain isn't owned (the report's own action plan lists buying it as a
  to-do). The live alias is `ns4homes.site`; canonical URLs will use
  whatever real domain the operator sets `NEXT_PUBLIC_SITE_URL` to.
- Did not touch GA4/Clarity, a cookie/CCPA consent banner, Google Business
  Profile, reviews collection, or the 20+ new pages (city×service pages,
  per-property pages, market-report content, case-study PDFs) the report's
  action plan proposes. All of these need operator-supplied IDs, real
  copy, or a real business decision (what the privacy policy actually
  says) — not something to generate wholesale from a template.
- Two open questions surfaced by the audit that are the operator's call,
  not mine: (1) `contact.displayName` reads "Nathaniel Harvison" while the
  brand is "The Harbison Standard" — genuine inconsistency, but picking
  a spelling means guessing which is the real name; (2) `roleLine`/
  `complianceFooter` say "All Around Kern County, CA" while the sold-
  property portfolio (added this session) includes Lemon Grove and San
  Diego addresses — real tension between existing brand copy and newly
  surfaced portfolio data, not resolved here.

## Post-Phase-3 (home page: about, signup framing, sold-property portfolio)

### "Mailing list" reused the existing lead-capture form, not a second system
Operator asked for "very good filters and funnels to entice people to sign
up with the mailing list." Built as a repositioned, better-framed instance
of the existing `LeadForm` (moved up the page, new heading/subcopy via new
`signupHeading`/`signupSubcopy` tenant-copy fields) rather than a second,
parallel email-list system. The existing form's situation/timeline
questions already are the segmentation ("filters") the operator described,
and every submission already lands in the same `leads` table with the same
scoring — a separate newsletter system would fragment the data model and
require real ESP/unsubscribe infrastructure nothing here asked for. Only
one `LeadForm` renders per page (it hardcodes `id="lead-form"`), so the
old bottom-of-page instance was removed rather than duplicated.

### Sold-property portfolio sourced from the operator's own Drive folder, verified before use
Operator initially shared a Google Drive folder containing 7 property
subfolders with photos and "info" docs. Before building anything, flagged
that the docs read like scraped MLS/Compass comp research (generic
Compass.com search-result links, `imgi_N_origin.webp` filenames matching
a bulk image-downloader extension's naming convention) rather than
confirmed closed deals with usable photo rights. Operator then explicitly
confirmed: "a section that has the properties that he has sold" — treated
as the business owner's authoritative call on his own transaction history
and photo rights. Pulled 1-5 photos per property (all 7), preferring
smaller file sizes where multiple were available (keeps `next/image`'s
generated payload down), and wrote each `description` from the real
`soldPrice`/specs in each property's info doc — not fabricated.

### `SoldProperty.photos` typed as a non-empty tuple, not `string[]`
`PortfolioSection` always renders `photos[0]` as the card's hero image.
Typing it `[string, ...string[]]` instead of `string[]` makes "at least
one photo" a compile-time guarantee instead of a runtime assumption —
`tsc` caught the alternative (`photos[0]` typed as possibly `undefined`)
immediately, which is exactly the kind of gap this type should close.

### Portfolio image gallery is plain `next/image`, not a lightbox/carousel
No new dependencies, no client JS. Each card shows one hero photo plus up
to 4 small thumbnails, all static `<Image>` elements — `next/image`
handles responsive `srcset` generation and format negotiation from the
single source file, so raw 2048px source photos never ship at full size.
Consistent with the pillar-tabs decision earlier in this file: motion/
interactivity spent only where it doesn't cost the JS-optional guarantee.

## Post-Phase-3 (production deploy fix)

### `getTenant()` treated an empty-string env var as a real tenant slug
First real Vercel deploy (`coaiebay-sources-projects/harbison-standard2`)
failed the build with `Error: Unknown tenant slug: ""`, traced to
`tenants/index.ts:15`. Cause: `getTenant()` used
`slug ?? process.env.NEXT_PUBLIC_TENANT ?? harbison.slug` — `??` only
falls through on `null`/`undefined`, not `""`. Locally the var is simply
absent from the environment, so it always fell through correctly; on
Vercel, the project's env var UI had `NEXT_PUBLIC_TENANT` set with an
empty value rather than omitted entirely, and Next.js inlines that empty
string at build time, so the check saw a defined-but-empty value and
never reached the `harbison.slug` fallback. Reproduced locally with
`NEXT_PUBLIC_TENANT="" npm run build` before fixing, and confirmed the
fix resolves it the same way. Fixed by switching to `||`, which treats
`""` the same as unset — the correct behavior regardless of what any
given host's dashboard does with a blank-but-present env var. No schema,
RLS, or other logic changes.

The redeploy this fix triggered hit the identical pattern one field over:
`tenants/harbison.ts`'s `siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "..."`
failed `new URL(tenant.siteUrl)` in `app/layout.tsx` with `Invalid URL`
for the same reason — `NEXT_PUBLIC_SITE_URL` was also present-but-empty
on Vercel. Fixed identically (`||` instead of `??`). Grepped the repo for
every other `process.env.\w+ ??` occurrence before pushing again — this
was the only other one, so this class of bug should be closed now, not
just patched at the two sites that happened to surface first.

## Post-Phase-3 (operator request)

### Twilio pulled out entirely — missed-call flow now a mock-data example
Operator request: no Twilio account exists yet, so stop pretending to
integrate with one. Removed the `twilio` npm package entirely (and its
~30 transitive deps) and rewrote `lib/twilio.ts` to a pure mock:
`sendSms()` always logs and returns `{sent: false}`, no env vars read, no
real API calls possible even by accident. `app/api/webhooks/twilio/route.ts`
dropped its `X-Twilio-Signature` verification branch (nothing to verify
without a real auth token) but kept the same URL and the same
`CallStatus=no-answer` → `handleMissedCall()` logic — pointing a real
Twilio number's voice status callback at this same route later is a
credentials-and-a-few-lines change, not a rebuild.

**What stayed real, deliberately:** `lib/missed-call.ts` (lead creation,
tenant resolution), `lib/suppression.ts` (STOP-suppression query against
`outreach_log`), and the `outreach_log` bookkeeping all still run for
real against Supabase when it's configured — only the actual SMS send
is mocked. This is what "an example of how it would work" means here:
the CRM-side behavior (a missed call becomes a real lead you can see on
the board) is functional today; only the "text actually leaves this
building" step waits on a Twilio account.

`/dev/simulate-missed-call` and `/dev/stop-simulator` dropped their
"disable if Twilio is configured" gate — pointless now that Twilio can
never be configured — and are the permanent, always-available way to
exercise this feature until a real account exists. Their copy says so
plainly rather than implying the feature is broken or half-built.

**To reconnect a real Twilio account later:** `npm install twilio`,
restore `lib/twilio.ts`'s real `sendSms`/`verifyTwilioSignature`
implementation (this file's own comment points at git history for the
prior version — the commit removing it is titled around "take Twilio
out"), re-add the `X-Twilio-Signature` check to the webhook route, and
set `TWILIO_ACCOUNT_SID`/`TWILIO_AUTH_TOKEN`/`TWILIO_PHONE_NUMBER`. No
schema, RLS, or CRM changes needed — none of that was Twilio-specific.

## Phase 3

### CI never actually ran `npm test` until now
Following on from the `npm test` bug above: even after fixing the
script, `.github/workflows/ci.yml` never called it at all — the RLS/
scoring proof tests (arguably the most compliance-critical tests in this
repo per §9) have never run in CI, only ever locally in this session.
Added a `Start PostgreSQL` step (`sudo systemctl start postgresql.service`)
before `npm test`, relying on GitHub's `ubuntu-latest` runner image
shipping PostgreSQL pre-installed (documented in GitHub's runner-images
repo) — the same peer-auth connection method `tests/helpers/db.mjs`
already uses locally, so no test-harness rewrite needed for a
TCP/password-auth service-container alternative. **Not verified against
an actual GitHub Actions run** (no way to trigger one from this
environment) — if `ubuntu-latest` ever drops the pre-installed Postgres
or the service name differs, this step will need adjusting. Watch the
first real CI run after this lands.

### `npm test` was silently broken — `node --test tests/` doesn't work on this Node version
Caught while doing the final Phase 3 verification pass, not before: the
`test` script in `package.json` since Phase 2 was `node --test tests/`,
which throws `MODULE_NOT_FOUND` on Node 22.22.2 in this environment — it
tries to `require()` the directory path itself rather than discovering
`*.test.mjs` files under it. Bare `node --test` (no path argument) works
correctly, using Node's built-in recursive test-file discovery from the
current directory. Changed the script to that. This means every "tests
pass" claim in `PHASES.md` for Phases 2 and 3 up to this point was
verified by running `node --test tests/rls.test.mjs` directly (which
does work — the bug is specific to passing a bare directory), never via
the actual `npm test` entry point a contributor or CI would use. Worth
naming plainly: the individual test runs were real, but the documented
"run `npm test`" instruction itself would have failed for anyone who
tried it before this fix.

### copy-lint never actually banned "safe neighborhood" — the exact phrase §9 names as its test case
Writing an automated regression test for the copy-lint detection logic
(`tests/copy-lint.test.mjs`, closing the §9 acceptance test "intentionally
adding 'safe neighborhood' fails the build") surfaced that the banned-
phrase list had "safe area" and "safe community" but never the literal
phrase "safe neighborhood" — the one instance §9 explicitly names as the
example that must fail the build. Added it. Also extracted the banned-
phrase lists and detection function from `scripts/copy-lint.mjs` into
`scripts/lint-rules.mjs` so both the real linter and the test import the
same logic, rather than the test re-implementing (and potentially
drifting from) what the linter actually checks.

### `RESEND_FROM_EMAIL` is actually wired up now — every automated send was using a Gmail address as `from`
While checking Vercel/production deploy-readiness, found that every
email send (auto-reply, morning briefing, nurture check-in) used
`tenant.contact.email` — `nate85.realtor@gmail.com` — as the `from`
address, even though `.env.example` already documented a
`RESEND_FROM_EMAIL` variable that nothing actually read. Resend (like
essentially every transactional-email provider) requires `from` to be on
a domain you've verified with them via DNS records; you cannot send *as*
an arbitrary Gmail address. Added `lib/email/from-address.ts`
(`resolveFromAddress`) and wired it into all three send sites:
`RESEND_FROM_EMAIL` when set, falling back to the contact email
otherwise so nothing crashes pre-domain — Resend will reject the send
with a clear provider error in that fallback case, which is the correct
failure mode (visible in logs) rather than a silent success that looks
fine locally and breaks in production. **Operator action needed:** once
a domain is purchased and verified with Resend, set `RESEND_FROM_EMAIL`
(e.g. `leads@theharbisonstandard.com`) — no code change required after
that.

### Video "generation" creates a slug + falls back to the tenant's default video
§7.4's "generate video page" action has no video-generation service
behind it — none is specified, and building one is out of scope. Reading
it pragmatically: "generate" means create the unique `/v/[slug]` and give
it something to show immediately, which is the tenant's existing hero
footage (`public/media/hero.mp4` — finally put to use after sitting
unreferenced since Phase 0/1). The lead-detail screen lets the agent
paste a real recorded video URL (YouTube or an uploaded MP4 path)
afterward; personalization on the generic-video path comes from the
on-page text (name, address, transcript), not per-lead footage.

### OG image doesn't pin `runtime = "edge"`
§7.4 describes the OG image as "(edge, satori)." `next/og`'s
`ImageResponse` is Next's built-in Satori wrapper — no separate `satori`
dependency — but `next build` warned that Next 16 deprecated the
`runtime = "edge"` route-segment export in favor of always using the
`nodejs` runtime, which runs `ImageResponse` identically. Followed the
current framework's own guidance over the spec's now-outdated runtime
name for the same reason as the Supabase version pin: the literal string
"edge" was standing in for "fast, on-demand image generation," which
`nodejs` still delivers here.

### STOP suppression lives in `outreach_log`, not a new table
§8 requires a suppression check on every automated send, but §5's schema
has no dedicated opt-out table or column, and it's fixed ("migrations
must create exactly this"). `outreach_log` already records every inbound
message, so an inbound row with `direction: 'in'`, `channel: 'text'`, and
a body containing "stop" (case-insensitive — matches the keyword Twilio
itself recognizes) doubles as the suppression record
(`lib/suppression.ts`). Scoped by phone number across every lead that
shares it — the missed-call webhook creates a new lead row per call
rather than reusing one, so a STOP has to apply to the phone number, not
one specific lead id. In real production, Twilio's own Advanced Opt-Out
feature intercepts STOP replies before they reach this app at all — this
check is defense in depth, and it's what makes `/dev/stop-simulator`
meaningful to test without a real Twilio number.

### `/dev/simulate-missed-call` and `/dev/stop-simulator` self-disable, not auth-gated
§7.4/§8 ask for these as ways to exercise the missed-call and STOP-
suppression logic "without Twilio creds." Rather than gating them behind
CRM login (which would make them useless for a quick pre-auth smoke test,
and adds a second protection model alongside the "not configured"
condition that already defines when they're relevant), both pages check
`TWILIO_ACCOUNT_SID`/`AUTH_TOKEN`/`PHONE_NUMBER` server-side and refuse to
run their action once Twilio is actually configured — which is exactly
the point where they'd otherwise let an unauthenticated visitor create
real fake leads or fire real texts in production. `robots.ts` also
disallows `/dev/` so they're never indexed. If the operator wants a
second layer, adding them to `middleware.ts`'s protected prefixes is a
small change — flagged here rather than silently assumed unnecessary.

### `vercel.json` cron is a fixed UTC time — ~1hr drift across DST, by design
§7.4 wants the morning briefing at "07:00 America/Los_Angeles," but
Vercel Cron Jobs run on plain cron syntax evaluated in UTC — there's no
IANA timezone field, and no first-party DST-aware alternative. Picked
`0 14 * * *` (14:00 UTC), which is exactly 07:00 during Pacific Daylight
Time (roughly mid-March to early November, the majority of the year) and
06:00 during Pacific Standard Time the rest of the year — a fire time
that's up to an hour early in winter, never late. Early is the safer
direction for a briefing meant to be read before the day starts. A
precise fix would mean two cron entries plus in-route date-math to no-op
the wrong one each half of the year — not worth it for an internal email
with an hour of acceptable slop.

### `CRON_SECRET` checked via `Authorization: Bearer` header
Vercel's own Cron Jobs docs describe this exact convention: when a
`CRON_SECRET` env var is present, Vercel automatically sends
`Authorization: Bearer $CRON_SECRET` on requests it triggers from
`vercel.json`. `app/api/cron/briefing/route.ts` checks for that exact
header, which is both the §7.4-mandated protection and literally how
Vercel expects a cron route to protect itself — no separate mechanism
invented.

### Relaxed 5 `leads` columns from NOT NULL to nullable
Phase 2's migration marked `email`, `property_address`, `situation`,
`consent_text`, and `consent_at` all `not null`, reading §5 through the
lens of the one ingest path built at the time — the web form, where
every one of those fields is genuinely required (§7.2). Building the
Phase 3 missed-call webhook exposed that this was too narrow: a missed
call supplies a phone number and nothing else. §7.4 itself confirms this
isn't an oversight to route around — it explicitly says "Respect
`consent_at IS NULL`," meaning the spec's own design expects that state
to exist. Added a new migration (`20260902130000_relax_lead_optional_fields.sql`)
rather than editing the Phase 2 one — once a migration has shipped,
correcting it is a new migration, not a rewrite of history. Added a test
(`tests/rls.test.mjs`) proving a phone-only insert succeeds. `name`
stays `NOT NULL`: even a missed-call lead gets a display name (falls
back to the caller's phone number — see the Twilio webhook), so every
row is guaranteed to render sensibly in the CRM without a cascade of
null-checks through every display component.

## Phase 2

### `@supabase/supabase-js` pinned to 2.50.x, not latest (2.113.x)
Latest `@supabase/supabase-js` (2.113.0) ships a very recent internal
rewrite of its generic type system (a vendored, restructured
`postgrest-js` with `GenericSchema`/`GenericTable`/`Relationships`/
`__InternalSupabase` machinery). A hand-written minimal `Database` type
(`lib/supabase/types.ts` — reasonable here since there's no live project
to run `supabase gen types typescript` against yet) hit a generic
resolution bug in that version: `.from("leads").insert(...)` typed the
`values` parameter as `never[]` regardless of how the `Database` type was
shaped, traced through `SupabaseClient`'s `Schema`/`ClientOptions`
conditional-type defaults but not fully root-caused — it's new enough
(shipped after this session's knowledge) that it isn't a documented,
searchable issue yet. Pinned to 2.50.5 instead (paired with
`@supabase/ssr` 0.5.2, its contemporary), which depends on the older,
stable `postgrest-js` 1.x typing pattern — the one nearly every
Supabase+Next.js guide and the official docs still demonstrate. Same
hand-written `Database` type works immediately with zero changes. If a
future need justifies the newer major, re-verify this exact insert
pattern against it first.

### Kept `middleware.ts`, not Next 16's renamed `proxy.ts`
`next build` warns that the `middleware.ts` file convention is deprecated
in favor of `proxy.ts` (Next 16 renamed it, with a codemod available:
`npx @next/codemod@canary middleware-to-proxy .`). §4 of the spec
explicitly names this file `middleware.ts` (both for auth gating now and
for Phase 4's host→tenant resolution), and the warning doesn't fail the
build. Kept the spec's literal filename for now rather than deviate
preemptively; re-run the codemod once `middleware.ts` support is actually
removed, or sooner if it becomes a real CI failure instead of a warning.

### `current_tenant_id()` helper instead of a custom-JWT-claims hook
§5's RLS matrix describes authenticated access as "scoped tenant_id = jwt
claim tenant." The literal mechanism that phrase points at — a Supabase
Custom Access Token Hook that injects `tenant_id` into the JWT at login —
is real but requires a manual, non-SQL step (enabling the hook in the
Supabase Dashboard, since Auth Hooks aren't configurable purely via
migration). Used a `SECURITY DEFINER` SQL function instead
(`current_tenant_id()`, in the init-schema migration) that looks up the
caller's tenant from `profiles` via `auth.uid()` on every RLS check. Same
effective behavior — authenticated access scoped to the caller's tenant —
zero Dashboard configuration required, and it can't go stale the way a
baked-in JWT claim could if a profile's tenant ever changed without a
re-login. Document the Custom Access Token Hook as an alternative in
README if a future need (e.g., wanting tenant_id visible client-side
without a query) makes it worth the tradeoff.

### RLS proof discovered a real interaction: RETURNING needs a SELECT policy too
While writing the RLS test suite, `anon`'s INSERT-only access to `leads`
initially failed with "new row violates row-level security policy" even
though the insert policy is `with check (true)`. Root cause, confirmed by
testing with and without a trailing `RETURNING` clause: Postgres enforces
the actor's SELECT policy on the row handed back by `INSERT ... RETURNING`
(and `UPDATE ... RETURNING`), not just the INSERT policy's `WITH CHECK` —
and raises an error rather than silently omitting the row. Since anon has
no SELECT policy on `leads` at all, `RETURNING` after an anon insert must
fail — which is actually the RLS matrix working exactly as specified
("anon: INSERT-only... nothing else, nowhere"), not a bug to route around.
**Real consequence for application code, not just the test:** the Phase 2
Supabase client insert in `app/api/leads/route.ts` must never chain
`.select()` after `.insert()` when running as anon/the public form path.
`supabase-js`'s `.insert()` doesn't call `.select()` by default (it uses
`Prefer: return=minimal`), so the route handler already avoids this by
construction — but it's a sharp edge worth naming explicitly, since adding
`.select()` later (e.g., to log the new lead's id) would silently turn
every public form submission into a 401/RLS error in production.

### Local test harness: a Postgres auth-schema shim, not the full Supabase CLI
No Docker daemon is available in this environment (only the `docker`
client, socket unreachable), so `supabase start` (which needs Docker
Compose to run the full stack — Postgres, GoTrue, PostgREST, Studio) isn't
usable here. A system Postgres 16 install was available instead. Since
what Phase 2 actually needs to prove is the RLS matrix and the scoring
trigger — not Auth/PostgREST/Studio — built `tests/fixtures/auth-shim.sql`,
a minimal stand-in for just the pieces the real migrations assume exist
(the `auth` schema, `auth.users`, `auth.uid()`, and the `anon`/
`authenticated` roles with Supabase's default grants). It is explicitly
never applied to a real Supabase project (which already has all of this)
and is kept in `tests/fixtures/`, not `supabase/migrations/`, so it can
never be mistaken for one. `npm test` runs against this local setup;
`README.md` documents both this path and the full Supabase CLI (with
Docker) as an alternative for anyone who has it available.

### Tests shell out to `psql`, no new `pg` npm dependency
`tests/helpers/db.mjs` drives Postgres via `execFileSync("psql", ...)`
rather than adding the `pg` npm package. `psql` is already required
tooling for anyone running Supabase migrations locally, so this adds zero
new dependencies for a testing-only need — consistent with the hard rule
against adding dependencies without justification.

### Scoring trigger has no "un-flag as not-spam" path yet
`fn_score_lead()` re-derives `flagged_spam` from `form_seconds_open` on
every `UPDATE`, not just `INSERT` (so scoring stays consistent if those
inputs ever change). One side effect: if an agent manually corrects a
false-positive spam flag in the CRM, the trigger will re-flag it on the
next update as long as the original `form_seconds_open` value is still
below the threshold — there's no override column. Not required by any
§9 acceptance test; noted here as a known limitation rather than
building an unrequested override mechanism now.

### `?demo=1` bypasses login, but only for hardcoded seed-marked rows
§7.3 requires a `?demo=1` mode that "guarantees seeded data visible," and
§9's acceptance test phrases it as something that just "shows 8 seeded
DEMO leads" — with no mention of first logging in. Read together with the
operator's stated need to run impressive live demos, treated this as
intentionally unauthenticated: `middleware.ts` lets `?demo=1` through on
`/dashboard` and `/leads/[id]` (never `/settings`, which has no demo
meaning) without a session. The safety net: `lib/leads-query.ts`'s demo
path always uses the service-role client with a **hardcoded** filter to
rows carrying the `notes->>'demo'` marker — the only rows that ever get
that marker are the ones `supabase/seed.sql` inserts. No request input
(filters, search terms, IDs) can widen that query to real lead data, and
demo-mode writes are refused at the application layer (the "Update"/"Save
notes" controls don't even render) with RLS as the actual backstop (an
unauthenticated request has no session, so the anon role would apply —
and anon has no UPDATE policy on `leads`).

### Notification preferences on /settings are UI-only for now
§7.3 lists "/settings profile, notification prefs" as a required page.
`profiles` has no column for notification settings, and §5's schema is
explicit ("migrations must create exactly this") — adding one now would
mean the schema no longer matches the spec's model. Since the one
notification Phase 2 could plausibly control (the 7am morning briefing
email) doesn't exist until Phase 3, `/settings` ships with a working
profile section (editable `display_name`) and a notification-preferences
section that's explanatory text only, not a persisted toggle. Revisit
when Phase 3's briefing email lands — that's the natural point to decide
where the preference lives (a new `profiles` column, or tenant-level
config) and log it as its own decision then.

### `update` situation carries no scoring bonus (matches §5's weight table literally)
§5 lists weights for `sell-probate|sell-inherited|sell-nod` (+40),
`land|sell-landlord` (+25), and `build|invest` (+20), but never mentions
`update` even though it's a valid `situation` enum value. `fn_score_lead()`
gives it 0 situation points, same as leaving it out of the CASE entirely —
a lead can still reach WARM/HOT on timeline + phone + engagement alone.
Revisit if the operator wants `update` leads weighted like `build`.

## Phase 1

### Lead route handler ships without persistence (Phase 2 stub)
§10 explicitly scopes Supabase migrations and "form→DB wired" to Phase 2,
so `app/api/leads/route.ts` implements the full request-side pipeline
(honeypot, time-trap, UTM/referrer capture, consent capture, rate
limiting) but logs the would-be row to console instead of inserting it —
clearly marked `[leads:stub]` and grep-able. Phase 2 swaps the `console.log`
for a `supabase.from("leads").insert(...)` call; scoring itself is never
computed here — that's the Postgres trigger `fn_score_lead()`'s job, so
this route never duplicates that logic even provisionally.

### Time-trap (`opened_at`) is progressive enhancement, not a hard gate
§3 requires public pages to be static-first and forms to work with JS
disabled; §7.2 requires a "server-side time-trap via hidden opened_at."
Those two requirements are in tension: a force-static page can't stamp a
per-request server timestamp at render time. Resolved as: a hidden
`opened_at` input starts empty and is filled by a small inline script (pure
progressive enhancement, no hydration) on page load. The route handler
computes `form_seconds_open` server-side from that value at submit time —
still a server-side calculation, just fed a client-supplied timestamp. When
`opened_at` is missing (JS disabled), `form_seconds_open` is `null` and the
&lt;3-second spam heuristic is skipped entirely rather than penalizing
legitimate no-JS submitters. The honeypot field still catches basic bots
regardless of JS.

### UTM capture: hidden fields + script, referrer always server-side
Force-static pages can't read their own request's query string at render
time, so UTM params can't be captured purely server-side without making
every page dynamic (which would break the static-first hard rule). UTM
hidden fields are populated client-side from `location.search` by the same
inline script as the time-trap; the HTTP `Referer` header is captured
unconditionally server-side regardless of JS. A no-JS submission from a
UTM-tagged link therefore loses the specific `utm_source`/`medium`/
`campaign` values but keeps referrer-based attribution.

### Rate limiting is in-memory (Phase 1), durable rate limiting deferred
`lib/rate-limit.ts` is a process-local `Map`-based 5/hour-per-IP limiter.
It resets on cold start and doesn't share state across serverless
instances — a real gap, not swept under the rug. Once the `leads` table
exists (Phase 2), the correct home for this is a query against recent rows
by IP, which is durable and consistent with how the rest of the anti-spam
logic (honeypot, time-trap) ultimately lands in that table. Tracked here
explicitly rather than presented as a finished feature.

### Situation dropdown: full list every page, per-page default only
§2 says the four pillars (BUILD/UPDATE/INVEST/FLIP) structure "the ...
lead-intent dropdown." Read literally as "restrict the dropdown to that
page's pillar," a visitor on `/sell` who is actually an investor would
have no way to select the right option. Instead, `LeadForm` always offers
the full `SITUATION_OPTIONS` list (grouped by Sell/Build/Land via
`<optgroup>`) and just sets a sensible pre-selected default per page
(`/sell` → sell-inherited, `/build` → build, `/land` → land, home →
blank). Matches the spirit of "pre-set" without trapping a visitor in the
wrong bucket.

### Small brass text on white/light backgrounds swapped for navy + brass underline
Lighthouse's accessibility audit failed `color-contrast` on brass
(`#C9A24B`) used as small uppercase eyebrow text on white cards (home
service cards, press talking-points cards, the one-sheet's pillar labels)
— brass reads fine on navy but doesn't meet 4.5:1 against white. Per §2,
brass is an accent/highlight color, "never large fills except buttons," so
keeping it as decorative (a `border-b-2 border-brass` underline) while
switching the text itself to navy preserves the brand accent without
failing accessibility. Also bumped one `text-navy/60` label (home page
proof-stat captions) to `/70` to match the opacity already used safely
elsewhere on the site. Verified via a full Lighthouse CI run after the fix:
accessibility scored 1.0 on all six audited pages.

### `/privacy` and `/terms` added even though §4's page tree doesn't list them
§4's public route list doesn't include `/privacy` or `/terms`, but §8 does
require them ("Compliance is a release blocker") as plain-language pages
linked from the footer. Built now rather than deferred, since compliance
requirements are explicitly not optional. Both are static, footer-linked,
and carry the same JSON-LD identity/breadcrumb nodes as every other public
page for consistency.

### `/v/[slug]` (personalized video pages) deferred to Phase 3
§10 explicitly scopes "video pages + OG generation" to Phase 3, and the
route's real content (lead name, property address, agent photo) depends on
the `leads` table that doesn't exist until Phase 2. Building a shell now
against fake data would just need to be rebuilt once real data exists.
`app/robots.ts` already disallows `/v/` for all crawlers now, ahead of the
route existing, since that's pure static config with no data dependency.

### Press one-sheet: print CSS, not a generated PDF file
§7.6 asks for a "downloadable one-sheet PDF (print CSS)" — read as an
instruction to build it as print-optimized HTML/CSS rather than to add a
PDF-generation library (which would be a new dependency requiring
justification per the hard rules, for a job the browser's native print
dialog already does). `/press#one-sheet` plus a "Print / save as PDF"
button (`window.print()`) and a `.no-print` / `@media print` rule set in
`globals.css` hides everything else on the page, leaving a clean one-pager
to print or save. No new dependency added.

### Headshot: styled placeholder, not a missing-image `<img>`
No headshot photo has been provided (same situation as the logo — see the
Phase 0 entries above). Rather than reference a nonexistent image file,
`/press`'s one-sheet renders a navy box with brass "NH" initials.
**TODO(operator):** provide a real headshot photo.

## Phase 0

### Next.js scaffolded by hand, not `create-next-app`
`create-next-app` is interactive and pulls in defaults (Turbopack flag,
`src/` dir toggle, import alias prompts) that need pinning down anyway.
Hand-scaffolding the same output gives identical results with no prompts
and lets every file be reviewed as it's written. No functional difference
to the shipped app.

### Next.js 16.3.x pinned (App Router), React 19, ESLint 9 flat config
Spec requires "server-rendered, zero client-side JS except progressive
enhancement of forms" and static-first public pages. The App Router with
`export const dynamic = "force-static"` per route satisfies this directly,
no separate static-site generator needed. Initially scaffolded on Next
14.2.15, but `npm install` surfaced that version's known **critical**
DoS advisory (GHSA-7m27-7ghc-44w9, among others) — `npm audit` only
clears on 16.x. Since the "boring standard" choice must also mean the
current non-vulnerable stable release, bumped to Next 16.3.4 + React 19.2
+ `eslint-config-next` 16.3.4, which requires ESLint 9 (flat config,
`eslint.config.mjs`, replacing the `.eslintrc.json` written first). `npm
audit` reports 0 vulnerabilities at these pinned versions. Re-run `npm
audit` before each future phase's commit — this is a fast-moving stack.
Next 16 also removed the `next lint` subcommand entirely, so `npm run
lint` invokes `eslint .` directly instead.

### No Supabase/Resend/Twilio packages installed yet
They're not imported by any code yet (Phase 0 has no forms, no DB calls, no
sends). Adding unused dependencies violates the "don't add things you're
not using yet" principle and just bloats `npm install` / the CI cache.
Each SDK is added in the phase that first imports it (Phase 2 for
`@supabase/supabase-js` and `@supabase/ssr`, Phase 3 for `resend` and
`twilio`).

### Logo: no real `logo.png` available — text wordmark placeholder shipped
The spec pointed at `logo.png` as an existing asset to copy into
`public/brand/logo.png`. What actually arrived in this session was an
*inline chat preview* of the logo (rendered as an image in the
conversation), not a retrievable file on disk — there is no `logo.png` to
copy. Per the spec's own fallback ("if missing, ship a text wordmark
placeholder in the exact brand fonts/colors and log a TODO"), `Wordmark`
(`components/Wordmark.tsx`) renders a Georgia/brass text mark plus the
inline benchmark SVG until `tenant.brand.hasRealLogo` is flipped to `true`
in `tenants/harbison.ts` after a real transparent PNG is dropped at
`public/brand/logo.png`.
**TODO(operator):** provide `logo.png` (full-res, transparent) and flip
`hasRealLogo`. Still outstanding as of the operator's second asset drop
(same session, later message): another chat-inline preview of the same
logo was sent, but again as a rendered image in the conversation, not an
attached file — there is nothing on disk to copy. A logo file only
becomes usable here if it arrives as an actual upload (the same channel
the hero videos came through, which do land as real files) or a URL.

### Hero video stored, not yet wired up (superseded once already)
A hero video was attached to this session and copied to
`public/media/kern-county-hero.mp4` purely so it survives past this
ephemeral container — it was not referenced by any page. A second, later
message in the same session supplied a different video file explicitly
labeled "hero" — replaced the first with it at `public/media/hero.mp4`
(dropped the working-title `kern-county-` prefix now that this is the
confirmed asset). Neither version has been wired into a page yet: doing so
is a Phase 1 design decision (autoplay/muted, poster frame, `<video>` vs.
background embed, mobile data/`prefers-reduced-motion` considerations) and
will be made then, not smuggled in ahead of the phase gate.

### Nav pillars (BUILD/UPDATE/INVEST/FLIP) vs. page routes (Sell/Build/Land)
§2 says the four pillars structure "the nav, the services section, and the
lead-intent dropdown," but §4's actual page tree only has three funnel
pages (`/sell`, `/build`, `/land`) and §7.1 lists three service cards
(SELL/BUILD/LAND), not four. Reconciled as: **the pillars are a
classification/voice concept** (they show up as diamond-separated section
labels, in `leads.intent_pillar`, and in the situation dropdown's option
grouping) while **top nav and service cards follow the actual page
routes** (Sell/Build/Land + Press/FAQ), since there is no fourth page for
"Update" to link to. `tenants/harbison.ts` nav therefore lists the five
real routes; pillar labels are used for the `Pillar` type and
`ServiceCard.pillar` tagging instead of as standalone nav items. Revisit if
the operator wants a literal four-item pillar nav.

### copy-lint.mjs scans source files, not rendered HTML, for now
At Phase 0 there is no real page copy yet — the linter's job right now is
to prove the CI gate exists and catches banned phrases. It statically
greps `app/`, `components/`, `tenants/` for the banned-phrase list from
§8. Phase 1, once FAQ/press-kit/funnel copy exists and some of it is
assembled at render time (not just in source strings), should extend this
to also crawl the built static HTML output (`next build` + a static
export or a headless fetch of each route) so nothing assembled dynamically
slips through.

### Lighthouse CI: filesystem upload target, no explicit preset
`lighthouserc.json` uses `upload.target: "filesystem"` instead of
`temporary-public-storage` — the latter calls an external Google Cloud
Function that isn't guaranteed reachable from every CI/sandboxed egress
policy, and needlessly uploads a client's pre-launch report to a
third-party temporary host. Reports land in the (gitignored)
`.lighthouseci/` dir as build artifacts instead. No `settings.preset` is
set: Lighthouse's default (no preset) is mobile emulation, which is what
§9's "Lighthouse (ci, mobile)" asks for — `"preset": "mobile"` is not a
valid Lighthouse CLI value and errors out (valid presets are
`perf`/`experimental`/`desktop`).

### Lighthouse CI scoped to `/` only for now
`lighthouserc.json` only audits `/` because `/sell`, `/build`, `/land`,
`/press`, `/faq` don't exist yet (Phase 1). Auditing routes that 404 would
either fail CI for the wrong reason or require stubbing them out now and
rewriting the audit later. The URL list will be expanded in Phase 1 as each
route ships.

### Tailwind, not CSS Modules or vanilla CSS
Not specified. Tailwind is the standard choice for a token-driven design
system like §2's brand table, keeps public pages' CSS payload small (only
used utilities ship), and every class maps 1:1 to a brand token
(`bg-navy`, `text-brass`, etc.) so no component can accidentally use an
off-brand color.

### ESLint via `next/core-web-vitals` only
Not specified. This is Next.js's standard recommended config and already
enforces the accessibility/perf rules relevant to the Lighthouse gate. A
stricter custom rule set can be layered on later if a specific class of bug
shows up in review.
