/**
 * ELECTRIC ALCHEMIST: PROTECTED ROUTE
 *
 * Route guard component that requires authentication.
 * Uses Electric Alchemist design system for loading states.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components';

export interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute Component
 *
 * Guards routes that require authentication.
 * Shows loading state while checking auth status.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <Card variant="default" className="p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-data text-sm text-outline">Loading...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

