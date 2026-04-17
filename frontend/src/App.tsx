import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect } from 'react';
import AnimationTestPage from './components/debug/AnimationTest';
import {
  Navigate,
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom';
import { Toaster } from 'sonner';
import { BannerTexture } from './components/kerala-rage/BannerTexture';
import './design/styles/design-tokens.css';
import { MigratedRouteLayout } from './layouts/MigratedRouteLayout';
import { getModeForRoute } from './config/routeModeMap';
import { useAuth } from './context/AuthContext';
import { Layout } from './layouts/Layout';
import { useModeStore } from './stores/useModeStore';

// Canonical Pages (Migrated to Features)
import { LandingPage } from './features/landing/LandingPage';
import { OnboardingPage } from './features/onboarding/OnboardingPage';
import { Dashboard as DashboardPage } from './features/dashboard/Dashboard';
import { ProfilePage } from './features/profile/ProfilePage';
import { OpportunitiesDiscovery as OpportunitiesPage } from './screens/06_opportunities/OpportunitiesDiscovery';
import { ApplicationTracker as ApplicationsPage } from './features/applications/ApplicationTracker';
import { AnalysisPage } from './features/analysis/AnalysisPage';
import { Documents as DocsPage } from './features/documents/Documents';
import { ApplyQuick as ApplyPage } from './features/applications/ApplyQuick';
import { TabbedGenerationPanel as GenerationPage } from './features/documents/components/TabbedGenerationPanel';
import { Settings as SettingsPage } from './features/settings/Settings';
import AuthModal from './screens/02_auth/AuthModal';
import { Scaffold } from './components/archetypes';

// Preserved non-canonical / utility
import { NotFound } from './features/not-found/NotFound';
import { StyleGuide } from './features/style-guide/StyleGuide';
import DesignSidekick from './features/design-sidekick/DesignSidekick';
import { TokenTest } from './components/debug/TokenTest';
import { AssetLibrary } from './features/analysis/AssetLibrary';

/**
 * AuthPage Bridge
 * Handles /auth canonical route with mode detection
 */
function AuthPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mode = (searchParams.get('mode') as 'login' | 'register') || 'login';

  return (
    <Scaffold>
      <AuthModal mode={mode} />
    </Scaffold>
  );
}

/**
 * ModeSync Component
 * Automatically switches between modes based on the current route
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
        to="/auth"
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
      <BannerTexture />
      <AnimatePresence>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, scale: 0.98, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.45,
            ease: [0.175, 0.885, 0.32, 1.1],
          }}
          className="min-h-screen relative z-10"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};

// Public Layout (Login/Register/Landing)
export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-charcoalBackground-base text-worker-ash-base relative">
      <BannerTexture />
      <div className="relative z-10">
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
            path="/auth"
            element={<AuthPage />}
          />

          {/* Developer / Internal Routes */}
          <Route
            path="/design-sidekick"
            element={<DesignSidekick />}
          />
          <Route
            path="/style-guide"
            element={<StyleGuide />}
          />
          <Route
            path="/animation-test"
            element={<AnimationTestPage />}
          />
          <Route
            path="*"
            element={<NotFound />}
          />
        </Route>

        {/* Protected Canonical Routes */}
        <Route element={<RequireAuth />}>
          <Route element={<MigratedRouteLayout />}>
            <Route
              path="/dashboard"
              element={<DashboardPage />}
            />
            <Route
              path="/profile"
              element={<ProfilePage />}
            />
            <Route
              path="/opportunities"
              element={<OpportunitiesPage />}
            />
            <Route
              path="/applications"
              element={<ApplicationsPage />}
            />
            <Route
              path="/analysis"
              element={<AnalysisPage />}
            />
            <Route
              path="/apply"
              element={<ApplyPage />}
            />
            <Route
              path="/generation"
              element={<GenerationPage />}
            />
            <Route
              path="/settings"
              element={<SettingsPage />}
            />
            <Route
              path="/onboarding"
              element={<OnboardingPage />}
            />
            <Route
              path="/documents"
              element={<DocsPage />}
            />
          </Route>

          {/* ProtectedLayout: support-only surfaces that intentionally remain on the legacy shell. */}
          <Route element={<ProtectedLayout />}>
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
