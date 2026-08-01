import { describe, expect, it } from 'vitest';

import {
  claimPaidOrder,
  decideClaim,
  type ClaimableOrder,
  type PaidAssessmentStore,
  type PaidAssessmentSummary,
} from '../../src/features/paid-assessment/claim';

const PROFILE = '11111111-1111-4111-8111-111111111111';
const OTHER_PROFILE = '22222222-2222-4222-8222-222222222222';
const ORDER_ID = '33333333-3333-4333-8333-333333333333';

function paidOrder(overrides: Partial<ClaimableOrder> = {}): ClaimableOrder {
  return {
    id: ORDER_ID,
    status: 'paid',
    customerProfileId: null,
    leadEmail: 'buyer@example.com',
    leadLocale: 'en',
    ...overrides,
  };
}

const claimant = { profileId: PROFILE, email: 'buyer@example.com' };

describe('decideClaim', () => {
  it('accepts a paid, unowned order with a matching email', () => {
    expect(decideClaim(paidOrder(), claimant)).toBeNull();
  });

  it('accepts a re-claim by the same profile', () => {
    expect(decideClaim(paidOrder({ customerProfileId: PROFILE }), claimant)).toBeNull();
  });

  it('matches emails case-insensitively and ignores stray whitespace', () => {
    const order = paidOrder({ leadEmail: '  Buyer@Example.COM ' });
    expect(decideClaim(order, { ...claimant, email: 'buyer@example.com' })).toBeNull();
  });

  it('rejects a missing order', () => {
    expect(decideClaim(null, claimant)).toBe('order_not_found');
  });

  it.each(['checkout_open', 'created', 'cancelled', 'expired'])(
    'rejects an order in status %s: only the webhook decides paid',
    (status) => {
      expect(decideClaim(paidOrder({ status }), claimant)).toBe('order_not_paid');
    },
  );

  it('rejects an order already owned by a different account', () => {
    expect(decideClaim(paidOrder({ customerProfileId: OTHER_PROFILE }), claimant)).toBe(
      'owned_by_another_account',
    );
  });

  it('rejects a claimant whose email does not match the purchase', () => {
    expect(decideClaim(paidOrder(), { ...claimant, email: 'intruder@example.com' })).toBe(
      'email_mismatch',
    );
  });

  it('rejects when the order has no lead email at all', () => {
    expect(decideClaim(paidOrder({ leadEmail: null }), claimant)).toBe('email_mismatch');
  });
});

interface MemoryState {
  order: ClaimableOrder | null;
  assessment: PaidAssessmentSummary | null;
  attachCalls: number;
}

function memoryStore(state: MemoryState): PaidAssessmentStore {
  return {
    findOrderForClaim: (sessionId) =>
      Promise.resolve(sessionId === 'cs_test_known' ? state.order : null),
    attachOrderToProfile: (orderId, profileId) => {
      state.attachCalls += 1;
      if (state.order && state.order.id === orderId && !state.order.customerProfileId) {
        state.order = { ...state.order, customerProfileId: profileId };
      }
      return Promise.resolve();
    },
    ensurePaidAssessment: (input) => {
      state.assessment ??= {
        id: '44444444-4444-4444-8444-444444444444',
        orderId: input.orderId,
        customerProfileId: state.order?.customerProfileId ?? input.customerProfileId,
        status: 'not_started',
        preferredLocale: input.preferredLocale,
      };
      return Promise.resolve(state.assessment);
    },
  };
}

describe('claimPaidOrder', () => {
  it('attaches the order and creates the assessment on first claim', async () => {
    const state: MemoryState = { order: paidOrder(), assessment: null, attachCalls: 0 };

    const result = await claimPaidOrder(memoryStore(state), {
      checkoutSessionId: 'cs_test_known',
      claimant,
    });

    expect(result).toMatchObject({
      claimed: true,
      assessment: { orderId: ORDER_ID, customerProfileId: PROFILE, status: 'not_started' },
    });
    expect(state.attachCalls).toBe(1);
    expect(state.order?.customerProfileId).toBe(PROFILE);
  });

  it('is idempotent: a repeat claim returns the same assessment without re-attaching', async () => {
    const state: MemoryState = { order: paidOrder(), assessment: null, attachCalls: 0 };
    const store = memoryStore(state);

    const first = await claimPaidOrder(store, { checkoutSessionId: 'cs_test_known', claimant });
    const second = await claimPaidOrder(store, { checkoutSessionId: 'cs_test_known', claimant });

    expect(second).toEqual(first);
    expect(state.attachCalls).toBe(1);
  });

  it('carries the lead locale onto the assessment, defaulting unknown values to en', async () => {
    const spanish: MemoryState = {
      order: paidOrder({ leadLocale: 'es' }),
      assessment: null,
      attachCalls: 0,
    };
    const spanishResult = await claimPaidOrder(memoryStore(spanish), {
      checkoutSessionId: 'cs_test_known',
      claimant,
    });
    expect(spanishResult.claimed && spanishResult.assessment.preferredLocale).toBe('es');

    const unknown: MemoryState = {
      order: paidOrder({ leadLocale: null }),
      assessment: null,
      attachCalls: 0,
    };
    const fallbackResult = await claimPaidOrder(memoryStore(unknown), {
      checkoutSessionId: 'cs_test_known',
      claimant,
    });
    expect(fallbackResult.claimed && fallbackResult.assessment.preferredLocale).toBe('en');
  });

  it('reports the loss when a concurrent claim wins the attach race', async () => {
    const state: MemoryState = { order: paidOrder(), assessment: null, attachCalls: 0 };
    const store = memoryStore(state);
    // Simulate the race: between the eligibility read and the attach, another
    // session claims the order and owns the assessment row.
    store.attachOrderToProfile = () => {
      state.order = { ...paidOrder(), customerProfileId: OTHER_PROFILE };
      state.assessment = {
        id: '55555555-5555-4555-8555-555555555555',
        orderId: ORDER_ID,
        customerProfileId: OTHER_PROFILE,
        status: 'not_started',
        preferredLocale: 'en',
      };
      return Promise.resolve();
    };

    const result = await claimPaidOrder(store, { checkoutSessionId: 'cs_test_known', claimant });
    expect(result).toEqual({ claimed: false, reason: 'owned_by_another_account' });
  });

  it('surfaces rejections without touching the store', async () => {
    const state: MemoryState = { order: paidOrder(), assessment: null, attachCalls: 0 };

    const result = await claimPaidOrder(memoryStore(state), {
      checkoutSessionId: 'cs_test_unknown',
      claimant,
    });

    expect(result).toEqual({ claimed: false, reason: 'order_not_found' });
    expect(state.attachCalls).toBe(0);
    expect(state.assessment).toBeNull();
  });
});
