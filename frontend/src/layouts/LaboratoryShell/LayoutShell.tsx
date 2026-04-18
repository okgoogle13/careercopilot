import React from 'react';
import { Link } from 'react-router-dom';
import { GlobalHeader } from './components/GlobalHeader';
import { MainCanvas } from './components/MainCanvas';
import { NavRail } from './components/NavRail';
import { SidePanel } from './components/SidePanel';

const KR_LOGO_SRC =
  '/assets/kr-solidarity/ui-kit/svg/kr-solidarity__ui-kit__brand--careercopilot-primary-logo--v1.svg';

/**
 * LayoutShell
 *
 * The primary container for the KrDark Workspace.
 * Orchestrates the grid layout and provides the ModeContext.
 */
export const LayoutShell: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--kr-color-charcoal-background-steps-3)] text-on-surface-paper-white font-primary antialiased">
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
          <aside className="flex-none w-80 border-l border-[var(--kr-color-charcoal-background-steps-4)] bg-[var(--kr-color-charcoal-background-steps-3)] z-10 hidden lg:block">
            <SidePanel />
          </aside>
        </div>

        <footer className="flex-none border-t border-[var(--kr-color-charcoal-background-steps-4)] bg-[var(--kr-color-charcoal-background-steps-3)] px-6 py-4">
          <Link
            to="/"
            aria-label="Kerala Rage CareerCopilot"
            className="flex items-center justify-center gap-3 lg:justify-start"
          >
            <img
              src={KR_LOGO_SRC}
              alt="Kerala Rage CareerCopilot"
              className="h-auto max-h-[60px] w-auto rounded-strike"
            />
            <div className="flex flex-col">
              <span className="font-proclamation text-sm uppercase tracking-[0.2em] text-ink-gold">
                Built with Solidarity
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-secondary-flannel-dim">
                Navigation and workspace shell branding
              </span>
            </div>
          </Link>
        </footer>
      </div>
    </div>
  );
};
