import { createBrowserRouter, Link } from 'react-router';
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
import { Logo } from './components/Logo';

// ============================================================================
// 404 — Kerala Rage / Solidarity Mode
// Scaffold: high-level screen layer
// ============================================================================
function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{ background: 'var(--sys-color-charcoalBackground-steps-0)' }}
    >
      <Logo variant="icon" size={120} className="mb-12" />
      <h1
        style={{
          fontFamily: "var(--sys-type-fontFamilies-display), serif",
          fontVariationSettings: "'wght' 900, 'SOFT' 100, 'WONK' 1",
          fontSize: 'clamp(4rem, 10vw, 9rem)',
          color: 'var(--sys-color-solidarityRed-base)',
          lineHeight: 0.95,
          letterSpacing: '-0.02em',
          textTransform: 'uppercase' as const,
        }}
      >
        404
      </h1>
      <p
        style={{
          fontFamily: "var(--sys-type-fontFamilies-mono), monospace",
          fontVariationSettings: "'wght' 700",
          fontSize: '12px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase' as const,
          color: 'var(--sys-color-worker-ash-steps-1)',
          marginTop: '16px',
        }}
      >
        ROUTE NOT FOUND // SOLIDARITY MODE
      </p>
      <Link
        to="/"
        style={{
          fontFamily: "var(--sys-type-fontFamilies-primary), system-ui, sans-serif",
          fontVariationSettings: "'wght' 700",
          fontSize: '14px',
          color: 'var(--sys-color-inkGold-base)',
          marginTop: '32px',
          textDecoration: 'none',
          padding: '12px 28px',
          borderRadius: 'var(--sys-shape-marchSurge01)',
          border: '1px solid rgba(218, 246, 116, 0.25)',
        }}
      >
        BACK TO HOME
      </Link>
    </div>
  );
}

export const router = createBrowserRouter([
  // ── Public full-bleed routes (no sidebar) ────────────────────────────────
  // Scaffold: Home
  { path: '/',          Component: LandingPage },
  { path: '/auth',      Component: AuthPage },
  { path: '/login',     Component: AuthPage },
  { path: '/register',  Component: AuthPage },
  { path: '/onboarding',Component: Onboarding },

  // Scaffold: Smart Ingestion (public onboarding flow)
  { path: '/career/ingest', Component: Ingestion },
  { path: '/ingestion',     Component: Ingestion }, // legacy alias

  // ── Protected routes (sidebar + page transitions) ─────────────────────────
  {
    Component: ProtectedLayout,
    children: [
      // Scaffold: Operations Dashboard
      { path: '/dashboard',          Component: Dashboard },
      { path: '/dashboard-overview', Component: Dashboard },  // legacy alias

      // Scaffold: The Lookout
      { path: '/opportunities', Component: Opportunities },
      { path: '/feed',          Component: Opportunities },   // legacy alias

      // Scaffold: Campaign Kanban
      { path: '/tracker', Component: KanbanBoard },
      { path: '/kanban',  Component: KanbanBoard },           // legacy alias

      // Scaffold: Analysis Workbench
      { path: '/analysis', Component: Analysis },

      // Scaffold: Account Control
      { path: '/profile',   Component: Settings },
      { path: '/settings',  Component: Settings },            // legacy alias

      // Scaffold: Documents / KSC (secondary tools)
      { path: '/documents',     Component: Documents },
      { path: '/editor',        Component: Documents },       // legacy alias
      { path: '/ksc-generator', Component: KSCGenerator },
      { path: '/studio',        Component: KSCGenerator },    // legacy alias
      { path: '/asset-library', Component: AssetLibrary },

      // Style Guide (utility)
      { path: '/style-guide', Component: StyleGuide },
      { path: '/styleguide',  Component: StyleGuide },
    ],
  },

  // Catch-all 404
  { path: '*', Component: NotFound },
]);
