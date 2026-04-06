// Unit tests for platform detection logic used by the install banner.
import { describe, it, expect } from 'vitest';
import { detectPlatform, isIosUserAgent } from '../detect-platform';

describe('detectPlatform', () => {
  it('returns "standalone" when app is installed', () => {
    expect(detectPlatform('any-agent', true)).toBe('standalone');
  });

  it('returns "webview" for WhatsApp in-app browser', () => {
    const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) WhatsApp/2.23';
    expect(detectPlatform(ua, false)).toBe('webview');
  });

  it('returns "webview" for Facebook in-app browser', () => {
    const ua = 'Mozilla/5.0 (Linux; Android 13) FBAN/FB4A FBAV/400.0';
    expect(detectPlatform(ua, false)).toBe('webview');
  });

  it('returns "webview" for Instagram in-app browser', () => {
    const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) Instagram 300.0';
    expect(detectPlatform(ua, false)).toBe('webview');
  });

  it('returns "ios-safari" for Safari on iPhone', () => {
    const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1';
    expect(detectPlatform(ua, false)).toBe('ios-safari');
  });

  it('returns "ios-other" for Chrome on iPhone', () => {
    const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/119.0 Mobile/15E148 Safari/604.1';
    expect(detectPlatform(ua, false)).toBe('ios-other');
  });

  it('returns "ios-other" for Firefox on iPhone', () => {
    const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/119.0 Mobile/15E148 Safari/604.1';
    expect(detectPlatform(ua, false)).toBe('ios-other');
  });

  it('returns "ios-safari" for iPad Safari', () => {
    const ua = 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1';
    expect(detectPlatform(ua, false)).toBe('ios-safari');
  });

  it('returns "android" for Chrome on Android', () => {
    const ua = 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0 Mobile Safari/537.36';
    expect(detectPlatform(ua, false)).toBe('android');
  });

  it('returns "desktop" for Chrome on desktop', () => {
    const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0 Safari/537.36';
    expect(detectPlatform(ua, false)).toBe('desktop');
  });

  it('standalone takes precedence over everything', () => {
    const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) WhatsApp/2.23';
    expect(detectPlatform(ua, true)).toBe('standalone');
  });
});

describe('isIosUserAgent', () => {
  it('returns true for iPhone user agent', () => {
    expect(isIosUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_0)')).toBe(true);
  });

  it('returns true for iPad user agent', () => {
    expect(isIosUserAgent('Mozilla/5.0 (iPad; CPU OS 16_0)')).toBe(true);
  });

  it('returns false for Android user agent', () => {
    expect(isIosUserAgent('Mozilla/5.0 (Linux; Android 13)')).toBe(false);
  });
});
