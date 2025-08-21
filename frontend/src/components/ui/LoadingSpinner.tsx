import { memo } from 'react';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'primary' | 'secondary' | 'white' | 'gray';
}

const LoadingSpinner = memo<LoadingSpinnerProps>(({
  size = 'md',
  className = '',
  color = 'primary',
}) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
    gray: 'text-gray-400',
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="progressbar"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

// Enhanced loading state components

interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'card';
}

export const LoadingState = memo<LoadingStateProps>(({
  message = 'Loading...',
  className = '',
  size = 'lg',
  variant = 'default',
}) => {
  const baseClasses = 'flex flex-col items-center justify-center';
  
  const variantClasses = {
    default: 'py-12',
    minimal: 'py-6',
    card: 'py-8 px-6 bg-white rounded-lg shadow-sm border',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} role="status" aria-live="polite">
      <LoadingSpinner size={size} className="mb-4" />
      <p className="text-gray-600 text-center text-sm">{message}</p>
    </div>
  );
});

LoadingState.displayName = 'LoadingState';

interface PageLoadingProps {
  message?: string;
  className?: string;
}

export const PageLoading = memo<PageLoadingProps>(({
  message = 'Loading page...',
  className = '',
}) => (
  <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${className}`} role="status" aria-live="polite">
    <div className="text-center">
      <LoadingSpinner size="xl" className="mb-6 mx-auto" />
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  </div>
));

PageLoading.displayName = 'PageLoading';

// Inline loading component for buttons and small spaces
interface InlineLoadingProps {
  message?: string;
  className?: string;
}

export const InlineLoading = memo<InlineLoadingProps>(({
  message = 'Loading...',
  className = '',
}) => (
  <div className={`flex items-center space-x-2 ${className}`} role="status" aria-live="polite">
    <LoadingSpinner size="sm" />
    {message && <span className="text-sm text-gray-600">{message}</span>}
  </div>
));

InlineLoading.displayName = 'InlineLoading';

// Table loading skeleton
interface TableLoadingProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const TableLoading = memo<TableLoadingProps>(({
  rows = 5,
  columns = 4,
  className = '',
}) => (
  <div className={`animate-pulse ${className}`} role="status" aria-label="Loading table data">
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4 py-3 border-b border-gray-100">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div
            key={colIndex}
            className="h-4 bg-gray-200 rounded flex-1"
            style={{ width: `${Math.random() * 40 + 60}%` }}
          />
        ))}
      </div>
    ))}
  </div>
));

TableLoading.displayName = 'TableLoading';

// Card loading skeleton
interface CardLoadingProps {
  className?: string;
  variant?: 'default' | 'compact';
}

export const CardLoading = memo<CardLoadingProps>(({
  className = '',
  variant = 'default',
}) => (
  <div 
    className={`animate-pulse p-6 bg-white rounded-lg shadow-sm border ${className}`}
    role="status" 
    aria-label="Loading card content"
  >
    <div className="space-y-4">
      {variant === 'default' && (
        <>
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded" />
            <div className="h-3 bg-gray-200 rounded w-5/6" />
          </div>
        </>
      )}
      {variant === 'compact' && (
        <>
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </>
      )}
    </div>
  </div>
));

CardLoading.displayName = 'CardLoading';

export default LoadingSpinner;
