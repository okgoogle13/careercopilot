import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  className = '',
  showLabel = false,
  color = 'blue',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ease-out ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={`Progress: ${percentage.toFixed(1)}%`}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-sm text-gray-600 text-center">
          {percentage.toFixed(1)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;