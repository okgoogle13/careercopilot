import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Fireflies } from './components/Fireflies';
import { KrDarkDock } from './components/KrDarkDock';

// Views
import { KrDarkAuth } from './views/KrDarkAuth';
import { KrDarkDashboard } from './views/KrDarkDashboard';
import { KrDarkFeed } from './views/KrDarkFeed';
import { KrDarkKanban } from './views/KrDarkKanban';
import { KrDarkLanding } from './views/KrDarkLanding'; // Renamed from KrDarkCanvas
import { KrDarkOnboarding } from './views/KrDarkOnboarding';

type KrDarkView = 'landing' | 'auth' | 'onboarding' | 'feed' | 'dashboard' | 'kanban';

/**
 * KrDarkShell
 *
 * The atmospheric container for the KeralaStreetprint Naturalist experience.
 * Orchestrates global KrDark state and visual effects.
 */
export const KrDarkShell: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const viewParam = searchParams.get('view') as KrDarkView | null;
  const [currentView, setCurrentView] = useState<KrDarkView>(viewParam || 'landing');

  // Sync state if URL changes externally (e.g. back button)
  React.useEffect(() => {
    if (viewParam && viewParam !== currentView) {
      setCurrentView(viewParam);
    }
  }, [viewParam, currentView]);

  const handleViewChange = (view: string) => {
    const newView = view as KrDarkView;
    setCurrentView(newView);
    setSearchParams({ view: newView });
  };

  const renderView = () => {
    switch (currentView) {
      case 'auth':
        return <KrDarkAuth />;
      case 'onboarding':
        return <KrDarkOnboarding />;
      case 'feed':
        return <KrDarkFeed />;
      case 'dashboard':
        return <KrDarkDashboard />;
      case 'kanban':
        return <KrDarkKanban />;
      case 'landing':
      default:
        return <KrDarkLanding />;
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-surface-asphalt-black-base text-on-surface-paper-white font-field-note antialiased selection:bg-wattle-gold selection:text-surface-asphalt-black-base">
      {/* Atmospheric Effects */}
      <Fireflies count={20} />

      {/* Background Gradient Mesh (Subtle) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(44,39,35,0.4)_0%,rgba(26,23,20,0.8)_100%)] pointer-events-none z-0" />

      {/* Floating Dock with View Switching */}
      <KrDarkDock
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
            Switch to KrDark →
          </Link>
        </div>

        {children || renderView()}
      </main>
    </div>
  );
};
