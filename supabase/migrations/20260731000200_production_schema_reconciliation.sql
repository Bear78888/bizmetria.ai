begin;

-- Reconciles a pre-migration production schema with platform foundation 20260731000100.
-- This file intentionally preserves all existing tables, columns, rows, buckets, and policies.

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;
create extension if not exists citext with schema extensions;

create schema if not exists app_private;
revoke all on schema app_private from public;
grant usage on schema app_private to authenticated, service_role;

-- Production reconciliation notes:
-- - public.profiles pre-dated Supabase migration history and already contained live rows.
-- - Its existing id PK/FK, Stripe/subscription columns, rows, and legacy policy name are preserved.
-- - public.disputes and the recordings, rml-videos, and screenshots buckets belong to the
--   pre-existing application surface and are intentionally outside this migration.
-- - The statements below are additive and fail closed when a safe compatibility condition
--   cannot be proven. No schema reset or existing-row deletion is performed.

do $profiles_create$
begin
  if to_regclass('public.profiles') is null then
    execute $ddl$
      create table if not exists public.profiles (
        id uuid primary key references auth.users (id) on delete cascade,
        email extensions.citext not null,
        display_name text,
        preferred_locale text not null default 'en',
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now(),
        deleted_at timestamptz,
        constraint profiles_preferred_locale_check check (preferred_locale in ('en', 'es'))
      )
    $ddl$;
  end if;
end
$profiles_create$;

alter table public.profiles
  add column if not exists email extensions.citext,
  add column if not exists display_name text,
  add column if not exists preferred_locale text default 'en',
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now(),
  add column if not exists deleted_at timestamptz;

do $profiles_email_type$
declare
  email_udt text;
begin
  select c.udt_name
  into email_udt
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'profiles'
    and c.column_name = 'email';

  if email_udt = 'text' then
    alter table public.profiles
      alter column email type extensions.citext
      using email::extensions.citext;
  elsif email_udt <> 'citext' then
    raise exception 'public.profiles.email has incompatible type %', email_udt;
  end if;
end
$profiles_email_type$;

update public.profiles p
set email = u.email::extensions.citext
from auth.users u
where p.id = u.id
  and p.email is null;

update public.profiles
set preferred_locale = 'en'
where preferred_locale is null;

update public.profiles
set created_at = now()
where created_at is null;

update public.profiles
set updated_at = now()
where updated_at is null;

do $profiles_compatibility$
begin
  if exists (select 1 from public.profiles where email is null) then
    raise exception 'Cannot reconcile public.profiles: a live row has no Auth email';
  end if;

  if exists (
    select 1
    from public.profiles
    where preferred_locale not in ('en', 'es')
  ) then
    raise exception 'Cannot reconcile public.profiles: unsupported preferred_locale';
  end if;

  if exists (
    select lower(email::text)
    from public.profiles
    where deleted_at is null
    group by lower(email::text)
    having count(*) > 1
  ) then
    raise exception 'Cannot reconcile public.profiles: duplicate active email';
  end if;
end
$profiles_compatibility$;

alter table public.profiles
  alter column email set not null,
  alter column preferred_locale set default 'en',
  alter column preferred_locale set not null,
  alter column created_at set default now(),
  alter column created_at set not null,
  alter column updated_at set default now(),
  alter column updated_at set not null;

do $profiles_constraints$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname = 'profiles_preferred_locale_check'
  ) then
    alter table public.profiles
      add constraint profiles_preferred_locale_check
      check (preferred_locale in ('en', 'es')) not valid;
    alter table public.profiles
      validate constraint profiles_preferred_locale_check;
  end if;
end
$profiles_constraints$;

create unique index if not exists profiles_email_unique_active
  on public.profiles (email)
  where deleted_at is null;

do $profiles_legacy_policy$
begin
  if exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'Users can view own profile'
  ) then
    alter policy "Users can view own profile"
      on public.profiles
      to authenticated
      using (id = (select auth.uid()) and deleted_at is null);
  end if;
end
$profiles_legacy_policy$;

create table if not exists public.admin_roles (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  role text not null,
  is_active boolean not null default true,
  granted_by uuid references public.profiles (id) on delete set null,
  granted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint admin_roles_role_check check (role in ('admin', 'reviewer', 'support'))
);

create table if not exists public.businesses (
  id uuid primary key default extensions.gen_random_uuid(),
  owner_profile_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  website text,
  business_type text,
  industry text,
  team_size integer,
  timezone text not null default 'America/Los_Angeles',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint businesses_name_not_blank check (length(trim(name)) > 0),
  constraint businesses_team_size_check check (
    team_size is null or team_size between 1 and 100000
  ),
  constraint businesses_metadata_object_check check (jsonb_typeof(metadata) = 'object')
);

create table if not exists public.leads (
  id uuid primary key default extensions.gen_random_uuid(),
  owner_profile_id uuid references public.profiles (id) on delete set null,
  business_id uuid references public.businesses (id) on delete set null,
  name text not null,
  business_name text not null,
  website text,
  email extensions.citext not null,
  phone text,
  preferred_locale text not null,
  source text not null default 'public_free_assessment',
  status text not null default 'captured',
  idempotency_key text not null unique,
  captured_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint leads_preferred_locale_check check (preferred_locale in ('en', 'es')),
  constraint leads_status_check check (
    status in ('captured', 'qualified', 'checkout_started', 'converted', 'suppressed', 'deleted')
  ),
  constraint leads_contact_name_check check (
    length(trim(name)) > 0 and length(trim(business_name)) > 0
  )
);

create table if not exists public.consents (
  id uuid primary key default extensions.gen_random_uuid(),
  lead_id uuid references public.leads (id) on delete cascade,
  profile_id uuid references public.profiles (id) on delete cascade,
  channel text not null,
  status text not null,
  policy_version text not null,
  capture_source text not null,
  evidence jsonb not null default '{}'::jsonb,
  granted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint consents_subject_check check (lead_id is not null or profile_id is not null),
  constraint consents_channel_check check (
    channel in ('email_marketing', 'sms_marketing', 'transactional', 'voice_recording')
  ),
  constraint consents_status_check check (status in ('granted', 'denied', 'revoked')),
  constraint consents_evidence_object_check check (jsonb_typeof(evidence) = 'object'),
  constraint consents_granted_timestamp_check check (
    status <> 'granted' or granted_at is not null
  ),
  constraint consents_revoked_timestamp_check check (
    status <> 'revoked' or revoked_at is not null
  )
);

create unique index if not exists consents_active_subject_channel_unique
  on public.consents (
    coalesce(lead_id, '00000000-0000-0000-0000-000000000000'::uuid),
    coalesce(profile_id, '00000000-0000-0000-0000-000000000000'::uuid),
    channel,
    created_at
  );

create table if not exists public.free_assessments (
  id uuid primary key default extensions.gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  owner_profile_id uuid references public.profiles (id) on delete set null,
  business_id uuid references public.businesses (id) on delete set null,
  preferred_locale text not null,
  contract_version text not null default 'free-audit/1.0.0',
  status text not null default 'started',
  idempotency_key text not null unique,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  scored_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint free_assessments_locale_check check (preferred_locale in ('en', 'es')),
  constraint free_assessments_status_check check (
    status in ('started', 'submitted', 'scored', 'abandoned', 'invalidated')
  )
);

create table if not exists public.free_assessment_answers (
  id uuid primary key default extensions.gen_random_uuid(),
  free_assessment_id uuid not null references public.free_assessments (id) on delete cascade,
  question_id text not null,
  answer_value jsonb not null,
  canonical_answer_ids text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint free_assessment_answers_question_check check (
    question_id ~ '^Q(0[1-9]|1[01])$'
  ),
  unique (free_assessment_id, question_id)
);

create table if not exists public.opportunity_scores (
  id uuid primary key default extensions.gen_random_uuid(),
  free_assessment_id uuid not null unique
    references public.free_assessments (id) on delete cascade,
  lead_response_follow_up smallint not null,
  manual_work smallint not null,
  systems_data smallint not null,
  strategic_priority_urgency smallint not null,
  opportunity_breadth smallint not null,
  total_score smallint generated always as (
    lead_response_follow_up
    + manual_work
    + systems_data
    + strategic_priority_urgency
    + opportunity_breadth
  ) stored,
  score_band text not null,
  opportunity_areas jsonb not null default '[]'::jsonb,
  algorithm_version text not null default 'ai-opportunity-score/1.0.0',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint opportunity_scores_lead_response_check check (
    lead_response_follow_up between 0 and 30
  ),
  constraint opportunity_scores_manual_work_check check (manual_work between 0 and 25),
  constraint opportunity_scores_systems_data_check check (systems_data between 0 and 20),
  constraint opportunity_scores_strategy_check check (
    strategic_priority_urgency between 0 and 15
  ),
  constraint opportunity_scores_breadth_check check (opportunity_breadth between 0 and 10),
  constraint opportunity_scores_total_check check (total_score between 0 and 100),
  constraint opportunity_scores_band_check check (
    (total_score between 0 and 24 and score_band = 'FOCUSED')
    or (total_score between 25 and 44 and score_band = 'MODERATE')
    or (total_score between 45 and 64 and score_band = 'STRONG')
    or (total_score between 65 and 79 and score_band = 'HIGH')
    or (total_score between 80 and 100 and score_band = 'VERY_HIGH')
  ),
  constraint opportunity_scores_areas_check check (
    jsonb_typeof(opportunity_areas) = 'array'
    and jsonb_array_length(opportunity_areas) <= 3
  )
);

create table if not exists public.orders (
  id uuid primary key default extensions.gen_random_uuid(),
  customer_profile_id uuid references public.profiles (id) on delete set null,
  lead_id uuid references public.leads (id) on delete set null,
  business_id uuid references public.businesses (id) on delete set null,
  product_code text not null default 'bizmetria_business_assessment',
  currency text not null default 'usd',
  amount_subtotal integer not null default 29900,
  amount_discount integer not null default 0,
  amount_tax integer not null default 0,
  amount_total integer generated always as (
    amount_subtotal - amount_discount + amount_tax
  ) stored,
  status text not null default 'created',
  provider_mode text not null default 'test',
  stripe_checkout_session_id text unique,
  stripe_customer_id text,
  idempotency_key text not null unique,
  checkout_expires_at timestamptz,
  paid_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint orders_customer_reference_check check (
    customer_profile_id is not null or lead_id is not null
  ),
  constraint orders_currency_check check (currency = 'usd'),
  constraint orders_price_check check (
    amount_subtotal = 29900
    and amount_discount between 0 and 19900
    and amount_tax >= 0
    and amount_total >= 0
  ),
  constraint orders_status_check check (
    status in (
      'created',
      'checkout_open',
      'checkout_expired',
      'payment_pending',
      'paid',
      'payment_failed',
      'cancelled',
      'refund_pending',
      'partially_refunded',
      'refunded'
    )
  ),
  constraint orders_test_mode_only_check check (provider_mode = 'test')
);

create table if not exists public.payments (
  id uuid primary key default extensions.gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete restrict,
  provider text not null default 'stripe',
  provider_mode text not null default 'test',
  stripe_payment_intent_id text unique,
  stripe_charge_id text unique,
  amount integer not null,
  currency text not null default 'usd',
  status text not null,
  failure_code text,
  receipt_reference text,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint payments_provider_check check (provider = 'stripe'),
  constraint payments_test_mode_only_check check (provider_mode = 'test'),
  constraint payments_amount_check check (amount >= 0 and currency = 'usd'),
  constraint payments_status_check check (
    status in (
      'pending',
      'processing',
      'succeeded',
      'failed',
      'refund_pending',
      'partially_refunded',
      'refunded'
    )
  )
);

create table if not exists public.promotion_redemptions (
  id uuid primary key default extensions.gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  stripe_promotion_code_id text not null,
  stripe_coupon_id text,
  discount_amount integer not null,
  status text not null default 'applied',
  redeemed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint promotion_redemptions_discount_check check (
    discount_amount between 4900 and 19900
  ),
  constraint promotion_redemptions_status_check check (
    status in ('applied', 'removed', 'consumed', 'reversed')
  ),
  unique (order_id, stripe_promotion_code_id)
);

create table if not exists public.paid_assessments (
  id uuid primary key default extensions.gen_random_uuid(),
  order_id uuid not null unique references public.orders (id) on delete restrict,
  customer_profile_id uuid not null references public.profiles (id) on delete restrict,
  business_id uuid references public.businesses (id) on delete set null,
  preferred_locale text not null,
  contract_version text not null default 'paid-assessment/1.0.0',
  status text not null default 'not_started',
  questionnaire_data jsonb not null default '{}'::jsonb,
  completion_state jsonb not null default '{}'::jsonb,
  started_at timestamptz,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint paid_assessments_locale_check check (preferred_locale in ('en', 'es')),
  constraint paid_assessments_status_check check (
    status in (
      'not_started',
      'in_progress',
      'questionnaire_complete',
      'interview_ready',
      'interview_complete',
      'analysis_pending',
      'under_review',
      'completed',
      'cancelled'
    )
  ),
  constraint paid_assessments_questionnaire_object_check check (
    jsonb_typeof(questionnaire_data) = 'object'
  ),
  constraint paid_assessments_completion_object_check check (
    jsonb_typeof(completion_state) = 'object'
  )
);

create table if not exists public.interview_sessions (
  id uuid primary key default extensions.gen_random_uuid(),
  paid_assessment_id uuid not null references public.paid_assessments (id) on delete cascade,
  preferred_locale text not null,
  provider text not null default 'retell',
  provider_mode text not null default 'test',
  provider_agent_id text,
  status text not null default 'created',
  attempt_number integer not null default 1,
  started_at timestamptz,
  ended_at timestamptz,
  failure_code text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint interview_sessions_locale_check check (preferred_locale in ('en', 'es')),
  constraint interview_sessions_provider_check check (provider = 'retell'),
  constraint interview_sessions_test_mode_only_check check (provider_mode = 'test'),
  constraint interview_sessions_attempt_check check (attempt_number between 1 and 10),
  constraint interview_sessions_status_check check (
    status in (
      'created',
      'scheduled',
      'calling',
      'in_progress',
      'interrupted',
      'completed',
      'failed',
      'cancelled'
    )
  ),
  constraint interview_sessions_metadata_object_check check (jsonb_typeof(metadata) = 'object')
);

create table if not exists public.call_records (
  id uuid primary key default extensions.gen_random_uuid(),
  interview_session_id uuid not null references public.interview_sessions (id) on delete cascade,
  provider_call_id text not null unique,
  status text not null,
  recording_storage_path text,
  recording_status text not null default 'not_requested',
  provider_metadata jsonb not null default '{}'::jsonb,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint call_records_status_check check (
    status in ('registered', 'started', 'ended', 'analyzed', 'failed')
  ),
  constraint call_records_recording_status_check check (
    recording_status in ('not_requested', 'pending', 'available', 'unavailable', 'deleted')
  ),
  constraint call_records_metadata_object_check check (
    jsonb_typeof(provider_metadata) = 'object'
  )
);

create table if not exists public.transcripts (
  id uuid primary key default extensions.gen_random_uuid(),
  call_record_id uuid not null unique references public.call_records (id) on delete cascade,
  preferred_locale text not null,
  transcript_text text not null,
  transcript_segments jsonb not null default '[]'::jsonb,
  redaction_status text not null default 'pending',
  provider_version text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint transcripts_locale_check check (preferred_locale in ('en', 'es')),
  constraint transcripts_segments_array_check check (
    jsonb_typeof(transcript_segments) = 'array'
  ),
  constraint transcripts_redaction_status_check check (
    redaction_status in ('pending', 'redacted', 'not_required', 'failed')
  )
);

create table if not exists public.analysis_runs (
  id uuid primary key default extensions.gen_random_uuid(),
  paid_assessment_id uuid not null references public.paid_assessments (id) on delete cascade,
  transcript_id uuid references public.transcripts (id) on delete set null,
  status text not null default 'queued',
  prompt_version text not null,
  model_version text,
  input_evidence jsonb not null default '[]'::jsonb,
  structured_output jsonb,
  token_usage jsonb not null default '{}'::jsonb,
  estimated_cost_micros bigint,
  error_code text,
  attempt_number integer not null default 1,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint analysis_runs_status_check check (
    status in ('queued', 'running', 'succeeded', 'failed', 'needs_input', 'superseded')
  ),
  constraint analysis_runs_attempt_check check (attempt_number between 1 and 5),
  constraint analysis_runs_evidence_array_check check (jsonb_typeof(input_evidence) = 'array'),
  constraint analysis_runs_token_usage_object_check check (jsonb_typeof(token_usage) = 'object'),
  constraint analysis_runs_cost_check check (
    estimated_cost_micros is null or estimated_cost_micros >= 0
  )
);

create table if not exists public.recommendations (
  id uuid primary key default extensions.gen_random_uuid(),
  analysis_run_id uuid not null references public.analysis_runs (id) on delete cascade,
  sequence_number smallint not null,
  canonical_id text not null,
  title text not null,
  summary text not null,
  impact text not null,
  effort text not null,
  priority text not null,
  confidence numeric(4, 3) not null,
  dependencies jsonb not null default '[]'::jsonb,
  risks jsonb not null default '[]'::jsonb,
  evidence_references jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint recommendations_sequence_check check (sequence_number between 1 and 15),
  constraint recommendations_impact_check check (impact in ('low', 'medium', 'high')),
  constraint recommendations_effort_check check (effort in ('low', 'medium', 'high')),
  constraint recommendations_priority_check check (
    priority in ('now', 'next', 'later', 'not_recommended')
  ),
  constraint recommendations_confidence_check check (confidence between 0 and 1),
  constraint recommendations_dependencies_array_check check (jsonb_typeof(dependencies) = 'array'),
  constraint recommendations_risks_array_check check (jsonb_typeof(risks) = 'array'),
  constraint recommendations_evidence_array_check check (
    jsonb_typeof(evidence_references) = 'array'
  ),
  unique (analysis_run_id, sequence_number),
  unique (analysis_run_id, canonical_id)
);

create table if not exists public.roadmaps (
  id uuid primary key default extensions.gen_random_uuid(),
  analysis_run_id uuid not null unique references public.analysis_runs (id) on delete cascade,
  horizon_days smallint not null,
  roadmap_data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint roadmaps_horizon_check check (horizon_days between 30 and 90),
  constraint roadmaps_data_object_check check (jsonb_typeof(roadmap_data) = 'object')
);

create table if not exists public.reports (
  id uuid primary key default extensions.gen_random_uuid(),
  paid_assessment_id uuid not null references public.paid_assessments (id) on delete cascade,
  analysis_run_id uuid not null references public.analysis_runs (id) on delete restrict,
  version integer not null default 1,
  preferred_locale text not null,
  status text not null default 'DRAFT',
  report_schema_version text not null default 'report/1.0.0',
  report_data jsonb not null default '{}'::jsonb,
  storage_path text,
  approved_by uuid references public.profiles (id) on delete set null,
  approved_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint reports_version_check check (version >= 1),
  constraint reports_locale_check check (preferred_locale in ('en', 'es')),
  constraint reports_status_check check (
    status in (
      'DRAFT',
      'AI_GENERATED',
      'NEEDS_REVIEW',
      'CHANGES_REQUESTED',
      'APPROVED',
      'DELIVERED',
      'SUPERSEDED'
    )
  ),
  constraint reports_data_object_check check (jsonb_typeof(report_data) = 'object'),
  constraint reports_approval_check check (
    status not in ('APPROVED', 'DELIVERED')
    or (approved_by is not null and approved_at is not null)
  ),
  unique (paid_assessment_id, version, preferred_locale)
);

create table if not exists public.report_reviews (
  id uuid primary key default extensions.gen_random_uuid(),
  report_id uuid not null references public.reports (id) on delete cascade,
  reviewer_profile_id uuid not null references public.profiles (id) on delete restrict,
  action text not null,
  notes text,
  changes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint report_reviews_action_check check (
    action in ('opened', 'edited', 'changes_requested', 'approved', 'rejected', 'regenerated')
  ),
  constraint report_reviews_changes_object_check check (jsonb_typeof(changes) = 'object')
);

create table if not exists public.consultations (
  id uuid primary key default extensions.gen_random_uuid(),
  paid_assessment_id uuid not null references public.paid_assessments (id) on delete cascade,
  customer_profile_id uuid not null references public.profiles (id) on delete restrict,
  status text not null default 'offered',
  preferred_locale text not null,
  duration_minutes smallint not null default 30,
  scheduled_for timestamptz,
  scheduling_reference text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint consultations_status_check check (
    status in ('offered', 'scheduled', 'completed', 'cancelled', 'no_show', 'rebooking')
  ),
  constraint consultations_locale_check check (preferred_locale in ('en', 'es')),
  constraint consultations_duration_check check (duration_minutes = 30)
);

create table if not exists public.email_events (
  id uuid primary key default extensions.gen_random_uuid(),
  lead_id uuid references public.leads (id) on delete set null,
  recipient_profile_id uuid references public.profiles (id) on delete set null,
  order_id uuid references public.orders (id) on delete set null,
  template_key text not null,
  category text not null,
  preferred_locale text not null,
  provider_message_id text unique,
  status text not null default 'queued',
  failure_code text,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint email_events_recipient_check check (
    lead_id is not null or recipient_profile_id is not null
  ),
  constraint email_events_category_check check (category in ('transactional', 'marketing')),
  constraint email_events_locale_check check (preferred_locale in ('en', 'es')),
  constraint email_events_status_check check (
    status in ('queued', 'sent', 'delivered', 'bounced', 'complained', 'failed', 'suppressed')
  )
);

create table if not exists public.integration_events (
  id uuid primary key default extensions.gen_random_uuid(),
  source text not null,
  event_type text not null,
  external_event_id text not null,
  payload jsonb not null default '{}'::jsonb,
  processing_status text not null default 'received',
  error_code text,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint integration_events_payload_object_check check (jsonb_typeof(payload) = 'object'),
  constraint integration_events_status_check check (
    processing_status in ('received', 'processing', 'processed', 'failed', 'ignored')
  ),
  unique (source, external_event_id)
);

create table if not exists public.webhook_events (
  id uuid primary key default extensions.gen_random_uuid(),
  provider text not null,
  external_event_id text not null,
  event_type text not null,
  signature_verified boolean not null default false,
  payload_hash text not null,
  sanitized_payload jsonb not null default '{}'::jsonb,
  processing_status text not null default 'received',
  attempt_count integer not null default 0,
  error_code text,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint webhook_events_provider_check check (provider in ('stripe', 'retell', 'resend')),
  constraint webhook_events_payload_object_check check (
    jsonb_typeof(sanitized_payload) = 'object'
  ),
  constraint webhook_events_status_check check (
    processing_status in ('received', 'verified', 'processing', 'processed', 'failed', 'ignored')
  ),
  constraint webhook_events_attempt_check check (attempt_count between 0 and 20),
  unique (provider, external_event_id)
);

create table if not exists public.automation_jobs (
  id uuid primary key default extensions.gen_random_uuid(),
  job_type text not null,
  deduplication_key text not null unique,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'queued',
  attempt_count integer not null default 0,
  max_attempts integer not null default 5,
  run_after timestamptz not null default now(),
  locked_at timestamptz,
  locked_by text,
  last_error_code text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint automation_jobs_payload_object_check check (jsonb_typeof(payload) = 'object'),
  constraint automation_jobs_status_check check (
    status in ('queued', 'running', 'retry_wait', 'completed', 'failed', 'cancelled')
  ),
  constraint automation_jobs_attempt_check check (
    attempt_count between 0 and max_attempts and max_attempts between 1 and 20
  )
);

create table if not exists public.audit_logs (
  id uuid primary key default extensions.gen_random_uuid(),
  actor_profile_id uuid references public.profiles (id) on delete set null,
  actor_type text not null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_state jsonb,
  after_state jsonb,
  request_id text,
  ip_hash text,
  user_agent_hash text,
  created_at timestamptz not null default now(),
  constraint audit_logs_actor_type_check check (
    actor_type in ('customer', 'admin', 'service', 'system', 'vendor')
  )
);

create table if not exists public.rate_limit_windows (
  id uuid primary key default extensions.gen_random_uuid(),
  key_hash text not null,
  route_key text not null,
  window_started_at timestamptz not null,
  window_seconds integer not null,
  request_count integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rate_limit_windows_window_check check (window_seconds between 1 and 86400),
  constraint rate_limit_windows_count_check check (request_count between 1 and 100000),
  unique (key_hash, route_key, window_started_at, window_seconds)
);

create index if not exists businesses_owner_profile_idx on public.businesses (owner_profile_id);
create index if not exists leads_owner_profile_idx on public.leads (owner_profile_id);
create index if not exists leads_business_idx on public.leads (business_id);
create index if not exists leads_status_idx on public.leads (status) where deleted_at is null;
create index if not exists consents_lead_idx on public.consents (lead_id);
create index if not exists consents_profile_idx on public.consents (profile_id);
create index if not exists free_assessments_lead_idx on public.free_assessments (lead_id);
create index if not exists free_assessments_owner_idx on public.free_assessments (owner_profile_id);
create index if not exists free_assessment_answers_assessment_idx
  on public.free_assessment_answers (free_assessment_id);
create index if not exists orders_customer_idx on public.orders (customer_profile_id);
create index if not exists orders_lead_idx on public.orders (lead_id);
create index if not exists orders_status_idx on public.orders (status) where deleted_at is null;
create index if not exists payments_order_idx on public.payments (order_id);
create index if not exists paid_assessments_customer_idx on public.paid_assessments (customer_profile_id);
create index if not exists paid_assessments_status_idx on public.paid_assessments (status);
create index if not exists interview_sessions_assessment_idx
  on public.interview_sessions (paid_assessment_id);
create index if not exists call_records_interview_idx on public.call_records (interview_session_id);
create index if not exists analysis_runs_assessment_idx on public.analysis_runs (paid_assessment_id);
create index if not exists analysis_runs_status_idx on public.analysis_runs (status);
create index if not exists recommendations_analysis_idx on public.recommendations (analysis_run_id);
create index if not exists reports_assessment_idx on public.reports (paid_assessment_id);
create index if not exists reports_status_idx on public.reports (status) where deleted_at is null;
create index if not exists report_reviews_report_idx on public.report_reviews (report_id);
create index if not exists consultations_assessment_idx on public.consultations (paid_assessment_id);
create index if not exists email_events_lead_idx on public.email_events (lead_id);
create index if not exists email_events_profile_idx on public.email_events (recipient_profile_id);
create index if not exists webhook_events_status_idx on public.webhook_events (processing_status, received_at);
create index if not exists automation_jobs_ready_idx
  on public.automation_jobs (status, run_after)
  where status in ('queued', 'retry_wait');
create index if not exists audit_logs_entity_idx on public.audit_logs (entity_type, entity_id, created_at desc);
create index if not exists audit_logs_actor_idx on public.audit_logs (actor_profile_id, created_at desc);

create or replace function app_private.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  relation_name text;
begin
  foreach relation_name in array array[
    'profiles',
    'admin_roles',
    'businesses',
    'leads',
    'consents',
    'free_assessments',
    'free_assessment_answers',
    'opportunity_scores',
    'orders',
    'payments',
    'promotion_redemptions',
    'paid_assessments',
    'interview_sessions',
    'call_records',
    'transcripts',
    'analysis_runs',
    'recommendations',
    'roadmaps',
    'reports',
    'consultations',
    'email_events',
    'integration_events',
    'webhook_events',
    'automation_jobs',
    'rate_limit_windows'
  ]
  loop
    if not exists (
      select 1
      from pg_trigger
      where tgrelid = format('public.%I', relation_name)::regclass
        and tgname = relation_name || '_set_updated_at'
        and not tgisinternal
    ) then
      execute format(
        'create trigger %I before update on public.%I for each row execute function app_private.set_updated_at()',
        relation_name || '_set_updated_at',
        relation_name
      );
    end if;
  end loop;
end;
$$;

create or replace function app_private.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth, extensions, pg_temp
as $$
begin
  insert into public.profiles (id, email, display_name, preferred_locale)
  values (
    new.id,
    new.email,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'display_name', '')), ''),
    case
      when new.raw_user_meta_data ->> 'preferred_locale' = 'es' then 'es'
      else 'en'
    end
  )
  on conflict (id) do update
  set
    email = excluded.email,
    updated_at = now();

  return new;
end;
$$;

do $auth_profile_trigger$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgrelid = 'auth.users'::regclass
      and tgname = 'auth_user_created_profile'
      and not tgisinternal
  ) then
    create trigger auth_user_created_profile
      after insert or update of email on auth.users
      for each row execute function app_private.handle_new_auth_user();
  end if;
end
$auth_profile_trigger$;

create or replace function app_private.prevent_audit_log_mutation()
returns trigger
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
begin
  raise exception 'audit_logs are immutable';
end;
$$;

do $audit_immutable_trigger$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgrelid = 'public.audit_logs'::regclass
      and tgname = 'audit_logs_immutable'
      and not tgisinternal
  ) then
    create trigger audit_logs_immutable
      before update or delete on public.audit_logs
      for each row execute function app_private.prevent_audit_log_mutation();
  end if;
end
$audit_immutable_trigger$;

create or replace function app_private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.admin_roles
    where profile_id = (select auth.uid())
      and is_active
      and role in ('admin', 'reviewer', 'support')
  );
$$;

create or replace function app_private.owns_lead(target_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.leads
    where id = target_id
      and owner_profile_id = (select auth.uid())
      and deleted_at is null
  );
$$;

create or replace function app_private.owns_free_assessment(target_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.free_assessments
    where id = target_id
      and (
        owner_profile_id = (select auth.uid())
        or app_private.owns_lead(lead_id)
      )
  );
$$;

create or replace function app_private.owns_order(target_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.orders
    where id = target_id
      and deleted_at is null
      and (
        customer_profile_id = (select auth.uid())
        or app_private.owns_lead(lead_id)
      )
  );
$$;

create or replace function app_private.owns_paid_assessment(target_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.paid_assessments
    where id = target_id
      and customer_profile_id = (select auth.uid())
      and deleted_at is null
  );
$$;

revoke all on all functions in schema app_private from public;
grant execute on function app_private.is_admin() to authenticated, service_role;
grant execute on function app_private.owns_lead(uuid) to authenticated, service_role;
grant execute on function app_private.owns_free_assessment(uuid) to authenticated, service_role;
grant execute on function app_private.owns_order(uuid) to authenticated, service_role;
grant execute on function app_private.owns_paid_assessment(uuid) to authenticated, service_role;

do $$
declare
  relation_name text;
begin
  foreach relation_name in array array[
    'profiles',
    'admin_roles',
    'businesses',
    'leads',
    'consents',
    'free_assessments',
    'free_assessment_answers',
    'opportunity_scores',
    'orders',
    'payments',
    'promotion_redemptions',
    'paid_assessments',
    'interview_sessions',
    'call_records',
    'transcripts',
    'analysis_runs',
    'recommendations',
    'roadmaps',
    'reports',
    'report_reviews',
    'consultations',
    'email_events',
    'integration_events',
    'webhook_events',
    'automation_jobs',
    'audit_logs',
    'rate_limit_windows'
  ]
  loop
    execute format('alter table public.%I enable row level security', relation_name);
    execute format('alter table public.%I force row level security', relation_name);

    if not exists (
      select 1
      from pg_policies
      where schemaname = 'public'
        and tablename = relation_name
        and policyname = relation_name || '_admin_all'
    ) then
      execute format(
        'create policy %I on public.%I for all to authenticated using (app_private.is_admin()) with check (app_private.is_admin())',
        relation_name || '_admin_all',
        relation_name
      );
    end if;
  end loop;
end;
$$;

do $policy_guard$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname in ('profiles_owner_select', 'Users can view own profile')
  ) then
    execute $policy_ddl$
create policy profiles_owner_select
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) and deleted_at is null);
$policy_ddl$;
  end if;
end
$policy_guard$;

do $policy_guard$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'profiles_owner_update'
  ) then
    execute $policy_ddl$
create policy profiles_owner_update
  on public.profiles for update to authenticated
  using (id = (select auth.uid()) and deleted_at is null)
  with check (id = (select auth.uid()));
$policy_ddl$;
  end if;
end
$policy_guard$;

do $policy_guard$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'admin_roles'
      and policyname = 'admin_roles_self_select'
  ) then
    execute $policy_ddl$
create policy admin_roles_self_select
  on public.admin_roles for select to authenticated
  using (profile_id = (select auth.uid()) and is_active);
$policy_ddl$;
  end if;
end
$policy_guard$;

do $policy_guard$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'businesses'
      and policyname = 'businesses_owner_select'
  ) then
    execute $policy_ddl$
create policy businesses_owner_select
  on public.businesses for select to authenticated
  using (owner_profile_id = (select auth.uid()) and deleted_at is null);
$policy_ddl$;
  end if;
end
$policy_guard$;

do $policy_guard$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'businesses'
      and policyname = 'businesses_owner_insert'
  ) then
    execute $policy_ddl$
create policy businesses_owner_insert
  on public.businesses for insert to authenticated
  with check (owner_profile_id = (select auth.uid()));
$policy_ddl$;
  end if;
end
$policy_guard$;

do $policy_guard$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'businesses'
      and policyname = 'businesses_owner_update'
  ) then
    execute $policy_ddl$
create policy businesses_owner_update
  on public.businesses for update to authenticated
  using (owner_profile_id = (select auth.uid()) and deleted_at is null)
  with check (owner_profile_id = (select auth.uid()));
$policy_ddl$;
  end if;
end
$policy_guard$;

do $policy_guard$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'leads'
      and policyname = 'leads_owner_select'
  ) then
    execute $policy_ddl$
create policy leads_owner_select
  on public.leads for select to authenticated
  using (owner_profile_id = (select auth.uid()) and deleted_at is null);
$policy_ddl$;
  end if;
end
$policy_guard$;

do $policy_guard$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'leads'
      and policyname = 'leads_owner_update'
  ) then
    execute $policy_ddl$
create policy leads_owner_update
  on public.leads for update to authenticated
  using (owner_profile_id = (select auth.uid()) and deleted_at is null)
  with check (owner_profile_id = (select auth.uid()));
$policy_ddl$;
  end if;
end
$policy_guard$;

do $policy_guard$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'consents'
      and policyname = 'consents_subject_select'
  ) then
    execute $policy_ddl$
create policy consents_subject_select
  on public.consents for select to authenticated
  using (
    profile_id = (select auth.uid())
    or app_private.owns_lead(lead_id)
  );
$policy_ddl$;
  end if;
end
$policy_guard$;

do $policy_guard$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'free_assessments'
      and policyname = 'free_assessments_owner_select'
  ) then
    execute $policy_ddl$
create policy free_assessments_owner_select
  on public.free_assessments for select to authenticated
  using (
    owner_profile_id = (select auth.uid())
    or app_private.owns_lead(lead_id)
  );
$policy_ddl$;
  end if;
end
$policy_guard$;

do $policy_guard$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'free_assessments'
      and policyname = 'free_assessments_owner_update'
  ) then
    execute $policy_ddl$
create policy free_assessments_owner_update
  on public.free_assessments for update to authenticated
  using (
    owner_profile_id = (select auth.uid())
    or app_private.owns_lead(lead_id)
  )
  with check (
    owner_profile_id = (select auth.uid())
    or app_private.owns_lead(lead_id)
  );
$policy_ddl$;
  end if;
end
$policy_guard$;

do $policy_guard$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'free_assessment_answers'
      and policyname = 'free_answers_owner_select'
  ) then
    execute $policy_ddl$
create policy free_answers_owner_select
  on public.free_assessment_answers for select to authenticated
  using (app_private.owns_free_assessment(free_assessment_id));
$policy_ddl$;
  end if;
end
$policy_guard$;

do $policy_guard$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'opportunity_scores'
      and policyname = 'opportunity_scores_owner_select'
  ) then
    execute $policy_ddl$
create policy opportunity_scores_owner_select
  on public.opportunity_scores for select to authenticated
  using (app_private.owns_free_assessment(free_assessment_id));
$policy_ddl$;
  end if;
end
$policy_guard$;

do $policy_guard$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'orders'
      and policyname = 'orders_owner_select'
  ) then
    execute $policy_ddl$
create policy orders_owner_select
  on public.orders for select to authenticated
  using (app_private.owns_order(id));
$policy_ddl$;
  end if;
end
$policy_guard$;

do $policy_guard$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'payments'
      and policyname = 'payments_owner_select'
  ) then
    execute $policy_ddl$
create policy payments_owner_select
  on public.payments for select to authenticated
  using (app_private.owns_order(order_id));
$policy_ddl$;
  end if;
end
$policy_guard$;

do $policy_guard$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'promotion_redemptions'
      and policyname = 'promotion_redemptions_owner_select'
  ) then
    execute $policy_ddl$
create policy promotion_redemptions_owner_select
  on public.promotion_redemptions for select to authenticated
  using (app_private.owns_order(order_id));
$policy_ddl$;
  end if;
end
$policy_guard$;

do $policy_guard$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'paid_assessments'
      and policyname = 'paid_assessments_owner_select'
  ) then
    execute $policy_ddl$
create policy paid_assessments_owner_select
  on public.paid_assessments for select to authenticated
  using (customer_profile_id = (select auth.uid()) and deleted_at is null);
$policy_ddl$;
  end if;
end
$policy_guard$;

do $policy_guard$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'paid_assessments'
      and policyname = 'paid_assessments_owner_update'
  ) then
    execute $policy_ddl$
create policy paid_assessments_owner_update
  on public.paid_assessments for update to authenticated
  using (customer_profile_id = (select auth.uid()) and deleted_at is null)
  with check (customer_profile_id = (select auth.uid()));
$policy_ddl$;
  end if;
end
$policy_guard$;

do $policy_guard$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'interview_sessions'
      and policyname = 'interview_sessions_owner_select'
  ) then
    execute $policy_ddl$
create policy interview_sessions_owner_select
  on public.interview_sessions for select to authenticated
  using (app_private.owns_paid_assessment(paid_assessment_id));
$policy_ddl$;
  end if;
end
$policy_guard$;

do $policy_guard$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'call_records'
      and policyname = 'call_records_owner_select'
  ) then
    execute $policy_ddl$
create policy call_records_owner_select
  on public.call_records for select to authenticated
  using (
    exists (
      select 1
      from public.interview_sessions
      where interview_sessions.id = call_records.interview_session_id
        and app_private.owns_paid_assessment(interview_sessions.paid_assessment_id)
    )
  );
$policy_ddl$;
  end if;
end
$policy_guard$;

do $policy_guard$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'transcripts'
      and policyname = 'transcripts_owner_select'
  ) then
    execute $policy_ddl$
create policy transcripts_owner_select
  on public.transcripts for select to authenticated
  using (
    exists (
      select 1
      from public.call_records
      join public.interview_sessions
        on interview_sessions.id = call_records.interview_session_id
      where call_records.id = transcripts.call_record_id
        and app_private.owns_paid_assessment(interview_sessions.paid_assessment_id)
    )
  );
$policy_ddl$;
  end if;
end
$policy_guard$;

do $policy_guard$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'analysis_runs'
      and policyname = 'analysis_runs_owner_select'
  ) then
    execute $policy_ddl$
create policy analysis_runs_owner_select
  on public.analysis_runs for select to authenticated
  using (app_private.owns_paid_assessment(paid_assessment_id));
$policy_ddl$;
  end if;
end
$policy_guard$;

do $policy_guard$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'recommendations'
      and policyname = 'recommendations_owner_select'
  ) then
    execute $policy_ddl$
create policy recommendations_owner_select
  on public.recommendations for select to authenticated
  using (
    exists (
      select 1
      from public.analysis_runs
      where analysis_runs.id = recommendations.analysis_run_id
        and app_private.owns_paid_assessment(analysis_runs.paid_assessment_id)
    )
  );
$policy_ddl$;
  end if;
end
$policy_guard$;

do $policy_guard$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'roadmaps'
      and policyname = 'roadmaps_owner_select'
  ) then
    execute $policy_ddl$
create policy roadmaps_owner_select
  on public.roadmaps for select to authenticated
  using (
    exists (
      select 1
      from public.analysis_runs
      where analysis_runs.id = roadmaps.analysis_run_id
        and app_private.owns_paid_assessment(analysis_runs.paid_assessment_id)
    )
  );
$policy_ddl$;
  end if;
end
$policy_guard$;

do $policy_guard$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'reports'
      and policyname = 'reports_owner_select'
  ) then
    execute $policy_ddl$
create policy reports_owner_select
  on public.reports for select to authenticated
  using (
    app_private.owns_paid_assessment(paid_assessment_id)
    and status in ('APPROVED', 'DELIVERED')
    and deleted_at is null
  );
$policy_ddl$;
  end if;
end
$policy_guard$;

do $policy_guard$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'report_reviews'
      and policyname = 'report_reviews_owner_select'
  ) then
    execute $policy_ddl$
create policy report_reviews_owner_select
  on public.report_reviews for select to authenticated
  using (
    exists (
      select 1
      from public.reports
      where reports.id = report_reviews.report_id
        and app_private.owns_paid_assessment(reports.paid_assessment_id)
        and reports.status in ('APPROVED', 'DELIVERED')
    )
  );
$policy_ddl$;
  end if;
end
$policy_guard$;

do $policy_guard$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'consultations'
      and policyname = 'consultations_owner_select'
  ) then
    execute $policy_ddl$
create policy consultations_owner_select
  on public.consultations for select to authenticated
  using (
    customer_profile_id = (select auth.uid())
    and app_private.owns_paid_assessment(paid_assessment_id)
  );
$policy_ddl$;
  end if;
end
$policy_guard$;

do $policy_guard$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'email_events'
      and policyname = 'email_events_recipient_select'
  ) then
    execute $policy_ddl$
create policy email_events_recipient_select
  on public.email_events for select to authenticated
  using (
    recipient_profile_id = (select auth.uid())
    or app_private.owns_lead(lead_id)
  );
$policy_ddl$;
  end if;
end
$policy_guard$;

do $policy_guard$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'audit_logs'
      and policyname = 'audit_logs_actor_select'
  ) then
    execute $policy_ddl$
create policy audit_logs_actor_select
  on public.audit_logs for select to authenticated
  using (actor_profile_id = (select auth.uid()));
$policy_ddl$;
  end if;
end
$policy_guard$;

grant usage on schema public to authenticated, service_role;

do $table_grants$
declare
  relation_name text;
begin
  foreach relation_name in array array[
    'profiles',
    'admin_roles',
    'businesses',
    'leads',
    'consents',
    'free_assessments',
    'free_assessment_answers',
    'opportunity_scores',
    'orders',
    'payments',
    'promotion_redemptions',
    'paid_assessments',
    'interview_sessions',
    'call_records',
    'transcripts',
    'analysis_runs',
    'recommendations',
    'roadmaps',
    'reports',
    'report_reviews',
    'consultations',
    'email_events',
    'integration_events',
    'webhook_events',
    'automation_jobs',
    'audit_logs',
    'rate_limit_windows'
  ]
  loop
    execute format(
      'grant select, insert, update, delete on table public.%I to service_role',
      relation_name
    );
    execute format(
      'grant select, insert, update on table public.%I to authenticated',
      relation_name
    );
  end loop;
end
$table_grants$;

alter default privileges in schema public
  grant select, insert, update, delete on tables to service_role;
alter default privileges in schema public
  grant select, insert, update on tables to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'reports',
  'reports',
  false,
  20971520,
  array['application/pdf']
)
on conflict (id) do update
set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

do $policy_guard$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'reports_storage_owner_read'
  ) then
    execute $policy_ddl$
create policy reports_storage_owner_read
  on storage.objects for select to authenticated
  using (
    bucket_id = 'reports'
    and (
      split_part(name, '/', 1) = (select auth.uid())::text
      or app_private.is_admin()
    )
  );
$policy_ddl$;
  end if;
end
$policy_guard$;

do $policy_guard$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'reports_storage_admin_all'
  ) then
    execute $policy_ddl$
create policy reports_storage_admin_all
  on storage.objects for all to authenticated
  using (bucket_id = 'reports' and app_private.is_admin())
  with check (bucket_id = 'reports' and app_private.is_admin());
$policy_ddl$;
  end if;
end
$policy_guard$;

commit;
