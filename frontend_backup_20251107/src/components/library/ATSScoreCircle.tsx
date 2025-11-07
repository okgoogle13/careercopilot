import React from 'react';
import { Box } from '@mui/material';

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
    <div sx={{
      "relative": true,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      "${className}": true
    }}>
      <svg width={config.diameter} height={config.diameter} sx={{
      "transform": true,
      "-rotate-90": true
    }}>
        {/* Background circle */}
        <circle
          cx={config.diameter / 2}
          cy={config.diameter / 2}
          r={radius}
          stroke="var(--muted)"
          strokeWidth={config.strokeWidth}
          fill="transparent"
          sx={{
      opacity: 0.2
    }}
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
          sx={{
      "transition-all": true,
      "duration-1000": true,
      "ease-out": true
    }}
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
            sx={{
      "transition-all": true,
      "duration-1000": true,
      "ease-out": true,
      opacity: 0.3
    }}
            style={{
              filter: `blur(4px)`,
            }}
          />
        )}
      </svg>

      {/* Score text overlay - removed since it's handled in parent component for large size */}
      {size !== 'large' && (
        <div sx={{
      "absolute": true,
      "inset-0": true,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
          <div sx={{
      textAlign: "center"
    }}>
            <div sx={{
      fontWeight: 700,
      "${config.textSize}": true
    }} style={{ color: scoreColor }}>
              {score}%
            </div>
            {showLabel && (
              <div sx={{
      "text-muted-foreground": true,
      "${config.labelSize}": true
    }}>ATS Score</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
