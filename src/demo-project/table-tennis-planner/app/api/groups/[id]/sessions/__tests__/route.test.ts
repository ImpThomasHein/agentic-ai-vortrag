import { describe, it, expect } from 'vitest';
import { buildSessionDateFilter } from '../session-date-filter';

describe('GET /api/groups/[id]/sessions — date filtering', () => {
  it('should return a gte filter for today at midnight', () => {
    const now = new Date('2025-07-15T14:30:00');
    const filter = buildSessionDateFilter(now);

    const expectedDate = new Date('2025-07-15T00:00:00');
    expect(filter).toEqual({ gte: expectedDate });
  });

  it('should set hours to 00:00:00.000', () => {
    const now = new Date('2025-12-31T23:59:59.999');
    const filter = buildSessionDateFilter(now);

    expect(filter.gte.getHours()).toBe(0);
    expect(filter.gte.getMinutes()).toBe(0);
    expect(filter.gte.getSeconds()).toBe(0);
    expect(filter.gte.getMilliseconds()).toBe(0);
  });
});
