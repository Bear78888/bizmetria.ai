import { describe, expect, it } from 'vitest';

import {
  ASSESSMENT_PRICE_CENTS,
  isPromotionCode,
  promotionCodes,
  promotionTiers,
} from '@/features/checkout/contract';
import { decidePromotion, expectedDiscountCents } from '@/features/checkout/promotions';

describe('promotion ladder', () => {
  it('keeps every tier inside the approved $49-$199 range', () => {
    for (const code of promotionCodes) {
      expect(promotionTiers[code].discountCents).toBeGreaterThanOrEqual(4_900);
      expect(promotionTiers[code].discountCents).toBeLessThanOrEqual(19_900);
    }
  });

  it('never discounts the price to zero or below', () => {
    for (const code of promotionCodes) {
      expect(ASSESSMENT_PRICE_CENTS - promotionTiers[code].discountCents).toBeGreaterThan(0);
    }
  });

  it('offers exactly one tier publicly', () => {
    const publicTiers = promotionCodes.filter((code) => promotionTiers[code].publiclyOffered);
    expect(publicTiers).toEqual(['BIZ49']);
  });

  it('keeps the $199 late-reactivation tier private', () => {
    expect(promotionTiers.BIZ199.publiclyOffered).toBe(false);
  });
});

describe('promotion eligibility', () => {
  it('applies nothing when no code was supplied', () => {
    expect(decidePromotion(undefined)).toBeNull();
    expect(decidePromotion('   ')).toBeNull();
  });

  it('applies the public tier from a public request', () => {
    expect(decidePromotion('BIZ49')).toEqual({
      applied: true,
      code: 'BIZ49',
      discountCents: 4_900,
    });
  });

  it('accepts the code regardless of the case the customer typed', () => {
    expect(decidePromotion('  biz49 ')).toEqual({
      applied: true,
      code: 'BIZ49',
      discountCents: 4_900,
    });
  });

  it('refuses every private tier presented publicly', () => {
    for (const code of promotionCodes.filter((entry) => !promotionTiers[entry].publiclyOffered)) {
      expect(decidePromotion(code)).toEqual({ applied: false, reason: 'unknown_code' });
    }
  });

  it('reports a private tier exactly like an unknown code, so guessing reveals nothing', () => {
    expect(decidePromotion('BIZ199')).toEqual(decidePromotion('BIZ12345'));
  });

  it('applies a private tier only when the server issued the request', () => {
    expect(decidePromotion('BIZ199', 'targeted')).toEqual({
      applied: true,
      code: 'BIZ199',
      discountCents: 19_900,
    });
  });

  it('rejects an unknown code from a targeted request too', () => {
    expect(decidePromotion('FREE', 'targeted')).toEqual({
      applied: false,
      reason: 'unknown_code',
    });
  });

  it('reports no discount for anything that was not applied', () => {
    expect(expectedDiscountCents(null)).toBe(0);
    expect(expectedDiscountCents(decidePromotion('BIZ199'))).toBe(0);
    expect(expectedDiscountCents(decidePromotion('BIZ49'))).toBe(4_900);
  });

  it('recognises only the ladder as promotion codes', () => {
    expect(isPromotionCode('BIZ49')).toBe(true);
    expect(isPromotionCode('toString')).toBe(false);
    expect(isPromotionCode('constructor')).toBe(false);
  });
});
