/**
 * ELECTRIC ALCHEMIST: APP SHELL COMPONENT
 *
 * Responsive layout with fixed sidebar on desktop and main content area.
 * Uses Electric Alchemist Design System tokens:
 * - Sidebar: bg-surface-container with asymmetric radius (0 28px 28px 0)
 * - Main: bg-surface
 * - Responsive: Sidebar fixed on desktop (lg:), hidden on mobile
 */

import React from 'react';
import { motion } from 'framer-motion';

export interface AppShellProps {
  /**
   * Main content to render in the content area
   */
  children: React.ReactNode;
  /**
   * Optional sidebar content
   */
  sidebarContent?: React.ReactNode;
}

/**
 * AppShell Component
 *
 * Implements the primary surface color and font family from tokens.
 * Sidebar is fixed on larger screens (lg: 1024px+) and hidden on mobile.
 *
 * @example
 * <AppShell sidebarContent={<Navigation />}>
 *   <DashboardContent />
 * </AppShell>
 */
export const AppShell: React.FC<AppShellProps> = ({ children, sidebarContent }) => {
  return (
    <div className="min-h-screen flex bg-surface">
      {/* 1. ASYMMETRIC SIDEBAR (Fixed on larger screens) */}
      <motion.aside
        className="fixed left-0 top-0 hidden h-full w-[280px] flex-col bg-surface-container shadow-2xl lg:flex"
        // Asymmetric Radius: 0 28px 28px 0 (implemented via custom style since Tailwind doesn't support T-R-B-L natively)
        style={{ borderRadius: '0 28px 28px 0' }}
      >
        <div className="p-6">
          <h2 className="text-xl text-hero text-primary">A.E. System</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{sidebarContent}</div>
      </motion.aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 lg:ml-[280px] p-8">{children}</main>
    </div>
  );
};

export default AppShell;
