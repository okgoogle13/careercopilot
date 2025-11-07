import React from 'react';
import { Box } from '@mui/material';

interface ATSScoreCircleProps {
  /**
   * ATS score (0-100)
   */
  score: number;
  /**
   * Size of the score circle
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Whether to show the score text
   * @default true
   */
  showScore?: boolean;
  /**
   * Custom class name
   */
  className?: string;
}

const SIZE_MAP = {
  small: {
    size: 24,
    strokeWidth: 3,
    textSize: 'text-xs',
  },
  medium: {
    size: 40,
    strokeWidth: 4,
    textSize: 'text-sm',
  },
  large: {
    size: 192,
    strokeWidth: 8,
    textSize: 'text-4xl',
  },
} as const;

export const ATSScoreCircle: React.FC<ATSScoreCircleProps> = ({
  score,
  size = 'medium',
  showScore = true,
  className = '',
}) => {
  const { size: circleSize, strokeWidth, textSize } = SIZE_MAP[size];
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getColorClass = (_core: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div
      sx={{
      "relative": true,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      "${className}": true
    }}
      style={{ width: circleSize, height: circleSize }}
    >
      <svg
        sx={{
      "transform": true,
      "-rotate-90": true
    }}
        width={circleSize}
        height={circleSize}
        viewBox={`0 0 ${circleSize} ${circleSize}`}
      >
        <circle
          sx={{
      "text-surface-container-highest": true
    }}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={circleSize / 2}
          cy={circleSize / 2}
        />
        <circle
          sx={{
      "${getColorClass(score)}": true,
      "transition-all": true,
      "duration-500": true,
      "ease-in-out": true
    }}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={circleSize / 2}
          cy={circleSize / 2}
        />
      </svg>
      {showScore && <span sx={{
      "absolute": true,
      "${textSize}": true,
      fontWeight: 500
    }}>{Math.round(score)}</span>}
    </div>
  );
};
