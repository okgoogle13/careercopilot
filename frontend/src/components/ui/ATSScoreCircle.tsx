/**
 * ELECTRIC ALCHEMIST: ATS SCORE CIRCLE COMPONENT
 *
 * Animated circular progress indicator for ATS scores with design system tokens.
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ATSScoreCircleProps {
  score: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  className?: string;
}

interface SizeConfig {
  diameter: number;
  strokeWidth: number;
  fontSize: string;
  labelSize: string;
}

const sizeConfigs: Record<'small' | 'medium' | 'large', SizeConfig> = {
  small: {
    diameter: 80,
    strokeWidth: 6,
    fontSize: 'text-lg',
    labelSize: 'text-xs',
  },
  medium: {
    diameter: 120,
    strokeWidth: 8,
    fontSize: 'text-2xl',
    labelSize: 'text-sm',
  },
  large: {
    diameter: 192,
    strokeWidth: 12,
    fontSize: 'text-5xl',
    labelSize: 'text-base',
  },
};

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-primary';
  if (score >= 60) return 'text-secondary';
  return 'text-error';
}

function getScoreColorValue(score: number): string {
  if (score >= 80) return '#D0BCFF';
  if (score >= 60) return '#9D88D4';
  return '#FF6B9D';
}

function calculateCircleMetrics(diameter: number, strokeWidth: number, score: number) {
  const radius = (diameter - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  return { radius, circumference, strokeDasharray, strokeDashoffset };
}

export function ATSScoreCircle({
  score,
  size = 'medium',
  showLabel = false,
  className,
}: ATSScoreCircleProps) {
  const clampedScore = Math.min(100, Math.max(0, score));
  const config = sizeConfigs[size];
  const scoreColor = getScoreColor(clampedScore);
  const scoreColorValue = getScoreColorValue(clampedScore);
  const { radius, circumference, strokeDasharray, strokeDashoffset } = useMemo(
    () => calculateCircleMetrics(config.diameter, config.strokeWidth, clampedScore),
    [config.diameter, config.strokeWidth, clampedScore]
  );

  const center = config.diameter / 2;

  return (
    <div
      className={cn('inline-flex flex-col items-center justify-center', className)}
      role="img"
      aria-label={`ATS Score: ${clampedScore} out of 100`}
    >
      <div className="relative inline-flex">
        <svg
          width={config.diameter}
          height={config.diameter}
          style={{ transform: 'rotate(-90deg)' }}
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            fill="transparent"
            className="text-outline-variant opacity-20"
          />
          {size === 'large' && (
            <motion.circle
              cx={center}
              cy={center}
              r={radius}
              stroke={scoreColorValue}
              strokeWidth={config.strokeWidth + 2}
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              opacity={0.3}
              style={{ filter: 'blur(4px)' }}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
            />
          )}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            stroke={scoreColorValue}
            strokeWidth={config.strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${scoreColorValue}40)` }}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          />
        </svg>

        {size !== 'large' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className={cn(config.fontSize, 'font-bold', scoreColor, 'leading-none')}>
                {clampedScore}%
              </p>
              {showLabel && (
                <p className={cn(config.labelSize, 'text-on-surface-variant mt-0.5')}>
                  ATS Score
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {size === 'large' && (
        <div className="text-center mt-2">
          <p className={cn(config.fontSize, 'font-bold', scoreColor, 'leading-none')}>
            {clampedScore}%
          </p>
          {showLabel && (
            <p className={cn(config.labelSize, 'text-on-surface-variant mt-1')}>ATS Score</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ATSScoreCircle;
