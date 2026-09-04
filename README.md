# The Harbison Standard

Production website + lead-capture + CRM for Nathaniel Harbison (Realtor ·
Developer · Investor, Kern County, CA). Client-owned code, no page
builders, no rented land. Built as a white-labelable base — see
`OPERATOR.md` (added Phase 4) for spinning up a second agent's site from
this same codebase.

This repo is being built in phases (`PHASES.md` tracks status). This
README documents what exists **today**; it will grow with each phase.

## Stack

- **Next.js 16** (App Router, TypeScript) — public marketing pages are
  static-first (`force-static`), CRM pages are dynamic and auth-gated.
- **Tailwind CSS** — brand tokens only (`tailwind.config.ts`), no raw hex
  values in components.
- **Supabase** (Postgres + Auth + RLS) — data model, RLS, and the CRM
  dashboard shipped in Phase 2.
- **Resend** (email) — added Phase 3, with graceful degradation to
  console logging when keys are absent.
- **Twilio** (SMS/voice) — not connected yet, by request. The
  missed-call text-back feature (§7.4) ships as a working example
  against mock data (`lib/twilio.ts` always logs instead of sending) —
  see `DECISIONS.md` for what re-adding a real Twilio account involves.

See `DECISIONS.md` for every judgment call made where the spec was silent.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in values as you set up Supabase (below)
npm run dev                  # http://localhost:3000
```

The public site works with zero configuration — `NEXT_PUBLIC_TENANT` and
`NEXT_PUBLIC_SITE_URL` already have safe defaults in `.env.example`, and
the lead form falls back to logging submissions to the console when
Supabase isn't configured (same graceful-degradation pattern §3 requires
for Resend, extended here to local dev with no project set up yet).
Resend vars aren't read until Phase 3. There are no Twilio vars to set —
see above.

## Setting up Supabase

Two ways to get a real database, either works with the same migrations:

**Hosted Supabase project** (recommended for the operator's actual deploy):
1. Create a project at [supabase.com](https://supabase.com).
2. Run every file in `supabase/migrations/` against it, in order — either
   via `supabase db push` (Supabase CLI, linked to your project) or by
   pasting each file into the SQL Editor in order.
3. Insert your tenant row (this is **not** the demo seed — it's the one
   real row your site resolves against by `tenants.slug`):
   ```sql
   insert into tenants (slug, name, config) values (
     'harbison', 'The Harbison Standard',
     '{"scoring": {"situationHigh": 40, "situationMid": 25, "situationPillar": 20, "timelineAsap": 30, "timelineSoon": 15, "hasPhone": 10, "engagementThresholdSeconds": 8, "engagementBonus": 10, "minFormSeconds": 3}}'::jsonb
   );
   ```
   (These weights mirror `tenants/harbison.ts` — see that file's scoring
   block if you want to tune them; the DB row is what actually runs.)
4. Optionally run `supabase/seed.sql` too if you want the 8 fake DEMO
   leads for a sales walkthrough (`/dashboard?demo=1` shows only rows it
   inserts — see below).
5. Copy your project's URL, anon key, and service role key into
   `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`).
6. In Supabase Auth settings, invite/create the first user — the first
   registered email is the tenant's `owner` (insert their `profiles` row
   manually the first time, pointing `id` at their `auth.users` id and
   `tenant_id` at the row from step 3).

**Supabase CLI, local stack** (`supabase start`, needs Docker): standard
alternative for local development against a full local Supabase (Auth +
PostgREST + Studio, not just Postgres). Run the same migrations via
`supabase db reset` (applies everything in `supabase/migrations/` plus
`supabase/seed.sql` automatically) and point `.env.local` at the local
URLs/keys the CLI prints.

## Running the test suite

```bash
npm test
```

`tests/rls.test.mjs` proves the RLS matrix and the scoring trigger against
a **real local Postgres** — not mocks. It needs a Postgres server the
`postgres` OS/DB user can reach (`sudo -u postgres psql`); on a box with
`postgresql` installed, `sudo service postgresql start` is usually enough.
It works without Docker or the Supabase CLI: `tests/fixtures/auth-shim.sql`
is a minimal stand-in for just the pieces of Supabase's platform (the
`auth` schema, `auth.uid()`, the `anon`/`authenticated` roles) that a bare
Postgres doesn't have — see the comment at the top of that file and
`DECISIONS.md`. It's never applied to a real Supabase project, which
already provides all of it. The suite skips itself with a clear message if
no local Postgres is reachable at all, rather than failing CI for an
unrelated environment reason.

### Verifying multi-tenant isolation (Phase 4)

Phase 4 adds white-label support. Each operator gets their own tenant config,
and RLS guarantees no lead leakage between operators sharing the same Supabase
instance. To verify this manually:

```bash
# Terminal 1: Build and run Harbison
npm run build                           # Default: NEXT_PUBLIC_TENANT=harbison
NEXT_PUBLIC_TENANT=harbison npm run dev # http://localhost:3000

# Terminal 2: Build and run template on different port
NEXT_PUBLIC_TENANT=template npm run build
NEXT_PUBLIC_TENANT=template npm run dev --port 3001  # http://localhost:3001
```

Then test end-to-end:
1. Submit a test lead to Harbison at `http://localhost:3000/sell`
2. Log in to Harbison CRM at `http://localhost:3000/dashboard`
3. Confirm the lead appears on Harbison's board
4. Submit a different test lead to template at `http://localhost:3001/sell`
5. Log in to template CRM at `http://localhost:3001/dashboard`
6. Confirm the second lead appears **only** on template, not Harbison

Both instances share the same `NEXT_PUBLIC_SUPABASE_URL` and keys, but RLS
enforces tenant isolation at the SQL level — not the application layer. See
`OPERATOR.md` for full CRM onboarding and data-isolation verification steps.

## Checks

```bash
npm run lint        # eslint (next/core-web-vitals)
npm run typecheck    # tsc --noEmit
npm run copy-lint    # fair-housing / banned-phrase scan, see §8 of the spec
npm run build        # production build
npm test             # RLS + scoring proof tests (needs local Postgres, see above)
```

All of the above run in CI on every push (`.github/workflows/ci.yml`),
plus a Lighthouse CI pass (`lighthouserc.json`) on every public page.

## Project structure

```
app/                  Next.js App Router routes
  (public pages)       /, /sell, /build, /land, /press, /faq, /thank-you,
                       /privacy, /terms — static-first, JS-optional
  dashboard/           CRM board (auth-gated, or ?demo=1 read-only)
  leads/[id]/          Lead detail (auth-gated, or ?demo=1 read-only)
  settings/            Agent profile
  login/               Magic-link sign-in
  auth/                Magic-link callback + sign-out route handlers
  api/leads/           Lead ingest route handler
components/           Shared UI (brand mark, wordmark, lead form, etc.)
components/crm/        CRM-only UI (board cards, pillar badges, header)
lib/                  Shared logic: situations/consent (lib/situations.ts),
                       rate limiting, JSON-LD, Supabase clients
                       (lib/supabase/), lead queries, scoring breakdown
tenants/              Tenant config — single source of truth for brand,
                      contact info, copy, FAQ, nav, scoring weights.
                      See tenants/types.ts for the contract every tenant
                      must satisfy, and tenants/harbison.ts for tenant #1.
scripts/              copy-lint.mjs (CI gate), make-tenant.mjs (Phase 4)
supabase/migrations/  SQL migrations — schema, RLS, scoring trigger (§5)
supabase/seed.sql     8 fake DEMO leads, safe to re-run
tests/                RLS/scoring proof tests + the local-Postgres harness
public/brand/         Logo assets
public/media/         Video/image assets (e.g. hero footage)
```

## Multi-tenant / white-label

Every page, email, and JSON-LD block reads brand/contact/copy from a
`TenantConfig` object (`tenants/*.ts`) — never a hardcoded string. Phase 4
adds host-header resolution (`middleware.ts`) and a scaffolding script
(`scripts/make-tenant.mjs`) to stand up a new agent's site from a short
questionnaire.

## Deploying to Vercel

1. Push this repo to GitHub (or GitLab/Bitbucket) and import it in
   [Vercel](https://vercel.com/new) — it's a standard Next.js app, so
   Vercel auto-detects the framework and build command with zero config.
2. Finish "Setting up Supabase" above first if you haven't (migrations
   run, tenant row inserted).
3. In the Vercel project's Settings → Environment Variables, set:
   - `NEXT_PUBLIC_SITE_URL` — your real domain once you have one (e.g.
     `https://theharbisonstandard.com`); update `tenants/harbison.ts`'s
     `domains` array too once a domain is live.
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
     `SUPABASE_SERVICE_ROLE_KEY` — from your Supabase project settings.
   - `RESEND_API_KEY` and `RESEND_FROM_EMAIL` — see the note in
     `.env.example`: `RESEND_FROM_EMAIL` **must** be on a domain you've
     verified with Resend (a Gmail address won't work as a `from`).
     Automated emails still work without these set — they log to
     console/`outreach_log` instead of sending (§3's graceful-degradation
     rule) — but nothing actually reaches a lead's inbox until they're
     configured.
   - No Twilio variables to set — that integration isn't connected yet
     by request (see `DECISIONS.md`). `/dev/simulate-missed-call` and
     `/dev/stop-simulator` demonstrate the missed-call flow against mock
     data on any deployment. When ready to connect a real Twilio number,
     see the note at the top of `lib/twilio.ts`.
   - `CRON_SECRET` — generate with `openssl rand -hex 32`. Vercel
     automatically sends it as `Authorization: Bearer $CRON_SECRET` on
     the cron-triggered request defined in `vercel.json`, which is what
     `app/api/cron/briefing/route.ts` checks against.
4. Deploy. `vercel.json`'s `crons` entry registers the morning-briefing
   schedule automatically — no separate setup step on Vercel's side.
5. Confirm the cron is registered: Vercel project → Cron Jobs tab. You
   can also trigger `/api/cron/briefing` manually (with the
   `Authorization: Bearer <CRON_SECRET>` header) to test it without
   waiting for the schedule.

**Known limitation on serverless hosts** (Vercel included):
`lib/rate-limit.ts`'s 5-requests/hour-per-IP limit is in-memory and
process-local — see `DECISIONS.md`. It still functions (each serverless
instance enforces its own limit), but isn't a hard global guarantee under
Vercel's horizontal scaling. Move it to a `leads`-table query (count
recent rows by IP) if that gap matters before launch.

**Self-hosting instead of Vercel:** this is a standard Next.js app with
no Vercel-specific APIs beyond the two things above (the `vercel.json`
cron and the `CRON_SECRET` header convention) — a Docker container or a
VPS running `next start` works identically, just trigger
`/api/cron/briefing` on your own schedule (any cron daemon, e.g. system
`cron` calling `curl` with the `Authorization` header) instead of relying
on `vercel.json`.

## Client ownership

No proprietary lock-in: standard Next.js + Postgres, no vendor-specific
runtime beyond what Supabase itself is (itself just Postgres + a few
open-source services, self-hostable if ever needed).

**Data export:** every table is plain Postgres — `pg_dump` the database,
or export any table to CSV from the Supabase Studio table editor, or
query it directly (`select * from leads`, `select * from outreach_log`)
with any Postgres client using the connection string from your project's
settings.

**Data deletion:** deleting a `tenants` row cascades to delete every
`profiles`, `leads`, and `outreach_log` row for that tenant (all four
tables' foreign keys are `on delete cascade`, per the migrations in
`supabase/migrations/`). To delete a single lead and its outreach history,
delete that one `leads` row — `outreach_log` rows for it cascade too.
