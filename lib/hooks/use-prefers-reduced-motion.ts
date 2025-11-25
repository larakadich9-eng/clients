/**
 * Prefers Reduced Motion Hook
 * 
 * React hook for detecting user's motion preference via prefers-reduced-motion media query
 * Automatically updates when user changes their system preference
 * 
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
 */

'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect if user prefers reduced motion
 * Listens to prefers-reduced-motion media query and updates on changes
 * 
 * @returns Boolean indicating if user prefers reduced motion
 * 
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
 */
export function usePrefersReducedMotion(): boolean {
  // Initialize with false for SSR (animations enabled by default)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    // Check if window is available (client-side only)
    if (typeof window === 'undefined') {
      return;
    }

    // Create media query for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Set initial value based on current preference
    setPrefersReducedMotion(mediaQuery.matches);

    // Handler for media query changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Add event listener for media query changes
    // This allows the hook to respond to real-time changes in user preferences
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup: remove event listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook to get animation configuration based on motion preference
 * Returns appropriate animation settings for reduced motion users
 * 
 * @param normalDuration - Normal animation duration in seconds
 * @param reducedDuration - Reduced animation duration in seconds (default: 0)
 * @returns Animation duration based on user preference
 * 
 * Requirements: 9.2, 9.3, 9.4
 */
export function useAnimationDuration(
  normalDuration: number,
  reducedDuration: number = 0
): number {
  const prefersReducedMotion = usePrefersReducedMotion();
  return prefersReducedMotion ? reducedDuration : normalDuration;
}

/**
 * Hook to conditionally enable animations based on motion preference
 * Returns false if user prefers reduced motion, true otherwise
 * 
 * @returns Boolean indicating if animations should be enabled
 * 
 * Requirements: 9.2, 9.3, 9.4
 */
export function useAnimationsEnabled(): boolean {
  const prefersReducedMotion = usePrefersReducedMotion();
  return !prefersReducedMotion;
}
