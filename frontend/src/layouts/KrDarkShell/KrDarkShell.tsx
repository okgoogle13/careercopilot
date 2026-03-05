import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Fireflies } from './components/Fireflies';
import { KrDarkDock } from './components/KrDarkDock';

// Views
import { KrDarkAuth } from './views/KrDarkAuth';
import { KrDarkDashboard } from './views/KrDarkDashboard';
import { KrDarkFeed } from './views/KrDarkFeed';
import { KrDarkKanban } from './views/KrDarkKanban';
import { KrDarkLanding } from './views/KrDarkLanding';
import { KrDarkOnboarding } from './views/KrDarkOnboarding';
import { KrDarkIngestion } from './views/KrDarkIngestion';
import { KrDarkAnalysis } from './views/KrDarkAnalysis';
import { KrDarkSearch } from './views/KrDarkSearch';
import { KrDarkApplication } from './views/KrDarkApplication';
import { KrDarkEditor } from './views/KrDarkEditor';
import { KrDarkSettings } from './views/KrDarkSettings';
import { KrDarkProfile } from './views/KrDarkProfile';
import { KrDarkDesigner } from './views/KrDarkDesigner';

type KrDarkView =
  | 'landing'
  | 'auth'
  | 'onboarding'
  | 'feed'
  | 'dashboard'
  | 'kanban'
  | 'ingestion'
  | 'analysis'
  | 'search'
  | 'application'
  | 'editor'
  | 'settings'
  | 'profile'
  | 'designer';

/**
 * KrDarkShell
 *
 * The atmospheric container for the active Kerala Rage shell.
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
      case 'ingestion':
        return <KrDarkIngestion />;
      case 'analysis':
        return <KrDarkAnalysis />;
      case 'search':
        return <KrDarkSearch />;
      case 'application':
        return <KrDarkApplication />;
      case 'editor':
        return <KrDarkEditor />;
      case 'settings':
        return <KrDarkSettings />;
      case 'profile':
        return <KrDarkProfile />;
      case 'designer':
        return <KrDarkDesigner />;
      case 'landing':
      default:
        return <KrDarkLanding />;
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-surface-asphalt-black-base text-on-surface-paper-white font-primary antialiased selection:bg-ink-gold selection:text-surface-asphalt-black-base">
      {/* Atmospheric Effects */}
      <Fireflies count={20} />

      {/* Background Gradient Mesh (Subtle) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--sys-color-solidaritySmokeOrange-base)_0%,var(--sys-color-charcoalBackground-base)_100%)] opacity-20 pointer-events-none z-0" />

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
            className="text-xs font-annotation text-secondary-ash-dim hover:text-ink-gold"
          >
            Switch to KrDark →
          </Link>
        </div>

        {children || renderView()}
      </main>
    </div>
  );
};
