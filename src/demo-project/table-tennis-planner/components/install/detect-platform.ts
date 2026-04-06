// Platform detection utility for PWA install banner.
// Determines the user's browser/platform context to show appropriate install instructions.

export type InstallPlatform =
  | 'webview'        // In-app browser (WhatsApp, Facebook, etc.)
  | 'ios-safari'     // iOS Safari, not standalone
  | 'ios-other'      // iOS Chrome, Firefox, etc.
  | 'android'        // Android browser (beforeinstallprompt available)
  | 'standalone'     // Already installed as PWA
  | 'desktop';       // Desktop browser — no banner needed

export function isIosUserAgent(userAgent: string): boolean {
  return /iPad|iPhone|iPod/.test(userAgent);
}

export function detectPlatform(userAgent: string, isStandalone: boolean): InstallPlatform {
  if (isStandalone) return 'standalone';

  // WebView detection (WhatsApp, Facebook, Instagram, Line, etc.)
  const webviewPatterns = /FBAN|FBAV|Instagram|Line|WhatsApp|wv\)/i;
  if (webviewPatterns.test(userAgent)) return 'webview';

  if (isIosUserAgent(userAgent)) {
    // iOS non-Safari browsers (Chrome = CriOS, Firefox = FxiOS, Edge = EdgiOS)
    const nonSafari = /CriOS|FxiOS|EdgiOS/.test(userAgent);
    return nonSafari ? 'ios-other' : 'ios-safari';
  }

  // Android detection
  if (/Android/.test(userAgent)) return 'android';

  return 'desktop';
}
