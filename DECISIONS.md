# Decisions

Judgment calls made where the spec was silent or ambiguous, newest first.
Each entry: what was decided, why, and what would change it.

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
