-- Phase 2 (§5): RLS matrix.
--   anon           — INSERT-only on leads. Nothing else, nowhere.
--   authenticated   — full CRUD scoped to their own tenant_id, on every
--                     table (via current_tenant_id(), defined in the
--                     init-schema migration).
--   service_role    — bypasses RLS by default on Supabase; used only in
--                      server-side route handlers/cron (§5). Never
--                      exposed to the browser.

alter table tenants enable row level security;
alter table profiles enable row level security;
alter table leads enable row level security;
alter table outreach_log enable row level security;

-- No anon policies on tenants/profiles/outreach_log at all — RLS enabled
-- with zero matching policies means zero access for that role, which is
-- exactly "nothing else, nowhere."

create policy "anon can insert leads" on leads
  for insert
  to anon
  with check (true);

create policy "authenticated can select own tenant" on tenants
  for select
  to authenticated
  using (id = public.current_tenant_id());

create policy "authenticated can update own tenant" on tenants
  for update
  to authenticated
  using (id = public.current_tenant_id())
  with check (id = public.current_tenant_id());

create policy "authenticated can select own tenant profiles" on profiles
  for select
  to authenticated
  using (tenant_id = public.current_tenant_id());

create policy "authenticated can insert own tenant profiles" on profiles
  for insert
  to authenticated
  with check (tenant_id = public.current_tenant_id());

create policy "authenticated can update own tenant profiles" on profiles
  for update
  to authenticated
  using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy "authenticated can delete own tenant profiles" on profiles
  for delete
  to authenticated
  using (tenant_id = public.current_tenant_id());

create policy "authenticated can select own tenant leads" on leads
  for select
  to authenticated
  using (tenant_id = public.current_tenant_id());

create policy "authenticated can insert own tenant leads" on leads
  for insert
  to authenticated
  with check (tenant_id = public.current_tenant_id());

create policy "authenticated can update own tenant leads" on leads
  for update
  to authenticated
  using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy "authenticated can delete own tenant leads" on leads
  for delete
  to authenticated
  using (tenant_id = public.current_tenant_id());

create policy "authenticated can select own tenant outreach_log" on outreach_log
  for select
  to authenticated
  using (tenant_id = public.current_tenant_id());

create policy "authenticated can insert own tenant outreach_log" on outreach_log
  for insert
  to authenticated
  with check (tenant_id = public.current_tenant_id());

create policy "authenticated can update own tenant outreach_log" on outreach_log
  for update
  to authenticated
  using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy "authenticated can delete own tenant outreach_log" on outreach_log
  for delete
  to authenticated
  using (tenant_id = public.current_tenant_id());
