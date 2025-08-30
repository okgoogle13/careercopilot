import React from 'react';

interface ScoreCircleProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Displays a circular progress indicator for overall ATS scores
 */
export const ScoreCircle: React.FC<ScoreCircleProps> = ({
  score,
  size = 'lg',
}) => {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-36 h-36',
    lg: 'w-48 h-48',
  };

  const textSizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };

  return (
    <div className="flex justify-center mb-6">
      <div className={`relative ${sizeClasses[size]}`}>
        <svg className="w-full h-full" viewBox="0 0 36 36">
          {/* Background circle */}
          <path
            className="text-gray-200"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            strokeWidth="3"
            stroke="currentColor"
          />
          {/* Progress circle */}
          <path
            className="text-blue-500 transition-all duration-1000 ease-out"
            strokeDasharray={`${score}, 100`}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            stroke="currentColor"
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <span className={`${textSizeClasses[size]} font-bold text-gray-900`}>
            {score}
          </span>
          <span className="block text-sm text-gray-600">Overall Score</span>
        </div>
      </div>
    </div>
  );
};
