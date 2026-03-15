import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate, Link } from 'react-router-dom';
import {
  ProtectedLayout,
  PublicLayout,
  RequireAuth,
  MigratedRouteLayout,
  ModeSyncWrapper,
} from './App';

// Feature Imports
import { LandingPage } from './features/landing/LandingPage';
import { Login } from './features/auth/Login';
import { Register } from './features/auth/Register';
import { Dashboard } from './features/dashboard/Dashboard';
import { KanbanTracker } from './screens/07_kanban/KanbanTracker';
import { Documents } from './features/documents/Documents';
import { AnalysisPage } from './pages/AnalysisPage';
import { Opportunities } from './features/opportunities/Opportunities';
import { KSCGenerator } from './features/ksc-generator/KSCGenerator';
import { AssetLibrary } from './features/analysis/AssetLibrary';
import { Settings } from './features/settings/Settings';
import { ProfileView } from './features/profile/components/ProfileView';
import { JobQueue } from './features/jobs/JobQueue';
import { ApplyQuick } from './pages/ApplyQuick';
import { WelcomeScreen } from './features/onboarding/WelcomeScreen';
import { OnboardingPage } from './features/onboarding/OnboardingPage';

// Lazy Components
const SmartIngestion = lazy(() => import('./features/ingestion/SmartIngestion'));

// components
import { Logo } from './components/kerala-rage/Logo'; // Updated path to KR Solidarity Logo

/**
 * 404 — Kerala Rage / Solidarity Mode
 */
function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{ background: 'var(--sys-color-charcoalBackground-base)' }}
    >
      <Logo
        variant="icon"
        size={120}
        className="mb-12"
      />
      <h1
        style={{
          fontFamily: 'var(--sys-type-fontFamilies-display), serif',
          fontVariationSettings: "'wght' 900, 'SOFT' 100, 'WONK' 1",
          fontSize: 'clamp(4rem, 10vw, 9rem)',
          color: 'var(--sys-color-solidarityRed-base)',
          lineHeight: 0.95,
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
        }}
      >
        404
      </h1>
      <p
        style={{
          fontFamily: 'var(--sys-type-fontFamilies-mono), monospace',
          fontWeight: 700,
          fontSize: '12px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--sys-color-worker-ash-base)',
          marginTop: '16px',
        }}
      >
        ROUTE NOT FOUND // SOLIDARITY MODE
      </p>
      <Link
        to="/"
        style={{
          fontFamily: 'var(--sys-type-fontFamilies-primary), system-ui, sans-serif',
          fontWeight: 700,
          fontSize: '14px',
          color: 'var(--sys-color-inkGold-base)',
          marginTop: '32px',
          textDecoration: 'none',
          padding: '12px 28px',
          borderRadius: 'var(--sys-shape-corner-medium)', // Use semantic shape token
          border: '1px solid rgba(218, 246, 116, 0.25)',
        }}
      >
        BACK TO LANDING
      </Link>
    </div>
  );
}

export const router = createBrowserRouter(
  [
    {
      element: <ModeSyncWrapper />,
      children: [
        {
          element: <PublicLayout />,
          children: [
            { path: '/', element: <LandingPage /> },
            { path: '/login', element: <Login /> },
            { path: '/register', element: <Register /> },
            {
              path: '/auth',
              element: (
                <Navigate
                  to="/login"
                  replace
                />
              ),
            },
          ],
        },
        {
          element: <RequireAuth />,
          children: [
            // Migrated Routes (Expressive Shell)
            {
              element: <MigratedRouteLayout />,
              children: [
                { path: '/dashboard', element: <Dashboard /> },
                { path: '/dashboard-overview', element: <Dashboard /> },
                { path: '/tracker', element: <KanbanTracker /> },
                { path: '/kanban', element: <KanbanTracker /> },
                {
                  path: '/career/ingest',
                  element: (
                    <Suspense fallback={<div>Loading Ingestion...</div>}>
                      <SmartIngestion />
                    </Suspense>
                  ),
                },
                {
                  path: '/ingestion',
                  element: (
                    <Navigate
                      to="/career/ingest"
                      replace
                    />
                  ),
                },
                { path: '/analysis', element: <AnalysisPage /> },
                { path: '/opportunities', element: <Opportunities /> },
                {
                  path: '/feed',
                  element: (
                    <Navigate
                      to="/opportunities"
                      replace
                    />
                  ),
                },
              ],
            },
            // Legacy/Protected Routes
            {
              element: <ProtectedLayout />,
              children: [
                { path: '/welcome', element: <WelcomeScreen /> },
                { path: '/onboarding', element: <OnboardingPage /> },
                { path: '/documents', element: <Documents /> },
                {
                  path: '/editor',
                  element: (
                    <Navigate
                      to="/documents"
                      replace
                    />
                  ),
                },
                { path: '/ksc-generator', element: <KSCGenerator /> },
                {
                  path: '/studio',
                  element: (
                    <Navigate
                      to="/ksc-generator"
                      replace
                    />
                  ),
                },
                { path: '/asset-library', element: <AssetLibrary /> },
                { path: '/settings', element: <Settings /> },
                { path: '/profile', element: <ProfileView /> },
                { path: '/job-queue', element: <JobQueue /> },
                { path: '/apply/quick', element: <ApplyQuick /> },
              ],
            },
          ],
        },
        { path: '*', element: <NotFound /> },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);
