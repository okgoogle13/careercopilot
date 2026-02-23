import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import {
  Navigate,
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom';
import { Toaster } from 'sonner';
const texturePattern = '/assets/kr-solidarity/texture/kr-solidarity__substrate__kr-solidarity--texture--melbourne-laneway--v1__v1.png';
import { TokenTest } from './components/debug/TokenTest';
import { getModeForRoute } from './config/routeModeMap';
import { useAuth } from './context/AuthContext';
import { AssetLibrary } from './features/analysis/AssetLibrary';
import { ApplicationTracker } from './features/applications/ApplicationTracker';
import { CoverLetterGenerator } from './features/applications/CoverLetterGenerator';
import { Login } from './features/auth/Login';
import { Register } from './features/auth/Register';
import { Dashboard } from './features/dashboard/Dashboard';
import { Documents } from './features/documents/Documents';
import { KSCGenerator } from './features/ksc-generator/KSCGenerator';
import { LandingPage } from './features/landing/LandingPage';
import { NotFound } from './features/not-found/NotFound';
import { OnboardingPage } from './features/onboarding/OnboardingPage';
import { Opportunities } from './features/opportunities/Opportunities';
import { ProfileView } from './features/profile/components/ProfileView';
import { Settings } from './features/settings/Settings';
import { StyleGuide } from './features/style-guide/StyleGuide';
import { Layout } from './layouts/Layout';
import { AnalysisPage } from './pages/AnalysisPage';
import { IngestionPage } from './pages/IngestionPage';
import { JobQueue } from './pages/JobQueue';
import { useModeStore } from './stores/useModeStore';

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

// Protected Layout with animations
const ProtectedLayout = () => {
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

  return (
    <Layout>
      <AnimatePresence mode="wait">
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
const PublicLayout = () => {
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
        {import.meta.env.DEV && (
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
        <Route element={<ProtectedLayout />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
          <Route
            path="/onboarding"
            element={<OnboardingPage />}
          />
          <Route
            path="/tracker"
            element={<ApplicationTracker />}
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
            element={<IngestionPage />}
          />
          <Route
            path="/job-queue"
            element={<JobQueue />}
          />
          <Route
            path="/style-guide"
            element={<StyleGuide />}
          />
          <Route
            path="/test-tokens"
            element={<TokenTest />}
          />
        </Route>
      </Routes>
    </Router>
  );
}
