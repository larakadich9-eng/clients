import { useState, useEffect, useCallback } from 'react';

/**
 * Hook that provides dynamic card dimensions and positioning calculations
 * based on viewport width for fluid responsive layouts
 */
export function useDynamicDimensions() {
  const [dimensions, setDimensions] = useState(() => {
    if (typeof window === 'undefined') {
      return {
        cardWidth: 280,
        spacing: 24,
      };
    }
    
    return {
      cardWidth: Math.max(240, Math.min(420, window.innerWidth * 0.28)),
      spacing: Math.max(16, Math.min(48, window.innerWidth * 0.025)),
    };
  });

  /**
   * Calculate card width using fluid formula
   * Min: 240px, Max: 420px, Preferred: 28vw
   */
  const getCardWidth = useCallback(() => {
    if (typeof window === 'undefined') return 280;
    return Math.max(240, Math.min(420, window.innerWidth * 0.28));
  }, []);

  /**
   * Calculate spacing between cards using fluid formula
   * Min: 16px, Max: 48px, Preferred: 2.5vw
   */
  const getSpacing = useCallback(() => {
    if (typeof window === 'undefined') return 24;
    return Math.max(16, Math.min(48, window.innerWidth * 0.025));
  }, []);

  /**
   * Calculate card offset for positioning in carousel
   * Includes centering offset to align center card with viewport center
   * @param position - Position index relative to center card (0 = center, -1 = left, 1 = right)
   * @returns Offset in pixels from left: 50% position
   * 
   * For center card (position 0): returns -cardWidth/2 to center the card
   * For other cards: returns position * (cardWidth + spacing) - cardWidth/2
   */
  const getCardOffset = useCallback((position: number) => {
    const cardWidth = getCardWidth();
    const spacing = getSpacing();
    // Include centering offset: shift left by half card width to center
    return (position * (cardWidth + spacing)) - (cardWidth / 2);
  }, [getCardWidth, getSpacing]);

  /**
   * Calculate z-axis depth for 3D positioning
   * @param position - Position index relative to center card
   * Range: -200px to -100px based on viewport width
   */
  const getZDepth = useCallback((position: number) => {
    if (position === 0) return 0;
    if (typeof window === 'undefined') return -200;
    // Calculate depth: more negative for cards further from center
    // Clamp between -200 (far) and -100 (near)
    const depth = position * window.innerWidth * -0.15;
    return Math.max(-200, Math.min(-100, depth));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateDimensions = () => {
      setDimensions({
        cardWidth: getCardWidth(),
        spacing: getSpacing(),
      });
    };

    // Update on resize
    window.addEventListener('resize', updateDimensions, { passive: true });

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [getCardWidth, getSpacing]);

  return {
    cardWidth: dimensions.cardWidth,
    spacing: dimensions.spacing,
    getCardWidth,
    getSpacing,
    getCardOffset,
    getZDepth,
  };
}
