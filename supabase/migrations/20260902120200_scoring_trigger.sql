-- Phase 2 (§5): fn_score_lead() is the single source of truth for lead
-- scoring, regardless of ingest path (web form, missed-call webhook,
-- manual CRM entry, import). Application code (app/api/leads/route.ts,
-- the Twilio webhook in Phase 3, etc.) must never set `leads.score` or
-- compute a bucket itself — it only supplies the raw inputs (situation,
-- timeline, phone, form_seconds_open, and flagged_spam for the honeypot
-- case, since the honeypot value itself isn't a stored column).
--
-- Weights are read from `tenants.config->'scoring'` on every call, not
-- hardcoded, so they're tunable from the CRM later without a migration.
-- Missing/malformed config falls back to 0 for every weight rather than
-- raising — an under-scored lead (falls into NURTURE) is a far safer
-- failure mode than losing the submission entirely.

create or replace function public.fn_score_lead()
returns trigger
language plpgsql
as $$
declare
  v_scoring jsonb;
  v_situation_points int := 0;
  v_timeline_points int := 0;
  v_phone_points int := 0;
  v_engagement_points int := 0;
  v_score int := 0;
  v_min_form_seconds int;
  v_engagement_threshold int;
  v_is_spam boolean;
begin
  select config -> 'scoring' into v_scoring from public.tenants where id = new.tenant_id;

  v_min_form_seconds := coalesce((v_scoring ->> 'minFormSeconds')::int, 3);
  v_engagement_threshold := coalesce((v_scoring ->> 'engagementThresholdSeconds')::int, 8);

  v_is_spam := coalesce(new.flagged_spam, false)
    or (new.form_seconds_open is not null and new.form_seconds_open < v_min_form_seconds);

  if v_is_spam then
    new.flagged_spam := true;
    new.score := 0;
    return new;
  end if;

  v_situation_points := case new.situation
    when 'sell-probate' then coalesce((v_scoring ->> 'situationHigh')::int, 0)
    when 'sell-inherited' then coalesce((v_scoring ->> 'situationHigh')::int, 0)
    when 'sell-nod' then coalesce((v_scoring ->> 'situationHigh')::int, 0)
    when 'land' then coalesce((v_scoring ->> 'situationMid')::int, 0)
    when 'sell-landlord' then coalesce((v_scoring ->> 'situationMid')::int, 0)
    when 'build' then coalesce((v_scoring ->> 'situationPillar')::int, 0)
    when 'invest' then coalesce((v_scoring ->> 'situationPillar')::int, 0)
    else 0 -- 'update' carries no situation bonus per §5's weight table
  end;

  v_timeline_points := case new.timeline
    when 'asap' then coalesce((v_scoring ->> 'timelineAsap')::int, 0)
    when '1-3months' then coalesce((v_scoring ->> 'timelineSoon')::int, 0)
    else 0
  end;

  if new.phone is not null and length(trim(new.phone)) > 0 then
    v_phone_points := coalesce((v_scoring ->> 'hasPhone')::int, 0);
  end if;

  if new.form_seconds_open is not null and new.form_seconds_open >= v_engagement_threshold then
    v_engagement_points := coalesce((v_scoring ->> 'engagementBonus')::int, 0);
  end if;

  v_score := v_situation_points + v_timeline_points + v_phone_points + v_engagement_points;

  new.flagged_spam := false;
  new.score := greatest(0, least(100, v_score));

  return new;
end;
$$;

create trigger trg_score_lead
  before insert or update on public.leads
  for each row
  execute function public.fn_score_lead();
