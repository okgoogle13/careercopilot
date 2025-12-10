/**
 * ELECTRIC ALCHEMIST: APP ROUTER
 *
 * Main application router with lazy loading and protected routes.
 * Uses Electric Alchemist design system for loading states.
 */

import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Card } from '@/components/ui/card';

// Auth pages
import Auth from '@/pages/Auth';

// Lazy load page components
const Dashboard = lazy(() => import('@/pages/Index'));
const Applications = lazy(() => import('@/pages/Applications'));
const Documents = lazy(() => import('@/pages/Documents'));
const Analysis = lazy(() => import('@/pages/Analysis'));
const Opportunities = lazy(() => import('@/pages/Opportunities'));
const Settings = lazy(() => import('@/pages/Settings'));

// Legacy/Test pages (Keep until confirmed deletion)
const ElectricAlchemistTestKitchen = lazy(() =>
  import('@/pages/ElectricAlchemistTestKitchen').then((m) => ({
    default: m.ElectricAlchemistTestKitchen,
  }))
);

// Loading fallback using design system
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-surface">
    <Card className="p-8">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </Card>
  </div>
);

function AppRouterContent() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Auth />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Auth />}
        />
        <Route path="/electric-alchemist" element={<ElectricAlchemistTestKitchen />} />

        {/* Default redirect */}
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <Applications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analysis"
          element={
            <ProtectedRoute>
              <Analysis />
            </ProtectedRoute>
          }
        />
        <Route
          path="/opportunities"
          element={
            <ProtectedRoute>
              <Opportunities />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <Documents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Catch-all - redirect to dashboard or login */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
        />
      </Routes>
    </Suspense>
  );
}

export const AppRouter: React.FC = () => {
  return <AppRouterContent />;
};

export default AppRouter;

export default AppRouter;

