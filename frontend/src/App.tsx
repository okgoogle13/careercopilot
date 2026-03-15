import { AnimatePresence, motion } from 'framer-motion';
import React, { Suspense, lazy, useEffect } from 'react';
import {
  Navigate,
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { Toaster } from 'sonner';
const texturePattern =
  '/assets/kr-solidarity/texture/kr-solidarity__substrate__landmark--melbourne-laneway--v1.png';
import './design/styles/design-tokens.css';
import { KrDarkDock } from './layouts/KrDarkShell/components/KrDarkDock';
import { getModeForRoute } from './config/routeModeMap';
import { useAuth } from './context/AuthContext';
import { AssetLibrary } from './features/analysis/AssetLibrary';
import { CoverLetterGenerator } from './features/applications/CoverLetterGenerator';
import { KanbanTracker } from './screens/07_kanban/KanbanTracker';
import { Login } from './features/auth/Login';
import { Register } from './features/auth/Register';
import { Dashboard } from './features/dashboard/Dashboard';
import { Documents } from './features/documents/Documents';
import { KSCGenerator } from './features/ksc-generator/KSCGenerator';
import { LandingPage } from './features/landing/LandingPage';
import { NotFound } from './features/not-found/NotFound';
import { OnboardingPage } from './features/onboarding/OnboardingPage';
import { WelcomeScreen } from './features/onboarding/WelcomeScreen';
import { Opportunities } from './features/opportunities/Opportunities';
import { ProfileView } from './features/profile/components/ProfileView';
import { Settings } from './features/settings/Settings';
import { Layout } from './layouts/Layout';
import { AnalysisPage } from './pages/AnalysisPage';
const SmartIngestion = lazy(() => import('./features/ingestion/SmartIngestion'));
import { JobQueue } from './features/jobs/JobQueue';
import { ApplyQuick } from './pages/ApplyQuick';
import { useModeStore } from './stores/useModeStore';
import { useUserStore } from './stores/userStore';

/**
 * ModeSync Component
 * Automatically switches between KrDark and KrDark modes based on the current route
 */
function ModeSync() {
  const location = useLocation();
  const setMode = useModeStore((state) => state.setMode);

  useEffect(() => {
    const requiredMode = getModeForRoute(location.pathname);
    setMode(requiredMode);

    if (import.meta.env.DEV) {
      console.log(`[ModeSync] Route: ${location.pathname} → Mode: ${requiredMode}`);
    }
  }, [location.pathname, setMode]);

  return null; // Logic-only component
}

const RequireAuth = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Check for demo/guest mode
  const searchParams = new URLSearchParams(location.search);
  const isDemoMode = searchParams.get('demo') === 'true';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1714] flex items-center justify-center text-[#E6E1E5]">
        Loading...
      </div>
    );
  }

  // Allow access if authenticated OR in demo mode
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

// Protected Layout with legacy sidebar shell
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
            ease: [0.175, 0.885, 0.32, 1.275], // expressive-spring
          }}
          className="min-h-screen"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};

// Thin authenticated shell for migrated routes that must not inherit the legacy sidebar.
// Includes the KrDarkDock for navigation.
const MigratedRouteLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleViewChange = (view: string) => {
    // Basic view-to-route mapper for the dock
    const viewMap: Record<string, string> = {
      'KrDark-landing': '/',
      auth: '/login',
      'KrDark-kanban': '/tracker',
      'lab-dashboard': '/dashboard',
      'lab-analysis': '/analysis',
      'KrDark-ingestion': '/career/ingest',
    };
    const route = viewMap[view] || '/dashboard';
    navigate(route);
  };

  // Determine current view from pathname
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

const OnboardingRoute = () => {
  const isNewUser = useUserStore((state) => state.isNewUser);
  if (isNewUser) {
    return (
      <Navigate
        to="/welcome"
        replace
      />
    );
  }
  return <OnboardingPage />;
};

// Public Layout (Login/Register/Landing)
const PublicLayout = () => {
  const showSentryTestButton =
    import.meta.env.DEV && import.meta.env.VITE_SHOW_SENTRY_TEST_BUTTON === 'true';

  return (
    <div className="min-h-screen bg-[#1A1714] relative">
      {/* Textured Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: `url(${texturePattern})`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
        }}
      />
      <div className="relative z-10">
        {/* Temporary Sentry Test Button */}
        {showSentryTestButton && (
          <button
            onClick={() => {
              throw new Error('Sentry Frontend Test Error');
            }}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              padding: '10px',
              background: '#D0BCFE',
              color: '#381E72',
              borderRadius: '8px',
              zIndex: 9999,
              cursor: 'pointer',
              fontWeight: 'bold',
              border: 'none',
            }}
          >
            Trigger Sentry Error
          </button>
        )}
        <Outlet />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ModeSync />
      <Toaster
        position="top-right"
        theme="dark"
        richColors
        expand
      />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route
            path="/"
            element={<LandingPage />}
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/register"
            element={<Register />}
          />
          <Route
            path="*"
            element={<NotFound />}
          />
        </Route>

        {/* Protected Routes */}
        <Route element={<RequireAuth />}>
          <Route element={<MigratedRouteLayout />}>
            <Route
              path="/tracker"
              element={<KanbanTracker />}
            />
          </Route>

          <Route element={<ProtectedLayout />}>
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />
            <Route
              path="/onboarding"
              element={<OnboardingRoute />}
            />
            <Route
              path="/welcome"
              element={<WelcomeScreen />}
            />
            <Route
              path="/documents"
              element={<Documents />}
            />
            <Route
              path="/analysis"
              element={<AnalysisPage />}
            />
            <Route
              path="/opportunities"
              element={<Opportunities />}
            />
            <Route
              path="/ksc-generator"
              element={<KSCGenerator />}
            />
            <Route
              path="/cover-letter-generator"
              element={<CoverLetterGenerator />}
            />
            <Route
              path="/settings"
              element={<Settings />}
            />
            <Route
              path="/profile"
              element={<ProfileView />}
            />
            <Route
              path="/asset-library"
              element={<AssetLibrary />}
            />
            <Route
              path="/career/ingest"
              element={<SmartIngestion />}
            />
            <Route
              path="/job-queue"
              element={<JobQueue />}
            />
            <Route
              path="/apply/quick"
              element={<ApplyQuick />}
            />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
