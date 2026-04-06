/** Utility for computing new sortOrder values when reordering exercises in a training session. */

interface SortableItem {
  id: string;
  sortOrder: number;
}

/**
 * Given a sorted list of items, compute the items whose sortOrder
 * needs to change when moving itemId in the given direction.
 * Normalizes sortOrders first (0, 1, 2, ...) to handle duplicates,
 * then swaps the target item with its neighbor.
 * Always returns both swapped items plus any items needing normalization.
 */
export function computeNewSortOrders(
  items: SortableItem[],
  itemId: string,
  direction: 'up' | 'down'
): SortableItem[] {
  const index = items.findIndex((item) => item.id === itemId);
  if (index === -1) return [];

  const swapIndex = direction === 'up' ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= items.length) return [];

  // Build target state: normalize to 0,1,2,..., then swap the two positions
  const target = items.map((_, i) => i);
  target[index] = swapIndex;
  target[swapIndex] = index;

  // Always include the swapped pair, plus any other items needing normalization
  const updates: SortableItem[] = [];
  for (let i = 0; i < items.length; i++) {
    if (i === index || i === swapIndex || items[i].sortOrder !== target[i]) {
      updates.push({ id: items[i].id, sortOrder: target[i] });
    }
  }

  return updates;
}
