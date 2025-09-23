import React from 'react';

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
  
  const getColorClass = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div 
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: circleSize, height: circleSize }}
    >
      <svg
        className="transform -rotate-90"
        width={circleSize}
        height={circleSize}
        viewBox={`0 0 ${circleSize} ${circleSize}`}
      >
        <circle
          className="text-surface-container-highest"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={circleSize / 2}
          cy={circleSize / 2}
        />
        <circle
          className={`${getColorClass(score)} transition-all duration-500 ease-in-out`}
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
      {showScore && (
        <span className={`absolute ${textSize} font-medium`}>
          {Math.round(score)}
        </span>
      )}
    </div>
  );
};
