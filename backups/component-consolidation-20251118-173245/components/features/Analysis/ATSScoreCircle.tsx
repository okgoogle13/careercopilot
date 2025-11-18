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
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",}}
      style={{ width: circleSize, height: circleSize }}
    >
      <svg
        sx={{}}
        width={circleSize}
        height={circleSize}
        viewBox={`0 0 ${circleSize} ${circleSize}`}
      >
        <circle
          sx={{}}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={circleSize / 2}
          cy={circleSize / 2}
        />
        <circle
          sx={{}}
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
      fontWeight: 500
    }}>{Math.round(score)}</span>}
    </div>
  );
};
