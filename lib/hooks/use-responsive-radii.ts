/**
 * Responsive Radii Hook
 * 
 * React hook for calculating outer and inner radii based on viewport dimensions
 * Uses diagonal-based calculation for radial mandala bloom pattern
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 */

'use client';

import { useEffect, useState } from 'react';

interface ResponsiveRadii {
  outer: number;  // Perimeter radius in pixels
  inner: number;  // Inner radius in pixels
}

/**
 * Calculate radii based on viewport dimensions
 * Uses diagonal-based calculation (70% for outer, 15% for inner)
 * 
 * @param viewportWidth - Current viewport width in pixels
 * @param viewportHeight - Current viewport height in pixels
 * @returns Calculated outer and inner radii
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4
 */
function calculateRadii(viewportWidth: number, viewportHeight: number): ResponsiveRadii {
  // Calculate viewport diagonal using Pythagorean theorem
  const diagonal = Math.sqrt(viewportWidth ** 2 + viewportHeight ** 2);
  
  return {
    outer: diagonal * 0.7,   // 70% of diagonal for perimeter
    inner: diagonal * 0.15,  // 15% of diagonal for inner radius
  };
}

/**
 * Hook to calculate and maintain responsive radii based on viewport dimensions
 * Automatically updates radii on window resize
 * 
 * @param enabled - Whether to enable responsive radius calculation (default: true)
 * @param customOuter - Optional custom outer radius (overrides calculation)
 * @param customInner - Optional custom inner radius (overrides calculation)
 * @returns Current outer and inner radii
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 */
export function useResponsiveRadii(
  enabled: boolean = true,
  customOuter?: number,
  customInner?: number
): ResponsiveRadii {
  // Initialize with default values for SSR
  const [radii, setRadii] = useState<ResponsiveRadii>(() => {
    // If custom values provided, use them
    if (customOuter !== undefined && customInner !== undefined) {
      return { outer: customOuter, inner: customInner };
    }
    
    // Default values for SSR (desktop-like viewport)
    return { outer: 800, inner: 150 };
  });

  useEffect(() => {
    // If disabled or custom values provided, don't calculate
    if (!enabled || (customOuter !== undefined && customInner !== undefined)) {
      if (customOuter !== undefined && customInner !== undefined) {
        setRadii({ outer: customOuter, inner: customInner });
      }
      return;
    }

    // Calculate radii based on current viewport
    const updateRadii = () => {
      const { innerWidth, innerHeight } = window;
      const calculated = calculateRadii(innerWidth, innerHeight);
      
      // Use custom values if provided, otherwise use calculated
      setRadii({
        outer: customOuter ?? calculated.outer,
        inner: customInner ?? calculated.inner,
      });
    };

    // Set initial radii
    updateRadii();

    // Add resize event listener to recompute radii on window resize
    window.addEventListener('resize', updateRadii);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('resize', updateRadii);
    };
  }, [enabled, customOuter, customInner]);

  return radii;
}

/**
 * Get viewport type based on current window width
 * Used for responsive beam count adjustment
 * 
 * @returns Current viewport type (mobile, tablet, or desktop)
 * 
 * Requirements: 8.2, 8.3, 8.4
 */
export function getViewportType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') {
    return 'desktop'; // Default for SSR
  }

  const width = window.innerWidth;

  if (width < 768) {
    return 'mobile';
  } else if (width < 1024) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

/**
 * Hook to track current viewport type
 * Updates on window resize
 * 
 * @returns Current viewport type
 * 
 * Requirements: 8.2, 8.3, 8.4, 8.5
 */
export function useViewportType(): 'mobile' | 'tablet' | 'desktop' {
  const [viewportType, setViewportType] = useState<'mobile' | 'tablet' | 'desktop'>(() => 
    getViewportType()
  );

  useEffect(() => {
    const updateViewportType = () => {
      setViewportType(getViewportType());
    };

    // Set initial viewport type
    updateViewportType();

    // Add resize event listener
    window.addEventListener('resize', updateViewportType);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('resize', updateViewportType);
    };
  }, []);

  return viewportType;
}
