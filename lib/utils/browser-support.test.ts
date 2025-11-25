import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  supportsBackdropFilter,
  getBrowserInfo,
  isLegacyBrowser,
  addBrowserSupportClasses,
  getGlassmorphismClasses,
} from './browser-support';

describe('Browser Support Detection', () => {
  beforeEach(() => {
    // Reset DOM
    if (typeof document !== 'undefined') {
      document.documentElement.className = '';
    }
  });

  describe('supportsBackdropFilter', () => {
    it('should return true when CSS.supports indicates backdrop-filter support', () => {
      // Mock CSS.supports to return true
      global.CSS = {
        supports: vi.fn((property: string, value: string) => {
          return property === 'backdrop-filter' && value === 'blur(1px)';
        }),
      } as any;

      expect(supportsBackdropFilter()).toBe(true);
    });

    it('should return true when CSS.supports indicates -webkit-backdrop-filter support', () => {
      global.CSS = {
        supports: vi.fn((property: string, value: string) => {
          return property === '-webkit-backdrop-filter' && value === 'blur(1px)';
        }),
      } as any;

      expect(supportsBackdropFilter()).toBe(true);
    });

    it('should check element style when CSS.supports is not available', () => {
      // Remove CSS.supports
      global.CSS = undefined as any;

      // Mock createElement to return element with backdropFilter property
      const mockElement = {
        style: {
          backdropFilter: '',
        },
      };
      vi.spyOn(document, 'createElement').mockReturnValue(mockElement as any);

      expect(supportsBackdropFilter()).toBe(true);
    });
  });

  describe('getBrowserInfo', () => {
    it('should detect Firefox', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0',
        configurable: true,
      });

      const info = getBrowserInfo();
      expect(info.name).toBe('Firefox');
      expect(info.version).toBe('115');
    });

    it('should detect Chrome', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        configurable: true,
      });

      const info = getBrowserInfo();
      expect(info.name).toBe('Chrome');
      expect(info.version).toBe('120');
    });

    it('should detect Edge', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
        configurable: true,
      });

      const info = getBrowserInfo();
      expect(info.name).toBe('Edge');
      expect(info.version).toBe('120');
    });

    it('should detect Safari', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
        configurable: true,
      });

      const info = getBrowserInfo();
      expect(info.name).toBe('Safari');
      expect(info.version).toBe('17');
    });
  });

  describe('isLegacyBrowser', () => {
    it('should return true for Firefox < 103', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0',
        configurable: true,
      });

      expect(isLegacyBrowser()).toBe(true);
    });

    it('should return false for Firefox >= 103', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0',
        configurable: true,
      });

      expect(isLegacyBrowser()).toBe(false);
    });

    it('should return true for Chrome < 76', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.0.0 Safari/537.36',
        configurable: true,
      });

      expect(isLegacyBrowser()).toBe(true);
    });

    it('should return false for Chrome >= 76', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        configurable: true,
      });

      expect(isLegacyBrowser()).toBe(false);
    });
  });

  describe('addBrowserSupportClasses', () => {
    it('should add supports-backdrop-filter class when supported', () => {
      global.CSS = {
        supports: vi.fn(() => true),
      } as any;

      addBrowserSupportClasses();

      expect(document.documentElement.classList.contains('supports-backdrop-filter')).toBe(true);
    });

    it('should add no-backdrop-filter class when not supported', () => {
      global.CSS = {
        supports: vi.fn(() => false),
      } as any;

      addBrowserSupportClasses();

      expect(document.documentElement.classList.contains('no-backdrop-filter')).toBe(true);
    });

    it('should add legacy-browser class for old browsers', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0',
        configurable: true,
      });

      addBrowserSupportClasses();

      expect(document.documentElement.classList.contains('legacy-browser')).toBe(true);
    });
  });

  describe('getGlassmorphismClasses', () => {
    it('should return glass-effect for modern browsers', () => {
      global.CSS = {
        supports: vi.fn(() => true),
      } as any;

      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        configurable: true,
      });

      const classes = getGlassmorphismClasses();
      expect(classes).toBe('glass-effect');
    });

    it('should return glass-effect glass-fallback for legacy browsers', () => {
      global.CSS = {
        supports: vi.fn(() => false),
      } as any;

      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0',
        configurable: true,
      });

      const classes = getGlassmorphismClasses();
      expect(classes).toBe('glass-effect glass-fallback');
    });
  });
});
