/**
 * Performance Optimization Utilities
 * 
 * Utilities for optimizing animations and detecting device capabilities
 * to ensure smooth 60fps performance across all devices.
 */

// ============================================================================
// DEVICE DETECTION
// ============================================================================

/**
 * Detects if device is low-end based on hardware capabilities
 * Low-end devices: <= 4 CPU cores and <= 4GB RAM
 */
export const isLowEndDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  
  const hardwareConcurrency = (navigator as any).hardwareConcurrency || 4;
  const deviceMemory = (navigator as any).deviceMemory || 4;
  
  return hardwareConcurrency <= 4 && deviceMemory <= 4;
};

/**
 * Detects if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Determines if animations should be simplified or disabled
 */
export const shouldReduceAnimations = (): boolean => {
  return prefersReducedMotion() || isLowEndDevice();
};

// ============================================================================
// WILL-CHANGE MANAGEMENT
// ============================================================================

/**
 * Manages will-change property for performance optimization
 * Automatically adds will-change before animation and removes after
 */
export class WillChangeManager {
  private elements = new Map<HTMLElement, NodeJS.Timeout>();

  /**
   * Add will-change property to element
   * @param element - DOM element to optimize
   * @param properties - CSS properties that will change (e.g., 'transform', 'opacity')
   * @param duration - Duration in ms before removing will-change (default: 1000ms)
   */
  add(element: HTMLElement | null, properties: string, duration: number = 1000): void {
    if (!element) return;

    // Clear existing timeout if any
    const existingTimeout = this.elements.get(element);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Add will-change
    element.style.willChange = properties;

    // Schedule removal
    const timeout = setTimeout(() => {
      this.remove(element);
    }, duration);

    this.elements.set(element, timeout);
  }

  /**
   * Remove will-change property from element
   * @param element - DOM element to clean up
   */
  remove(element: HTMLElement | null): void {
    if (!element) return;

    element.style.willChange = 'auto';
    
    const timeout = this.elements.get(element);
    if (timeout) {
      clearTimeout(timeout);
      this.elements.delete(element);
    }
  }

  /**
   * Clean up all managed elements
   */
  cleanup(): void {
    this.elements.forEach((timeout, element) => {
      clearTimeout(timeout);
      element.style.willChange = 'auto';
    });
    this.elements.clear();
  }
}

// Global instance
export const willChangeManager = new WillChangeManager();

// ============================================================================
// ANIMATION THROTTLING
// ============================================================================

/**
 * Tracks concurrent animations to prevent performance issues
 */
class AnimationThrottler {
  private activeAnimations = new Set<string>();
  private maxConcurrent = 4;

  /**
   * Check if animation can start
   * @param id - Unique identifier for the animation
   * @returns boolean indicating if animation should proceed
   */
  canAnimate(id: string): boolean {
    if (shouldReduceAnimations()) return false;
    if (this.activeAnimations.size >= this.maxConcurrent) return false;
    return true;
  }

  /**
   * Register animation as active
   * @param id - Unique identifier for the animation
   */
  start(id: string): void {
    this.activeAnimations.add(id);
  }

  /**
   * Unregister animation
   * @param id - Unique identifier for the animation
   */
  end(id: string): void {
    this.activeAnimations.delete(id);
  }

  /**
   * Get count of active animations
   */
  getActiveCount(): number {
    return this.activeAnimations.size;
  }

  /**
   * Set maximum concurrent animations
   * @param max - Maximum number of concurrent animations
   */
  setMaxConcurrent(max: number): void {
    this.maxConcurrent = max;
  }
}

// Global instance
export const animationThrottler = new AnimationThrottler();

// ============================================================================
// GPU ACCELERATION HELPERS
// ============================================================================

/**
 * Apply GPU acceleration hints to element
 * @param element - DOM element to optimize
 */
export const enableGPUAcceleration = (element: HTMLElement | null): void => {
  if (!element) return;
  
  // Force GPU layer creation
  element.style.transform = element.style.transform || 'translateZ(0)';
  element.style.backfaceVisibility = 'hidden';
  element.style.perspective = '1000px';
};

/**
 * Remove GPU acceleration hints from element
 * @param element - DOM element to clean up
 */
export const disableGPUAcceleration = (element: HTMLElement | null): void => {
  if (!element) return;
  
  element.style.transform = '';
  element.style.backfaceVisibility = '';
  element.style.perspective = '';
};

// ============================================================================
// FRAME RATE MONITORING
// ============================================================================

/**
 * Simple FPS monitor for development
 */
export class FPSMonitor {
  private frames = 0;
  private lastTime = performance.now();
  private fps = 60;
  private rafId: number | null = null;

  start(callback?: (fps: number) => void): void {
    const measure = () => {
      this.frames++;
      const currentTime = performance.now();
      
      if (currentTime >= this.lastTime + 1000) {
        this.fps = Math.round((this.frames * 1000) / (currentTime - this.lastTime));
        this.frames = 0;
        this.lastTime = currentTime;
        
        if (callback) {
          callback(this.fps);
        }
      }
      
      this.rafId = requestAnimationFrame(measure);
    };
    
    this.rafId = requestAnimationFrame(measure);
  }

  stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  getFPS(): number {
    return this.fps;
  }
}

// ============================================================================
// PERFORMANCE UTILITIES
// ============================================================================

/**
 * Debounce function for performance optimization
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Request animation frame with fallback
 * @param callback - Function to execute on next frame
 * @returns Request ID
 */
export const raf = (callback: FrameRequestCallback): number => {
  return requestAnimationFrame(callback);
};

/**
 * Cancel animation frame
 * @param id - Request ID to cancel
 */
export const caf = (id: number): void => {
  cancelAnimationFrame(id);
};

// ============================================================================
// WEB VITALS MONITORING
// ============================================================================

/**
 * Web Vitals thresholds based on Google's recommendations
 */
export const WEB_VITALS_THRESHOLDS = {
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
} as const;

export type WebVitalMetric = {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
};

/**
 * Rate a metric based on thresholds
 * @param name - Metric name
 * @param value - Metric value
 * @returns Rating (good, needs-improvement, poor)
 */
export function rateMetric(
  name: keyof typeof WEB_VITALS_THRESHOLDS,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = WEB_VITALS_THRESHOLDS[name];
  
  if (value <= thresholds.good) {
    return 'good';
  } else if (value <= thresholds.poor) {
    return 'needs-improvement';
  } else {
    return 'poor';
  }
}

/**
 * Report Web Vitals to console (development) or analytics (production)
 * @param metric - Web Vital metric
 */
export function reportWebVitals(metric: WebVitalMetric): void {
  if (process.env.NODE_ENV === 'development') {
    // Log to console in development
    const emoji = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌';
    console.log(
      `${emoji} ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`
    );
  } else {
    // In production, send to analytics service
    // Example: Google Analytics, Vercel Analytics, etc.
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      });
    }
  }
}
