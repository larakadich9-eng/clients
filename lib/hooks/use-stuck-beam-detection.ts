/**
 * Stuck Beam Detection Hook
 * 
 * Tracks beam positions over time and detects beams that haven't moved
 * in more than one cycle duration. Auto-resets stuck beams to perimeter position.
 * 
 * Requirements: 10.1, 10.2, 10.5
 */

import { useEffect, useRef } from 'react';
import type { RadialBeamConfig } from '@/lib/utils/radial-beams';

/**
 * Beam position tracking data
 */
interface BeamPositionData {
  /** Last recorded scale value (represents radial position) */
  lastScale: number;
  /** Timestamp when this position was first recorded */
  timestamp: number;
  /** Number of times this beam has been reset */
  resetCount: number;
}

/**
 * Hook to detect and recover stuck beams
 * 
 * Monitors beam animation state and detects beams that haven't moved
 * in more than one full cycle. When a stuck beam is detected, it triggers
 * a recovery callback to reset the beam to its perimeter position.
 * 
 * @param beamConfigs - Array of radial beam configurations
 * @param enabled - Whether stuck beam detection is enabled
 * @param onBeamStuck - Callback function when a stuck beam is detected
 * 
 * Requirements: 10.1, 10.2, 10.5
 */
export function useStuckBeamDetection(
  beamConfigs: RadialBeamConfig[],
  enabled: boolean = true,
  onBeamStuck?: (beamId: string) => void
) {
  // Track beam positions over time
  const beamPositions = useRef<Map<string, BeamPositionData>>(new Map());

  useEffect(() => {
    if (!enabled || beamConfigs.length === 0) {
      return;
    }

    /**
     * Check for stuck beams
     * A beam is considered stuck if it hasn't moved in more than one cycle duration
     * 
     * Requirements: 10.1, 10.2
     */
    const checkForStuckBeams = () => {
      const currentTime = Date.now();

      beamConfigs.forEach((config) => {
        // Get current beam element to check its animation state
        const beamElement = document.querySelector(
          `[data-beam-id="${config.id}"]`
        ) as HTMLElement;

        if (!beamElement) {
          return;
        }

        // Get computed transform to extract current scale
        const computedStyle = window.getComputedStyle(beamElement);
        const transform = computedStyle.transform;

        // Extract scale from transform matrix
        // transform format: matrix(a, b, c, d, tx, ty) or matrix3d(...)
        let currentScale = 1;
        if (transform && transform !== 'none') {
          const matrixMatch = transform.match(/matrix\(([^)]+)\)/);
          if (matrixMatch) {
            const values = matrixMatch[1].split(',').map(parseFloat);
            // Scale is the first value in the matrix (scaleX)
            currentScale = values[0] || 1;
          }
        }

        // Get previous position data
        const prevData = beamPositions.current.get(config.id);

        if (!prevData) {
          // First time seeing this beam, record its position
          beamPositions.current.set(config.id, {
            lastScale: currentScale,
            timestamp: currentTime,
            resetCount: 0,
          });
          return;
        }

        // Check if beam has moved significantly (more than 1% scale change)
        const scaleChange = Math.abs(currentScale - prevData.lastScale);
        const hasMovedSignificantly = scaleChange > 0.01;

        if (hasMovedSignificantly) {
          // Beam has moved, update position data
          beamPositions.current.set(config.id, {
            lastScale: currentScale,
            timestamp: currentTime,
            resetCount: prevData.resetCount,
          });
        } else {
          // Beam hasn't moved, check if it's been stuck for too long
          const timeSinceLastMove = currentTime - prevData.timestamp;
          const cycleDurationMs = config.cycleDuration * 1000;

          // If beam hasn't moved in more than one cycle, it's stuck
          // Requirement: 10.1, 10.2
          if (timeSinceLastMove > cycleDurationMs) {
            console.warn(
              `[RadialBeams] Beam "${config.id}" appears stuck at scale ${currentScale.toFixed(3)}. ` +
              `No movement detected for ${(timeSinceLastMove / 1000).toFixed(1)}s ` +
              `(cycle duration: ${config.cycleDuration}s). ` +
              `Triggering recovery (reset count: ${prevData.resetCount + 1}).`
            );

            // Trigger recovery callback
            // Requirement: 10.2, 10.5
            if (onBeamStuck) {
              onBeamStuck(config.id);
            }

            // Update position data with incremented reset count
            beamPositions.current.set(config.id, {
              lastScale: currentScale,
              timestamp: currentTime,
              resetCount: prevData.resetCount + 1,
            });

            // Log warning if beam has been reset multiple times
            // Requirement: 10.5
            if (prevData.resetCount >= 2) {
              console.error(
                `[RadialBeams] Beam "${config.id}" has been reset ${prevData.resetCount + 1} times. ` +
                `This may indicate a persistent animation issue.`
              );
            }
          }
        }
      });
    };

    // Check for stuck beams every 2 seconds
    // This is frequent enough to catch issues but not too aggressive
    const intervalId = setInterval(checkForStuckBeams, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, [beamConfigs, enabled, onBeamStuck]);

  /**
   * Manually reset a beam's tracking data
   * Useful when a beam is manually reset to perimeter
   * 
   * @param beamId - ID of the beam to reset
   */
  const resetBeamTracking = (beamId: string) => {
    beamPositions.current.delete(beamId);
  };

  /**
   * Get statistics about stuck beam detection
   * Useful for debugging and monitoring
   * 
   * @returns Object with detection statistics
   */
  const getStats = () => {
    const stats = {
      totalBeams: beamConfigs.length,
      trackedBeams: beamPositions.current.size,
      beamsWithResets: 0,
      totalResets: 0,
    };

    beamPositions.current.forEach((data) => {
      if (data.resetCount > 0) {
        stats.beamsWithResets++;
        stats.totalResets += data.resetCount;
      }
    });

    return stats;
  };

  return {
    resetBeamTracking,
    getStats,
  };
}
