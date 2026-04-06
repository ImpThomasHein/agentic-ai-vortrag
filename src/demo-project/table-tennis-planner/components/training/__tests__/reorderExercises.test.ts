/** Unit tests for the computeNewSortOrders utility function. */

import { describe, it, expect } from 'vitest';
import { computeNewSortOrders } from '../reorderExercises';

/** Helper: convert result array to id→sortOrder map for order-independent assertions */
function toMap(result: { id: string; sortOrder: number }[]): Record<string, number> {
  return Object.fromEntries(result.map(r => [r.id, r.sortOrder]));
}

describe('computeNewSortOrders', () => {
  it('should move an item up by swapping sortOrders', () => {
    const items = [
      { id: 'a', sortOrder: 0 },
      { id: 'b', sortOrder: 1 },
      { id: 'c', sortOrder: 2 },
    ];
    const result = toMap(computeNewSortOrders(items, 'b', 'up'));
    expect(result['a']).toBe(1);
    expect(result['b']).toBe(0);
  });

  it('should move an item down by swapping sortOrders', () => {
    const items = [
      { id: 'a', sortOrder: 0 },
      { id: 'b', sortOrder: 1 },
      { id: 'c', sortOrder: 2 },
    ];
    const result = toMap(computeNewSortOrders(items, 'b', 'down'));
    expect(result['b']).toBe(2);
    expect(result['c']).toBe(1);
  });

  it('should return empty array when moving first item up', () => {
    const items = [
      { id: 'a', sortOrder: 0 },
      { id: 'b', sortOrder: 1 },
    ];
    const result = computeNewSortOrders(items, 'a', 'up');
    expect(result).toEqual([]);
  });

  it('should return empty array when moving last item down', () => {
    const items = [
      { id: 'a', sortOrder: 0 },
      { id: 'b', sortOrder: 1 },
    ];
    const result = computeNewSortOrders(items, 'b', 'down');
    expect(result).toEqual([]);
  });

  it('should return empty array for unknown item id', () => {
    const items = [{ id: 'a', sortOrder: 0 }];
    const result = computeNewSortOrders(items, 'unknown', 'up');
    expect(result).toEqual([]);
  });

  it('should handle duplicate sortOrders by normalizing first', () => {
    const items = [
      { id: 'a', sortOrder: 1 },
      { id: 'b', sortOrder: 1 },
      { id: 'c', sortOrder: 2 },
    ];
    const result = toMap(computeNewSortOrders(items, 'a', 'down'));
    expect(result['a']).toBe(1);
    expect(result['b']).toBe(0);
  });

  it('should normalize all items with duplicate sortOrders', () => {
    const items = [
      { id: 'a', sortOrder: 1 },
      { id: 'b', sortOrder: 1 },
      { id: 'c', sortOrder: 1 },
      { id: 'd', sortOrder: 3 },
    ];
    const result = toMap(computeNewSortOrders(items, 'a', 'down'));
    expect(result['a']).toBe(1);
    expect(result['b']).toBe(0);
    expect(result['c']).toBe(2);
    // 'd' was 3, normalized to 3 — no change, may or may not appear
  });
});
