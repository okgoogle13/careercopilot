import React from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { KrDarkDock } from './KrDarkShell/components/KrDarkDock';
import { Footer } from '../components/ui/Footer';

/**
 * MigratedRouteLayout
 *
 * A clean, authenticated shell for routes that have been promoted to KR Solidarity v6.0 standards.
 * It removes the legacy sidebar and utilizes the floating KrDarkDock for navigation.
 */
export const MigratedRouteLayout = () => {
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
      'KrDark-feed': '/opportunities',
      overview: '/job-queue',
    };
    const route = viewMap[view] || '/dashboard';
    navigate(route);
  };

  // Determine current view from pathname
  const getCurrentView = () => {
    const { pathname } = location;
    if (pathname === '/tracker') return 'KrDark-kanban';
    if (pathname === '/career/ingest') return 'KrDark-ingestion';
    if (pathname.startsWith('/analysis')) return 'lab-analysis';
    if (pathname === '/dashboard') return 'lab-dashboard';
    if (pathname === '/') return 'KrDark-landing';
    if (pathname === '/opportunities') return 'KrDark-feed';
    if (pathname === '/job-queue') return 'overview';
    return 'lab-dashboard';
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
