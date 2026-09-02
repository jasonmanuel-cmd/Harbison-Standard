# Decisions

Judgment calls made where the spec was silent or ambiguous, newest first.
Each entry: what was decided, why, and what would change it.

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
