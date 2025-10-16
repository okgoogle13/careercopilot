import React from 'react';

interface ATSScoreCircleProps {
  score: number;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  showLabel?: boolean;
}

export function ATSScoreCircle({
  score,
  size = 'medium',
  className = '',
  showLabel = false,
}: ATSScoreCircleProps) {
  // Size configurations
  const sizeConfig = {
    small: {
      diameter: 80,
      strokeWidth: 6,
      textSize: 'text-lg',
      labelSize: 'text-xs',
    },
    medium: {
      diameter: 120,
      strokeWidth: 8,
      textSize: 'text-2xl',
      labelSize: 'text-sm',
    },
    large: {
      diameter: 192, // 48 * 4 = 192px for w-48 h-48
      strokeWidth: 12,
      textSize: 'text-5xl',
      labelSize: 'text-base',
    },
  };

  const config = sizeConfig[size];
  const radius = (config.diameter - config.strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Color based on score
  const getScoreColor = (_core: number) => {
    if (score >= 80) return '#10b981'; // green-500
    if (score >= 60) return '#f59e0b'; // yellow-500
    return '#ef4444'; // red-500
  };

  const scoreColor = getScoreColor(score);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={config.diameter} height={config.diameter} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={config.diameter / 2}
          cy={config.diameter / 2}
          r={radius}
          stroke="var(--muted)"
          strokeWidth={config.strokeWidth}
          fill="transparent"
          className="opacity-20"
        />

        {/* Progress circle */}
        <circle
          cx={config.diameter / 2}
          cy={config.diameter / 2}
          r={radius}
          stroke={scoreColor}
          strokeWidth={config.strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${scoreColor}40)`,
          }}
        />

        {/* Glow effect for large size */}
        {size === 'large' && (
          <circle
            cx={config.diameter / 2}
            cy={config.diameter / 2}
            r={radius}
            stroke={scoreColor}
            strokeWidth={config.strokeWidth + 2}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out opacity-30"
            style={{
              filter: `blur(4px)`,
            }}
          />
        )}
      </svg>

      {/* Score text overlay - removed since it's handled in parent component for large size */}
      {size !== 'large' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`font-bold ${config.textSize}`} style={{ color: scoreColor }}>
              {score}%
            </div>
            {showLabel && (
              <div className={`text-muted-foreground ${config.labelSize}`}>ATS Score</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
