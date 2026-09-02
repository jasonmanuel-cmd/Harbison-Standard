-- NOT a Supabase migration — never apply this to a real Supabase project,
-- which already provides all of this natively. This is a minimal,
-- test-only stand-in for the pieces of Supabase's platform that the real
-- migrations assume exist (the `auth` schema, `auth.uid()`, and the
-- `anon`/`authenticated` roles), so RLS and the scoring trigger can be
-- proven against a bare local Postgres in CI without Docker or the full
-- Supabase CLI stack. Run once per test database, after the real
-- migrations in supabase/migrations/.

create schema if not exists auth;

create table if not exists auth.users (
  id uuid primary key default gen_random_uuid()
);

-- Mirrors Supabase's real auth.uid(): reads the `sub` claim off a
-- session-local setting that tests populate with SET LOCAL before each
-- query, the same mechanism PostgREST uses to pass the caller's JWT
-- claims into Postgres.
create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'sub', '')::uuid
$$;

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
end $$;

grant usage on schema public to anon, authenticated;
grant usage on schema auth to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
