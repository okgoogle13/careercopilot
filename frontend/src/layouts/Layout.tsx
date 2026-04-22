import { ReactNode } from 'react';
import { Sidebar } from './shared/Sidebar';

// ============================================================================
// LAYOUT — KERALA RAGE / SOLIDARITY MODE
// Desktop-first. Sidebar always visible. Min canvas: 1024px.
// Optimised for 1280px–1920px (laptops → wide monitors).
// Window scroll only — required for Framer Motion useScroll.
// ============================================================================

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        minWidth: '1024px',
        background: 'var(--kr-color-charcoal-background-base)',
        position: 'relative',
      }}
    >
      {/* Atmosphere: mesh gradient */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background: `
            radial-gradient(ellipse 80% 50% at 20% 40%, rgba(241,71,20,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 80%, rgba(218,246,116,0.03) 0%, transparent 50%)
          `,
        }}
      />
      {/* Atmosphere: noise texture */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Sidebar — sticky, always visible */}
      <Sidebar />

      {/* Main content — window scroll, capped for readability */}
      <main
        style={{
          flex: 1,
          minHeight: '100vh',
          overflowX: 'hidden',
          position: 'relative',
          zIndex: 1,
          background: 'transparent',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            width: '100%',
            padding: '40px 48px 80px 48px',
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
