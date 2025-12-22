/**
 * ELECTRIC ALCHEMIST: APP ROUTER
 *
 * Main application router with lazy loading and protected routes.
 * Uses Electric Alchemist design system for loading states.
 */

import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Sidebar } from '@/components/Sidebar';
import { Card } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import texturePattern from '@/assets/texture-pattern.png';

// Auth pages
import Auth from '@/pages/Auth';

// Lazy load page components
const Dashboard = lazy(() => import('@/pages/Index'));
const Applications = lazy(() => import('@/pages/Applications'));
const Documents = lazy(() => import('@/pages/Documents'));
const Analysis = lazy(() => import('@/pages/Analysis'));
const Opportunities = lazy(() => import('@/pages/Opportunities'));
const Settings = lazy(() => import('@/pages/Settings'));
const KSCGenerator = lazy(() => import('@/components/KSCGenerator'));
const ApplicationTracker = lazy(() => import('@/components/ApplicationTracker'));
const DesignSystem = lazy(() => import('@/pages/DesignSystem'));

const ProtectedLayout = () => {
  const isAuthenticated = true;
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Texture Layer */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30 mix-blend-overlay z-0"
        style={{ backgroundImage: `url(${texturePattern})`, backgroundSize: 'auto' }}
      />

      <Sidebar />

      {/* Main Content Area - Left Aligned, Standardized Padding */}
      <main className="flex-1 lg:ml-[280px] md:ml-[72px] ml-0 min-h-screen overflow-y-auto relative z-10 hidden-scrollbar">
        <div className="w-full max-w-[1600px] p-6 md:p-10 lg:p-12 mb-20 md:mb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

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

        {/* Default redirect */}
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
        />

        {/* Protected routes */}
        <Route element={<ProtectedLayout />}>
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
            path="/tracker"
            element={
              <ProtectedRoute>
                <ApplicationTracker />
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
            path="/ksc-generator"
            element={
              <ProtectedRoute>
                <KSCGenerator />
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
          <Route
            path="/design-system"
            element={
              <ProtectedRoute>
                <DesignSystem />
              </ProtectedRoute>
            }
          />
        </Route>

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
