import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Auth pages - not lazy loaded since they're critical path
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Lazy load page components
const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const KscGeneratorPage = lazy(() =>
  import('./pages/KscGeneratorPage').then((m) => ({ default: m.KscGeneratorPage }))
);
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);
const AnalysisPage = lazy(() =>
  import('./pages/AnalysisPage').then((m) => ({ default: m.AnalysisPage }))
);
const OpportunitiesPage = lazy(() =>
  import('./pages/OpportunitiesPage').then((m) => ({ default: m.OpportunitiesPage }))
);
const DocumentsPage = lazy(() =>
  import('./pages/DocumentsPage').then((m) => ({ default: m.DocumentsPage }))
);
const AssetLibraryPage = lazy(() =>
  import('./pages/AssetLibraryPage').then((m) => ({ default: m.AssetLibraryPage }))
);
const ElectricAlchemistTestKitchen = lazy(() =>
  import('./pages/ElectricAlchemistTestKitchen').then((m) => ({ default: m.ElectricAlchemistTestKitchen }))
);

// Loading fallback
const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    <CircularProgress />
  </Box>
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
        <Route
          path="/electric-alchemist"
          element={<ElectricAlchemistTestKitchen />}
        />

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

const AppRouter: React.FC = () => {
  return <AppRouterContent />;
};

export default AppRouter;
