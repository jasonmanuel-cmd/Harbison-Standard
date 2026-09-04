# Operator Handbook

This document guides a second agent (or the same agent across additional markets) through spinning up a new branded site from the Harbison Standard white-label codebase.

## What this codebase is

The Harbison Standard is a Next.js + Supabase real-estate CRM platform designed from the ground up to be operator-agnostic. Every page, email, form, and JSON-LD block reads brand/contact/copy from a `TenantConfig` object — never hardcoded strings. A `NEXT_PUBLIC_TENANT` environment variable selects which tenant config loads at build time.

**Phase 4 goal:** make adding a second operator as simple as filling out a questionnaire and running a script.

## Who is an operator?

An operator is a licensed real-estate professional who owns a property, their contact information, their brand strategy, and their regional focus (Bakersfield, Tehachapi, San Diego, statewide, nationwide, etc.). A single deployment (Vercel project) serves one operator.

Multi-operator multi-tenancy (multiple agents on one domain via host-header resolution) is architected but not yet implemented — Phase 4 stage 2, deferred pending first live multi-operator deployment experience.

## Quick start: spinning up operator #2

### 1. Create a new tenant config file

```bash
node scripts/make-tenant.mjs
```

This interactive script asks you:
- Real name (e.g., "Jamie Chen")
- Agent name or brand (e.g., "Chen Real Estate" or just "Jamie")
- License number (CA DRE #XXXXXXX)
- Phone number and email
- Service areas (comma-separated cities/regions)
- Primary service focus (Sell / Buy / Build / Multi)
- Hero headline
- Logo path (optional; defaults to text wordmark until you provide one)

The script generates a new file at `tenants/chen.ts` (slug derived from name) with the same shape as `tenants/harbison.ts`, fully typed against `tenants/types.ts`.

### 2. Insert the tenant row into Supabase

Once your `tenants/chen.ts` file is generated and you're happy with the copy:

```sql
insert into tenants (slug, name, config) values (
  'chen',
  'Chen Real Estate',
  '{"scoring": {"situationHigh": 40, "situationMid": 25, "situationPillar": 20, "timelineAsap": 30, "timelineSoon": 15, "hasPhone": 10, "engagementThresholdSeconds": 8, "engagementBonus": 10, "minFormSeconds": 3}}'::jsonb
);
```

(The scoring weights are the same baseline as Harbison; tune them in the dashboard or the SQL row as you learn what works for your market.)

### 3. Deploy to a new Vercel project

1. Commit your new `tenants/chen.ts` file to the repo.
2. Create a new Vercel project pointing at the same GitHub repo.
3. In the Vercel Environment Variables panel, set:
   - `NEXT_PUBLIC_TENANT=chen` (tells the build to load your tenant config)
   - Same `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` as Harbison (shared database)
   - Same `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CRON_SECRET` (or a new `CRON_SECRET` if you want isolated cron scheduling)
4. Deploy.

**That's it.** Your Chen Real Estate site now runs against the same Supabase instance, same Resend account, same backend infrastructure — but your pages, emails, and JSON-LD all read Chen's branding and contact info.

### 4. Initialize Chen's first admin user

In Supabase Auth → Users, create a new user for Chen (or invite their email). Then insert their profile row:

```sql
insert into profiles (id, tenant_id, display_name) values (
  'CHEN_AUTH_UID_HERE',
  (select id from tenants where slug = 'chen'),
  'Jamie Chen'
);
```

They can now log in at `your-chen-domain.com/login` and see their own CRM dashboard.

## Verifying your tenant is isolated

Visit your new domain's `/api/leads` route with a test lead submission (curl POST to `/api/leads` with a `situation=sell-probate` body). The lead should:
- Appear on your Chen dashboard (`/dashboard`)
- **NOT** appear on Harbison's dashboard
- Trigger a Chen-branded auto-reply (if Resend is configured)

Then verify the opposite: submit a test lead from Harbison's public form and confirm it appears **only** on Harbison's dashboard.

RLS enforces this hard — no lead can ever leak between tenants, no matter what request tricks you try.

## Customization checkpoints

### Branding

Drop your real logo PNG at `public/brand/logo.png` and set `hasRealLogo: true` in your tenant config. The header and press kit will use it; the wordmark fallback disappears.

A headshot photo for the press kit's one-sheet and video pages goes at `public/media/headshot.webp` (referenced by path in your tenant config).

### Contact & Compliance

Your `contact.licenseLine` and `complianceFooter` appear on every page. Update them to match your actual license jurisdiction and fair-housing statement.

The footer also pulls from `contact.displayName`, `contact.roleLine`, `contact.phone`, `contact.email` — make sure these are correct.

### Copy

Every public page reads from `copy.*` fields in your tenant config: hero headlines, service descriptions, FAQ answers, portfolio heading text. Keep the spec's required structure, but personalize every sentence.

### Portfolio

Replace `copy.soldProperties` with your own closed deals. Keep the same structure — address, price, specs, description, and a `photos` array (at least one photo, up to five). Photos load from `public/portfolio/[id]/[n].{jpg,webp}` — set them up the same way Harbison's are organized.

### FAQ

The four FAQ entries (cash sales, probate, cost comparison, SB 800 warranty) are Harbison-specific. Replace them with Q&A that matters to **your** market. Keep the same shape: `id`, `question`, `answer`, and optionally `verifyWithCounsel: true` for legal disclaimers.

### Scoring weights

The default weights (situationHigh=40, timelineAsap=30, etc.) are tuned for Harbison's business. Adjust them in the Supabase dashboard's `tenants` row under `config->'scoring'` to match your qualifying criteria. No code change needed — the trigger reads these at insert time.

## Email setup: Resend verified domain

Automated emails (auto-reply, morning briefing, nurture check-in) are sent `from` an address on a domain you control. Verify the domain with Resend:

1. Add your domain to Resend (Settings → Domains).
2. Add the DNS records Resend gives you.
3. Once verified, set `RESEND_FROM_EMAIL=leads@yourdomain.com` in your Vercel environment variables.

If you don't have `RESEND_FROM_EMAIL` set, emails still log to console and to `outreach_log` for testing — but nothing actually reaches a lead's inbox (Resend rejects the send with a clear error about an unverified domain).

## CRM + Mobile + Voice: what's wired, what's pending

**Fully wired and working:**
- Lead capture form on public pages
- CRM dashboard (lead board, filtering, status management)
- Lead detail page (notes, outreach history, score breakdown, video page generation)
- Auto-reply email on form submission
- Daily morning briefing email (lists your HOT leads for the day)
- Test missed-call simulator (`/dev/simulate-missed-call`) — creates a lead from a phone number for testing STOP suppression and missed-call workflows

**Pending real Twilio setup:**
- Live phone ingest (voicemail → missed-call lead + text-back)
- Real SMS sending (currently mocked to console)

To connect a real Twilio number later, see the note at the top of `lib/twilio.ts` — it's a credentials-and-a-few-lines change, not a rebuild.

**Not yet built:**
- Two-way SMS conversation threading (Phase 5+)
- Call recording / personalized video generation (listed as Phase 5+)
- Per-property landing pages / market-analysis reports (listed as Phase 5+)

## Customizing the CRM

The dashboard columns (Status, Source, Pillar) and the lead detail fields are read from `lib/leads-query.ts` and `components/crm/` — both are operator-agnostic and work for any tenant without code changes.

To add a new lead field (e.g., "interest level," "preferred contact time"):
1. Add a migration creating a new `leads` column
2. Update `lib/leads-query.ts` to select it
3. Update the lead-detail component to render it
4. Set RLS if the field contains sensitive data

The form on public pages is shared across all operators (`components/LeadForm.tsx`). If you want operator-specific questions or different required fields, fork the form into `tenants/[slug]-form.tsx` and conditionally render it — no global form-field changes needed.

## Rate limiting and DDoS protection

The form submits to `/api/leads` with a 5-requests-per-IP-per-hour rate limit. This is in-memory and per-process — on Vercel's horizontal scaling, each serverless instance enforces its own limit independently.

For a production site expecting real volume, move this to a `leads` table query (count recent rows by IP) so all instances respect the same global limit. See `lib/rate-limit.ts` and the README's rate-limiting caveat.

## Monitoring and support

### Supabase Dashboard

Visit your shared project's SQL Editor to:
- Manually check leads: `select * from leads where tenant_id = (select id from tenants where slug = 'chen')`
- Check outreach history: `select * from outreach_log where lead_id in (select id from leads where tenant_id = ...)`
- Inspect the morning briefing cron's last run: check logs under Edge Function → `briefing` (if it exists in your region)

### Vercel Dashboard

- Deployments: confirm your site rebuilt when you pushed a new tenant config
- Environment Variables: double-check `NEXT_PUBLIC_TENANT` matches your slug
- Functions: check log tail for form submissions, API errors, cron executions
- Analytics (if enabled): track page views, form conversion, engagement

### Local dev against Vercel's shared Supabase

```bash
cp .env.example .env.local
# Fill in Supabase URL and keys (shared with Harbison)
NEXT_PUBLIC_TENANT=chen npm run dev
```

Visit `http://localhost:3000` — you'll see Chen's branding. Submit a test lead from the form and watch it appear on Chen's `/dashboard`.

## Troubleshooting

### "Unknown tenant slug" on build

`NEXT_PUBLIC_TENANT` environment variable doesn't match any file in `tenants/*.ts`. Check:
1. The file exists: `ls tenants/chen.ts`
2. The export is named correctly: `export const chen: TenantConfig = ...`
3. The slug matches `tenants/index.ts`'s import and export

### Leads appear but branded wrong

You're likely on a cached version. Clear browser cache or open an incognito window. If the live site still shows wrong branding:
1. Check `NEXT_PUBLIC_TENANT` in Vercel Environment Variables
2. Confirm the deployment finished successfully
3. Visit the deployment URL directly (not a domain alias) to rule out DNS cache

### No leads in the CRM after submitting the form

1. Check Vercel Function logs for `/api/leads` — any 400/500 errors?
2. If Supabase isn't configured (no `NEXT_PUBLIC_SUPABASE_URL`), the route logs to console instead of the database — check Vercel's Function logs
3. Try `/dashboard?demo=1` (no login required) to confirm the CRM interface works; if demo leads load, your Supabase connection is fine

### Emails not reaching inboxes

1. Check `outreach_log` in Supabase — does the row exist with the right `channel`/`direction`?
2. If `outreach_log` is empty, Resend rejected the send — check Vercel Function logs for the error (usually "unverified domain")
3. Verify your domain with Resend and set `RESEND_FROM_EMAIL` correctly

## Advanced: multi-tenant on one domain (Phase 4 stage 2)

The architecture is **designed** for host-header resolution — `middleware.ts` already has the comment about Phase 4 extending it. To run multiple tenants on one domain:

1. `middleware.ts` needs a host→tenant lookup (e.g., `harbison.example.com` → `harbison`, `chen.example.com` → `chen`)
2. Inject the resolved tenant slug into a request header or context so `getTenant()` reads it instead of `NEXT_PUBLIC_TENANT`
3. One Vercel project, one build, all tenants' configs load at runtime instead of build time

This is a design checkpoint for a future phase — the groundwork is in place, but it requires:
- How to resolve domains to tenants (hardcoded mapping, Supabase lookup, wildcard DNS?)
- How to handle assets (operator #1's logo.png can't be the same path as operator #2's)
- Whether to share `public/portfolio/` or segregate it by tenant

File an issue or ask for guidance before tackling this.

## Questions?

This is a white-label codebase owned by you — no proprietary lock-in. Standard Next.js, Postgres, open-source tools. Any change you make to your tenant config or the shared infrastructure is yours to own.

For issues with your specific deployment (DNS, Vercel, Supabase, Resend), use those platforms' documentation and support. For bugs or design questions about the shared codebase, check `DECISIONS.md` and `PHASES.md` for context before opening an issue.

Happy launching.
