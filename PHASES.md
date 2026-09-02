# Phases

Status of each build phase. Updated at the end of every phase, before
commit, per the spec's stop-and-review gate.

## Phase 0 — Scaffold ✅ done

**What's done:**
- Next.js 14 (App Router) + TypeScript project, hand-scaffolded (no
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
- `public/media/kern-county-hero.mp4` — hero video asset preserved from
  the session upload, not yet wired into any page (Phase 1 decision).

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

**Next up — Phase 1:** all public pages (`/sell`, `/build`, `/land`,
`/press`, `/faq`, `/thank-you`, `/v/[slug]`), forms posting to route
handlers, GEO layer (`robots.ts`, `sitemap.ts`, `llms.txt`, JSON-LD), press
kit + one-sheet.
