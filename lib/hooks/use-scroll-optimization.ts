import { useEffect, useState } from 'react';

/**
 * Hook to optimize scroll performance by temporarily disabling expensive effects
 * during active scrolling
 * 
 * This helps maintain 60fps by reducing backdrop-filter and other GPU-intensive
 * operations while the user is scrolling
 */
export function useScrollOptimization() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let rafId: number;

    const handleScroll = () => {
      // Mark as scrolling
      setIsScrolling(true);

      // Update scroll position using RAF for better performance
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });

      // Clear existing timeout
      clearTimeout(timeout);

      // Mark as not scrolling after 150ms of no scroll events
      timeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Set initial scroll position
    setScrollY(window.scrollY);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return {
    isScrolling,
    scrollY,
    isScrolled: scrollY > 50,
  };
}

/**
 * Hook to detect low-end devices and adjust performance settings
 */
export function useDevicePerformance() {
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);

  useEffect(() => {
    // Detect low-end devices based on hardware concurrency and memory
    const checkDevice = () => {
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      const deviceMemory = (navigator as any).deviceMemory || 4;
      
      // Consider device low-end if it has <= 4 cores and <= 4GB RAM
      const isLowEnd = hardwareConcurrency <= 4 && deviceMemory <= 4;
      
      setIsLowEndDevice(isLowEnd);

      // Also check for reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (prefersReducedMotion) {
        setIsLowEndDevice(true);
      }
    };

    checkDevice();
  }, []);

  return { isLowEndDevice };
}

/**
 * Hook to throttle scroll events for better performance
 */
export function useThrottledScroll(callback: (scrollY: number) => void, delay = 100) {
  useEffect(() => {
    let lastRun = 0;
    let rafId: number;

    const handleScroll = () => {
      const now = Date.now();

      if (now - lastRun >= delay) {
        lastRun = now;

        if (rafId) {
          cancelAnimationFrame(rafId);
        }

        rafId = requestAnimationFrame(() => {
          callback(window.scrollY);
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [callback, delay]);
}
