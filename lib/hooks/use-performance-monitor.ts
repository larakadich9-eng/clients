/**
 * Performance Monitoring Hook
 * 
 * React hook for monitoring FPS and animation performance in development
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { FPSMonitor } from '@/lib/utils/performance';

interface PerformanceMetrics {
  fps: number;
  isLowPerformance: boolean;
  cls: number;
  isGPUAccelerated: boolean;
  resizeCount: number;
}

/**
 * Hook to monitor FPS and performance metrics
 * Only active in development mode
 * 
 * @param enabled - Whether to enable monitoring (default: false)
 * @param threshold - FPS threshold for low performance warning (default: 50)
 * @returns Performance metrics
 */
export function usePerformanceMonitor(
  enabled: boolean = false,
  threshold: number = 50
): PerformanceMetrics {
  const [fps, setFps] = useState(60);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [cls, setCls] = useState(0);
  const [isGPUAccelerated, setIsGPUAccelerated] = useState(true);
  const [resizeCount, setResizeCount] = useState(0);

  // FPS Monitoring
  useEffect(() => {
    if (!enabled || process.env.NODE_ENV !== 'development') {
      return;
    }

    const monitor = new FPSMonitor();

    monitor.start((currentFps) => {
      setFps(currentFps);
      setIsLowPerformance(currentFps < threshold);

      // Log warning if performance is low
      if (currentFps < threshold) {
        console.warn(
          `⚠️ Low FPS detected: ${currentFps}fps (threshold: ${threshold}fps)`
        );
      }
    });

    return () => {
      monitor.stop();
    };
  }, [enabled, threshold]);

  // CLS Monitoring during viewport resize
  useEffect(() => {
    if (!enabled || process.env.NODE_ENV !== 'development' || typeof PerformanceObserver === 'undefined') {
      return;
    }

    try {
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }

        if (clsValue > 0) {
          setCls((prev) => {
            const newCls = prev + clsValue;
            if (newCls > 0.1) {
              console.warn(`⚠️ High CLS detected: ${newCls.toFixed(4)} (threshold: 0.1)`);
            }
            return newCls;
          });
        }
      });

      clsObserver.observe({ entryTypes: ['layout-shift'] });

      return () => {
        clsObserver.disconnect();
      };
    } catch (error) {
      console.warn('[Performance] CLS monitoring not supported:', error);
    }
  }, [enabled]);

  // Resize Count Monitoring (to verify debouncing)
  useEffect(() => {
    if (!enabled || process.env.NODE_ENV !== 'development') {
      return;
    }

    const handleResize = () => {
      setResizeCount((prev) => {
        const newCount = prev + 1;
        console.log(`[Performance] Resize event #${newCount}`);
        return newCount;
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [enabled]);

  // GPU Acceleration Check
  useEffect(() => {
    if (!enabled || process.env.NODE_ENV !== 'development') {
      return;
    }

    const checkGPUAcceleration = () => {
      const cards = document.querySelectorAll('.academy-card-container');
      let isAccelerated = false;

      cards.forEach((card) => {
        const styles = window.getComputedStyle(card);
        const willChange = styles.willChange;
        const transform = styles.transform;
        
        // Check if GPU acceleration is likely active
        if (willChange.includes('transform') || transform !== 'none') {
          isAccelerated = true;
        }
      });

      setIsGPUAccelerated(isAccelerated);
      console.log(`[Performance] GPU Acceleration: ${isAccelerated ? '✓ Active' : '✗ Inactive'}`);
    };

    // Check after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(checkGPUAcceleration, 1000);

    return () => clearTimeout(timeoutId);
  }, [enabled]);

  return { fps, isLowPerformance, cls, isGPUAccelerated, resizeCount };
}

/**
 * Hook to log component render performance
 * Only active in development mode
 * 
 * @param componentName - Name of the component being monitored
 */
export function useRenderPerformance(componentName: string): void {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      if (renderTime > 16) {
        // More than one frame at 60fps
        console.warn(
          `⚠️ Slow render in ${componentName}: ${renderTime.toFixed(2)}ms`
        );
      }
    };
  });
}

/**
 * Hook to measure animation performance
 * Only active in development mode
 * 
 * @param animationName - Name of the animation being monitored
 * @param isAnimating - Whether animation is currently active
 */
export function useAnimationPerformance(
  animationName: string,
  isAnimating: boolean
): void {
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    if (isAnimating && !startTime) {
      setStartTime(performance.now());
    } else if (!isAnimating && startTime) {
      const duration = performance.now() - startTime;
      console.log(`✓ Animation "${animationName}" completed in ${duration.toFixed(2)}ms`);
      setStartTime(null);
    }
  }, [isAnimating, startTime, animationName]);
}
