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
import { Card } from '@/components/electric';

// Auth pages - not lazy loaded since they're critical path
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';

// Lazy load page components
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const KscGeneratorPage = lazy(() =>
  import('@/pages/KscGeneratorPage').then((m) => ({ default: m.KscGeneratorPage }))
);
const SettingsPage = lazy(() =>
  import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);
const AnalysisPage = lazy(() =>
  import('@/pages/AnalysisPage').then((m) => ({ default: m.AnalysisPage }))
);
const OpportunitiesPage = lazy(() =>
  import('@/pages/OpportunitiesPage').then((m) => ({ default: m.OpportunitiesPage }))
);
const DocumentsPage = lazy(() =>
  import('@/pages/DocumentsPage').then((m) => ({ default: m.DocumentsPage }))
);
const AssetLibraryPage = lazy(() =>
  import('@/pages/AssetLibraryPage').then((m) => ({ default: m.AssetLibraryPage }))
);
const ElectricAlchemistTestKitchen = lazy(() =>
  import('@/pages/ElectricAlchemistTestKitchen').then((m) => ({
    default: m.ElectricAlchemistTestKitchen,
  }))
);
const M3IntegrationTestPage = lazy(() =>
  import('@/pages/M3IntegrationTestPage').then((m) => ({
    default: m.M3IntegrationTestPage,
  }))
);

// Loading fallback using design system
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-surface">
    <Card variant="default" className="p-8">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-data text-sm text-outline">Loading...</p>
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
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
        />
        <Route path="/electric-alchemist" element={<ElectricAlchemistTestKitchen />} />
        <Route path="/m3-integration-test" element={<M3IntegrationTestPage />} />

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
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ksc-generator"
          element={
            <ProtectedRoute>
              <KscGeneratorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analysis"
          element={
            <ProtectedRoute>
              <AnalysisPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/opportunities"
          element={
            <ProtectedRoute>
              <OpportunitiesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <DocumentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/asset-library"
          element={
            <ProtectedRoute>
              <AssetLibraryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
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

