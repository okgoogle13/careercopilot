/* eslint-disable */
import React from 'react';
import { SidebarNav } from './SidebarNav';

type Props = {
  children: React.ReactNode;
  onLogout: () => void;
  activeTab: 'WORKSPACE' | 'PROFILE' | 'PAST' | 'STUDIO' | 'LIBRARY';
  onTabChange: (tab: 'WORKSPACE' | 'PROFILE' | 'PAST' | 'STUDIO' | 'LIBRARY') => void;
};

export function AppShell({ children, onLogout, activeTab, onTabChange }: Props) {
  return (
    <div
      className="min-h-screen flex flex-col text-[var(--sys-color-worker-ash-base)] font-sans"
      style={{ background: 'var(--sys-color-charcoalBackground-base)' }}
    >
      {/* Top Navigation Bar */}
      <header
        className="h-[80px] fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 min-[600px]:px-8 border-b"
        style={{
          background: 'var(--sys-color-charcoalBackground-steps-1)',
          borderColor: 'var(--sys-color-outline-variant)',
        }}
      >
        <div className="flex items-center">
          <h1 className="text-2xl min-[600px]:text-4xl type-solidarityProtest text-[var(--sys-color-paperWhite-base)] uppercase tracking-tighter leading-none">
            Career<span className="text-[var(--sys-color-solidarityRed-base)]">Copilot</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="w-10 h-10 min-[600px]:w-12 min-[600px]:h-12 bg-[var(--sys-color-charcoalBackground-steps-2)] border overflow-hidden flex items-center justify-center"
            style={{
              borderRadius: 'var(--sys-shape-cutoutRiot01)',
              borderColor: 'var(--sys-color-outline-variant)',
            }}
          >
            <img
              src="https://picsum.photos/seed/worker/100/100"
              alt="User Avatar"
              className="w-full h-full object-cover grayscale opacity-80"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-[80px] max-[599px]:pb-[80px]">
        <SidebarNav
          onLogout={onLogout}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
        <main className="flex-1 min-[600px]:ml-[80px] min-[1200px]:ml-[360px] relative min-h-[calc(100vh-80px)]">
          {/* Grit Particle Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
          <div className="relative z-10 w-full max-w-[1200px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
