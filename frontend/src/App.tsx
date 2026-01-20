import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { Layout } from './layouts/Layout';
import { Login } from './features/auth/Login';
import { Register } from './features/auth/Register';
import { Dashboard } from './features/dashboard/Dashboard';
import { ApplicationTracker } from './features/applications/ApplicationTracker';
import { Documents } from './features/documents/Documents';
import { Analysis } from './features/analysis/Analysis';
import { Opportunities } from './features/opportunities/Opportunities';
import { KSCGenerator } from './features/ksc-generator/KSCGenerator';
import { StyleGuide } from './features/style-guide/StyleGuide';
import { Settings } from './features/settings/Settings';
import { LandingPage } from './features/landing/LandingPage';
import { ProfileView } from './features/profile/components/ProfileView';
import { AssetLibrary } from './features/analysis/AssetLibrary';
import { NotFound } from './features/not-found/NotFound';
import { IngestionPage } from './pages/IngestionPage';
import { JobQueue } from './pages/JobQueue';
import { AnalysisPage } from './pages/AnalysisPage';
import { useAuth } from './context/AuthContext';
import texturePattern from './assets/images/texture-pattern.png';

// Protected Layout with animations
const ProtectedLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Check for demo/guest mode
  const searchParams = new URLSearchParams(location.search);
  const isDemoMode = searchParams.get('demo') === 'true';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141218] flex items-center justify-center text-[#E6E1E5]">
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
    <div className="min-h-screen bg-[#141218] relative">
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
        </Route>
      </Routes>
    </Router>
  );
}
