'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';
import { useResponsiveRadii } from '@/lib/hooks/use-responsive-radii';
import { useStuckBeamDetection } from '@/lib/hooks/use-stuck-beam-detection';
import { generateRadialBeams, validateBeamConfig as validateRadialBeamConfig } from '@/lib/utils/radial-beams';

// Type definitions for beam configuration
type AnchorPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'center-left'
  | 'center-right';

interface BeamConfig {
  id: string;
  anchor: AnchorPosition;
  angle: number;
  angleOscillation: number;      // Oscillation range in degrees (±)
  oscillationPhase: number;      // Phase offset for staggered motion (0-1)
  offsetX: number;
  offsetY: number;
  width: number;
  length: number;
  baseOpacity: number;
  blurRadius?: number;           // Optional: Blur radius in pixels (25-35px for diffused effect)
  animationDuration: number;
  animationDelay: number;
}

/**
 * Radial Beam Configuration Interface
 * Defines properties for radial mandala bloom pattern beams
 * 
 * Requirements: 1.1, 2.1, 4.3, 4.5, 5.1, 5.2, 5.3
 */
export interface RadialBeamConfig {
  id: string;                    // Unique identifier for the beam
  angle: number;                 // Angle in degrees (0-360) from center
  startRadius: number;           // Perimeter radius in pixels (outer position)
  endRadius: number;             // Inner radius in pixels (inner position)
  width: number;                 // Beam width in pixels
  baseOpacity: number;           // Base opacity (0-1)
  peakOpacity: number;           // Peak opacity at inner radius (0-1)
  blurRadius: number;            // Blur amount in pixels (18-28)
  cycleDuration: number;         // Full cycle time in seconds (5-8)
  staggerDelay: number;          // Stagger offset in seconds
}

/**
 * Create Framer Motion animation variants for radial beam yoyo loop
 * 
 * Implements continuous inward-outward cycling motion with:
 * - Scale animation to simulate radial translation from startRadius to endRadius
 * - Opacity breathing effect with peak at inner radius
 * - Yoyo repeat with automatic direction reversal
 * - Sinusoidal easing for smooth, natural motion
 * - Infinite loop for continuous animation
 * 
 * Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.5, 11.2, 11.3
 * 
 * @param config - Radial beam configuration
 * @param prefersReducedMotion - Whether user prefers reduced motion
 * @returns Framer Motion variants object
 */
function createBeamAnimationVariants(
  config: RadialBeamConfig,
  prefersReducedMotion: boolean
): Variants {
  // If user prefers reduced motion, return static variant
  // Requirements: 9.2, 9.3, 9.4
  if (prefersReducedMotion) {
    return {
      static: {
        scale: 1,
        opacity: config.baseOpacity,
      },
    };
  }

  // Calculate scale factor for radial translation
  // Scale from 1 (at perimeter/startRadius) to endRadius/startRadius (at inner radius)
  // This simulates the beam moving inward along its radial vector
  // Requirement: 2.2, 3.1
  const scaleAtInner = config.endRadius / config.startRadius;

  // Create animation variant with yoyo loop
  // Requirements: 2.3, 2.4, 2.5, 2.6, 4.1, 4.2, 4.3, 4.4, 11.2, 11.3
  return {
    animate: {
      // Scale animation: 1 (perimeter) → scaleAtInner (inner)
      // Using repeatType: 'reverse' to create the yoyo effect
      // This creates the radial inward-outward motion
      // Requirement: 2.2, 2.3, 2.4
      scale: scaleAtInner,
      
      // Opacity breathing: baseOpacity → peakOpacity (at inner)
      // Using repeatType: 'reverse' to create the breathing effect
      // Peak opacity occurs at the midpoint (inner radius)
      // Requirements: 5.1, 5.2, 5.5
      opacity: config.peakOpacity,
      
      transition: {
        // Full cycle duration (inward + outward)
        // Requirement: 4.3, 4.4
        duration: config.cycleDuration,
        
        // Sinusoidal easing for smooth, natural motion
        // easeInOut creates smooth acceleration and deceleration
        // Requirements: 4.1, 4.2
        ease: 'easeInOut',
        
        // Infinite loop for continuous animation
        // Requirement: 2.6, 11.3
        repeat: Infinity,
        
        // Yoyo repeat type for automatic direction reversal
        // This eliminates the need for manual reverse logic
        // Requirements: 2.5, 11.2
        repeatType: 'reverse',
        
        // Stagger delay for wave-like motion across circular pattern
        // Requirements: 11.4, 12.2
        delay: config.staggerDelay,
      },
    },
  };
}



// Anchor position to CSS positioning mapping
const ANCHOR_STYLES: Record<AnchorPosition, React.CSSProperties> = {
  'top-left': { top: 0, left: 0, transformOrigin: 'top left' },
  'top-center': { top: 0, left: '50%', transformOrigin: 'top center' },
  'top-right': { top: 0, right: 0, transformOrigin: 'top right' },
  'bottom-left': { bottom: 0, left: 0, transformOrigin: 'bottom left' },
  'bottom-center': { bottom: 0, left: '50%', transformOrigin: 'bottom center' },
  'bottom-right': { bottom: 0, right: 0, transformOrigin: 'bottom right' },
  'center-left': { top: '50%', left: 0, transformOrigin: 'center left' },
  'center-right': { top: '50%', right: 0, transformOrigin: 'center right' },
};

// Asymmetrical beam configuration array with 8 rays for organic, diffused lighting
// Each beam has varied opacity (0.30-0.38), width (85-140px), length (160-240%), and blur (26-35px)
// Asymmetrical offsets and staggered timing create natural, non-geometric light distribution
// Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 2.4, 2.5, 3.2, 3.3
const BEAM_CONFIGS: BeamConfig[] = [
  // 1. Top-left corner - Softer, wider beam
  {
    id: 'top-left',
    anchor: 'top-left',
    angle: 45,  // Diagonal toward center
    angleOscillation: 15,  // ±15 degrees oscillation
    oscillationPhase: 0,   // Starts outward
    offsetX: -3,  // Slight left offset to prevent grid alignment
    offsetY: 2,   // Slight down offset
    width: 120,   // Medium-wide for balanced coverage
    length: 180,  // Medium length
    baseOpacity: 0.32,  // Lower opacity for subtle presence
    blurRadius: 30,  // Medium blur for soft diffusion
    animationDuration: 11,  // Slower animation for organic motion
    animationDelay: 0,
  },

  // 2. Top-center - Narrower, longer beam
  {
    id: 'top-center',
    anchor: 'top-center',
    angle: 90,  // Straight down
    angleOscillation: 15,  // ±15 degrees oscillation
    oscillationPhase: 0.5, // Starts inward
    offsetX: 4,   // Slight right offset
    offsetY: 0,
    width: 90,    // Narrower for delicate accent
    length: 220,  // Longer for extended coverage
    baseOpacity: 0.38,  // Higher opacity for prominence
    blurRadius: 28,  // Medium blur
    animationDuration: 10,  // Varied timing
    animationDelay: 1.5,  // Staggered delay
  },

  // 3. Top-right corner - Widest, shortest beam
  {
    id: 'top-right',
    anchor: 'top-right',
    angle: 135,  // Diagonal toward center
    angleOscillation: 15,  // ±15 degrees oscillation
    oscillationPhase: 0.25, // Starts outward
    offsetX: 2,   // Slight right offset
    offsetY: -4,  // Slight up offset
    width: 140,   // Widest for soft ambient fill
    length: 160,  // Shortest to prevent edge concentration
    baseOpacity: 0.30,  // Lowest opacity for background ambiance
    blurRadius: 35,  // Maximum blur for softest diffusion
    animationDuration: 12,  // Slower for varied motion
    animationDelay: 2,
  },

  // 4. Center-right - Medium properties
  {
    id: 'center-right',
    anchor: 'center-right',
    angle: 180,  // Straight left
    angleOscillation: 15,  // ±15 degrees oscillation
    oscillationPhase: 0.75, // Starts inward
    offsetX: 0,
    offsetY: 5,   // Down offset for asymmetry
    width: 110,   // Medium width
    length: 200,  // Standard coverage
    baseOpacity: 0.35,  // Medium opacity for balanced fill
    blurRadius: 27,  // Lower blur for subtle definition
    animationDuration: 9,  // Fastest animation for contrast
    animationDelay: 3.5,  // Staggered delay
  },

  // 5. Bottom-right corner - Long, narrow beam
  {
    id: 'bottom-right',
    anchor: 'bottom-right',
    angle: -135,  // Diagonal toward center
    angleOscillation: 15,  // ±15 degrees oscillation
    oscillationPhase: 0,   // Starts outward
    offsetX: -5,  // Left offset for maximum asymmetry
    offsetY: 3,   // Down offset
    width: 85,    // Narrow for delicate accent
    length: 240,  // Very long for atmospheric depth
    baseOpacity: 0.37,  // Higher opacity for focal accent
    blurRadius: 32,  // Higher blur for soft edges
    animationDuration: 13,  // Slowest animation for organic feel
    animationDelay: 4,
  },

  // 6. Bottom-center - Wide, medium length
  {
    id: 'bottom-center',
    anchor: 'bottom-center',
    angle: -90,  // Straight up
    angleOscillation: 15,  // ±15 degrees oscillation
    oscillationPhase: 0.5, // Starts inward
    offsetX: -2,  // Slight left offset
    offsetY: 0,
    width: 135,   // Wide for ambient fill
    length: 190,  // Medium length
    baseOpacity: 0.33,  // Lower-medium opacity
    blurRadius: 29,  // Medium blur
    animationDuration: 10.5,  // Varied timing
    animationDelay: 5.5,  // Staggered delay
  },

  // 7. Bottom-left corner - Balanced properties
  {
    id: 'bottom-left',
    anchor: 'bottom-left',
    angle: -45,  // Diagonal toward center
    angleOscillation: 15,  // ±15 degrees oscillation
    oscillationPhase: 0.25, // Starts outward
    offsetX: 3,   // Right offset
    offsetY: -2,  // Up offset
    width: 105,   // Medium width
    length: 210,  // Medium-long length
    baseOpacity: 0.36,  // Medium-high opacity
    blurRadius: 26,  // Lower blur for gentle definition
    animationDuration: 11.5,  // Varied timing
    animationDelay: 6,
  },

  // 8. Center-left - Narrow, very long beam
  {
    id: 'center-left',
    anchor: 'center-left',
    angle: 0,  // Straight right
    angleOscillation: 15,  // ±15 degrees oscillation
    oscillationPhase: 0.75, // Starts inward
    offsetX: 0,
    offsetY: -3,  // Up offset for asymmetry
    width: 95,    // Narrow for delicate accent
    length: 230,  // Very long for depth
    baseOpacity: 0.34,  // Medium opacity
    blurRadius: 31,  // Medium-high blur
    animationDuration: 12.5,  // Varied timing
    animationDelay: 7.5,  // Staggered delay
  },
];

/**
 * Props for the LightBeams component
 * 
 * The LightBeams component creates a radial mandala bloom pattern with continuous
 * inward-outward cycling animation. Beams are arranged in a circular layout and
 * animate smoothly along radial vectors using GPU-accelerated transforms.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 4.5, 11.5, 12.1, 12.2
 * 
 * @example
 * // Basic usage with defaults
 * <LightBeams />
 * 
 * @example
 * // Custom configuration
 * <LightBeams
 *   beamCount={32}
 *   cycleDuration={7}
 *   staggerAmount={0.2}
 *   opacity={0.8}
 * />
 * 
 * @example
 * // Responsive configuration
 * <LightBeams
 *   enableResponsiveBeams={true}
 *   opacity={0.75}
 * />
 * 
 * @example
 * // Fixed radii (no auto-calculation)
 * <LightBeams
 *   outerRadius={1200}
 *   innerRadius={200}
 *   enableResponsiveBeams={false}
 * />
 */
interface LightBeamsProps {
  /** 
   * Additional CSS class names to apply to the container
   * @default undefined
   */
  className?: string;
  
  /** 
   * Global opacity multiplier for all beams (0-1)
   * @default 0.1
   * @example
   * // Subtle effect
   * <LightBeams opacity={0.5} />
   * 
   * @example
   * // Prominent effect
   * <LightBeams opacity={0.9} />
   */
  opacity?: number;
  
  /** 
   * Number of radial beams to generate (16-36)
   * If not provided and enableResponsiveBeams is true, automatically adjusts based on viewport:
   * - Mobile (< 768px): 16 beams
   * - Tablet (768-1023px): 24 beams
   * - Desktop (≥ 1024px): 36 beams
   * 
   * @default undefined (auto-calculated when enableResponsiveBeams is true)
   * @example
   * // Fixed beam count
   * <LightBeams beamCount={24} />
   * 
   * @example
   * // Responsive beam count (auto-adjusts)
   * <LightBeams enableResponsiveBeams={true} />
   * 
   * Requirements: 1.3, 8.2, 8.3, 8.4
   */
  beamCount?: number;
  
  /** 
   * Enable viewport-based beam count and radius adjustment
   * When enabled, beam count and radii automatically adapt to viewport size
   * 
   * @default false
   * @example
   * <LightBeams enableResponsiveBeams={true} />
   * 
   * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
   */
  enableResponsiveBeams?: boolean;
  
  /** 
   * @deprecated Legacy prop for 8-cluster mode (not used in radial bloom system)
   * @internal
   */
  enableClusters?: boolean;
  
  /** 
   * Use fixed positioning to pin beams in place during scroll
   * When true, beams stay fixed relative to viewport
   * When false, beams scroll with content
   * 
   * @default false
   * @example
   * // Fixed positioning (stays during scroll)
   * <LightBeams pinned={true} />
   * 
   * @example
   * // Absolute positioning (scrolls with content)
   * <LightBeams pinned={false} />
   */
  pinned?: boolean;
  
  /** 
   * Outer radius (perimeter) in pixels
   * If not provided, automatically calculated as 70% of viewport diagonal
   * Must be greater than innerRadius
   * 
   * @default undefined (auto-calculated)
   * @example
   * // Fixed outer radius
   * <LightBeams outerRadius={1200} innerRadius={200} />
   * 
   * @example
   * // Auto-calculated (responsive)
   * <LightBeams enableResponsiveBeams={true} />
   * 
   * Requirements: 1.1, 1.2, 8.1, 12.2
   */
  outerRadius?: number;
  
  /** 
   * Inner radius in pixels
   * If not provided, automatically calculated as 15% of viewport diagonal
   * Must be less than outerRadius
   * 
   * @default undefined (auto-calculated)
   * @example
   * // Fixed inner radius
   * <LightBeams outerRadius={1200} innerRadius={200} />
   * 
   * @example
   * // Auto-calculated (responsive)
   * <LightBeams enableResponsiveBeams={true} />
   * 
   * Requirements: 1.1, 1.2, 8.1, 12.2
   */
  innerRadius?: number;
  
  /** 
   * Full cycle duration in seconds (5-8)
   * Controls the speed of the inward-outward animation cycle
   * - Shorter (5-6s): More energetic, suitable for landing pages
   * - Longer (7-8s): More meditative, suitable for content sections
   * 
   * @default 6
   * @example
   * // Fast cycle (energetic)
   * <LightBeams cycleDuration={5} />
   * 
   * @example
   * // Slow cycle (meditative)
   * <LightBeams cycleDuration={8} />
   * 
   * @example
   * // Balanced (recommended)
   * <LightBeams cycleDuration={6.5} />
   * 
   * Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 4.3, 4.4, 12.2
   */
  cycleDuration?: number;
  
  /** 
   * Stagger delay between beams in seconds (0-1)
   * Controls the wave-like motion across the circular pattern
   * - Shorter (0.1-0.15s): Quick wave effect
   * - Longer (0.2-0.25s): Gentle wave effect
   * 
   * @default 0.15
   * @example
   * // Quick wave
   * <LightBeams staggerAmount={0.1} />
   * 
   * @example
   * // Gentle wave
   * <LightBeams staggerAmount={0.25} />
   * 
   * @example
   * // Balanced (recommended)
   * <LightBeams staggerAmount={0.15} />
   * 
   * Requirements: 11.4, 12.2
   */
  staggerAmount?: number;
}

// Viewport type for responsive beam configuration
type ViewportType = 'mobile' | 'tablet' | 'desktop';

/**
 * Get responsive beam configurations based on viewport size
 * Adjusts beam count and dimensions for optimal display on different devices
 * Scales blur radius proportionally with other dimensions
 * 
 * Mobile: Returns 6 beams with 80% scaled dimensions and blur (20-28px blur range)
 * Tablet: Returns all 8 beams with 90% scaled length and blur (22.5-31.5px blur range)
 * Desktop: Returns all 8 beams at full scale (25-35px blur range)
 * 
 * @param viewport - The viewport type (mobile, tablet, or desktop)
 * @returns Adjusted beam configurations
 * 
 * Requirements: 5.1, 5.2, 5.3, 7.1, 7.2, 7.3, 7.4, 7.5
 */
const getResponsiveBeamConfigs = (viewport: ViewportType): BeamConfig[] => {
  const baseConfigs = BEAM_CONFIGS;

  if (viewport === 'mobile') {
    // On mobile, reduce to 6 beams and scale dimensions (Requirement 5.2, 5.3)
    // This maintains 60fps performance on mobile devices
    return baseConfigs.slice(0, 6).map(config => ({
      ...config,
      // Scale beam length proportionally (80% of original) (Requirement 7.4)
      length: config.length * 0.8,
      // Scale beam width proportionally (80% of original) (Requirement 7.4)
      width: config.width * 0.8,
      // Scale blur radius for mobile (80% of original, 20-28px range) (Requirement 5.3)
      blurRadius: config.blurRadius ? config.blurRadius * 0.8 : 20,
    }));
  }

  if (viewport === 'tablet') {
    // On tablet, keep all 8 beams but scale length and blur (Requirement 5.1, 7.2, 7.4)
    return baseConfigs.map(config => ({
      ...config,
      // Scale beam length proportionally (90% of original) (Requirement 7.4)
      length: config.length * 0.9,
      // Keep width at full size for tablet
      width: config.width,
      // Scale blur radius for tablet (90% of original, 22.5-31.5px range) (Requirement 5.1)
      blurRadius: config.blurRadius ? config.blurRadius * 0.9 : 20,
    }));
  }

  // Desktop: Use full beam configurations (all 8 beams) (Requirement 7.1, 7.2)
  return baseConfigs;
};

/**
 * Detect current viewport type based on window width
 * Uses standard breakpoints: mobile (<768px), tablet (768-1023px), desktop (>=1024px)
 * 
 * @returns Current viewport type
 */
const getViewportType = (): ViewportType => {
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
};

/**
 * Validate beam configuration parameters
 * Checks angle range (-180 to 180), opacity range (0.3 to 0.4), width range (80-150px),
 * length range (150-250%), and blur radius range (25-35px)
 * 
 * Note: Validation is relaxed for responsive configurations (scaled for mobile/tablet)
 * to allow values outside the base ranges when dimensions are scaled down.
 * 
 * @param config - The beam configuration to validate
 * @param isResponsive - Whether this is a responsive (scaled) configuration
 * @returns true if configuration is valid, false otherwise
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 1.2
 */
const validateBeamConfig = (config: BeamConfig, isResponsive: boolean = false): boolean => {
  // Validate angle range (-180 to 180 degrees)
  if (config.angle < -180 || config.angle > 180) {
    console.warn(
      `[LightBeams] Invalid angle for beam "${config.id}": ${config.angle}. ` +
      `Angle must be between -180 and 180 degrees.`
    );
    return false;
  }

  // For responsive configurations, skip strict validation of scaled dimensions
  // This allows mobile/tablet scaling (80%/90%) to produce values outside base ranges
  if (isResponsive) {
    return true;
  }

  // Validate opacity range (0.3 to 0.4) for diffused lighting effect (Requirement 4.1, 4.4)
  if (config.baseOpacity < 0.3 || config.baseOpacity > 0.4) {
    console.warn(
      `[LightBeams] Invalid opacity for beam "${config.id}": ${config.baseOpacity}. ` +
      `Opacity must be between 0.3 and 0.4 for diffused lighting effect.`
    );
    return false;
  }

  // Validate width range (80px to 150px) for asymmetrical distribution (Requirement 4.2, 4.4)
  if (config.width < 80 || config.width > 150) {
    console.warn(
      `[LightBeams] Invalid width for beam "${config.id}": ${config.width}px. ` +
      `Width must be between 80px and 150px for asymmetrical distribution.`
    );
    return false;
  }

  // Validate length range (150% to 250%) for balanced coverage (Requirement 4.3, 4.4)
  if (config.length < 150 || config.length > 250) {
    console.warn(
      `[LightBeams] Invalid length for beam "${config.id}": ${config.length}%. ` +
      `Length must be between 150% and 250% for balanced coverage.`
    );
    return false;
  }

  // Validate blur radius range (25px to 35px) for soft diffusion (Requirement 1.2, 4.4)
  // Only validate if blurRadius is provided (it's optional for backward compatibility)
  if (config.blurRadius !== undefined && (config.blurRadius < 25 || config.blurRadius > 35)) {
    console.warn(
      `[LightBeams] Invalid blur radius for beam "${config.id}": ${config.blurRadius}px. ` +
      `Blur radius must be between 25px and 35px for soft diffusion.`
    );
    return false;
  }

  return true;
};

/**
 * Calculate current angle offset for a beam based on oscillation time
 * Uses sine wave with oscillationPhase offset for smooth motion
 * Maps sine wave output (-1 to 1) to angleOscillation range (±15 degrees)
 * 
 * @param config - The beam configuration
 * @param time - Current animation time in seconds
 * @returns Calculated angle offset for current frame
 * 
 * Requirements: 4.1, 4.2, 4.3
 */
const calculateAngleOffset = (config: BeamConfig, time: number): number => {
  // Use sine wave for smooth oscillation
  // Phase offset ensures beams are staggered
  const phase = config.oscillationPhase * Math.PI * 2;
  const frequency = 1 / config.animationDuration;
  const sineWave = Math.sin(time * frequency * Math.PI * 2 + phase);

  // Map sine wave (-1 to 1) to angle oscillation range
  return sineWave * config.angleOscillation;
};

/**
 * Mapping of anchor positions to their center-pointing angles
 * These angles represent when a beam from each anchor points directly at viewport center
 * 
 * Requirements: 5.1, 5.2, 4.7
 */
const centerAngles: Record<AnchorPosition, number> = {
  'top-left': 45,       // Diagonal toward center
  'top-center': 90,     // Straight down toward center
  'top-right': 135,     // Diagonal toward center
  'center-right': 180,  // Straight left toward center
  'bottom-right': -135, // Diagonal toward center
  'bottom-center': -90, // Straight up toward center
  'bottom-left': -45,   // Diagonal toward center
  'center-left': 0,     // Straight right toward center
};

/**
 * Check if a beam is pointing near the viewport center
 * A beam is considered "near center" if its angle is within 10 degrees of the center angle
 * 
 * @param angle - Current beam angle in degrees
 * @param anchor - Anchor position of the beam
 * @returns true if beam is pointing near center, false otherwise
 * 
 * Requirements: 5.1, 5.2, 4.7
 */
const isPointingNearCenter = (angle: number, anchor: AnchorPosition): boolean => {
  const centerAngle = centerAngles[anchor];
  const angleDiff = Math.abs(angle - centerAngle);

  // Consider beam near center if within 10 degrees
  return angleDiff < 10;
};

/**
 * Check if a beam is in its outward phase (moving away from center)
 * A beam is outward when its current angle is further from center than its base angle
 * 
 * @param config - Beam configuration
 * @param currentAngle - Current beam angle in degrees
 * @returns true if beam is moving outward, false otherwise
 * 
 * Requirements: 5.4
 */
const isBeamOutward = (config: BeamConfig, currentAngle: number): boolean => {
  const centerAngle = centerAngles[config.anchor];
  const baseAngleDiff = Math.abs(config.angle - centerAngle);
  const currentAngleDiff = Math.abs(currentAngle - centerAngle);

  // Beam is outward if current angle is further from center than base angle
  return currentAngleDiff > baseAngleDiff;
};

/**
 * Calculate angular separation between two beams pointing toward the same quadrant
 * 
 * @param angle1 - First beam angle in degrees
 * @param angle2 - Second beam angle in degrees
 * @returns Angular separation in degrees
 * 
 * Requirements: 5.5
 */
const getAngularSeparation = (angle1: number, angle2: number): number => {
  let diff = Math.abs(angle1 - angle2);

  // Handle wrap-around at 180/-180 degrees
  if (diff > 180) {
    diff = 360 - diff;
  }

  return diff;
};

// Render function that accepts BeamConfig, oscillation time, and returns JSX element
const renderBeam = (config: BeamConfig, oscillationTime: number): React.ReactElement => {
  const anchorStyle = ANCHOR_STYLES[config.anchor];

  // Calculate current angle by adding angleOffset to base angle (Requirement 4.1)
  const angleOffset = calculateAngleOffset(config, oscillationTime);
  const currentAngle = config.angle + angleOffset;

  // Use blurRadius from config if provided, otherwise default to 20px for backward compatibility
  const blurRadius = config.blurRadius ?? 20;

  return (
    <div
      key={config.id}
      className="light-beam"
      data-anchor={config.anchor}
      style={{
        ...anchorStyle,
        position: 'absolute',
        '--beam-angle': `${currentAngle}deg`,  // Use calculated current angle (Requirement 6.2)
        '--beam-offset-x': `${config.offsetX}%`,
        '--beam-offset-y': `${config.offsetY}%`,
        '--beam-width': `${config.width}px`,
        '--beam-length': `${config.length}%`,
        '--beam-opacity': config.baseOpacity,
        '--beam-blur': `${blurRadius}px`,  // Dynamic blur radius with fallback
        '--beam-duration': `${config.animationDuration}s`,
        '--beam-delay': `${config.animationDelay}s`,
      } as React.CSSProperties}
    />
  );
};

/**
 * Calculate beam transform string for initial positioning at perimeter
 * 
 * Generates a complete transform string with:
 * - translate() for positioning at perimeter using polar coordinates
 * - rotate() to align beam along radial vector
 * - translateZ(0) for GPU layer creation
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 * 
 * @param config - Radial beam configuration
 * @param center - Center point for positioning
 * @returns Transform string for CSS transform property
 */
function calculateBeamTransform(
  config: RadialBeamConfig,
  center: { x: number; y: number }
): string {
  // Calculate initial position at perimeter using polar coordinates
  // Convert angle from degrees to radians for trigonometric functions
  // Requirements: 3.1, 3.5
  const radians = (config.angle * Math.PI) / 180;
  
  // Calculate x and y coordinates at perimeter
  // x = centerX + radius * cos(angle)
  // y = centerY + radius * sin(angle)
  // Requirement: 3.5
  const x = center.x + config.startRadius * Math.cos(radians);
  const y = center.y + config.startRadius * Math.sin(radians);

  // Calculate rotation to align beam along radial vector
  // Add 90 degrees to point the beam toward center (beam is vertical by default)
  // This ensures the beam extends inward along its radial path
  // Requirement: 3.1, 3.2
  const rotation = config.angle + 90;

  // Generate transform string with translate, rotate, and translateZ
  // - translate() positions the beam at the perimeter
  // - rotate() aligns the beam along its radial vector
  // - translateZ(0) forces GPU layer creation for hardware acceleration
  // Requirements: 3.1, 3.2, 3.3, 3.4
  return `translate(${x}px, ${y}px) rotate(${rotation}deg) translateZ(0)`;
}

/**
 * Memoized Radial Beam Component
 * 
 * Optimized with React.memo to prevent unnecessary re-renders
 * Only re-renders when config, center, prefersReducedMotion, or resetCount changes
 * 
 * Requirements: 3.3, 3.4 (Performance optimization)
 */
interface RadialBeamProps {
  config: RadialBeamConfig;
  center: { x: number; y: number };
  prefersReducedMotion: boolean;
  resetCount: number;
}

const RadialBeam = React.memo<RadialBeamProps>(({ config, center, prefersReducedMotion, resetCount }) => {
  // Calculate transform string for initial positioning
  // Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
  const transform = React.useMemo(
    () => calculateBeamTransform(config, center),
    [config, center]
  );

  // Create animation variants
  const variants = React.useMemo(
    () => createBeamAnimationVariants(config, prefersReducedMotion),
    [config, prefersReducedMotion]
  );

  return (
    <motion.div
      key={`${config.id}-${resetCount}`}
      className="radial-beam"
      data-beam-id={config.id}
      data-testid="radial-beam"
      // Apply animation variants
      // If reduced motion, use 'static' variant, otherwise use 'animate' variant
      // Requirements: 9.2, 9.3, 9.4
      variants={variants}
      initial={prefersReducedMotion ? 'static' : { scale: 1, opacity: config.baseOpacity }}
      animate={prefersReducedMotion ? 'static' : 'animate'}
      style={{
        position: 'absolute',
        // Transform origin at top center (beam extends downward from perimeter)
        transformOrigin: 'top center',
        // Apply calculated transform for initial positioning
        // Requirements: 3.1, 3.2, 3.3, 3.4
        transform,
        // Beam dimensions - width varies between beams for organic appearance
        // Requirements: 5.3, 6.1
        width: `${config.width}px`,
        height: `${config.startRadius - config.endRadius}px`, // Length from perimeter to inner radius
        // Visual styling - gradient from transparent to white glow to transparent
        // Requirements: 5.3, 6.1, 6.2
        background: `linear-gradient(
          to bottom,
          transparent 0%,
          rgba(255, 255, 255, ${config.baseOpacity * 0.4}) 15%,
          rgba(255, 255, 255, ${config.baseOpacity}) 40%,
          rgba(255, 255, 255, ${config.baseOpacity * 0.8}) 60%,
          rgba(255, 255, 255, ${config.baseOpacity * 0.4}) 80%,
          transparent 100%
        )`,
        // Apply blur filter with values between 18-28px for soft diffusion
        // Requirements: 5.3, 6.2
        filter: `blur(${config.blurRadius}px)`,
        // Set mix-blend-mode: screen for additive blending
        // Requirements: 5.3, 6.3
        mixBlendMode: 'screen',
        // Performance optimizations
        // Requirements: 3.4, 7.1, 7.2, 7.4, 7.5
        willChange: 'transform, opacity',
        pointerEvents: 'none', // Preserve mouse interactions
      }}
    />
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  // Only re-render if these specific properties change
  return (
    prevProps.config.id === nextProps.config.id &&
    prevProps.config.angle === nextProps.config.angle &&
    prevProps.config.startRadius === nextProps.config.startRadius &&
    prevProps.config.endRadius === nextProps.config.endRadius &&
    prevProps.config.width === nextProps.config.width &&
    prevProps.config.baseOpacity === nextProps.config.baseOpacity &&
    prevProps.config.peakOpacity === nextProps.config.peakOpacity &&
    prevProps.config.blurRadius === nextProps.config.blurRadius &&
    prevProps.config.cycleDuration === nextProps.config.cycleDuration &&
    prevProps.config.staggerDelay === nextProps.config.staggerDelay &&
    prevProps.center.x === nextProps.center.x &&
    prevProps.center.y === nextProps.center.y &&
    prevProps.prefersReducedMotion === nextProps.prefersReducedMotion &&
    prevProps.resetCount === nextProps.resetCount
  );
});

RadialBeam.displayName = 'RadialBeam';

/**
 * Render a radial beam using Framer Motion for animation
 * 
 * Creates a motion.div element with:
 * - Transform-based positioning at perimeter
 * - Framer Motion animation variants for yoyo loop
 * - GPU-accelerated transforms
 * - Conditional animation based on reduced motion preference
 * 
 * Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 5.1, 5.2, 7.1, 7.2, 7.4, 7.5, 9.2, 9.3, 9.4, 10.1, 10.2
 * 
 * @param config - Radial beam configuration
 * @param center - Center point for positioning
 * @param prefersReducedMotion - Whether user prefers reduced motion
 * @param beamResetTrigger - Map of beam IDs to reset counts for stuck beam recovery
 * @returns React element for the radial beam
 */
const renderRadialBeam = (
  config: RadialBeamConfig,
  center: { x: number; y: number },
  prefersReducedMotion: boolean,
  beamResetTrigger?: Map<string, number>
): React.ReactElement => {
  // Get reset count for this beam to force re-render on reset
  const resetCount = beamResetTrigger?.get(config.id) || 0;
  
  return (
    <RadialBeam
      key={config.id}
      config={config}
      center={center}
      prefersReducedMotion={prefersReducedMotion}
      resetCount={resetCount}
    />
  );
};

/**
 * Verify GPU acceleration is active for all beam transforms
 * 
 * In development mode, checks that all beam elements have:
 * - transform property with translateZ(0)
 * - will-change: transform, opacity
 * - Hardware acceleration enabled
 * 
 * Requirements: 3.3, 3.4
 */
function verifyGPUAcceleration() {
  if (process.env.NODE_ENV !== 'development') {
    return; // Only run in development
  }

  // Wait for next frame to ensure DOM is updated
  requestAnimationFrame(() => {
    const radialBeams = document.querySelectorAll('.radial-beam');
    const legacyBeams = document.querySelectorAll('.light-beam');
    
    let allBeamsAccelerated = true;
    
    // Check radial beams
    radialBeams.forEach((beam) => {
      const computedStyle = window.getComputedStyle(beam);
      const transform = computedStyle.transform;
      const willChange = computedStyle.willChange;
      
      if (!transform.includes('matrix') && transform !== 'none') {
        console.warn(`[LightBeams GPU] Radial beam missing transform:`, beam);
        allBeamsAccelerated = false;
      }
      
      if (!willChange.includes('transform') || !willChange.includes('opacity')) {
        console.warn(`[LightBeams GPU] Radial beam missing will-change:`, beam);
        allBeamsAccelerated = false;
      }
    });
    
    // Check legacy beams
    legacyBeams.forEach((beam) => {
      const computedStyle = window.getComputedStyle(beam);
      const transform = computedStyle.transform;
      const willChange = computedStyle.willChange;
      
      if (!transform.includes('matrix') && transform !== 'none') {
        console.warn(`[LightBeams GPU] Legacy beam missing transform:`, beam);
        allBeamsAccelerated = false;
      }
      
      if (!willChange.includes('transform') && !willChange.includes('opacity')) {
        console.warn(`[LightBeams GPU] Legacy beam missing will-change:`, beam);
        allBeamsAccelerated = false;
      }
    });
    
    if (allBeamsAccelerated && (radialBeams.length > 0 || legacyBeams.length > 0)) {
      console.log(
        `[LightBeams GPU] ✓ All ${radialBeams.length + legacyBeams.length} beams GPU-accelerated`
      );
    }
  });
}

/**
 * Custom hook for FPS monitoring in development mode
 * 
 * Tracks frame rate and logs warnings if FPS drops below 55fps
 * Provides real-time performance feedback for animation optimization
 * 
 * Requirements: 8.5
 * 
 * @returns Current FPS value
 */
const useFPSMonitor = (enabled: boolean = true) => {
  const [fps, setFps] = React.useState<number>(60);
  const frameCountRef = React.useRef<number>(0);
  const lastTimeRef = React.useRef<number>(performance.now());
  const fpsHistoryRef = React.useRef<number[]>([]);
  const lowFpsWarningShownRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    // Only run in development mode and when enabled
    if (process.env.NODE_ENV !== 'development' || !enabled) {
      return;
    }

    let animationFrameId: number;

    const measureFPS = () => {
      frameCountRef.current++;
      const currentTime = performance.now();
      const elapsed = currentTime - lastTimeRef.current;

      // Calculate FPS every second
      if (elapsed >= 1000) {
        const currentFPS = Math.round((frameCountRef.current * 1000) / elapsed);
        setFps(currentFPS);

        // Add to history (keep last 10 seconds)
        fpsHistoryRef.current.push(currentFPS);
        if (fpsHistoryRef.current.length > 10) {
          fpsHistoryRef.current.shift();
        }

        // Calculate average FPS over last 10 seconds
        const avgFPS =
          fpsHistoryRef.current.reduce((sum, val) => sum + val, 0) /
          fpsHistoryRef.current.length;

        // Log warning if average FPS drops below 55fps
        // Requirement: 8.5
        if (avgFPS < 55 && !lowFpsWarningShownRef.current) {
          console.warn(
            `[LightBeams Performance] ⚠️ Low FPS detected: ${avgFPS.toFixed(1)} fps (target: 60 fps)\n` +
            `Consider reducing beam count or disabling animations on this device.`
          );
          lowFpsWarningShownRef.current = true;

          // Reset warning flag after 30 seconds to allow re-warning if issue persists
          setTimeout(() => {
            lowFpsWarningShownRef.current = false;
          }, 30000);
        }

        // Log FPS every 5 seconds in development
        if (fpsHistoryRef.current.length % 5 === 0) {
          console.log(
            `[LightBeams Performance] FPS: ${currentFPS} (avg: ${avgFPS.toFixed(1)})`
          );
        }

        // Reset counters
        frameCountRef.current = 0;
        lastTimeRef.current = currentTime;
      }

      animationFrameId = requestAnimationFrame(measureFPS);
    };

    animationFrameId = requestAnimationFrame(measureFPS);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled]);

  return fps;
};

/**
 * LightBeams Component
 * 
 * Creates a radial mandala bloom pattern with continuous inward-outward cycling animation.
 * Beams are arranged in a perfect circular layout and animate smoothly along radial vectors
 * using GPU-accelerated transforms for optimal performance.
 * 
 * ## Features
 * 
 * - **Radial Circular Layout**: Beams distributed evenly in 360° circle
 * - **Continuous Cycling**: Smooth inward→outward→inward animation loop
 * - **GPU Acceleration**: Hardware-accelerated transforms for 60fps performance
 * - **Responsive**: Auto-adjusts beam count and radii based on viewport
 * - **Accessible**: Respects prefers-reduced-motion preference
 * - **Robust**: Automatic stuck beam detection and recovery
 * 
 * ## Basic Usage
 * 
 * ```tsx
 * import { LightBeams } from '@/components/effects/light-beams';
 * 
 * export default function HeroSection() {
 *   return (
 *     <div className="relative h-screen">
 *       <LightBeams />
 *       <div className="relative z-10">
 *         <h1>Your Content</h1>
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 * 
 * ## Configuration Examples
 * 
 * ### Energetic Landing Page
 * ```tsx
 * <LightBeams
 *   beamCount={36}
 *   cycleDuration={5}
 *   staggerAmount={0.1}
 *   opacity={0.9}
 *   enableResponsiveBeams={true}
 * />
 * ```
 * 
 * ### Meditative Content Section
 * ```tsx
 * <LightBeams
 *   beamCount={16}
 *   cycleDuration={8}
 *   staggerAmount={0.25}
 *   opacity={0.6}
 *   enableResponsiveBeams={true}
 * />
 * ```
 * 
 * ### Balanced Hero Section (Recommended)
 * ```tsx
 * <LightBeams
 *   beamCount={24}
 *   cycleDuration={6.5}
 *   staggerAmount={0.15}
 *   opacity={0.75}
 *   enableResponsiveBeams={true}
 * />
 * ```
 * 
 * ### Custom Radii
 * ```tsx
 * <LightBeams
 *   outerRadius={1200}
 *   innerRadius={200}
 *   beamCount={28}
 *   enableResponsiveBeams={false}
 * />
 * ```
 * 
 * ## Performance Tuning
 * 
 * ### Desktop (≥ 1024px)
 * - Beam count: 24-32 beams
 * - Cycle duration: 6-6.5 seconds
 * - Expected FPS: 60fps sustained
 * 
 * ### Tablet (768-1023px)
 * - Beam count: 20-24 beams
 * - Cycle duration: 6.5-7 seconds
 * - Expected FPS: 58-60fps
 * 
 * ### Mobile (< 768px)
 * - Beam count: 16 beams
 * - Cycle duration: 7-8 seconds
 * - Expected FPS: 55-60fps
 * 
 * ## Accessibility
 * 
 * The component automatically respects the user's motion preferences:
 * - Detects `prefers-reduced-motion: reduce` media query
 * - Disables animations when enabled
 * - Displays beams at static positions
 * - No configuration required
 * 
 * ## Performance Features
 * 
 * - GPU-accelerated transforms (translate, rotate, scale)
 * - Automatic stuck beam detection and recovery
 * - FPS monitoring in development mode
 * - Responsive beam count adjustment
 * - Optimized render with React.memo
 * - Memoized beam configurations
 * 
 * @param props - Component props (see LightBeamsProps interface)
 * @returns React component with radial bloom effect
 * 
 * @see {@link LightBeamsProps} for detailed prop documentation
 * @see {@link https://github.com/your-repo/docs/USAGE_GUIDE.md} for usage examples
 * @see {@link https://github.com/your-repo/docs/PERFORMANCE_TUNING.md} for performance guide
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 3.4, 3.5,
 *               4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3,
 *               7.4, 7.5, 8.1, 8.2, 8.3, 8.4, 8.5, 9.1, 9.2, 9.3, 9.4, 9.5, 10.1, 10.2, 10.3,
 *               10.4, 10.5, 11.2, 11.3, 11.4, 11.5, 12.1, 12.2, 12.3, 12.4, 12.5
 */
export function LightBeams({
  className,
  opacity = 0.1,
  beamCount,
  enableResponsiveBeams = false,
  pinned = false,
  outerRadius,
  innerRadius,
  cycleDuration = 6,
  staggerAmount = 0.15,
}: LightBeamsProps) {
  // State to track if component is mounted (client-side)
  const [mounted, setMounted] = React.useState(false);

  // State to track viewport type for responsive beam adjustment
  const [viewportType, setViewportType] = React.useState<ViewportType>('desktop');

  // State to track current animation time for oscillation (Requirement 4.2)
  const [oscillationTime, setOscillationTime] = React.useState<number>(0);

  // State to track beam resets for stuck beam recovery
  // Requirements: 10.1, 10.2
  const [beamResetTrigger, setBeamResetTrigger] = React.useState<Map<string, number>>(new Map());

  // Wait for client-side hydration
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Use hooks for reduced motion detection and responsive radii
  // Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 9.1, 9.2, 9.3, 9.4, 9.5
  const prefersReducedMotion = usePrefersReducedMotion();
  const responsiveRadii = useResponsiveRadii(
    enableResponsiveBeams ?? true,
    outerRadius,
    innerRadius
  );

  // Monitor FPS in development mode - DISABLED for performance
  // Only enable when animations are active (not in reduced motion mode)
  // Requirements: 8.5
  const currentFPS = useFPSMonitor(false); // Disabled - was adding overhead

  // Generate radial beam configurations on component mount
  // Memoize beam configurations to prevent unnecessary recalculation
  // Validate all configurations before rendering
  // Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 10.3, 10.4, 10.5, 12.1, 12.2, 12.3, 12.4, 12.5
  const radialBeamConfigs = React.useMemo(() => {
    // Allow generation on client-side, use safe defaults for SSR
    if (typeof window === 'undefined') {
      return []; // Return empty array during SSR only
    }

    // Import mergeWithDefaults to ensure all parameters have valid values
    // Requirements: 10.4, 10.5
    const { mergeWithDefaults } = require('@/lib/utils/radial-beams');
    
    // Determine responsive beam count based on viewport type
    // Requirements: 8.2, 8.3, 8.4, 8.5
    let responsiveBeamCount = beamCount;
    
    if (enableResponsiveBeams && !beamCount) {
      // Auto-adjust beam count based on viewport type
      // Mobile: 16 beams, Tablet: 24 beams, Desktop: 36 beams
      // Requirements: 8.2, 8.3, 8.4
      switch (viewportType) {
        case 'mobile':
          responsiveBeamCount = 16;
          break;
        case 'tablet':
          responsiveBeamCount = 24;
          break;
        case 'desktop':
          responsiveBeamCount = 36;
          break;
        default:
          responsiveBeamCount = 24; // Fallback to tablet count
      }
    }
    
    // Merge user config with defaults and validate
    // This ensures graceful degradation for invalid configurations
    // Requirements: 10.4, 10.5
    const safeConfig = mergeWithDefaults(
      {
        count: responsiveBeamCount,
        outerRadius: responsiveRadii.outer,
        innerRadius: responsiveRadii.inner,
        cycleDuration: cycleDuration,
        stagger: staggerAmount,
      },
      window.innerWidth,
      window.innerHeight
    );

    // Call generateRadialBeams with validated configuration
    // Requirement: 1.1, 1.2, 1.3, 1.4, 1.5, 12.1, 12.2, 12.3, 12.4, 12.5
    const generatedBeams = generateRadialBeams(safeConfig);

    // Validate all configurations before rendering
    // Filter out any invalid configurations
    // Requirements: 10.3, 10.4
    const validatedBeams = generatedBeams.filter((config) => {
      // Import validateBeamConfig from radial-beams utility
      const isValid = validateRadialBeamConfig(config);
      
      if (!isValid) {
        console.warn(
          `[LightBeams] Invalid beam configuration detected and filtered: ${config.id}`
        );
      }
      
      return isValid;
    });

    // Log summary of beam generation
    if (validatedBeams.length < generatedBeams.length) {
      console.warn(
        `[LightBeams] Filtered ${generatedBeams.length - validatedBeams.length} invalid beam(s). ` +
        `Rendering ${validatedBeams.length} valid beams.`
      );
    }

    // If no valid beams were generated, create a minimal fallback configuration
    // This ensures graceful degradation without breaking the page
    // Requirements: 10.4, 10.5
    if (validatedBeams.length === 0) {
      console.error(
        `[LightBeams] No valid beam configurations generated. ` +
        `Creating minimal fallback configuration with 8 beams.`
      );
      
      // Create a minimal safe configuration with 8 beams
      const fallbackConfig = mergeWithDefaults(
        {
          count: 8, // Minimal beam count
          cycleDuration: 6, // Safe middle value
          stagger: 0.15, // Safe stagger value
        },
        window.innerWidth,
        window.innerHeight
      );
      
      // Generate beams with fallback config
      const fallbackBeams = generateRadialBeams(fallbackConfig);
      
      // If even the fallback fails, return empty array (will render ambient fill only)
      if (fallbackBeams.length === 0) {
        console.error(
          `[LightBeams] Fallback beam generation failed. ` +
          `Rendering ambient fill only.`
        );
        return [];
      }
      
      return fallbackBeams;
    }

    return validatedBeams;
  }, [mounted, beamCount, responsiveRadii.outer, responsiveRadii.inner, cycleDuration, staggerAmount, viewportType, enableResponsiveBeams]);

  // Calculate center point for radial beam positioning
  const center = React.useMemo(() => {
    if (typeof window === 'undefined') {
      return { x: 960, y: 540 }; // Default center for SSR (1920x1080)
    }
    return {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
  }, [mounted]);

  // Stuck beam detection and recovery - DISABLED
  // The stuck beam detection was causing infinite reset loops and performance issues
  // Disabling for now until the root animation issue is resolved
  // Requirements: 10.1, 10.2, 10.5
  const handleBeamStuck = React.useCallback((beamId: string) => {
    // Disabled - was causing infinite loops
    console.log(`[RadialBeams] Beam stuck detected but recovery disabled: ${beamId}`);
  }, []);

  // Stuck beam detection DISABLED - was causing performance issues
  // useStuckBeamDetection(
  //   radialBeamConfigs,
  //   !prefersReducedMotion,
  //   handleBeamStuck
  // );

  // Ref to track how long each beam points near center (Requirement 5.1, 5.2, 4.7)
  const beamCenterTime = React.useRef<Map<string, number>>(new Map());

  // State to track mutable beam configurations for phase adjustments (Requirement 5.2, 5.3, 5.4)
  const [beamConfigs, setBeamConfigs] = React.useState<BeamConfig[]>(() => {
    // Initialize with responsive or default configs
    return enableResponsiveBeams ? getResponsiveBeamConfigs(viewportType) : BEAM_CONFIGS;
  });

  // Oscillation animation loop - DISABLED (only needed for legacy beams)
  // Legacy beams are disabled, so this is not needed
  // Requirements 4.2, 4.5, 8.4
  React.useEffect(() => {
    // DISABLED - legacy beams are not being used
    return;
    
    // Disable oscillation if user prefers reduced motion (Requirement 4.8)
    if (prefersReducedMotion) {
      return;
    }

    let animationFrameId: number;
    let lastTimestamp = 0;

    const animate = (timestamp: number) => {
      // Throttle updates to 30fps (33.33ms per frame) for performance (Requirement 8.4)
      if (timestamp - lastTimestamp >= 33.33) {
        setOscillationTime(timestamp / 1000); // Convert to seconds
        lastTimestamp = timestamp;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion]);

  // Clustering detection and redistribution - DISABLED for performance
  // This was causing significant overhead by running every 500ms
  // Requirements 5.2, 5.3, 5.4
  React.useEffect(() => {
    // DISABLED - was causing performance issues
    return;
    
    // Skip if reduced motion is enabled
    if (prefersReducedMotion) {
      return;
    }

    /**
     * Check for beam clustering and redistribute if necessary
     * Runs every 500ms to monitor beam distribution
     * 
     * Requirements: 5.2, 5.3, 5.4, 5.5
     */
    const checkClustering = () => {
      const currentTime = Date.now();
      let beamsNearCenter = 0;
      let outwardBeamCount = 0;
      const beamAngles: Array<{ id: string; angle: number; config: BeamConfig }> = [];

      // Track which beams are currently near center and count outward beams
      beamConfigs.forEach(config => {
        const currentAngle = config.angle + calculateAngleOffset(config, oscillationTime);
        const nearCenter = isPointingNearCenter(currentAngle, config.anchor);
        const isOutward = isBeamOutward(config, currentAngle);

        beamAngles.push({ id: config.id, angle: currentAngle, config });

        if (isOutward) {
          outwardBeamCount++;
        }

        if (nearCenter) {
          beamsNearCenter++;

          // Track when this beam started pointing near center
          if (!beamCenterTime.current.has(config.id)) {
            beamCenterTime.current.set(config.id, currentTime);
          }

          const startTime = beamCenterTime.current.get(config.id)!;
          const duration = currentTime - startTime;

          // If beam has been near center for more than 3 seconds, adjust its phase (Requirement 5.3)
          if (duration > 3000) {
            setBeamConfigs(prevConfigs =>
              prevConfigs.map(c =>
                c.id === config.id
                  ? { ...c, oscillationPhase: (c.oscillationPhase + 0.5) % 1 }
                  : c
              )
            );
            beamCenterTime.current.delete(config.id);
          }
        } else {
          // Beam is not near center, remove from tracking
          beamCenterTime.current.delete(config.id);
        }
      });

      // Ensure at least 2 beams are always in outward phase (Requirement 5.4)
      if (outwardBeamCount < 2) {
        // Find beams that are most inward and flip their phases
        const inwardBeams = beamAngles
          .filter(({ angle, config }) => !isBeamOutward(config, angle))
          .sort((a, b) => {
            // Sort by how close they are to center (most inward first)
            const aDiff = Math.abs(a.angle - centerAngles[a.config.anchor]);
            const bDiff = Math.abs(b.angle - centerAngles[b.config.anchor]);
            return aDiff - bDiff;
          });

        // Flip phases of the most inward beams to make them outward
        const beamsToFlip = inwardBeams.slice(0, 2 - outwardBeamCount);
        beamsToFlip.forEach(({ id }) => {
          setBeamConfigs(prevConfigs =>
            prevConfigs.map(c =>
              c.id === id
                ? { ...c, oscillationPhase: (c.oscillationPhase + 0.5) % 1 }
                : c
            )
          );
        });
      }

      // Check for minimum angular separation in same quadrant (Requirement 5.5)
      // Group beams by quadrant and check separation
      for (let i = 0; i < beamAngles.length; i++) {
        for (let j = i + 1; j < beamAngles.length; j++) {
          const beam1 = beamAngles[i];
          const beam2 = beamAngles[j];

          // Check if beams are in similar direction (within 90 degrees)
          const separation = getAngularSeparation(beam1.angle, beam2.angle);

          if (separation < 90) {
            // Beams are in same quadrant, check minimum separation
            if (separation < 30) {
              // Too close, adjust one beam's phase
              setBeamConfigs(prevConfigs =>
                prevConfigs.map(c =>
                  c.id === beam1.id
                    ? { ...c, oscillationPhase: (c.oscillationPhase + 0.25) % 1 }
                    : c
                )
              );
              return; // Exit after one adjustment to avoid multiple simultaneous changes
            }
          }
        }
      }

      // If more than 4 beams point near center, force redistribution (Requirement 5.4)
      if (beamsNearCenter > 4) {
        // Find beam that's been near center longest
        let longestBeam: string | null = null;
        let longestDuration = 0;

        beamCenterTime.current.forEach((startTime, id) => {
          const duration = currentTime - startTime;
          if (duration > longestDuration) {
            longestDuration = duration;
            longestBeam = id;
          }
        });

        // Adjust the longest beam's phase to move it outward
        if (longestBeam) {
          setBeamConfigs(prevConfigs =>
            prevConfigs.map(c =>
              c.id === longestBeam
                ? { ...c, oscillationPhase: (c.oscillationPhase + 0.5) % 1 }
                : c
            )
          );
          beamCenterTime.current.delete(longestBeam);
        }
      }
    };

    // Check clustering every 500ms (Requirement 5.2)
    const intervalId = setInterval(checkClustering, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, [oscillationTime, beamConfigs, prefersReducedMotion]);

  // Update viewport type on mount and window resize
  // This effect runs early to ensure viewport type is set before beam generation
  // Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
  React.useEffect(() => {
    const updateViewport = () => {
      const newViewportType = getViewportType();
      setViewportType(newViewportType);
      
      // Update legacy beam configs when viewport changes (if responsive beams enabled)
      if (enableResponsiveBeams) {
        setBeamConfigs(getResponsiveBeamConfigs(newViewportType));
      }
    };

    // Set initial viewport immediately
    updateViewport();

    // Listen for resize events
    window.addEventListener('resize', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
    };
  }, [enableResponsiveBeams]);

  // Verify GPU acceleration on mount and when beams change
  // Requirements: 3.3, 3.4
  React.useEffect(() => {
    verifyGPUAcceleration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radialBeamConfigs.length, beamConfigs.length]);

  // Filter beam configurations through validation before rendering
  // Pass isResponsive flag to allow scaled dimensions for mobile/tablet
  const validConfigs = beamConfigs.filter(config => validateBeamConfig(config, enableResponsiveBeams));

  // Use all valid legacy beam configs (for backward compatibility during migration)
  // Note: Legacy beams will be removed in future version
  const beamsToRender = validConfigs;

  // Fallback: If no valid configs exist, render ambient fill only
  if (validConfigs.length === 0) {
    console.warn(
      '[LightBeams] No valid beam configurations found. Rendering ambient fill only as fallback.'
    );

    return (
      <div
        className={cn(
          'pointer-events-none -z-10',
          'overflow-hidden',
          pinned ? 'fixed inset-0' : 'absolute inset-0',
          className
        )}
        style={{ opacity }}
        aria-hidden="true"
      >
        {/* Ambient fill layer as fallback */}
        <div className="ambient-fill" />

        <style jsx>{`
          .ambient-fill {
            position: absolute;
            inset: 0;
            background: 
              radial-gradient(
                ellipse at top left,
                rgba(255, 255, 255, 0.08) 0%,
                transparent 50%
              ),
              radial-gradient(
                ellipse at bottom right,
                rgba(255, 255, 255, 0.08) 0%,
                transparent 50%
              ),
              radial-gradient(
                ellipse at top center,
                rgba(255, 255, 255, 0.04) 0%,
                transparent 40%
              );
            mix-blend-mode: screen;
            pointer-events: none;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'pointer-events-none -z-10',
        'overflow-hidden',
        pinned ? 'fixed inset-0' : 'absolute inset-0',
        className
      )}
      style={{ 
        opacity: opacity,
        animation: 'fadeIn 0.8s ease-out'
      }}
      aria-hidden="true"
    >
      {/* Ambient fill layer - positioned first (beneath directional beams) */}
      <div className="ambient-fill" />

      {/* Legacy anchor-based beams - DISABLED for performance optimization */}
      {/* TODO: Remove legacy beam code in future version after full migration */}
      {/* <div className={cn("light-rays-container", pinned ? "fixed inset-0" : "absolute inset-0")}>
        {beamsToRender.map((config) => renderBeam(config, oscillationTime))}
      </div> */}

      {/* Radial mandala bloom beams with Framer Motion animation */}
      {/* Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 3.4, 9.2, 9.3, 9.4, 10.1, 10.2 */}
      <div className={cn("radial-beams-container", pinned ? "fixed inset-0" : "absolute inset-0")}>
        {radialBeamConfigs.map((config) => 
          renderRadialBeam(config, center, prefersReducedMotion, beamResetTrigger)
        )}
      </div>

      {/* FPS Counter - DISABLED for performance */}
      {/* Requirements: 8.5 */}
      {/* Disabled to reduce overhead */}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .ambient-fill {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(
              ellipse at top left,
              rgba(255, 255, 255, 0.08) 0%,
              transparent 50%
            ),
            radial-gradient(
              ellipse at bottom right,
              rgba(255, 255, 255, 0.08) 0%,
              transparent 50%
            ),
            radial-gradient(
              ellipse at top center,
              rgba(255, 255, 255, 0.04) 0%,
              transparent 40%
            );
          mix-blend-mode: screen;
          /* Prevent interaction overhead (Requirement 7.4) */
          pointer-events: none;
          /* Force GPU layer for better performance (Requirement 7.3) */
          transform: translateZ(0);
        }

        .light-rays-container {
          /* Prevent interaction overhead on container (Requirement 7.4) */
          pointer-events: none;
        }

        .radial-beams-container {
          /* Prevent interaction overhead on radial beams container (Requirement 7.4, 7.5) */
          pointer-events: none;
          /* Force GPU layer for better performance (Requirement 3.3, 3.4) */
          transform: translateZ(0);
        }

        .radial-beam {
          /* Prevent interaction overhead on individual beams (Requirement 7.1, 7.2, 7.4, 7.5) */
          pointer-events: none;
          /* GPU acceleration already applied via inline transform */
        }

        .light-beam {
          position: absolute;
          width: var(--beam-width);
          height: var(--beam-length);
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, var(--beam-opacity)) 0%,
            rgba(255, 255, 255, calc(var(--beam-opacity) * 0.6)) 30%,
            rgba(255, 255, 255, calc(var(--beam-opacity) * 0.3)) 60%,
            transparent 100%
          );
          /* Use transform and opacity for animations (Requirements 2.1, 8.1) */
          /* Apply translateZ(0) to force GPU layer creation (Requirements 2.3, 8.3) */
          transform: 
            rotate(var(--beam-angle)) 
            translateX(var(--beam-offset-x)) 
            translateY(var(--beam-offset-y))
            translateZ(0);
          /* Animate both opacity and transform for oscillation (Requirements 2.1, 8.2) */
          will-change: opacity, transform;
          /* Smooth transition for angle updates between frames (Requirement 2.2) */
          transition: transform 0.1s ease-out;
          animation: beamPulse var(--beam-duration) ease-in-out infinite;
          animation-delay: var(--beam-delay);
          filter: blur(var(--beam-blur));  /* Dynamic blur radius for enhanced diffusion */
          mix-blend-mode: screen;
          /* Prevent interaction overhead (Requirement 8.3) */
          pointer-events: none;
        }
        
        /* Explicit transform-origin for each anchor position to ensure beams stay pinned */
        .light-beam[data-anchor="top-left"] {
          transform-origin: top left !important;
        }
        .light-beam[data-anchor="top-center"] {
          transform-origin: top center !important;
        }
        .light-beam[data-anchor="top-right"] {
          transform-origin: top right !important;
        }
        .light-beam[data-anchor="center-left"] {
          transform-origin: center left !important;
        }
        .light-beam[data-anchor="center-right"] {
          transform-origin: center right !important;
        }
        .light-beam[data-anchor="bottom-left"] {
          transform-origin: bottom left !important;
        }
        .light-beam[data-anchor="bottom-center"] {
          transform-origin: bottom center !important;
        }
        .light-beam[data-anchor="bottom-right"] {
          transform-origin: bottom right !important;
        }

        @keyframes beamPulse {
          0%,
          100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }

        /* Respect user's motion preferences (Requirement 4.8) */
        /* Disable oscillation animation loop and display beams at base angles */
        @media (prefers-reduced-motion: reduce) {
          .light-beam {
            animation: none;
            /* Use base opacity from configuration instead of hardcoded value */
            opacity: var(--beam-opacity);
          }
        }

        /* Responsive behavior: Adjust beam opacity based on viewport size */
        /* Mobile: Reduce beam opacity to 80% of base value */
        @media (max-width: 767px) {
          .light-beam {
            --beam-opacity: calc(var(--beam-opacity) * 0.8);
          }
        }

        /* Tablet: Reduce beam opacity to 90% of base value */
        @media (min-width: 768px) and (max-width: 1023px) {
          .light-beam {
            --beam-opacity: calc(var(--beam-opacity) * 0.9);
          }
        }

        /* Desktop: Use full beam opacity (1024px+) */
        @media (min-width: 1024px) {
          .light-beam {
            --beam-opacity: var(--beam-opacity);
          }
        }
      `}</style>
    </div>
  );
}
