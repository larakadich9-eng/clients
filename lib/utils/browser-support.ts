/**
 * Browser Support Detection Utilities
 * Detects support for critical CSS features like backdrop-filter
 */

/**
 * Check if the browser supports backdrop-filter
 * @returns true if backdrop-filter is supported, false otherwise
 */
export function supportsBackdropFilter(): boolean {
  if (typeof window === 'undefined') {
    // SSR - assume support
    return true;
  }

  // Check for CSS.supports API
  if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function') {
    return (
      CSS.supports('backdrop-filter', 'blur(1px)') ||
      CSS.supports('-webkit-backdrop-filter', 'blur(1px)')
    );
  }

  // Fallback: Check if the property exists on a test element
  const testElement = document.createElement('div');
  const style = testElement.style as any;
  
  return (
    'backdropFilter' in style ||
    'webkitBackdropFilter' in style ||
    'WebkitBackdropFilter' in style
  );
}

/**
 * Get browser information
 * @returns Object with browser name and version
 */
export function getBrowserInfo(): { name: string; version: string } {
  if (typeof window === 'undefined') {
    return { name: 'unknown', version: 'unknown' };
  }

  const userAgent = window.navigator.userAgent;
  let name = 'unknown';
  let version = 'unknown';

  // Firefox
  if (userAgent.indexOf('Firefox') > -1) {
    name = 'Firefox';
    const match = userAgent.match(/Firefox\/(\d+)/);
    if (match) version = match[1];
  }
  // Chrome
  else if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edg') === -1) {
    name = 'Chrome';
    const match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = match[1];
  }
  // Edge
  else if (userAgent.indexOf('Edg') > -1) {
    name = 'Edge';
    const match = userAgent.match(/Edg\/(\d+)/);
    if (match) version = match[1];
  }
  // Safari
  else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
    name = 'Safari';
    const match = userAgent.match(/Version\/(\d+)/);
    if (match) version = match[1];
  }

  return { name, version };
}

/**
 * Check if the browser is an older version that may have limited support
 * @returns true if the browser is considered legacy
 */
export function isLegacyBrowser(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const { name, version } = getBrowserInfo();
  const versionNum = parseInt(version, 10);

  // Define minimum versions for modern features
  const minVersions: Record<string, number> = {
    Firefox: 103, // backdrop-filter support
    Chrome: 76,   // backdrop-filter support
    Edge: 79,     // backdrop-filter support
    Safari: 9,    // backdrop-filter support (with -webkit prefix)
  };

  if (name in minVersions && !isNaN(versionNum)) {
    return versionNum < minVersions[name];
  }

  return false;
}

/**
 * Add a class to the document element indicating browser support
 * This allows for CSS-based fallbacks
 */
export function addBrowserSupportClasses(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const html = document.documentElement;

  // Check backdrop-filter support
  if (supportsBackdropFilter()) {
    html.classList.add('supports-backdrop-filter');
  } else {
    html.classList.add('no-backdrop-filter');
  }

  // Check if legacy browser
  if (isLegacyBrowser()) {
    html.classList.add('legacy-browser');
  }

  // Add browser name class
  const { name } = getBrowserInfo();
  if (name !== 'unknown') {
    html.classList.add(`browser-${name.toLowerCase()}`);
  }
}

/**
 * Get recommended glassmorphism styles based on browser support
 * @returns CSS class names for optimal glassmorphism rendering
 */
export function getGlassmorphismClasses(): string {
  if (typeof window === 'undefined') {
    return 'glass-effect';
  }

  const hasBackdropFilter = supportsBackdropFilter();
  const isLegacy = isLegacyBrowser();

  if (!hasBackdropFilter || isLegacy) {
    // Return classes with stronger background for better readability
    return 'glass-effect glass-fallback';
  }

  return 'glass-effect';
}

/**
 * Log browser support information to console (development only)
 */
export function logBrowserSupport(): void {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
    return;
  }

  const { name, version } = getBrowserInfo();
  const backdropFilter = supportsBackdropFilter();
  const legacy = isLegacyBrowser();

  console.group('🌐 Browser Support Detection');
  console.log(`Browser: ${name} ${version}`);
  console.log(`Backdrop Filter: ${backdropFilter ? '✅ Supported' : '❌ Not Supported'}`);
  console.log(`Legacy Browser: ${legacy ? '⚠️ Yes' : '✅ No'}`);
  console.groupEnd();
}
