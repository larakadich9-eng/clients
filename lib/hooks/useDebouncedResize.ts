import { useEffect, useRef } from 'react';

/**
 * Hook that debounces resize events to prevent layout thrashing
 * @param callback - Function to call after resize events settle
 * @param delay - Debounce delay in milliseconds (default: 100ms)
 */
export function useDebouncedResize(callback: () => void, delay: number = 100): void {
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callbackRef.current();
      }, delay);
    };

    // Add passive event listener for better scroll/resize performance
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [delay]);
}
