import React from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { KrDarkDock } from './KrDarkShell/components/KrDarkDock';
import { Footer } from './shared/Footer';
import { NAVIGATION_SCHEMA } from '../config/navigation.schema';

/**
 * MigratedRouteLayout
 *
 * A clean, authenticated shell for routes that have been promoted to KR Solidarity v6.0 standards.
 * It removes the legacy sidebar and utilizes the floating KrDarkDock for navigation.
 */
export const MigratedRouteLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleViewChange = (viewId: string) => {
    const item = NAVIGATION_SCHEMA.find((i) => i.id === viewId);
    if (item) {
      navigate(item.route);
    } else {
      // Fallback for known specific logic if needed, otherwise dashboard
      navigate('/dashboard');
    }
  };

  // Determine current view from pathname
  const getCurrentView = () => {
    const { pathname } = location;
    // Find the best match in NAVIGATION_SCHEMA
    const match = NAVIGATION_SCHEMA.find(
      (item) => item.route === pathname || (item.route !== '/' && pathname.startsWith(item.route))
    );
    return match ? match.id : 'nav-dashboard';
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface relative flex flex-col">
      <KrDarkDock
        currentView={getCurrentView()}
        onViewChange={handleViewChange}
      />
      <div className="flex-1">
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
      <Footer />
    </div>
  );
};
