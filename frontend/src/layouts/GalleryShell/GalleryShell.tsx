import React, { useState } from 'react';
import { ModeProvider } from '../../context/ModeContext';
import { Fireflies } from './components/Fireflies';
import { GalleryDock } from './components/GalleryDock';
import { Link, useSearchParams } from 'react-router-dom';

// Views
import { GalleryLanding } from './views/GalleryLanding'; // Renamed from GalleryCanvas
import { GalleryAuth } from './views/GalleryAuth';
import { GalleryOnboarding } from './views/GalleryOnboarding';
import { GalleryFeed } from './views/GalleryFeed';
import { GalleryDashboard } from './views/GalleryDashboard';
import { GalleryKanban } from './views/GalleryKanban';

type GalleryView = 'landing' | 'auth' | 'onboarding' | 'feed' | 'dashboard' | 'kanban';

/**
 * GalleryShell
 * 
 * The atmospheric container for the Victorian Naturalist experience.
 * Orchestrates global gallery state and visual effects.
 */
export const GalleryShell: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const viewParam = searchParams.get('view') as GalleryView | null;
    const [currentView, setCurrentView] = useState<GalleryView>(viewParam || 'landing');

    // Sync state if URL changes externally (e.g. back button)
    React.useEffect(() => {
        if (viewParam && viewParam !== currentView) {
            setCurrentView(viewParam);
        }
    }, [viewParam, currentView]);

    const handleViewChange = (view: string) => {
        const newView = view as GalleryView;
        setCurrentView(newView);
        setSearchParams({ view: newView });
    };

    const renderView = () => {
        switch (currentView) {
            case 'auth': return <GalleryAuth />;
            case 'onboarding': return <GalleryOnboarding />;
            case 'feed': return <GalleryFeed />;
            case 'dashboard': return <GalleryDashboard />;
            case 'kanban': return <GalleryKanban />;
            case 'landing':
            default: return <GalleryLanding />;
        }
    };

    return (
        <ModeProvider initialMode="gallery">
            <div className="relative min-h-screen w-full overflow-hidden bg-surface-specimen-night-base text-on-surface-parchment font-field-note antialiased selection:bg-wattle-gold selection:text-surface-specimen-night-base">

                {/* Atmospheric Effects */}
                <Fireflies count={20} />

                {/* Background Gradient Mesh (Subtle) */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(44,39,35,0.4)_0%,rgba(26,23,20,0.8)_100%)] pointer-events-none z-0" />

                {/* Floating Dock with View Switching */}
                <GalleryDock currentView={currentView} onViewChange={handleViewChange} />

                {/* Main Content */}
                <main className="relative z-10 w-full min-h-screen pt-20 pb-32 overflow-y-auto">
                    {/* Quick Link back to Lab (Dev only) */}
                    <div className="fixed top-4 right-4 z-50 opacity-50 hover:opacity-100 transition-opacity">
                        <Link to="/lab" className="text-xs font-annotation text-secondary-flannel-dim hover:text-wattle-gold">Switch to Laboratory →</Link>
                    </div>

                    {children || renderView()}
                </main>

            </div>
        </ModeProvider>
    );
};
