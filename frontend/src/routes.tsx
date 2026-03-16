import { AnimatePresence, motion } from 'framer-motion';
import React, { Suspense, lazy, useEffect } from 'react';
import { createBrowserRouter, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getModeForRoute } from './config/routeModeMap';
import { useAuth } from './context/AuthContext';
import { AssetLibrary } from './features/analysis/AssetLibrary';
import { ApplicationTracker } from './features/applications/ApplicationTracker';
import { Login } from './features/auth/Login';
import { Register } from './features/auth/Register';
import { Dashboard } from './features/dashboard/Dashboard';
import { Documents } from './features/documents/Documents';
import { KSCGenerator } from './features/ksc-generator/KSCGenerator';
import { LandingPage } from './features/landing/LandingPage';
import { NotFound } from './features/not-found/NotFound';
import { OnboardingRoute } from './features/onboarding/OnboardingRoute';
import { WelcomeScreen } from './features/onboarding/WelcomeScreen';
import { Opportunities } from './features/opportunities/Opportunities';
import { ProfileView } from './features/profile/components/ProfileView';
import { Settings } from './features/settings/Settings';
import { JobQueue } from './features/jobs/JobQueue';
import { KrDarkDock } from './layouts/KrDarkShell/components/KrDarkDock';
import { Layout } from './layouts/Layout';
import { AnalysisPage } from './pages/AnalysisPage';
import { ApplyQuick } from './pages/ApplyQuick';
import { KanbanTracker } from './screens/07_kanban/KanbanTracker';
import { useModeStore } from './stores/useModeStore';

const SmartIngestion = lazy(() => import('./features/ingestion/SmartIngestion'));

function ModeSync() {
  const location = useLocation();
  const setMode = useModeStore((state) => state.setMode);

  useEffect(() => {
    setMode(getModeForRoute(location.pathname));
  }, [location.pathname, setMode]);

  return null;
}

const RequireAuth = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isDemoMode = searchParams.get('demo') === 'true';

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--sys-color-charcoalBackground-base)] flex items-center justify-center text-[var(--sys-color-worker-ash-base)]">
        Loading...
      </div>
    );
  }

  if (!user && !isDemoMode) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <Outlet />;
};

const ProtectedLayout = () => {
  const location = useLocation();

  return (
    <Layout>
      <AnimatePresence>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.175, 0.885, 0.32, 1.275],
          }}
          className="min-h-screen"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};

const MigratedRouteLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleViewChange = (view: string) => {
    const viewMap: Record<string, string> = {
      'KrDark-landing': '/',
      auth: '/login',
      'KrDark-kanban': '/tracker',
      'lab-dashboard': '/dashboard',
      'lab-analysis': '/analysis',
      'KrDark-ingestion': '/career/ingest',
    };

    navigate(viewMap[view] ?? '/dashboard');
  };

  const getCurrentView = () => {
    if (location.pathname === '/tracker') return 'KrDark-kanban';
    if (location.pathname === '/career/ingest') return 'KrDark-ingestion';
    if (location.pathname.startsWith('/analysis')) return 'lab-analysis';
    if (location.pathname === '/dashboard') return 'lab-dashboard';
    if (location.pathname === '/') return 'KrDark-landing';
    return 'lab-dashboard';
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface relative">
      <KrDarkDock
        currentView={getCurrentView()}
        onViewChange={handleViewChange}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.35,
            ease: [0.175, 0.885, 0.32, 1.1],
          }}
          className="min-h-screen"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const PublicLayout = () => <Outlet />;

const ModeSyncWrapper = () => (
  <>
    <ModeSync />
    <Outlet />
  </>
);

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
            {
              element: <MigratedRouteLayout />,
              children: [
                { path: '/dashboard', element: <Dashboard /> },
                { path: '/dashboard-overview', element: <Dashboard /> },
                { path: '/tracker', element: <ApplicationTracker /> },
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
            {
              element: <ProtectedLayout />,
              children: [
                { path: '/welcome', element: <WelcomeScreen /> },
                { path: '/onboarding', element: <OnboardingRoute /> },
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
