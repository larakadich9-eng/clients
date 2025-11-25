import { useState, useEffect } from 'react';

/**
 * Hook that detects device orientation (portrait vs landscape)
 * @returns boolean indicating if device is in portrait orientation
 */
export function useOrientation(): boolean {
  const [isPortrait, setIsPortrait] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(orientation: portrait)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(orientation: portrait)');
    
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsPortrait(e.matches);
    };

    // Initial check
    handleChange(mediaQuery);

    // Listen for orientation changes
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return isPortrait;
}
