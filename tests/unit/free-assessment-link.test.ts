import { describe, expect, it } from 'vitest';

import { selectLinkableLeadIds } from '@/features/free-assessment/link';

describe('selectLinkableLeadIds', () => {
  const candidates = [
    { id: 'lead-1', email: 'owner@example.com' },
    { id: 'lead-2', email: 'OWNER@Example.COM' },
    { id: 'lead-3', email: 'other@example.com' },
    { id: 'lead-4', email: null },
  ];

  it('matches exact addresses case-insensitively and after trimming', () => {
    expect(selectLinkableLeadIds(candidates, '  Owner@example.com ')).toEqual(['lead-1', 'lead-2']);
  });

  it('never treats the address as a pattern', () => {
    expect(selectLinkableLeadIds(candidates, '%@example.com')).toEqual([]);
    expect(selectLinkableLeadIds(candidates, 'owner@example.co_')).toEqual([]);
  });

  it('returns nothing for an empty authenticated email', () => {
    expect(selectLinkableLeadIds(candidates, '   ')).toEqual([]);
  });

  it('ignores leads without a stored email', () => {
    expect(selectLinkableLeadIds([{ id: 'lead-4', email: null }], 'owner@example.com')).toEqual([]);
  });
});
