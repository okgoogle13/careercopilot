import { createBrowserRouter } from 'react-router';
import { ProtectedLayout } from './components/ProtectedLayout';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Onboarding } from './components/Onboarding';
import { Ingestion } from './components/Ingestion';
import { Dashboard } from './components/Dashboard';
import { KanbanBoard } from './components/KanbanBoard';
import { Documents } from './components/Documents';
import { Analysis } from './components/Analysis';
import { Opportunities } from './components/Opportunities';
import { KSCGenerator } from './components/KSCGenerator';
import { AssetLibrary } from './components/AssetLibrary';
import { Settings } from './components/Settings';
import { StyleGuide } from './components/StyleGuide';

// ============================================================================
// 404 — Kerala Rage / Solidarity Mode
// ============================================================================
function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{ background: '#0F0F0F' }}
    >
      <h1
        style={{
          fontFamily: "'Fraunces', serif",
          fontVariationSettings: "'wght' 900, 'SOFT' 100, 'WONK' 1",
          fontSize: 'clamp(4rem, 10vw, 9rem)',
          color: '#F14714',
          lineHeight: 0.95,
          letterSpacing: '-0.02em',
          textTransform: 'uppercase' as const,
        }}
      >
        404
      </h1>
      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 700,
          fontSize: '12px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase' as const,
          color: '#444444',
          marginTop: '16px',
        }}
      >
        ROUTE NOT FOUND // SOLIDARITY MODE
      </p>
      <a
        href="/"
        style={{
          fontFamily: "'Work Sans', sans-serif",
          fontWeight: 700,
          fontSize: '14px',
          color: '#DAF674',
          marginTop: '32px',
          textDecoration: 'none',
          padding: '12px 28px',
          borderRadius: '16px 8px 12px 20px',
          border: '1px solid #DAF67440',
        }}
      >
        BACK TO LANDING
      </a>
    </div>
  );
}

export const router = createBrowserRouter([
  // Public full-bleed routes (no sidebar)
  { path: '/', Component: LandingPage },
  { path: '/auth', Component: AuthPage },
  { path: '/login', Component: AuthPage },
  { path: '/register', Component: AuthPage },
  { path: '/onboarding', Component: Onboarding },
  { path: '/ingestion', Component: Ingestion },

  // Protected routes (sidebar + page transitions)
  {
    Component: ProtectedLayout,
    children: [
      { path: '/dashboard', Component: Dashboard },
      { path: '/dashboard-overview', Component: Dashboard },
      { path: '/kanban', Component: KanbanBoard },
      { path: '/tracker', Component: KanbanBoard },
      { path: '/documents', Component: Documents },
      { path: '/analysis', Component: Analysis },
      { path: '/opportunities', Component: Opportunities },
      { path: '/feed', Component: Opportunities },
      { path: '/ksc-generator', Component: KSCGenerator },
      { path: '/editor', Component: Documents },
      { path: '/studio', Component: KSCGenerator },
      { path: '/asset-library', Component: AssetLibrary },
      { path: '/settings', Component: Settings },
      { path: '/style-guide', Component: StyleGuide },
      { path: '/styleguide', Component: StyleGuide },
    ],
  },

  // Catch-all 404
  { path: '*', Component: NotFound },
]);