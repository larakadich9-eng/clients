'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { fadeIn, conditionalVariant } from '@/lib/utils/motion';

interface AIGradientProps {
  className?: string;
  opacity?: number;
}

export function AIGradient({ className, opacity = 0.2 }: AIGradientProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 -z-10',
        'overflow-hidden',
        className
      )}
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* Simplified static gradient - much better performance */}
      <div className="ai-mesh-gradient absolute inset-0">
        <div className="gradient-orb gradient-orb-1" />
        <div className="gradient-orb gradient-orb-2" />
      </div>

      <style jsx>{`
        .ai-mesh-gradient {
          background: radial-gradient(
              circle at 20% 30%,
              rgba(255, 255, 255, 0.15) 0%,
              transparent 60%
            ),
            radial-gradient(
              circle at 80% 70%,
              rgba(255, 255, 255, 0.1) 0%,
              transparent 60%
            );
          filter: blur(40px);
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          mix-blend-mode: screen;
          will-change: transform;
          transform: translateZ(0);
        }

        .gradient-orb-1 {
          width: 400px;
          height: 400px;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.2) 0%,
            transparent 70%
          );
          top: -10%;
          left: -10%;
          animation: meshMove1 30s ease-in-out infinite;
        }

        .gradient-orb-2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.15) 0%,
            transparent 70%
          );
          bottom: -15%;
          right: -10%;
          animation: meshMove2 35s ease-in-out infinite;
        }

        @keyframes meshMove1 {
          0%,
          100% {
            transform: translate(0, 0) scale(1) translateZ(0);
          }
          50% {
            transform: translate(20px, -20px) scale(1.05) translateZ(0);
          }
        }

        @keyframes meshMove2 {
          0%,
          100% {
            transform: translate(0, 0) scale(1) translateZ(0);
          }
          50% {
            transform: translate(-20px, 20px) scale(1.05) translateZ(0);
          }
        }

        /* Respect user's motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .gradient-orb {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
