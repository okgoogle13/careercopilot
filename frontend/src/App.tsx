import { AnimatePresence, motion } from 'framer-motion';
import React, { lazy, useEffect } from 'react';
import {
  Navigate,
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom';
import { Toaster } from 'sonner';
const texturePattern =
  '/assets/kr-solidarity/texture/kr-solidarity__substrate__landmark--melbourne-laneway--v1.png';
import './design/styles/design-tokens.css';
import { MigratedRouteLayout } from './layouts/MigratedRouteLayout';
import { getModeForRoute } from './config/routeModeMap';
import { useAuth } from './context/AuthContext';
import { AssetLibrary } from './features/analysis/AssetLibrary';
import { AnalysisPage } from './features/analysis/AnalysisPage';
import { ApplicationTracker } from './features/applications/ApplicationTracker';
import { ApplyQuick } from './features/applications/ApplyQuick';
import { CoverLetterGenerator } from './features/applications/CoverLetterGenerator';
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
import { Layout } from './layouts/Layout';
import { StyleGuide } from './features/style-guide/StyleGuide';
import DesignSidekick from './features/design-sidekick/DesignSidekick';
import { TokenTest } from './components/debug/TokenTest';
const SmartIngestion = lazy(() => import('./features/ingestion/SmartIngestion'));
import { JobQueue } from './features/jobs/JobQueue';
import { useModeStore } from './stores/useModeStore';
import { PrototypeRoutes } from './prototype-features/prototype-routes';

/**
 * ModeSync Component
 * Automatically switches between KrDark and KrDark modes based on the current route
 */
export function ModeSync() {
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

export const RequireAuth = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Check for demo/guest mode
  const searchParams = new URLSearchParams(location.search);
  const isDemoMode = searchParams.get('demo') === 'true';

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--sys-color-charcoalBackground-base)] flex items-center justify-center text-[var(--sys-color-worker-ash-base)]">
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
export const ProtectedLayout = () => {
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

// Public Layout (Login/Register/Landing)
export const PublicLayout = () => {
  const showSentryTestButton =
    import.meta.env.DEV && import.meta.env.VITE_SHOW_SENTRY_TEST_BUTTON === 'true';

  return (
    <div className="min-h-screen bg-[var(--sys-color-charcoalBackground-base)] relative">
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
              background: 'var(--sys-color-inkGold-base)',
              color: 'var(--sys-color-charcoalBackground-base)',
              borderRadius: '8px',
              zIndex: 9999,
              cursor: 'pointer',
              fontWeight: 'bold',
              border: '1px solid var(--sys-color-outline-variant)',
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

export function ModeSyncWrapper() {
  return (
    <>
      <ModeSync />
      <Outlet />
    </>
  );
}

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
            path="/design-sidekick"
            element={<DesignSidekick />}
          />
          <Route
            path="/style-guide"
            element={<StyleGuide />}
          />
          <Route
            path="/auth"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />
          <Route
            path="*"
            element={<NotFound />}
          />
        </Route>

        {/* Prototype Routes — no auth required, quarantine zone */}
        <Route
          path="/prototype/*"
          element={<PrototypeRoutes />}
        />

        {/* Protected Routes */}
        <Route element={<RequireAuth />}>
          <Route element={<MigratedRouteLayout />}>
            {/* Step 3a: CRUD verified via REST; local Python client blocked by gRPC hang */}
            <Route
              path="/tracker"
              element={<ApplicationTracker />}
            />
            <Route
              path="/dashboard"
              element={<Dashboard />}
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
              path="/career/ingest"
              element={<SmartIngestion />}
            />
            <Route
              path="/apply/quick"
              element={<ApplyQuick />}
            />
            <Route
              path="/settings"
              element={<Settings />}
            />
            <Route
              path="/profile"
              element={<ProfileView />}
            />
            {/* Step 6B: shell-promoted — token-enforcement + migration-audit passed */}
            <Route
              path="/onboarding"
              element={<OnboardingRoute />}
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
              path="/job-queue"
              element={<JobQueue />}
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
              path="/dashboard-overview"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />
            <Route
              path="/kanban"
              element={
                <Navigate
                  to="/tracker"
                  replace
                />
              }
            />
            <Route
              path="/ingestion"
              element={
                <Navigate
                  to="/career/ingest"
                  replace
                />
              }
            />
            <Route
              path="/feed"
              element={
                <Navigate
                  to="/opportunities"
                  replace
                />
              }
            />
            <Route
              path="/studio"
              element={
                <Navigate
                  to="/ksc-generator"
                  replace
                />
              }
            />
            <Route
              path="/editor"
              element={
                <Navigate
                  to="/documents"
                  replace
                />
              }
            />
          </Route>

          {/* ProtectedLayout: support-only surfaces that intentionally remain on the legacy shell. */}
          <Route element={<ProtectedLayout />}>
            {/* support-only: asset library is analysis/ingestion tooling, not a product pillar */}
            <Route
              path="/asset-library"
              element={<AssetLibrary />}
            />
            <Route
              path="/test-tokens"
              element={<TokenTest />}
            />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
