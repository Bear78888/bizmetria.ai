import { describe, expect, it } from 'vitest';

import { findSolution, formatSolutionPrice, solutionsCatalog } from '@/features/solutions/catalog';

describe('solutions catalog', () => {
  it('holds thirteen curated solutions with unique codes', () => {
    expect(solutionsCatalog.length).toBe(13);
    const codes = solutionsCatalog.map((item) => item.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it('keeps every price inside the database bracket for solution orders', () => {
    // Mirrors solution_orders_amount_check in the migration: a catalog price
    // outside this range would create orders the database refuses to store.
    for (const item of solutionsCatalog) {
      expect(item.priceCents).toBeGreaterThanOrEqual(30_000);
      expect(item.priceCents).toBeLessThanOrEqual(300_000);
    }
  });

  it('keeps every code shaped like the database expects', () => {
    for (const item of solutionsCatalog) {
      expect(item.code).toMatch(/^[a-z][a-z0-9_]{2,63}$/u);
    }
  });

  it('carries both languages and a delivery window for every item', () => {
    for (const item of solutionsCatalog) {
      expect(item.title.en.length).toBeGreaterThan(0);
      expect(item.title.es.length).toBeGreaterThan(0);
      expect(item.outcome.en.length).toBeGreaterThan(0);
      expect(item.outcome.es.length).toBeGreaterThan(0);
      expect(item.deliveryBusinessDays).toBeGreaterThanOrEqual(3);
      expect(item.deliveryBusinessDays).toBeLessThanOrEqual(20);
    }
  });

  it('finds solutions by code and rejects unknown codes', () => {
    expect(findSolution('intake_autoreply')?.priceCents).toBe(39_000);
    expect(findSolution('does_not_exist')).toBeNull();
  });

  it('formats prices in whole dollars', () => {
    const dashboard = findSolution('metrics_dashboard');
    expect(dashboard).not.toBeNull();
    expect(formatSolutionPrice(dashboard!)).toBe('$1,990');
  });
});
