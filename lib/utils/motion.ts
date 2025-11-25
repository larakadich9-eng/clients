/**
 * Motion System Utilities
 * 
 * Centralized animation variants, timing configurations, and motion utilities
 * for consistent animations throughout the ORNINA website.
 * 
 * Design Principles:
 * - Micro-interactions: 150ms
 * - State changes: 300ms
 * - GPU-accelerated properties only (transform, opacity)
 * - Respects prefers-reduced-motion
 * - Limits concurrent animations to 3-4 elements
 * - Uses will-change sparingly and removes after animation
 */

import { Variants, Transition } from 'framer-motion';
import { 
  shouldReduceAnimations, 
  prefersReducedMotion, 
  isLowEndDevice 
} from './performance';

// Re-export for backward compatibility
export { prefersReducedMotion, isLowEndDevice };

/**
 * Determines if animations should be disabled
 * @returns boolean indicating if animations should be disabled
 */
export const shouldDisableAnimations = shouldReduceAnimations;

// ============================================================================
// TIMING CONFIGURATION
// ============================================================================

/**
 * Standard timing durations for consistent animations
 */
export const timing = {
  /** Micro-interactions (hover, focus) - 150ms */
  micro: 0.15,
  /** State changes (theme, language) - 300ms */
  state: 0.3,
  /** Scroll animations - 250ms */
  scroll: 0.25,
  /** Page transitions - 400ms */
  page: 0.4,
} as const;

// ============================================================================
// CUSTOM EASING FUNCTIONS
// ============================================================================

/**
 * Custom easing functions for smooth, natural motion
 */
export const easing = {
  /** Smooth ease out for entrances */
  easeOut: [0.16, 1, 0.3, 1] as number[],
  /** Smooth ease in-out for state changes */
  easeInOut: [0.43, 0.13, 0.23, 0.96] as number[],
  /** Sharp ease out for micro-interactions */
  sharpOut: [0.34, 1.56, 0.64, 1] as number[],
  /** Gentle ease for subtle movements */
  gentle: [0.25, 0.46, 0.45, 0.94] as number[],
};

// ============================================================================
// REUSABLE ANIMATION VARIANTS
// ============================================================================

/**
 * Fade-in animation variants
 */
export const fadeIn: Variants = {
  hidden: { 
    opacity: 0,
  },
  visible: { 
    opacity: 1,
    transition: {
      duration: timing.state,
      ease: easing.easeOut,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: timing.state,
      ease: easing.easeInOut,
    },
  },
};

/**
 * Slide-in from bottom animation variants
 * Only animates transform and opacity for optimal performance
 */
export const slideInFromBottom: Variants = {
  hidden: { 
    opacity: 0,
    y: 20,
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: timing.state,
      ease: easing.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: timing.state,
      ease: easing.easeInOut,
    },
  },
};

/**
 * Slide-in from top animation variants
 * Only animates transform and opacity for optimal performance
 */
export const slideInFromTop: Variants = {
  hidden: { 
    opacity: 0,
    y: -20,
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: timing.state,
      ease: easing.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: timing.state,
      ease: easing.easeInOut,
    },
  },
};

/**
 * Slide-in from left animation variants
 * Only animates transform and opacity for optimal performance
 */
export const slideInFromLeft: Variants = {
  hidden: { 
    opacity: 0,
    x: -20,
  },
  visible: { 
    opacity: 1,
    x: 0,
    transition: {
      duration: timing.state,
      ease: easing.easeOut,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: timing.state,
      ease: easing.easeInOut,
    },
  },
};

/**
 * Slide-in from right animation variants
 * Only animates transform and opacity for optimal performance
 */
export const slideInFromRight: Variants = {
  hidden: { 
    opacity: 0,
    x: 20,
  },
  visible: { 
    opacity: 1,
    x: 0,
    transition: {
      duration: timing.state,
      ease: easing.easeOut,
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: timing.state,
      ease: easing.easeInOut,
    },
  },
};

/**
 * Scale animation variants
 * Only animates transform and opacity for optimal performance
 */
export const scale: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.8,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: {
      duration: timing.state,
      ease: easing.easeOut,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: timing.state,
      ease: easing.easeInOut,
    },
  },
};

/**
 * Scale up animation variants (for hover effects)
 * Only animates transform for optimal performance
 */
export const scaleUp: Variants = {
  initial: { 
    scale: 1,
  },
  hover: { 
    scale: 1.05,
    transition: {
      duration: timing.micro,
      ease: easing.sharpOut,
    },
  },
  tap: { 
    scale: 0.95,
    transition: {
      duration: timing.micro,
      ease: easing.sharpOut,
    },
  },
};

/**
 * Glow effect animation variants
 */
export const glow: Variants = {
  initial: {
    boxShadow: '0 0 0px rgba(255, 255, 255, 0)',
  },
  hover: {
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
    transition: {
      duration: timing.micro,
      ease: easing.easeOut,
    },
  },
};

/**
 * Text glow effect animation variants
 */
export const textGlow: Variants = {
  initial: {
    textShadow: '0 0 0px rgba(255, 255, 255, 0)',
  },
  hover: {
    textShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
    transition: {
      duration: timing.micro,
      ease: easing.easeOut,
    },
  },
};

// ============================================================================
// STAGGER CONFIGURATIONS
// ============================================================================

/**
 * Creates a stagger transition configuration
 * @param delayBetween - Delay between each child animation (in seconds)
 * @param staggerFrom - Direction to stagger from ('first', 'last', 'center')
 * @returns Transition configuration for stagger animations
 */
export const createStagger = (
  delayBetween: number = 0.05,
  staggerFrom: 'first' | 'last' | 'center' = 'first'
): Transition => ({
  staggerChildren: delayBetween,
  delayChildren: 0,
  staggerDirection: staggerFrom === 'last' ? -1 : 1,
});

/**
 * Stagger container variants for parent elements
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: createStagger(0.05),
  },
};

/**
 * Stagger item variants for child elements
 * Only animates transform and opacity for optimal performance
 */
export const staggerItem: Variants = {
  hidden: { 
    opacity: 0,
    y: 20,
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: timing.state,
      ease: easing.easeOut,
    },
  },
};

// ============================================================================
// NAVBAR-SPECIFIC VARIANTS
// ============================================================================

/**
 * Navbar entrance animation
 * Only animates transform and opacity for optimal performance
 */
export const navbarEntrance: Variants = {
  hidden: { 
    y: -100, 
    opacity: 0,
  },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: timing.state, 
      ease: easing.easeOut,
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

/**
 * Navbar link hover animation
 * Only animates transform for optimal performance
 * Note: textShadow is kept for visual effect but is not GPU-accelerated
 */
export const navbarLink: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: { 
      duration: timing.micro,
      ease: easing.sharpOut,
    },
  },
};

/**
 * Mobile menu animation (LTR)
 * Only animates transform and opacity for optimal performance
 */
export const mobileMenuLTR: Variants = {
  closed: { 
    x: '100%', 
    opacity: 0,
  },
  open: {
    x: 0, 
    opacity: 1,
    transition: { 
      duration: timing.state, 
      ease: easing.easeInOut,
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

/**
 * Mobile menu animation (RTL)
 * Only animates transform and opacity for optimal performance
 */
export const mobileMenuRTL: Variants = {
  closed: { 
    x: '-100%', 
    opacity: 0,
  },
  open: {
    x: 0, 
    opacity: 1,
    transition: { 
      duration: timing.state, 
      ease: easing.easeInOut,
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

/**
 * Mobile menu item animation with custom delay
 * Only animates transform and opacity for optimal performance
 */
export const mobileMenuItem = (index: number): Variants => ({
  closed: { 
    x: 50, 
    opacity: 0,
  },
  open: {
    x: 0, 
    opacity: 1,
    transition: {
      delay: index * 0.05,
      duration: timing.state,
      ease: easing.easeOut,
    },
  },
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Creates a conditional variant that respects reduced motion preferences
 * @param normalVariant - Normal animation variant
 * @param reducedVariant - Reduced motion variant (optional, defaults to no animation)
 * @returns Appropriate variant based on user preferences
 */
export const conditionalVariant = <T extends Variants>(
  normalVariant: T,
  reducedVariant?: Partial<T>
): T => {
  if (shouldDisableAnimations()) {
    return (reducedVariant || { hidden: {}, visible: {}, exit: {} }) as T;
  }
  return normalVariant;
};

/**
 * Creates a transition with GPU acceleration hints
 * @param duration - Animation duration in seconds
 * @param ease - Easing function
 * @returns Transition configuration with GPU acceleration
 */
export const gpuTransition = (
  duration: number = timing.state,
  ease: number[] = easing.easeOut
): Transition => ({
  duration,
  ease,
  // GPU acceleration hints
  type: 'tween',
});

/**
 * Adds will-change property for performance optimization
 * Use sparingly and remove after animation completes
 */
export const willChange = {
  transform: { willChange: 'transform' },
  opacity: { willChange: 'opacity' },
  transformOpacity: { willChange: 'transform, opacity' },
  auto: { willChange: 'auto' },
} as const;
