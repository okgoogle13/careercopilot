import React, { useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { SolidaritySidebar } from './shared/SolidaritySidebar';
import { Footer } from './shared/Footer';
import { BannerTexture } from '@/components/kerala-rage/BannerTexture';
import { Logo } from '@/components/ui/Logo';

/**
 * MigratedRouteLayout
 *
 * KR Solidarity v6.0 Canonical Layout Shell.
 * Replaces legacy bottom-dock with fixed-left SolidaritySidebar and BannerTexture.
 */
export const MigratedRouteLayout = () => {
  const location = useLocation();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-charcoalBackground-base text-worker-ash-base relative flex">
      {/* Global Texture Layer */}
      <BannerTexture />

      {/* Persistent Sidebar (Desktop) */}
      <SolidaritySidebar />

      {/* Mobile Drawer Sidebar */}
      <SolidaritySidebar
        isMobileDrawer={true}
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-concreteGrey-steps-1 bg-charcoalBackground-base/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-march bg-charcoalBackground-steps-2 border border-concreteGrey-steps-1 flex items-center justify-center">
              <Logo
                size="sm"
                showText={false}
                className="mb-0"
              />
            </div>
            <span className="text-xs font-black uppercase tracking-tight">CareerCopilot</span>
          </div>

          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="p-2 rounded-march bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-worker-ash-base"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 relative z-10 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, scale: 0.98, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -12 }}
              transition={{
                duration: 0.45,
                ease: [0.175, 0.885, 0.32, 1.1],
              }}
              className="p-6 md:p-10"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer className="relative z-10 border-concreteGrey-steps-1" />
      </div>
    </div>
  );
};
