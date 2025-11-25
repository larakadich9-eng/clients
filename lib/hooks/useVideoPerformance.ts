/**
 * Hook for accessing video performance metrics
 * Provides easy access to performance data and quality recommendations
 */

import { useEffect, useState } from 'react';
import { performanceMonitor, PerformanceMetrics } from '@/lib/utils/performance-monitor';

export function useVideoPerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [qualityRecommendation, setQualityRecommendation] = useState<'high' | 'medium' | 'low'>('medium');

  useEffect(() => {
    // Get initial metrics and recommendation
    const initialMetrics = performanceMonitor.getMetrics();
    if (initialMetrics) {
      setMetrics(initialMetrics);
    }

    const recommendation = performanceMonitor.getVideoQualityRecommendation();
    setQualityRecommendation(recommendation);

    // Poll for updated metrics every 2 seconds
    const interval = setInterval(() => {
      const updatedMetrics = performanceMonitor.getMetrics();
      if (updatedMetrics) {
        setMetrics(updatedMetrics);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return {
    metrics,
    qualityRecommendation,
    isLowEndDevice: metrics?.isLowEndDevice ?? false,
    videoLoadTime: metrics?.videoLoadTime ?? 0,
    playbackFPS: metrics?.playbackFPS ?? 0,
  };
}
