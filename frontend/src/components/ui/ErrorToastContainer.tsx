import React from 'react';
import { useError } from '../../contexts/ErrorContext';
import ErrorDisplay from './ErrorDisplay';

interface ErrorToastContainerProps {
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center';
  className?: string;
}

const ErrorToastContainer: React.FC<ErrorToastContainerProps> = ({
  position = 'top-right',
  className = '',
}) => {
  const { errors, removeError, retryError } = useError();

  const getPositionStyles = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  const handleAction = async (actionType: string, actionData?: unknown, errorId?: string) => {
    if (actionType === 'retry' && errorId) {
      await retryError(errorId);
    }
    // Handle other actions as needed
  };

  if (errors.length === 0) {
    return null;
  }

  return (
    <div className={`fixed z-50 pointer-events-none ${getPositionStyles()} ${className}`}>
      <div className='space-y-2 max-w-md'>
        {errors.map(error => (
          <div
            key={error.id}
            className='pointer-events-auto transform transition-all duration-300 ease-in-out'
            style={{
              animation: 'slideIn 0.3s ease-out',
            }}
          >
            <ErrorDisplay
              error={error}
              variant='toast'
              showSuggestions={true}
              maxSuggestions={2}
              onDismiss={() => removeError(error.id)}
              onAction={(actionType, actionData) => handleAction(actionType, actionData, error.id)}
              className='shadow-lg border-l-4'
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ErrorToastContainer;
