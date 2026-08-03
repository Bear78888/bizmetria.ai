'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';

import { createSupabaseServerClient } from '@/lib/supabase/server';

const transitionSchema = z.object({
  locale: z.enum(['en', 'es']),
  orderId: z.uuid(),
  to: z.enum(['in_build', 'delivered']),
});

// Only forward movement: paid starts the build, either paid or in_build can
// complete. Anything else (refunds, cancellations) stays a deliberate manual
// operation rather than a one-click button.
const ALLOWED_FROM: Record<'in_build' | 'delivered', readonly string[]> = {
  in_build: ['paid'],
  delivered: ['paid', 'in_build'],
};

export async function advanceSolutionOrder(formData: FormData) {
  const parsed = transitionSchema.safeParse({
    locale: formData.get('locale'),
    orderId: formData.get('orderId'),
    to: formData.get('to'),
  });
  if (!parsed.success) redirect('/en/admin/orders?error=invalid');
  const { locale, orderId, to } = parsed.data;

  // The user-scoped client: row-level security only lets an active admin
  // update solution orders, so authorization lives in the database policy.
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth`);

  const { data, error } = await supabase
    .from('solution_orders')
    .update({
      status: to,
      ...(to === 'delivered' ? { delivered_at: new Date().toISOString() } : {}),
    })
    .eq('id', orderId)
    .in('status', [...ALLOWED_FROM[to]])
    .select('id');

  if (error || !data || data.length === 0) {
    redirect(`/${locale}/admin/orders?error=transition_failed`);
  }
  redirect(`/${locale}/admin/orders?updated=${orderId}`);
}
