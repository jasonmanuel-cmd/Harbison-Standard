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
- `tenants/harbison.ts` — tenant #1, fully populated: Nathaniel Harvison's
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

**Next up — Phase 3:** auto-reply (Resend), the 7am morning-briefing cron,
Twilio missed-call text-back + STOP suppression, video pages + OG
generation, and the nurture-bucket draft email.
