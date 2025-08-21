// Error trigger component for testing error boundaries (development only)
import React, { useState } from 'react';

interface ErrorTriggerProps {
  onlyInDev?: boolean;
}

const ErrorTrigger: React.FC<ErrorTriggerProps> = ({ onlyInDev = true }) => {
  const [shouldError, setShouldError] = useState(false);

  // Only show in development mode if onlyInDev is true
  if (onlyInDev && process.env.NODE_ENV !== 'development') {
    return null;
  }

  // Trigger error when shouldError is true
  if (shouldError) {
    throw new Error('Test error triggered by ErrorTrigger component');
  }

  const triggerRenderError = () => {
    setShouldError(true);
  };

  const triggerTypeError = () => {
    // This will cause a runtime error
    const obj: any = null;
    console.log(obj.someProperty.thatDoesNotExist);
  };

  const triggerAsyncError = async () => {
    // This will cause an unhandled promise rejection
    throw new Error('Async error for testing error boundaries');
  };

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="text-lg font-medium text-yellow-800 mb-2">
        Error Boundary Testing (Dev Only)
      </h3>
      <p className="text-sm text-yellow-700 mb-4">
        These buttons will trigger different types of errors to test error boundaries.
      </p>
      <div className="space-y-2">
        <button
          onClick={triggerRenderError}
          className="block w-full px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
        >
          Trigger Render Error (Caught by Error Boundary)
        </button>
        <button
          onClick={triggerTypeError}
          className="block w-full px-3 py-2 text-sm bg-orange-600 text-white rounded hover:bg-orange-700"
        >
          Trigger Type Error (Caught by Error Boundary)
        </button>
        <button
          onClick={triggerAsyncError}
          className="block w-full px-3 py-2 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Trigger Async Error (May not be caught)
        </button>
      </div>
    </div>
  );
};

export default ErrorTrigger;