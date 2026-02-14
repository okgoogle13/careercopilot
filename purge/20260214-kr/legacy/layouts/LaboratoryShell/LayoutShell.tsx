import React from 'react';
import { GlobalHeader } from './components/GlobalHeader';
import { MainCanvas } from './components/MainCanvas';
import { NavRail } from './components/NavRail';
import { SidePanel } from './components/SidePanel';

/**
 * LayoutShell
 *
 * The primary container for the KrDark Workspace.
 * Orchestrates the grid layout and provides the ModeContext.
 */
export const LayoutShell: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface-KrDark-slate-smoke-high text-on-surface-paper-white font-body antialiased">
      {/* Nav Rail - Fixed Width Left */}
      <div className="flex-none z-30">
        <NavRail />
      </div>

      {/* Main Content Area - Flex Column */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header - Top */}
        <div className="flex-none z-20">
          <GlobalHeader />
        </div>

        {/* Canvas & Side Panel Container */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Main Canvas - Flexible Center */}
          <main className="flex-1 overflow-auto relative z-0">{children || <MainCanvas />}</main>

          {/* Side Panel - Fixed Width Right (Collapsible logic to be added later) */}
          <aside className="flex-none w-80 border-l border-surface-KrDark-slate-smoke-highest bg-surface-KrDark-slate-smoke-high z-10 hidden lg:block">
            <SidePanel />
          </aside>
        </div>
      </div>
    </div>
  );
};
