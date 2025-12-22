import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './components/Dashboard';
import { ApplicationTracker } from './components/ApplicationTracker';
import { Documents } from './components/Documents';
import { Analysis } from './components/Analysis';
import { Opportunities } from './components/Opportunities';
import { KSCGenerator } from './components/KSCGenerator';
import { Settings } from './components/Settings';
import { LandingPage } from './components/LandingPage';
import { ProfileView } from './components/ProfileView';
import { NotFound } from './components/NotFound';
import { useAuth } from './context/AuthContext';
import texturePattern from './assets/images/texture-pattern.png';

// Protected Layout with animations
const ProtectedLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen bg-[#141218] flex items-center justify-center text-[#E6E1E5]">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
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
            duration: 0.6,
            ease: [0.2, 0.0, 0, 1.0]
          }}
          className="min-h-screen"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};

// Public Layout (Login/Register)
const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-[#141218] relative">
      {/* Textured Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: `url(${texturePattern})`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto'
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
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tracker" element={<ApplicationTracker />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/ksc-generator" element={<KSCGenerator />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<ProfileView />} />
        </Route>
      </Routes>
    </Router>
  );
}