-- Solution orders (DEC-031): one-click purchases of catalog implementations
-- offered after the paid report. Kept separate from public.orders, whose
-- constraints deliberately hard-code the $299 assessment; a solution order
-- also carries a delivery lifecycle (build, then handover) that the
-- assessment order never has.
--
-- Price integrity: the application derives the amount from the code-side
-- catalog; the check below only brackets it to the approved range so a bug
-- cannot store a charge outside the product's price band.

create table public.solution_orders (
  id uuid primary key default extensions.gen_random_uuid(),
  customer_profile_id uuid not null references public.profiles (id) on delete restrict,
  paid_assessment_id uuid references public.paid_assessments (id) on delete set null,
  solution_code text not null,
  currency text not null default 'usd',
  amount_total integer not null,
  status text not null default 'created',
  provider_mode text not null default 'test',
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  idempotency_key text not null unique,
  paid_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint solution_orders_currency_check check (currency = 'usd'),
  constraint solution_orders_amount_check check (
    amount_total between 30000 and 300000
  ),
  constraint solution_orders_status_check check (
    status in (
      'created',
      'checkout_open',
      'checkout_expired',
      'paid',
      'in_build',
      'delivered',
      'cancelled',
      'refunded'
    )
  ),
  constraint solution_orders_test_mode_only_check check (provider_mode = 'test'),
  constraint solution_orders_code_check check (solution_code ~ '^[a-z][a-z0-9_]{2,63}$')
);

create index solution_orders_customer_idx on public.solution_orders (customer_profile_id);
create index solution_orders_assessment_idx on public.solution_orders (paid_assessment_id);

create trigger solution_orders_set_updated_at
  before update on public.solution_orders
  for each row execute function app_private.set_updated_at();

alter table public.solution_orders enable row level security;
alter table public.solution_orders force row level security;

create policy solution_orders_owner_select
  on public.solution_orders for select to authenticated
  using (customer_profile_id = (select auth.uid()) and deleted_at is null);

create policy solution_orders_admin_all
  on public.solution_orders for all to authenticated
  using (app_private.is_admin())
  with check (app_private.is_admin());

-- Table privileges come from the schema's default privileges (foundation
-- migration): service_role full, authenticated select/insert/update behind
-- forced row-level security.
