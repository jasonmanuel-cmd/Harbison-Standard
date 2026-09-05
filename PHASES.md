# Phases

Status of each build phase. Updated at the end of every phase, before
commit, per the spec's stop-and-review gate.

## Phase 0 — Scaffold ✅ done

**What's done:**
- Next.js 16 (App Router) + TypeScript project, hand-scaffolded (no
  `create-next-app`, see `DECISIONS.md`).
- Tailwind configured with the exact brand tokens from §2
  (`tailwind.config.ts`): `navy`, `navy-deep`, `brass`, `steel`,
  `parchment`, `paper`, plus `font-serif`/`font-sans` mapped to
  Georgia/Helvetica stacks.
- `tenants/types.ts` — the `TenantConfig` contract every tenant must
  satisfy (brand, contact, license, social/`sameAs`, nav, hero/service
  copy, FAQ, tunable scoring weights).
- `tenants/harbison.ts` — tenant #1, fully populated: Nathaniel Harbison's
  contact/license info, approved hero copy, the four drafted FAQ entries
  (with `[mark: verify with counsel]` flags preserved on the probate and
  SB 800 answers), proof-stat placeholders, and initial scoring weights
  matching §5.
- `components/BenchmarkMark.tsx` — the surveyor's-benchmark brand mark as
  a stroke-only inline SVG.
- `components/Wordmark.tsx` — renders the real logo when present, else a
  text wordmark placeholder in brand fonts/colors (see `DECISIONS.md` —
  no real `logo.png` file was available to place in the repo this phase).
- Minimal `app/layout.tsx` + `app/page.tsx` proving the tenant config and
  design tokens render together (header, hero with brass-highlighted
  headline and benchmark watermark, compliance footer). This is **not**
  the full Phase 1 home page — no service cards, proof strip, FAQ, or lead
  form yet.
- `scripts/copy-lint.mjs` — fair-housing/banned-phrase CI gate, scanning
  `app/`, `components/`, `tenants/`.
- `.github/workflows/ci.yml` — install → lint → typecheck → copy-lint →
  build → Lighthouse CI.
- `lighthouserc.json` — mobile preset, ≥95 on all four categories,
  currently scoped to `/` only (other routes don't exist yet).
- `.env.example` — every env var the app will ever read, across all
  phases, each annotated with which phase wires it up.
- `README.md`, `DECISIONS.md` (this phase's judgment calls), `PHASES.md`.
- `public/media/hero.mp4` — hero video asset preserved from the session
  upload, not yet wired into any page (Phase 1 decision).

**How to test it:**
```bash
npm install
npm run lint
npm run typecheck
npm run copy-lint
npm run build
npm run dev   # visit http://localhost:3000 — header, hero, footer render
```
Expected: all commands exit 0. The home page shows the navy hero with the
brass-highlighted "from the ground up." headline, the benchmark watermark,
and the compliance footer line. No forms, no funnel pages, no CRM yet —
those are Phase 1+.

**No untracked TODOs** other than the two logged in `DECISIONS.md`
(real `logo.png` from the operator; hero video integration in Phase 1).

## Phase 1 — Site ✅ done

**What's done:**
- Full public page set: `/` (hero, proof strip, 3 service cards, FAQ
  teaser, lead form), `/sell` (probate/inherited/NOD/landlord tracks),
  `/build` (spec-home process), `/land` (lot valuation factors), `/press`
  (EPK: short + long bio, talking points, printable one-sheet), `/faq`
  (full FAQ as `<details>`), `/thank-you` (post-submit, JS-off friendly).
  `/privacy` and `/terms` also shipped — not in §4's page tree, but §8
  requires them as a release blocker (see `DECISIONS.md`).
- Shared chrome: `components/Header.tsx`, `Footer.tsx`.
- `components/LeadForm.tsx` — the shared capture form. Plain `<form
  method="POST" action="/api/leads">`, works fully with JS disabled;
  progressive-enhancement inline script fills the time-trap/UTM hidden
  fields and intercepts submit for an inline success message when JS is
  present. Honeypot field, required TCPA consent checkbox with the exact
  §7.2 copy, situation dropdown grouped by pillar with a per-page default.
- `app/api/leads/route.ts` — full request-side pipeline (honeypot,
  time-trap, UTM+referrer capture, consent capture, 5/hr per-IP rate
  limit, 303 redirect for no-JS / JSON for the fetch path). No DB yet —
  logs the stubbed lead row to console, clearly marked for Phase 2 to swap
  in a real insert. See `DECISIONS.md` for how the static-page vs.
  server-side-timestamp tension was resolved.
- GEO layer: `app/robots.ts` (explicit allow rules for GPTBot,
  OAI-SearchBot, ChatGPT-User, ClaudeBot, anthropic-ai, PerplexityBot,
  Google-Extended, Applebot-Extended, Amazonbot, CCBot; disallows `/v/`,
  `/dashboard`, `/api`), `app/sitemap.ts` (tenant-driven, content pages
  only), `app/llms.txt/route.ts` (generated from tenant config, with an
  honest "this doesn't control indexing" hedge).
- `lib/jsonld.ts` + `components/JsonLdScript.tsx` — JSON-LD `@graph`
  (Person, Brand, RealEstateAgent, WebSite, BreadcrumbList always;
  Service on funnel pages; FAQPage where FAQ content actually renders) on
  every public page.
- `lib/situations.ts` — canonical situation/timeline option lists and the
  exact TCPA consent string, shared across the whole site (schema-tied,
  not tenant-specific).
- `lib/rate-limit.ts` — in-memory 5/hr-per-IP limiter (Phase 1 stub; see
  `DECISIONS.md` for why this moves to a DB query in Phase 2).
- `lighthouserc.json` expanded to audit `/`, `/sell`, `/build`, `/land`,
  `/press`, `/faq`.
- Fixed two real accessibility findings Lighthouse caught (brass text on
  white backgrounds, a too-light navy opacity) — see `DECISIONS.md`.

**How to test it:**
```bash
npm install
npm run lint && npm run typecheck && npm run copy-lint && npm run build
npm run dev   # visit http://localhost:3000
```
Manually verified this phase (not yet in an automated test suite —
that lands with Phase 2's `npm test`):
- `curl -X POST http://localhost:3000/api/leads` with a plain
  `application/x-www-form-urlencoded` body (no `Accept: application/json`)
  → `303` redirect to `/thank-you?ok=1`, console logs the stubbed lead
  with `flagged_spam: false`.
- Same request with `company` (honeypot) filled → still `303` (doesn't
  tip off the bot), but `flagged_spam: true` in the logged stub.
- Same request with `opened_at` set to "now" → `form_seconds_open: 0` →
  below the 3-second threshold → `flagged_spam: true`.
- Missing a required field → `400` with a plain HTML error page (no-JS)
  or JSON error (JS path via `Accept: application/json`).
- `curl http://localhost:3000/robots.txt`, `/sitemap.xml`, `/llms.txt` all
  render correctly; JSON-LD on `/sell` parses and contains
  `Person/Brand/RealEstateAgent/WebSite/BreadcrumbList/Service`.
- Full Lighthouse CI run (`npx @lhci/cli autorun`, mobile, 3 runs × 6
  pages): performance ≥0.98, accessibility 1.0, best-practices 0.96, SEO
  1.0 on every audited page — all clear the §9 ≥95 bar.

**Known gaps carried forward (tracked, not silently dropped):**
- `public/media/hero.mp4` still isn't wired into the hero section — no
  page references it yet. Needs a design decision (autoplay/muted, poster
  frame, mobile data weight) rather than a default; deferred, not
  forgotten.
- Real `logo.png` and a real headshot photo are still outstanding — see
  `DECISIONS.md` (Phase 0 and Phase 1 entries). Text wordmark and "NH"
  initials placeholder remain in place.
- `/v/[slug]` intentionally not built yet — §10 scopes it to Phase 3, and
  it needs the `leads` table to have real data to render. `robots.ts`
  already disallows `/v/` ahead of the route existing.
- Rate limiting is in-memory and per-instance (Phase 1 stub) — see
  `DECISIONS.md`.

## Phase 2 — Data ✅ done

**What's done:**
- `supabase/migrations/` — three migrations implementing §5's schema
  exactly: `tenants`, `profiles`, `leads` (with generated `bucket` and
  `intent_pillar` columns), `outreach_log`; the full RLS matrix (anon
  insert-only on `leads`, nothing else anywhere; authenticated full CRUD
  scoped to their own tenant via a `current_tenant_id()` helper); and
  `fn_score_lead()`, a `BEFORE INSERT OR UPDATE` trigger that's the single
  source of truth for scoring regardless of ingest path, reading weights
  from `tenants.config->'scoring'` (tunable later without a migration).
- `supabase/seed.sql` — 8 fake DEMO leads (3 HOT / 3 WARM / 2 NURTURE,
  math verified against the actual trigger, not just hand-calculated) plus
  2 `outreach_log` rows, safe to re-run.
- `tests/rls.test.mjs` + `tests/helpers/db.mjs` + `tests/fixtures/auth-shim.sql`
  — 10 passing tests against a **real local Postgres**, proving: anon can
  insert but has zero read/write access anywhere else (including via
  `RETURNING` — see the real RLS+RETURNING interaction this suite
  actually caught, in `DECISIONS.md`); tenant isolation between two
  tenants; `sell-probate` + `asap` + phone scores ≥80/HOT; a form filled
  in under 3 seconds forces score 0 and `flagged_spam: true`.
- `lib/supabase/{admin,server,client}.ts` — service-role, cookie-bound,
  and browser Supabase clients, each returning `null` when unconfigured
  so every caller can degrade gracefully instead of crashing.
- `app/api/leads/route.ts` now does a real insert via the service-role
  client (resolving `tenant_id` by querying `tenants` by slug — leads
  never trusted a hardcoded UUID), falling back to the same Phase 1
  console-log stub when Supabase isn't configured. Verified both paths.
- Magic-link auth: `/login`, `/auth/callback`, `/auth/signout`, and
  `middleware.ts` gating `/dashboard`, `/leads/*`, `/settings` (redirects
  to `/login` when unauthenticated or unconfigured).
- CRM dashboard: `/dashboard` (search + status/source/pillar filters,
  HOT/WARM/NURTURE columns, DEMO badges), `/leads/[id]` (full fields,
  score breakdown, outreach timeline, status control, notes, a
  clearly-disabled "generate video page" stub for Phase 3), `/settings`
  (working display-name edit; notification prefs are a placeholder — no
  schema exists yet for them, see `DECISIONS.md`).
- `?demo=1` works without login on `/dashboard` and `/leads/[id]` —
  verified this can only ever surface rows seed.sql marks as demo, never
  real lead data, regardless of what a request tries to filter by.

**How to test it:**
```bash
npm install
npm run lint && npm run typecheck && npm run copy-lint && npm run build
npm test              # RLS + scoring proof tests — see README's
                       # "Running the test suite" for the local-Postgres
                       # setup this needs
npm run dev
```
Also manually verified this phase:
- `npm test` → 10/10 passing from a clean `resetTestDb()` each run.
- `psql -f supabase/seed.sql` against the test DB → exactly 3 HOT / 3
  WARM / 2 NURTURE, matching the hand-computed weights.
- `/dashboard` (no auth, no Supabase config) → `307` to `/login`.
- `/dashboard?demo=1` (no Supabase config) → `200`, renders the "CRM
  isn't connected to a database yet" message instead of crashing.
- `/settings` (no auth) → `307` to `/login`.
- Full Lighthouse CI re-run after this phase's changes (public pages
  weren't touched, but the shared tenant-config rename was worth
  re-checking): still performance ≥0.98, accessibility 1.0,
  best-practices 0.96, SEO 1.0 on all six pages.

**Known gaps / honestly not tested:**
- **No live HTTP round-trip against a real PostgREST-backed Supabase
  project** — this session has no Docker daemon, so there's no way to run
  `supabase start` or stand up PostgREST locally. Everything DB-shaped was
  proven against raw Postgres directly (`tests/rls.test.mjs`) and the
  route/dashboard code was verified via its graceful-degradation path
  (Supabase unconfigured). **The operator should smoke-test the actual
  `app/api/leads/route.ts` insert and the dashboard against a real hosted
  Supabase project** (or `supabase start` with Docker) before trusting
  this in production — see README's "Setting up Supabase."
- Notification preferences on `/settings` are UI-only; no schema exists
  for them yet (§5's `profiles` table doesn't have a settings column, and
  the migrations create "exactly" what §5 specifies). Revisit alongside
  Phase 3's morning-briefing email, which is what these prefs would
  actually control.
- All Phase 1 known gaps (hero video unwired, real logo/headshot still
  missing, `/v/[slug]` deferred to Phase 3, in-memory rate limiting) are
  still open — nothing in Phase 2 touched them.

## Phase 3 — Automation ✅ done

**What's done:**
- `lib/resend.ts` + `lib/twilio.ts` — graceful-degradation send wrappers
  matching the established pattern (real send when creds present,
  console log otherwise). `lib/twilio.ts` also verifies inbound webhook
  signatures via `X-Twilio-Signature` (§8).
- `lib/email/templates.ts` — auto-reply (plain-text ONLY, per §3's
  deliverability rule), morning briefing (text + minimal HTML for
  tap-to-call links), nurture check-in (draft, manual send only).
  Hand-written functions, not the react-email package (see
  `DECISIONS.md`).
- Auto-reply wired into `app/api/leads/route.ts`: fires on a real,
  non-spam insert, logs to `outreach_log` with `ai_generated: true,
  disclosed_ai: false` per §7.4's exact spec.
- `app/api/cron/briefing/route.ts` + `vercel.json` — daily briefing,
  `CRON_SECRET`-protected via the `Authorization: Bearer` header Vercel
  itself sends for scheduled cron requests. Iterates every tenant row
  (not just the one this deployment's `NEXT_PUBLIC_TENANT` points at),
  future-proofed for Phase 4.
- `app/api/webhooks/twilio/route.ts` + `lib/missed-call.ts` — missed-call
  text-back on `CallStatus=no-answer`: creates a `source='missed-call'`
  lead, sends exactly one compliant text (consent_at stays NULL), checks
  STOP suppression first (`lib/suppression.ts`, built on `outreach_log`
  since §5's schema has no dedicated opt-out table). `/dev/simulate-missed-call`
  and `/dev/stop-simulator` exercise the same logic without real Twilio
  creds — both self-disable once Twilio *is* configured, so they can't
  create fake leads or fire real texts in production.
- `/v/[slug]` video pages + `opengraph-image.tsx` (next/og's built-in
  Satori wrapper, no new dependency): noindex, excluded from sitemap,
  robots-disallowed. "Generate video page" on the lead-detail screen now
  actually creates the slug and defaults to the tenant's previously-unused
  `public/media/hero.mp4`; an agent can paste a real recorded video URL
  afterward.
- NURTURE-bucket leads get a "Send check-in email" button on lead detail
  — manual only, no automated sequence, hidden when the lead has no
  email on file.
- **Real bug caught and fixed while checking Vercel deploy-readiness:**
  every automated send was using the operator's Gmail address as the
  Resend `from` — which Resend rejects, since `from` must be on a
  domain you've verified with them. Added `lib/email/from-address.ts`
  and wired the already-documented-but-unused `RESEND_FROM_EMAIL` env
  var into all three send sites.
- Fixed a real schema gap Phase 2 didn't anticipate: `email`,
  `property_address`, `situation`, `consent_text`, `consent_at` are now
  nullable on `leads` (new migration, not an edit to Phase 2's) — the
  missed-call ingest path only ever has a phone number.
- Full "Deploying to Vercel" README section: env var checklist, cron
  registration, the `CRON_SECRET` convention, and the known in-memory
  rate-limiting caveat under serverless horizontal scaling.

**How to test it:**
```bash
npm install
npm run lint && npm run typecheck && npm run copy-lint && npm run build
npm test              # 11/11 passing, including the new missed-call-shaped
                       # insert test
npm run dev
```
Manually verified this phase:
- `/dev/simulate-missed-call` end-to-end via a real (non-JS) form POST
  replicating exactly what a browser sends for a Server Action: `303`
  redirect, `[missed-call:stub] would create lead + text` logged
  (Supabase unconfigured in this environment).
- `/api/cron/briefing`: `401` with no/wrong `Authorization` header,
  correctly rejecting unauthenticated cron-route access.
- `/v/nonexistent` → `404`; `/robots.txt` disallows `/v/`, `/dashboard`,
  `/leads/`, `/settings`, `/login`, `/api`, and `/dev/` (the last four
  disallow entries were a gap from Phase 1/2, fixed here).
- Full Lighthouse CI + the RLS/scoring test suite re-run clean after
  every change this phase, not just at the end.

**Known gaps / honestly not tested:**
- **No live Resend or Twilio send was made** — no API keys exist in this
  environment. Every send path is verified through its graceful-
  degradation (stub) branch, the same limitation as Phase 2's Supabase
  gap. Before trusting this in production: send one real auto-reply, one
  real morning briefing, and place one real test call that goes to
  voicemail against a live Twilio number.
- The morning-briefing cron's UTC time is a fixed offset from Pacific
  time, not DST-aware — up to an hour early in winter, never late (see
  `DECISIONS.md`).
- Real `logo.png` and a real headshot photo are still outstanding (same
  gap since Phase 0/1) — the video page's agent-photo placeholder reuses
  the press-kit "initials" treatment for the same reason.
- Rate limiting is still in-memory/per-instance — flagged again in this
  phase's README Vercel section since it matters more once actually
  deployed to serverless infrastructure.

### Post-Phase-3 update — Twilio pulled out (operator request)

No Twilio account exists yet, so Twilio came back out: the `twilio` npm
package is gone, `lib/twilio.ts` is now a pure mock (`sendSms()` always
logs, never calls a real API), and the webhook route dropped signature
verification since there's nothing to verify without real credentials.
**Lead creation and STOP-suppression logic on a simulated missed call
still run for real** against Supabase — only the SMS send itself is
mocked. `/dev/simulate-missed-call` and `/dev/stop-simulator` are now the
permanent way to exercise this feature (no more "disabled once Twilio is
configured," since it never will be until reconnected) and say plainly
in their own copy that this is example behavior pending a real account.
Reconnecting later is additive — see `DECISIONS.md` for exactly what to
restore. This also removed "No live Resend or Twilio send was made" as a
Twilio-shaped gap above: there's no longer a Twilio integration to be
gapped on, by design.

## Phase 4 — White Label ✅ done

**What's done:**
- `OPERATOR.md` — comprehensive handbook for spinning up a second operator's
  site. Covers: what white-labeling means, quick-start for operator #2,
  customization checkpoints (branding, contact, copy, portfolio, FAQ, scoring),
  email setup, CRM customization, monitoring, troubleshooting, and forward path
  to multi-tenant-on-one-domain (Phase 4 stage 2, deferred).
- `scripts/make-tenant.mjs` — interactive scaffolding tool that guides an
  operator through creating a new `tenants/[slug].ts` config file by asking
  them 8 questions (name, license, phone, email, service areas, positioning
  line, hero headline). Generates a fully-typed tenant config with
  `[CUSTOMIZE: ...]` placeholders, updates `tenants/index.ts` automatically,
  and outputs next-steps instructions.
- `tenants/template.ts` — second demo tenant, proving zero Harbison strings
  leak through when a different `NEXT_PUBLIC_TENANT` loads the site. Every
  field is populated with neutral placeholder copy; customization is the
  operator's responsibility per `OPERATOR.md`. Wired into `tenants/index.ts`
  so switching tenants is as simple as setting an env var.

**How to test it:**
```bash
npm run typecheck && npm run lint && npm run build
NEXT_PUBLIC_TENANT=template npm run dev
# Visit http://localhost:3000 — all copy, contact info, nav, etc. read from
# tenants/template.ts, not harbison.ts. No Harbison branding anywhere.
npm run build -- env NEXT_PUBLIC_TENANT=template
# Verifies template tenant builds cleanly to production.
```

**Known gaps / Phase 4 stage 2 (deferred):**
- Host→tenant resolution in `middleware.ts` — currently the middleware only
  handles auth gating, not domain→tenant lookup. Phase 4 stage 2 (not yet
  planned) would extend it to resolve by `Host` header (or SNI, or DNS lookup)
  so multiple operators can run on subdomains of a single Vercel project. See
  the comment in `middleware.ts` about this design.
- Asset segregation for multi-operator on one domain — `public/brand/logo.png`
  and `public/portfolio/` currently live at shared paths. Multi-operator would
  need per-tenant paths or S3/CDN-based asset serving. Deferred pending first
  multi-operator deployment experience.

**Next up — Phase 5+:**
- Verified tenant rotation test (swap `NEXT_PUBLIC_TENANT` between `harbison`
  and `template`, confirm zero data leakage via RLS)
- Real multi-operator pilot (operator #2 creates a live site, shares feedback)
- Host-header resolution (Phase 4 stage 2, when demand justifies)
- Per-property landing pages / market-analysis reports (Phase 5)
- Call recording / personalized video generation (Phase 5)
- Two-way SMS conversation threading (Phase 5+)
