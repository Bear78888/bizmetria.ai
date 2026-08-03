import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { findSolution, formatSolutionPrice } from '@/features/solutions/catalog';
import { isLocale } from '@/i18n/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';

import { advanceSolutionOrder } from './actions';

interface AdminOrdersPageProps {
  readonly params: Promise<{ locale: string }>;
  readonly searchParams: Promise<{ error?: string; updated?: string }>;
}

export const dynamic = 'force-dynamic';

const STATUS_LABELS: Record<string, string> = {
  paid: 'Paid — build not started',
  in_build: 'In build',
  delivered: 'Delivered',
  refunded: 'Refunded',
};

/**
 * Delivery management for solution orders: paid orders move to in_build and
 * delivered with one click each. Row-level security scopes everything here —
 * a non-admin sees an empty desk, never an error.
 */
export default async function AdminOrdersPage({ params, searchParams }: AdminOrdersPageProps) {
  const { locale: localeParameter } = await params;
  const query = await searchParams;
  if (!isLocale(localeParameter)) notFound();
  const locale = localeParameter;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${locale}/auth?next=${encodeURIComponent(`/${locale}/admin/orders`)}`);
  }

  // Admin gate: only an active admin can read admin_roles rows at all.
  const { data: role } = await supabase
    .from('admin_roles')
    .select('role, is_active')
    .eq('profile_id', user.id)
    .maybeSingle();
  if (!role?.is_active) {
    return (
      <main className="page-shell">
        <section className="centered-state">
          <h1>Not available</h1>
          <p>This area is for the review team.</p>
          <Link className="button button-secondary" href={`/${locale}/account`}>
            Back to your account
          </Link>
        </section>
      </main>
    );
  }

  const { data: orders } = await supabase
    .from('solution_orders')
    .select('id, solution_code, status, amount_total, created_at, paid_at, customer_profile_id')
    .is('deleted_at', null)
    .in('status', ['paid', 'in_build', 'delivered'])
    .order('created_at', { ascending: false })
    .limit(100);

  const list = orders ?? [];

  return (
    <main className="page-shell">
      <section className="result-section">
        <p className="eyebrow">Admin</p>
        <h1>Solution orders</h1>
        <p>
          Paid implementations move through build to delivery here.{' '}
          <Link href={`/${locale}/admin/reviews`}>Report reviews →</Link>
        </p>
        {query.error ? (
          <p className="form-message form-message-error" role="alert">
            The transition could not be applied. Refresh and check the order state.
          </p>
        ) : null}
        {query.updated ? <p className="form-message">Order updated.</p> : null}

        {list.length === 0 ? (
          <p>No solution orders yet.</p>
        ) : (
          <div className="account-details">
            {list.map((order) => {
              const solution = findSolution(order.solution_code);
              return (
                <div key={order.id}>
                  <dt>
                    {order.created_at?.slice(0, 10)} ·{' '}
                    {solution ? formatSolutionPrice(solution) : ''}
                  </dt>
                  <dd>
                    <strong>{solution ? solution.title.en : order.solution_code}</strong>
                    {' — '}
                    {STATUS_LABELS[order.status] ?? order.status}
                    <span className="order-actions">
                      {order.status === 'paid' ? (
                        <form action={advanceSolutionOrder}>
                          <input name="locale" type="hidden" value={locale} />
                          <input name="orderId" type="hidden" value={order.id} />
                          <input name="to" type="hidden" value="in_build" />
                          <button className="button button-secondary" type="submit">
                            Start build
                          </button>
                        </form>
                      ) : null}
                      {order.status === 'paid' || order.status === 'in_build' ? (
                        <form action={advanceSolutionOrder}>
                          <input name="locale" type="hidden" value={locale} />
                          <input name="orderId" type="hidden" value={order.id} />
                          <input name="to" type="hidden" value="delivered" />
                          <button className="button button-primary" type="submit">
                            Mark delivered
                          </button>
                        </form>
                      ) : null}
                    </span>
                  </dd>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
