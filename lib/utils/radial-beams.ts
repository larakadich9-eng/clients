/**
 * Radial Beam Generation Utilities
 * 
 * This module provides utility functions for generating and managing radial beam configurations
 * for the mandala bloom pattern. It includes functions for:
 * - Generating radial beam configurations with circular distribution
 * - Converting between polar and Cartesian coordinate systems
 * - Calculating responsive radii based on viewport dimensions
 * - Validating beam configurations
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 3.5, 10.3, 10.4, 12.1, 12.2, 12.3, 12.4, 12.5
 */

/**
 * Configuration interface for a single radial beam
 * 
 * Requirements: 1.1, 2.1, 4.3, 4.5, 5.1, 5.2, 5.3
 */
export interface RadialBeamConfig {
  /** Unique identifier for the beam */
  id: string;
  /** Angle in degrees (0-360) from the center point */
  angle: number;
  /** Starting radius at perimeter in pixels */
  startRadius: number;
  /** Ending radius at inner position in pixels */
  endRadius: number;
  /** Beam width in pixels */
  width: number;
  /** Base opacity value (0-1) */
  baseOpacity: number;
  /** Peak opacity at inner radius (0-1) */
  peakOpacity: number;
  /** Blur radius in pixels (18-28) */
  blurRadius: number;
  /** Full cycle duration in seconds (5-8) */
  cycleDuration: number;
  /** Stagger delay offset in seconds */
  staggerDelay: number;
}

/**
 * Point in 2D Cartesian coordinate system
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Point in polar coordinate system
 */
export interface PolarCoordinate {
  /** Angle in degrees (0-360) */
  angle: number;
  /** Distance from center in pixels */
  radius: number;
}

/**
 * Configuration parameters for generating radial beams
 * 
 * Requirements: 12.1, 12.2
 */
export interface GenerateBeamsConfig {
  /** Number of beams to generate (16-36) */
  count: number;
  /** Outer radius (perimeter) in pixels */
  outerRadius: number;
  /** Inner radius in pixels */
  innerRadius: number;
  /** Full cycle duration in seconds (5-8) */
  cycleDuration: number;
  /** Stagger delay between beams in seconds */
  stagger: number;
  /** Current viewport width in pixels */
  viewportWidth: number;
  /** Current viewport height in pixels */
  viewportHeight: number;
}

/**
 * Responsive radii configuration for different viewport sizes
 */
export interface ResponsiveRadii {
  /** Outer radius (perimeter) in pixels */
  outer: number;
  /** Inner radius in pixels */
  inner: number;
}

/**
 * Convert polar coordinates to Cartesian coordinates
 * 
 * @param polar - Polar coordinate (angle in degrees, radius in pixels)
 * @param center - Center point in Cartesian coordinates
 * @returns Cartesian coordinate point
 * 
 * Requirements: 3.5, 12.4
 */
export function polarToCartesian(polar: PolarCoordinate, center: Point): Point {
  // Convert degrees to radians
  const radians = (polar.angle * Math.PI) / 180;
  
  // Calculate Cartesian coordinates
  // x = centerX + radius * cos(angle)
  // y = centerY + radius * sin(angle)
  return {
    x: center.x + polar.radius * Math.cos(radians),
    y: center.y + polar.radius * Math.sin(radians),
  };
}

/**
 * Calculate responsive radii based on viewport dimensions
 * Uses diagonal-based calculation to ensure beams extend beyond viewport edges
 * 
 * - Outer radius: 70% of viewport diagonal (perimeter)
 * - Inner radius: 15% of viewport diagonal (inner boundary)
 * 
 * @param viewportWidth - Current viewport width in pixels
 * @param viewportHeight - Current viewport height in pixels
 * @returns Responsive radii configuration
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 12.3
 */
export function calculateResponsiveRadii(
  viewportWidth: number,
  viewportHeight: number
): ResponsiveRadii {
  // Calculate viewport diagonal using Pythagorean theorem
  const diagonal = Math.sqrt(viewportWidth ** 2 + viewportHeight ** 2);
  
  return {
    outer: diagonal * 0.7,  // 70% of diagonal for perimeter
    inner: diagonal * 0.15, // 15% of diagonal for inner radius
  };
}

/**
 * Validate beam configuration parameters
 * Checks all configuration values against acceptable ranges
 * 
 * @param config - Beam configuration to validate
 * @returns true if configuration is valid, false otherwise
 * 
 * Requirements: 10.3, 10.4
 */
export function validateBeamConfig(config: RadialBeamConfig): boolean {
  const errors: string[] = [];
  
  // Validate angle range (0-360 degrees)
  if (config.angle < 0 || config.angle >= 360) {
    errors.push(
      `Invalid angle: ${config.angle}. Must be between 0 and 360 degrees.`
    );
  }
  
  // Validate radius relationship (startRadius must be greater than endRadius)
  if (config.startRadius <= config.endRadius) {
    errors.push(
      `Invalid radius relationship: startRadius (${config.startRadius}) must be greater than endRadius (${config.endRadius}).`
    );
  }
  
  // Validate blur radius range (18-28px)
  if (config.blurRadius < 18 || config.blurRadius > 28) {
    errors.push(
      `Invalid blur radius: ${config.blurRadius}px. Must be between 18 and 28 pixels.`
    );
  }
  
  // Validate opacity ranges (0-1)
  if (config.baseOpacity < 0 || config.baseOpacity > 1) {
    errors.push(
      `Invalid base opacity: ${config.baseOpacity}. Must be between 0 and 1.`
    );
  }
  
  if (config.peakOpacity < 0 || config.peakOpacity > 1) {
    errors.push(
      `Invalid peak opacity: ${config.peakOpacity}. Must be between 0 and 1.`
    );
  }
  
  // Validate cycle duration (5-8 seconds)
  if (config.cycleDuration < 5 || config.cycleDuration > 8) {
    errors.push(
      `Invalid cycle duration: ${config.cycleDuration}s. Must be between 5 and 8 seconds.`
    );
  }
  
  // Validate width (positive value)
  if (config.width <= 0) {
    errors.push(
      `Invalid width: ${config.width}px. Must be greater than 0.`
    );
  }
  
  // Log warnings if validation fails
  if (errors.length > 0) {
    console.warn(
      `[RadialBeams] Configuration validation failed for beam "${config.id}":`,
      errors
    );
    return false;
  }
  
  return true;
}

/**
 * Generate radial beam configurations with circular distribution
 * 
 * Creates an array of beam configurations evenly distributed around a circle.
 * Each beam has varied visual properties (width, opacity, blur) for organic appearance.
 * Beams are positioned at calculated angles with staggered animation delays.
 * 
 * @param config - Generation configuration parameters
 * @returns Array of radial beam configurations
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 12.1, 12.2, 12.3, 12.4, 12.5
 */
export function generateRadialBeams(config: GenerateBeamsConfig): RadialBeamConfig[] {
  const { count, outerRadius, innerRadius, cycleDuration, stagger } = config;
  
  // Validate input parameters
  if (count < 16 || count > 36) {
    console.warn(
      `[RadialBeams] Beam count ${count} outside recommended range (16-36). ` +
      `Proceeding with provided value.`
    );
  }
  
  if (outerRadius <= innerRadius) {
    console.error(
      `[RadialBeams] Invalid radii: outerRadius (${outerRadius}) must be greater than innerRadius (${innerRadius}).`
    );
    // Return empty array as fallback
    return [];
  }
  
  const beams: RadialBeamConfig[] = [];
  
  // Calculate angle step for even distribution around full circle
  // Requirements: 1.2, 1.5, 12.5
  const angleStep = 360 / count;
  
  // Generate beam configurations
  for (let i = 0; i < count; i++) {
    // Calculate angle for this beam (evenly distributed)
    // Requirement: 1.2, 1.4
    const angle = i * angleStep;
    
    // Calculate stagger delay for this beam
    // Requirement: 11.4, 12.2
    const staggerDelay = i * stagger;
    
    // Generate varied visual properties for organic appearance
    // Width: 80-120px range
    const width = 80 + Math.random() * 40;
    
    // Base opacity: 0.3-0.4 range
    const baseOpacity = 0.3 + Math.random() * 0.1;
    
    // Peak opacity: 0.4-0.55 range (higher than base for breathing effect)
    const peakOpacity = 0.4 + Math.random() * 0.15;
    
    // Blur radius: 18-28px range
    // Requirement: 5.3, 6.2
    const blurRadius = 18 + Math.random() * 10;
    
    // Create beam configuration
    const beamConfig: RadialBeamConfig = {
      id: `radial-beam-${i}`,
      angle,
      startRadius: outerRadius,
      endRadius: innerRadius,
      width,
      baseOpacity,
      peakOpacity,
      blurRadius,
      cycleDuration,
      staggerDelay,
    };
    
    // Validate configuration before adding
    // Requirement: 10.3, 10.4
    if (validateBeamConfig(beamConfig)) {
      beams.push(beamConfig);
    } else {
      // Log warning but continue with other beams
      console.warn(
        `[RadialBeams] Skipping invalid beam configuration at index ${i}`
      );
    }
  }
  
  // Log summary
  console.log(
    `[RadialBeams] Generated ${beams.length} valid beam configurations ` +
    `(${count - beams.length} invalid configurations skipped)`
  );
  
  return beams;
}

/**
 * Get default fallback values for missing configuration parameters
 * Provides safe defaults when configuration is incomplete
 * 
 * @returns Default beam generation configuration
 * 
 * Requirements: 10.4, 10.5
 */
export function getDefaultBeamConfig(): Partial<GenerateBeamsConfig> {
  return {
    count: 24,              // Default to 24 beams (good for desktop)
    cycleDuration: 6,       // Default to 6 second cycle
    stagger: 0.15,          // Default to 0.15s stagger between beams
  };
}

/**
 * Merge user configuration with defaults
 * Ensures all required parameters are present and valid
 * 
 * @param userConfig - Partial configuration from user
 * @param viewportWidth - Current viewport width
 * @param viewportHeight - Current viewport height
 * @returns Complete configuration with defaults applied
 * 
 * Requirements: 10.4, 10.5
 */
export function mergeWithDefaults(
  userConfig: Partial<GenerateBeamsConfig>,
  viewportWidth: number,
  viewportHeight: number
): GenerateBeamsConfig {
  const defaults = getDefaultBeamConfig();
  
  // Validate and sanitize viewport dimensions
  // Requirement: 10.4, 10.5
  const safeViewportWidth = Math.max(320, viewportWidth || 1920); // Min 320px, default 1920px
  const safeViewportHeight = Math.max(568, viewportHeight || 1080); // Min 568px, default 1080px
  
  if (viewportWidth <= 0 || viewportHeight <= 0) {
    console.warn(
      `[RadialBeams] Invalid viewport dimensions (${viewportWidth}x${viewportHeight}). ` +
      `Using safe defaults (${safeViewportWidth}x${safeViewportHeight}).`
    );
  }
  
  // Calculate responsive radii if not provided or if provided values are invalid
  let radii: { outer: number; inner: number };
  
  if (userConfig.outerRadius && userConfig.innerRadius) {
    // Validate user-provided radii
    // Requirement: 10.4
    if (userConfig.outerRadius <= userConfig.innerRadius) {
      console.warn(
        `[RadialBeams] Invalid radii: outerRadius (${userConfig.outerRadius}) must be greater than innerRadius (${userConfig.innerRadius}). ` +
        `Falling back to calculated responsive radii.`
      );
      radii = calculateResponsiveRadii(safeViewportWidth, safeViewportHeight);
    } else if (userConfig.outerRadius <= 0 || userConfig.innerRadius < 0) {
      console.warn(
        `[RadialBeams] Invalid radii values: outerRadius (${userConfig.outerRadius}), innerRadius (${userConfig.innerRadius}). ` +
        `Falling back to calculated responsive radii.`
      );
      radii = calculateResponsiveRadii(safeViewportWidth, safeViewportHeight);
    } else {
      radii = { outer: userConfig.outerRadius, inner: userConfig.innerRadius };
    }
  } else {
    radii = calculateResponsiveRadii(safeViewportWidth, safeViewportHeight);
  }
  
  // Validate and sanitize beam count
  // Requirement: 10.4, 10.5
  let beamCount = userConfig.count ?? defaults.count!;
  if (beamCount < 16 || beamCount > 36) {
    console.warn(
      `[RadialBeams] Beam count ${beamCount} outside valid range (16-36). ` +
      `Clamping to valid range.`
    );
    beamCount = Math.max(16, Math.min(36, beamCount));
  }
  
  // Validate and sanitize cycle duration
  // Requirement: 10.4, 10.5
  let cycleDuration = userConfig.cycleDuration ?? defaults.cycleDuration!;
  if (cycleDuration < 5 || cycleDuration > 8) {
    console.warn(
      `[RadialBeams] Cycle duration ${cycleDuration}s outside valid range (5-8s). ` +
      `Clamping to valid range.`
    );
    cycleDuration = Math.max(5, Math.min(8, cycleDuration));
  }
  
  // Validate and sanitize stagger amount
  // Requirement: 10.4, 10.5
  let stagger = userConfig.stagger ?? defaults.stagger!;
  if (stagger < 0 || stagger > 1) {
    console.warn(
      `[RadialBeams] Stagger amount ${stagger}s outside valid range (0-1s). ` +
      `Clamping to valid range.`
    );
    stagger = Math.max(0, Math.min(1, stagger));
  }
  
  return {
    count: beamCount,
    outerRadius: radii.outer,
    innerRadius: radii.inner,
    cycleDuration: cycleDuration,
    stagger: stagger,
    viewportWidth: safeViewportWidth,
    viewportHeight: safeViewportHeight,
  };
}
