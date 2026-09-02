# The Harbison Standard

Production website + lead-capture + CRM for Nathaniel Harvison (Realtor ·
Developer · Investor, Kern County, CA). Client-owned code, no page
builders, no rented land. Built as a white-labelable base — see
`OPERATOR.md` (added Phase 4) for spinning up a second agent's site from
this same codebase.

This repo is being built in phases (`PHASES.md` tracks status). This
README documents what exists **today**; it will grow with each phase.

## Stack

- **Next.js 14** (App Router, TypeScript) — public marketing pages are
  static-first (`force-static`), CRM pages are dynamic and auth-gated.
- **Tailwind CSS** — brand tokens only (`tailwind.config.ts`), no raw hex
  values in components.
- **Supabase** (Postgres + Auth + RLS) — added Phase 2.
- **Resend** (email) and **Twilio** (SMS/voice) — added Phase 3, with
  graceful degradation to console logging when keys are absent.

See `DECISIONS.md` for every judgment call made where the spec was silent.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in values as later phases require them
npm run dev                  # http://localhost:3000
```

Phase 0 only requires `NEXT_PUBLIC_TENANT` and `NEXT_PUBLIC_SITE_URL` (both
have safe defaults already in `.env.example`). Supabase/Resend/Twilio vars
are not read until Phases 2-3.

## Checks

```bash
npm run lint        # eslint (next/core-web-vitals)
npm run typecheck    # tsc --noEmit
npm run copy-lint    # fair-housing / banned-phrase scan, see §8 of the spec
npm run build        # production build
npm test             # acceptance test suite (added Phase 2+)
```

All of the above run in CI on every push (`.github/workflows/ci.yml`),
plus a Lighthouse CI pass (`lighthouserc.json`) once real pages exist.

## Project structure

```
app/                  Next.js App Router routes
components/           Shared UI (brand mark, wordmark, etc.)
tenants/              Tenant config — single source of truth for brand,
                      contact info, copy, FAQ, nav, scoring weights.
                      See tenants/types.ts for the contract every tenant
                      must satisfy, and tenants/harbison.ts for tenant #1.
scripts/              copy-lint.mjs (CI gate), make-tenant.mjs (Phase 4)
supabase/migrations/  SQL migrations (added Phase 2)
public/brand/         Logo assets
public/media/         Video/image assets (e.g. hero footage)
```

## Multi-tenant / white-label

Every page, email, and JSON-LD block reads brand/contact/copy from a
`TenantConfig` object (`tenants/*.ts`) — never a hardcoded string. Phase 4
adds host-header resolution (`middleware.ts`) and a scaffolding script
(`scripts/make-tenant.mjs`) to stand up a new agent's site from a short
questionnaire.

## Deployment

Deployment instructions (Vercel + Supabase step-by-step, and a self-hosted
Docker/VPS alternative) will be documented here once Phase 2 (Supabase) and
Phase 3 (automations) land — deploying before then would ship a marketing
site with no backend to point at.

## Client ownership

No proprietary lock-in: standard Next.js + Postgres. Data export/delete
instructions will be documented here once the `leads`/`outreach_log` tables
exist (Phase 2).
