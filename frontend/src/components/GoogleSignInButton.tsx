import React, { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../contexts/AuthProvider';
import { isMobile } from 'react-device-detect';

interface GoogleSignInButtonProps {
  className?: string;
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  className = '',
  fallback,
  onError,
}) => {
  const { loginWithGoogle, isLoading } = useAuth();
  const [showFallback, setShowFallback] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Check if Google API is available
  useEffect(() => {
    // Check if Google API is loaded
    const checkGoogleAPI = () => {
      if (typeof window === 'undefined') return;

      // Check if Google API is blocked by an ad blocker
      const isGoogleBlocked = !window.google || !window.google.accounts;

      // Check if we're in an iframe (which might be blocked by some security policies)
      const isInIframe = window.self !== window.top;

      setShowFallback(isGoogleBlocked || isInIframe);
    };

    // Initial check
    checkGoogleAPI();

    // Set up a timeout to check again in case the API is loaded later
    const timer = setTimeout(checkGoogleAPI, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      await loginWithGoogle();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Google sign-in failed');
      setError(error);
      onError?.(error);

      // If this is a popup blocked error, show fallback
      if (error.message.includes('popup') || error.message.includes('blocked')) {
        setShowFallback(true);
      }
    }
  };

  // If we're showing fallback and a fallback component is provided
  if (showFallback && fallback) {
    return <>{fallback}</>;
  }

  // Default fallback content if no fallback prop is provided
  const defaultFallback = (
    <div className="p-4 text-yellow-700 bg-yellow-100 rounded-md dark:bg-yellow-900 dark:bg-opacity-30 dark:text-yellow-300">
      <p className="font-medium">Google Sign-In Unavailable</p>
      <p className="text-sm">Please try a different sign-in method or check your browser settings.</p>
    </div>
  );

  // If we're showing fallback and no custom fallback is provided
  if (showFallback) {
    return defaultFallback;
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className={`flex items-center justify-center w-full px-4 py-2 space-x-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 ${className} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        style={{
          borderRadius: 4,
          padding: '8px 16px',
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <FcGoogle className="w-5 h-5" />
        <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
      </button>

      {error && (
        <div className="p-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900 dark:bg-opacity-30 rounded-md">
          {error.message}
          {isMobile && (
            <div className="mt-1 text-xs text-red-700 dark:text-red-300">
              Tip: Try using a desktop browser if you're having issues.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
