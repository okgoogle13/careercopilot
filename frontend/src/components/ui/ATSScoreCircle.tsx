import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'motion/react';
import React, { useMemo } from 'react';

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
    fontSize: '1.125rem', // text-lg (18px)
    labelSize: '0.75rem', // text-xs (12px)
  },
  medium: {
    diameter: 120,
    strokeWidth: 8,
    fontSize: '1.5rem', // text-2xl (24px)
    labelSize: '0.875rem', // text-sm (14px)
  },
  large: {
    diameter: 192,
    strokeWidth: 12,
    fontSize: '3rem', // text-5xl (48px)
    labelSize: '1rem', // text-base (16px)
  },
};

/**
 * Get color based on score threshold
 * - score ≥ 80: Primary (Excellent)
 * - score 60-79: Secondary (Good)
 * - score < 60: Error (Needs improvement)
 */
function getScoreColor(score: number, theme?: any): string {
  if (theme) {
    if (score >= 80) return theme.palette.primary.main;
    if (score >= 60) return theme.palette.secondary.main;
    return theme.palette.error.main;
  }
  // Fallback to hardcoded colors if no theme
  if (score >= 80) return '#A78BFA'; // primary-main
  if (score >= 60) return '#C9C3DC'; // secondary-main
  return '#FFB4AB'; // error-main
}

/**
 * Calculate SVG circle metrics for progress animation
 */
function calculateCircleMetrics(diameter: number, strokeWidth: number, score: number) {
  const radius = (diameter - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return { radius, circumference, strokeDasharray, strokeDashoffset };
}

/**
 * ATSScoreCircle - Animated circular progress indicator for ATS scores
 *
 * Features:
 * - SVG-based circular progress with smooth animation
 * - Color-coded thresholds (green/yellow/red)
 * - Three size variants (small/medium/large)
 * - Optional glow effect for large size
 * - Accessible with ARIA labels
 *
 * @example
 * ```tsx
 * <ATSScoreCircle score={85} size="large" showLabel />
 * <ATSScoreCircle score={62} size="medium" />
 * <ATSScoreCircle score={45} size="small" />
 * ```
 */
export function ATSScoreCircle({
  score,
  size = 'medium',
  showLabel = false,
  className,
}: ATSScoreCircleProps) {
  const theme = useTheme();
  // Ensure score is within valid range
  const clampedScore = Math.min(100, Math.max(0, score));

  const config = sizeConfigs[size];
  const scoreColor = getScoreColor(clampedScore, theme);
  const { radius, circumference, strokeDasharray, strokeDashoffset } = useMemo(
    () => calculateCircleMetrics(config.diameter, config.strokeWidth, clampedScore),
    [config.diameter, config.strokeWidth, clampedScore]
  );

  const center = config.diameter / 2;

  return (
    <Box
      className={className}
      sx={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      role="img"
      aria-label={`ATS Score: ${clampedScore} out of 100`}
    >
      {/* SVG Circle Container */}
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <svg
          width={config.diameter}
          height={config.diameter}
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Background Circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#d1d5db"
            strokeWidth={config.strokeWidth}
            fill="transparent"
            opacity={0.2}
          />

          {/* Glow Effect (Large size only) */}
          {size === 'large' && (
            <motion.circle
              cx={center}
              cy={center}
              r={radius}
              stroke={scoreColor}
              strokeWidth={config.strokeWidth + 2}
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              opacity={0.3}
              style={{
                filter: 'blur(4px)',
              }}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{
                duration: 1,
                ease: [0.4, 0, 0.2, 1], // cubic-bezier
              }}
            />
          )}

          {/* Progress Circle */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            stroke={scoreColor}
            strokeWidth={config.strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 8px ${scoreColor}40)`,
            }}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{
              duration: 1,
              ease: [0.4, 0, 0.2, 1], // cubic-bezier(0.4, 0, 0.2, 1)
            }}
          />
        </svg>

        {/* Center Text Overlay (for small and medium sizes) */}
        {size !== 'large' && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                sx={{
                  fontSize: config.fontSize,
                  fontWeight: 700,
                  color: scoreColor,
                  lineHeight: 1,
                }}
              >
                {clampedScore}%
              </Typography>
              {showLabel && (
                <Typography
                  sx={{
                    fontSize: config.labelSize,
                    color: 'text.secondary',
                    mt: 0.5,
                  }}
                >
                  ATS Score
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* Large size text is rendered below circle */}
      {size === 'large' && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography
            sx={{
              fontSize: config.fontSize,
              fontWeight: 700,
              color: scoreColor,
              lineHeight: 1,
            }}
          >
            {clampedScore}%
          </Typography>
          {showLabel && (
            <Typography
              sx={{
                fontSize: config.labelSize,
                color: 'text.secondary',
                mt: 1,
              }}
            >
              ATS Score
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}
