import { describe, it, expect } from 'vitest';
import { buildMenuHeaderLabel } from './exerciseActionMenuUtils';

describe('buildMenuHeaderLabel', () => {
  it('should include group name when provided', () => {
    const result = buildMenuHeaderLabel('Jugend');
    expect(result).toBe('Zum Training hinzufügen (Jugend)');
  });

  it('should show default label when no group name provided', () => {
    const result = buildMenuHeaderLabel(undefined);
    expect(result).toBe('Zum Training hinzufügen');
  });

  it('should show default label when group name is empty', () => {
    const result = buildMenuHeaderLabel('');
    expect(result).toBe('Zum Training hinzufügen');
  });
});
