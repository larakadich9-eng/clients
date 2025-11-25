/**
 * Performance Testing Utilities
 * Provides tools for testing video performance on simulated low-end devices
 */

export interface DeviceSimulation {
  name: string;
  deviceMemory: number;
  effectiveType: '2g' | '3g' | '4g' | 'slow-4g';
  cpuCores: number;
  description: string;
}

export const DEVICE_SIMULATIONS: Record<string, DeviceSimulation> = {
  highEnd: {
    name: 'High-End Device',
    deviceMemory: 8,
    effectiveType: '4g',
    cpuCores: 8,
    description: 'Modern flagship device with 4G connection',
  },
  midRange: {
    name: 'Mid-Range Device',
    deviceMemory: 4,
    effectiveType: '4g',
    cpuCores: 4,
    description: 'Standard device with 4G connection',
  },
  lowEnd: {
    name: 'Low-End Device',
    deviceMemory: 2,
    effectiveType: '3g',
    cpuCores: 2,
    description: 'Budget device with 3G connection',
  },
  slowNetwork: {
    name: 'Slow Network',
    deviceMemory: 4,
    effectiveType: 'slow-4g',
    cpuCores: 4,
    description: 'Standard device with slow 4G connection',
  },
};

/**
 * Simulate network throttling by adding delay to video loading
 */
export function simulateNetworkThrottle(
  videoElement: HTMLVideoElement,
  effectiveType: '2g' | '3g' | '4g' | 'slow-4g'
): void {
  const delays: Record<string, number> = {
    '2g': 5000, // 5 second delay
    '3g': 2000, // 2 second delay
    'slow-4g': 1000, // 1 second delay
    '4g': 0, // no delay
  };

  const delay = delays[effectiveType];
  if (delay > 0) {
    const originalSrc = videoElement.querySelector('source')?.src;
    if (originalSrc) {
      // Clear source
      videoElement.innerHTML = '';

      // Add source after delay
      setTimeout(() => {
        const source = document.createElement('source');
        source.src = originalSrc;
        source.type = 'video/mp4';
        videoElement.appendChild(source);
        videoElement.load();
      }, delay);
    }
  }
}

/**
 * Measure video file size and estimate bandwidth requirements
 */
export async function measureVideoFileSize(videoSrc: string): Promise<number> {
  try {
    const response = await fetch(videoSrc, { method: 'HEAD' });
    const contentLength = response.headers.get('content-length');
    return contentLength ? parseInt(contentLength, 10) : 0;
  } catch (error) {
    console.error('Failed to measure video file size:', error);
    return 0;
  }
}

/**
 * Calculate estimated load time based on file size and connection speed
 */
export function estimateLoadTime(
  fileSizeBytes: number,
  effectiveType: '2g' | '3g' | '4g' | 'slow-4g'
): number {
  // Bandwidth in Mbps for each connection type
  const bandwidthMbps: Record<string, number> = {
    '2g': 0.4,
    '3g': 1.6,
    'slow-4g': 4,
    '4g': 10,
  };

  const bandwidth = bandwidthMbps[effectiveType];
  const fileSizeMb = fileSizeBytes / (1024 * 1024);
  const loadTimeSeconds = (fileSizeMb * 8) / bandwidth;

  return Math.round(loadTimeSeconds * 1000); // Convert to milliseconds
}

/**
 * Get video quality recommendation based on device and network
 */
export function getQualityRecommendation(
  deviceMemory: number,
  effectiveType: '2g' | '3g' | '4g' | 'slow-4g'
): 'high' | 'medium' | 'low' {
  // Low-end device or slow network
  if (deviceMemory <= 2 || effectiveType === '2g' || effectiveType === '3g') {
    return 'low';
  }

  // Mid-range device or slow 4G
  if (deviceMemory <= 4 || effectiveType === 'slow-4g') {
    return 'medium';
  }

  // High-end device with good network
  return 'high';
}

/**
 * Log performance test results
 */
export function logPerformanceTestResults(
  deviceName: string,
  videoSrc: string,
  fileSizeBytes: number,
  estimatedLoadTimeMs: number,
  qualityRecommendation: string
): void {
  console.log(`
    ╔════════════════════════════════════════════════════════════╗
    ║           VIDEO PERFORMANCE TEST RESULTS                   ║
    ╠════════════════════════════════════════════════════════════╣
    ║ Device:                    ${deviceName.padEnd(40)}║
    ║ Video:                     ${videoSrc.substring(0, 40).padEnd(40)}║
    ║ File Size:                 ${(fileSizeBytes / 1024 / 1024).toFixed(2)} MB${' '.repeat(32)}║
    ║ Estimated Load Time:       ${estimatedLoadTimeMs} ms${' '.repeat(32)}║
    ║ Quality Recommendation:    ${qualityRecommendation.padEnd(40)}║
    ╚════════════════════════════════════════════════════════════╝
  `);
}
