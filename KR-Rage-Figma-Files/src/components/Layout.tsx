import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

// ============================================================================
// LAYOUT — KERALA RAGE / SOLIDARITY MODE
// Charcoal canvas (#0F0F0F) with mesh-gradient + noise-texture atmosphere.
// Sidebar + main content area. Dark-only. No white backgrounds, ever.
// ============================================================================

const COLORS = {
  canvas: '#0F0F0F',
  surface1: '#1A1A1A',
  surface3: '#2A2A2A',
};

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div
      className="flex min-h-screen relative"
      style={{ background: COLORS.canvas }}
    >
      {/* Mesh gradient atmosphere — sits behind content */}
      <div className="fixed inset-0 -z-10 mesh-gradient pointer-events-none" />

      {/* Noise-texture atmosphere layer */}
      <div className="fixed inset-0 -z-5 noise-texture pointer-events-none" style={{ background: 'transparent' }} />

      {/* Sidebar — persistent nav */}
      <Sidebar />

      {/* Main content area */}
      <main
        className="flex-1 min-h-screen overflow-y-auto relative z-0"
        style={{
          background: 'transparent',
        }}
      >
        {/* Content padding — accounts for mobile menu button space */}
        <div className="p-6 pt-20 md:p-8 md:pt-8 lg:p-10 lg:pt-10">
          {children}
        </div>
      </main>
    </div>
  );
}
