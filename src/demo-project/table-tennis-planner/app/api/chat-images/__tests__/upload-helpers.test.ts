/** Unit tests for image upload helper functions */
import { describe, it, expect } from 'vitest';
import { validateImageFile } from '../upload-helpers';

describe('validateImageFile', () => {
  it('should accept JPEG files under 5MB', () => {
    const result = validateImageFile('image/jpeg', 2 * 1024 * 1024);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept PNG files under 5MB', () => {
    const result = validateImageFile('image/png', 1 * 1024 * 1024);
    expect(result.valid).toBe(true);
  });

  it('should accept WebP files under 5MB', () => {
    const result = validateImageFile('image/webp', 500 * 1024);
    expect(result.valid).toBe(true);
  });

  it('should reject non-image MIME types', () => {
    const result = validateImageFile('application/pdf', 1024);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('JPEG, PNG oder WebP');
  });

  it('should reject unsupported image types like GIF', () => {
    const result = validateImageFile('image/gif', 1024);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('JPEG, PNG oder WebP');
  });

  it('should reject files over 5MB', () => {
    const result = validateImageFile('image/jpeg', 6 * 1024 * 1024);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('5 MB');
  });

  it('should reject exactly 5MB boundary (exclusive)', () => {
    const fiveMB = 5 * 1024 * 1024;
    const result = validateImageFile('image/jpeg', fiveMB + 1);
    expect(result.valid).toBe(false);
  });

  it('should accept exactly 5MB', () => {
    const fiveMB = 5 * 1024 * 1024;
    const result = validateImageFile('image/jpeg', fiveMB);
    expect(result.valid).toBe(true);
  });
});
