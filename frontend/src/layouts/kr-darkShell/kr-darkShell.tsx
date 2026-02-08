import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Fireflies } from './components/Fireflies';
import { kr-darkDock } from './components/kr-darkDock';

// Views
import { kr-darkAuth } from './views/kr-darkAuth';
import { kr-darkDashboard } from './views/kr-darkDashboard';
import { kr-darkFeed } from './views/kr-darkFeed';
import { kr-darkKanban } from './views/kr-darkKanban';
import { kr-darkLanding } from './views/kr-darkLanding'; // Renamed from kr-darkCanvas
import { kr-darkOnboarding } from './views/kr-darkOnboarding';

type kr-darkView = 'landing' | 'auth' | 'onboarding' | 'feed' | 'dashboard' | 'kanban';

/**
 * kr-darkShell
 *
 * The atmospheric container for the kerala-streetprint Naturalist experience.
 * Orchestrates global kr-dark state and visual effects.
 */
export const kr-darkShell: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const viewParam = searchParams.get('view') as kr-darkView | null;
  const [currentView, setCurrentView] = useState<kr-darkView>(viewParam || 'landing');

  // Sync state if URL changes externally (e.g. back button)
  React.useEffect(() => {
    if (viewParam && viewParam !== currentView) {
      setCurrentView(viewParam);
    }
  }, [viewParam, currentView]);

  const handleViewChange = (view: string) => {
    const newView = view as kr-darkView;
    setCurrentView(newView);
    setSearchParams({ view: newView });
  };

  const renderView = () => {
    switch (currentView) {
      case 'auth':
        return <kr-darkAuth />;
      case 'onboarding':
        return <kr-darkOnboarding />;
      case 'feed':
        return <kr-darkFeed />;
      case 'dashboard':
        return <kr-darkDashboard />;
      case 'kanban':
        return <kr-darkKanban />;
      case 'landing':
      default:
        return <kr-darkLanding />;
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-surface-asphalt-black-base text-on-surface-paper-white font-field-note antialiased selection:bg-wattle-gold selection:text-surface-asphalt-black-base">
      {/* Atmospheric Effects */}
      <Fireflies count={20} />

      {/* Background Gradient Mesh (Subtle) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(44,39,35,0.4)_0%,rgba(26,23,20,0.8)_100%)] pointer-events-none z-0" />

      {/* Floating Dock with View Switching */}
      <kr-darkDock
        currentView={currentView}
        onViewChange={handleViewChange}
      />

      {/* Main Content */}
      <main className="relative z-10 w-full min-h-screen pt-20 pb-32 overflow-y-auto">
        {/* Quick Link back to Lab (Dev only) */}
        <div className="fixed top-4 right-4 z-50 opacity-50 hover:opacity-100 transition-opacity">
          <Link
            to="/lab"
            className="text-xs font-annotation text-secondary-flannel-dim hover:text-wattle-gold"
          >
            Switch to kr-dark →
          </Link>
        </div>

        {children || renderView()}
      </main>
    </div>
  );
};
