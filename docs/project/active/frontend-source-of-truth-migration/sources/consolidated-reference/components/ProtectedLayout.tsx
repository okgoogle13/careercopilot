import { Outlet, useLocation, Navigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Layout } from './Layout';

// ============================================================================
// PROTECTED LAYOUT — KERALA RAGE / SOLIDARITY MODE
// Wraps authenticated routes with sidebar + page transition animation.
// ============================================================================

const M3_EXPRESSIVE = [0.34, 1.56, 0.64, 1] as const;

export function ProtectedLayout() {
  const isAuthenticated = true; // Mock auth state
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
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
            ease: M3_EXPRESSIVE,
          }}
          className="min-h-screen"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}
