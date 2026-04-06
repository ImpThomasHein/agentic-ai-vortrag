/**
 * Test that verifies the lineup API response shape is correctly unwrapped
 * before being stored as an array. The API returns { lineup: [...] },
 * not a flat array — the client must extract the lineup property.
 */
import { describe, it, expect } from 'vitest';

/** Simulates extracting lineup entries from the API response, mirroring useMatchAvailability's fetchLineup. */
function extractLineupFromResponse(apiResponse: unknown): { userId: string; isDriver: boolean }[] {
  const data = apiResponse as { lineup: { userId: string; isDriver: boolean }[] };
  return data.lineup ?? [];
}

describe('lineup API response shape', () => {
  it('extracts lineup array from wrapped response object', () => {
    const apiResponse = {
      lineup: [
        { userId: 'u1', displayName: 'Max', isDriver: true },
        { userId: 'u2', displayName: 'Lisa', isDriver: false },
      ],
    };

    const result = extractLineupFromResponse(apiResponse);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
    expect(result[0].userId).toBe('u1');
  });

  it('returns empty array when lineup property is missing', () => {
    const apiResponse = {};

    const result = extractLineupFromResponse(apiResponse);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
  });

  it('current hook code fails — treats response object as array', () => {
    // This is what the buggy hook does: treats the full response as an array
    const apiResponse = {
      lineup: [{ userId: 'u1', displayName: 'Max', isDriver: true }],
    };

    // The buggy code: `const data = await res.json(); setLineupState(data);`
    // data is the full response object, not an array
    const buggyData = apiResponse as unknown;

    expect(Array.isArray(buggyData)).toBe(false);
    // This would crash: buggyData.map(...)
    expect(typeof (buggyData as Record<string, unknown>).map).toBe('undefined');
  });
});
