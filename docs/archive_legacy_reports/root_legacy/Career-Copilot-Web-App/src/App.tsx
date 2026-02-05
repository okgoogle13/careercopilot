import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Sidebar } from "./components/Sidebar";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Dashboard } from "./components/Dashboard";
import { ApplicationTracker } from "./components/ApplicationTracker";
import { Documents } from "./components/Documents";
import { Analysis } from "./components/Analysis";
import { Opportunities } from "./components/Opportunities";
import { KSCGenerator } from "./components/KSCGenerator";
import { AssetLibrary } from "./components/AssetLibrary";
import { Settings } from "./components/Settings";
import texturePattern from "figma:asset/5dd1245f16ac811d07e4da189bb280a15ab11e33.png";

// Protected Layout with Animation
const ProtectedLayout = () => {
  // Mock auth state - in real app, this would come from context/state management
  const isAuthenticated = true;
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#1A1714] relative">
      {/* Textured Background Layer */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${texturePattern})`,
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
          opacity: 0.3,
          mixBlendMode: "overlay",
          zIndex: 0,
        }}
      />

      {/* Content Layer */}
      <div className="relative z-10">
        <Sidebar />
        <main className="ml-[280px] min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.2, 0.0, 0, 1.0],
              }}
              className="min-h-screen"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

// Public Layout
const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-[#1A1714] relative">
      {/* Textured Background Layer */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${texturePattern})`,
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
          opacity: 0.3,
          mixBlendMode: "overlay",
          zIndex: 0,
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tracker" element={<ApplicationTracker />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/ksc-generator" element={<KSCGenerator />} />
          <Route path="/asset-library" element={<AssetLibrary />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}
