# Decisions

Judgment calls made where the spec was silent or ambiguous, newest first.
Each entry: what was decided, why, and what would change it.

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
