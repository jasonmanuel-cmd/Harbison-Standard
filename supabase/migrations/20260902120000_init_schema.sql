-- Phase 2 (§5): core schema. Written against Supabase's platform, which
-- already provides the `auth` schema (auth.users, auth.uid(), etc.) and
-- the `anon`/`authenticated`/`service_role` roles — this migration does
-- not create any of those. For local development against a bare Postgres
-- (no full Supabase stack), see tests/fixtures/auth-shim.sql, which is a
-- test-only stand-in and is never applied to a real Supabase project.

create extension if not exists pgcrypto;

create table tenants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  tenant_id uuid not null references tenants (id) on delete cascade,
  role text not null check (role in ('owner', 'agent')),
  display_name text
);

create index profiles_tenant_id_idx on profiles (tenant_id);

-- SECURITY DEFINER helper resolving the calling user's tenant via their
-- profile row. Chosen over a custom-access-token JWT-claims hook (also a
-- valid way to read "the caller's tenant" per §5's RLS matrix): this
-- needs no Supabase Dashboard configuration step and updates immediately
-- if a profile's tenant_id ever changes, since it queries live instead of
-- reading a claim baked into a token at login time. See DECISIONS.md.
create or replace function public.current_tenant_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select tenant_id from public.profiles where id = auth.uid()
$$;

create table leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  tenant_id uuid not null references tenants (id) on delete cascade,

  source text not null check (
    source in ('home', 'sell', 'build', 'land', 'press', 'missed-call', 'manual', 'import')
  ),
  name text not null,
  phone text not null,
  email text not null,
  property_address text not null,
  city text,

  situation text not null check (
    situation in (
      'sell-probate', 'sell-inherited', 'sell-nod', 'sell-landlord',
      'land', 'build', 'update', 'invest'
    )
  ),
  timeline text check (timeline in ('asap', '1-3months', '3plus')),
  -- Derived from situation (§5). Keep this mapping in sync with
  -- SITUATION_OPTIONS in lib/situations.ts — that file drives the form's
  -- dropdown and this column drives everything downstream in the DB, so
  -- the two must agree even though nothing enforces that across the
  -- Postgres/TypeScript boundary.
  intent_pillar text generated always as (
    case situation
      when 'sell-probate' then 'flip'
      when 'sell-inherited' then 'flip'
      when 'sell-nod' then 'flip'
      when 'sell-landlord' then 'flip'
      when 'build' then 'build'
      when 'update' then 'update'
      when 'land' then 'invest'
      when 'invest' then 'invest'
    end
  ) stored,

  -- TCPA proof (§7.2, §8): stored verbatim per submission.
  consent_text text not null,
  consent_at timestamptz not null,
  ip inet,
  user_agent text,

  -- bot defense (§7.2):
  form_seconds_open int,
  flagged_spam boolean not null default false,

  -- enrichment (nullable, filled later):
  owner_name text,
  apn text,
  est_arv numeric,
  est_repair numeric,
  offer_target numeric,
  years_owned int,

  -- scoring (§5, computed by fn_score_lead() — see the scoring-trigger
  -- migration; never set score/bucket directly from application code):
  score int not null default 0 check (score between 0 and 100),
  bucket text generated always as (
    case
      when score >= 80 then 'hot'
      when score >= 60 then 'warm'
      else 'nurture'
    end
  ) stored,

  -- outreach:
  video_slug text unique,
  video_url text,
  status text not null default 'new' check (
    status in ('new', 'contacted', 'appointment', 'offer_out', 'dead', 'closed')
  ),
  utm jsonb not null default '{}'::jsonb,
  notes jsonb not null default '{}'::jsonb
);

create index leads_tenant_id_idx on leads (tenant_id);
create index leads_bucket_idx on leads (tenant_id, bucket);
create index leads_status_idx on leads (tenant_id, status);
create index leads_created_at_idx on leads (tenant_id, created_at desc);

create table outreach_log (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads (id) on delete cascade,
  created_at timestamptz not null default now(),
  tenant_id uuid not null references tenants (id) on delete cascade,

  channel text not null check (
    channel in ('call', 'text', 'email', 'video-page', 'letter', 'voicemail-drop')
  ),
  direction text not null check (direction in ('out', 'in')),
  body text,
  ai_generated boolean not null default false,
  disclosed_ai boolean not null default false,
  outcome text
);

create index outreach_log_lead_id_idx on outreach_log (lead_id);
create index outreach_log_tenant_id_idx on outreach_log (tenant_id);
