'use client';

import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';
import { reportWebVitals, rateMetric, WEB_VITALS_THRESHOLDS } from '@/lib/utils/performance';

/**
 * Web Vitals reporting component
 * Tracks and reports Core Web Vitals metrics
 */
export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    // Map Next.js metric to our format
    const metricName = metric.name as keyof typeof WEB_VITALS_THRESHOLDS;
    
    // Only rate metrics we have thresholds for
    const rating = Object.keys(WEB_VITALS_THRESHOLDS).includes(metricName)
      ? rateMetric(metricName, metric.value)
      : 'good';

    reportWebVitals({
      name: metric.name,
      value: metric.value,
      rating,
      delta: metric.delta,
      id: metric.id,
    });
  });

  return null;
}
