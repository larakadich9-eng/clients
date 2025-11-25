/**
 * Performance Monitoring Utility
 * Tracks video load time, playback performance, and device capabilities
 */

export interface PerformanceMetrics {
  videoLoadTime: number; // milliseconds
  firstFrameTime: number; // milliseconds
  playbackFPS: number;
  deviceMemory?: number; // GB
  effectiveType?: string; // 4g, 3g, 2g, slow-4g
  isLowEndDevice: boolean;
  timestamp: number;
}

export interface VideoPerformanceData {
  videoSrc: string;
  metrics: PerformanceMetrics;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics | null = null;
  private videoStartTime: number = 0;
  private frameCount: number = 0;
  private lastFrameTime: number = 0;
  private fpsInterval: NodeJS.Timeout | null = null;

  /**
   * Initialize performance monitoring for a video element
   */
  initializeVideoMonitoring(videoElement: HTMLVideoElement): void {
    this.videoStartTime = performance.now();
    this.frameCount = 0;
    this.lastFrameTime = performance.now();

    // Track when video starts playing
    videoElement.addEventListener('play', () => {
      this.recordPlaybackStart();
    });

    // Track when first frame is rendered
    videoElement.addEventListener('loadeddata', () => {
      this.recordFirstFrame();
    });

    // Start FPS monitoring
    this.startFPSMonitoring();
  }

  /**
   * Record video playback start time
   */
  private recordPlaybackStart(): void {
    if (!this.metrics) {
      this.metrics = {
        videoLoadTime: performance.now() - this.videoStartTime,
        firstFrameTime: 0,
        playbackFPS: 0,
        isLowEndDevice: this.detectLowEndDevice(),
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Record first frame render time
   */
  private recordFirstFrame(): void {
    if (this.metrics && this.metrics.firstFrameTime === 0) {
      this.metrics.firstFrameTime = performance.now() - this.videoStartTime;
    }
  }

  /**
   * Start monitoring FPS during playback
   */
  private startFPSMonitoring(): void {
    let framesSinceLastCheck = 0;
    let lastCheckTime = performance.now();

    const checkFPS = () => {
      framesSinceLastCheck++;
      const now = performance.now();
      const elapsed = now - lastCheckTime;

      // Calculate FPS every 500ms
      if (elapsed >= 500) {
        const fps = (framesSinceLastCheck / elapsed) * 1000;
        if (this.metrics) {
          this.metrics.playbackFPS = Math.round(fps);
        }
        framesSinceLastCheck = 0;
        lastCheckTime = now;
      }

      this.fpsInterval = requestAnimationFrame(checkFPS) as unknown as NodeJS.Timeout;
    };

    this.fpsInterval = requestAnimationFrame(checkFPS) as unknown as NodeJS.Timeout;
  }

  /**
   * Detect if device is low-end based on available memory and connection
   */
  private detectLowEndDevice(): boolean {
    // Check device memory (if available)
    const deviceMemory = (navigator as any).deviceMemory;
    if (deviceMemory && deviceMemory <= 4) {
      return true;
    }

    // Check connection type
    const connection = (navigator as any).connection;
    if (connection) {
      const effectiveType = connection.effectiveType;
      if (effectiveType === '2g' || effectiveType === '3g' || effectiveType === 'slow-4g') {
        return true;
      }
    }

    // Check if device has reduced motion preference (often indicates older device)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return true;
    }

    return false;
  }

  /**
   * Get collected performance metrics
   */
  getMetrics(): PerformanceMetrics | null {
    if (this.metrics) {
      // Add device info
      const connection = (navigator as any).connection;
      if (connection) {
        this.metrics.deviceMemory = (navigator as any).deviceMemory;
        this.metrics.effectiveType = connection.effectiveType;
      }
    }
    return this.metrics;
  }

  /**
   * Log performance metrics to console
   */
  logMetrics(videoSrc: string): void {
    const metrics = this.getMetrics();
    if (metrics) {
      const data: VideoPerformanceData = { videoSrc, metrics };
      console.log('[VideoPerformance]', data);

      // Log warnings for poor performance
      if (metrics.videoLoadTime > 3000) {
        console.warn('[VideoPerformance] Slow video load time:', metrics.videoLoadTime, 'ms');
      }
      if (metrics.playbackFPS < 24) {
        console.warn('[VideoPerformance] Low FPS detected:', metrics.playbackFPS);
      }
      if (metrics.isLowEndDevice) {
        console.info('[VideoPerformance] Low-end device detected');
      }
    }
  }

  /**
   * Stop monitoring and cleanup
   */
  stopMonitoring(): void {
    if (this.fpsInterval) {
      cancelAnimationFrame(this.fpsInterval as unknown as number);
      this.fpsInterval = null;
    }
  }

  /**
   * Get recommendation for video quality based on device
   */
  getVideoQualityRecommendation(): 'high' | 'medium' | 'low' {
    if (this.metrics?.isLowEndDevice) {
      return 'low';
    }

    const connection = (navigator as any).connection;
    if (connection) {
      const effectiveType = connection.effectiveType;
      if (effectiveType === '4g') {
        return 'high';
      }
      if (effectiveType === '3g') {
        return 'medium';
      }
    }

    return 'medium';
  }
}

export const performanceMonitor = new PerformanceMonitor();
