import { useMode } from '@/hooks/use-mode';
import React from 'react';
import { KeralaRageButton } from '../../../components/ui/KeralaRageButton';

export const GlobalHeader: React.FC = () => {
  const { mode, toggleMode } = useMode();

  return (
    <header className="h-16 border-b border-surface-KrDark-slate-smoke-highest bg-surface-KrDark-slate-smoke-high flex items-center justify-between px-6 shadow-sm z-20 relative">
      <div className="flex items-center gap-4">
        {/* Branding */}
        <div className="flex flex-col">
          <h1 className="font-proclamation text-xl text-ink-gold tracking-tight">
            KeralaRage KrSolidarity
          </h1>
          <span className="text-[10px] font-annotation uppercase tracking-widest text-secondary-flannel-dim opacity-70">
            Field Station Alpha
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Mode Toggle */}
        <div className="flex items-center gap-2 bg-surface-KrDark-slate-smoke-highest p-1 rounded-lg">
          <button
            onClick={() => mode !== 'KrDark' && toggleMode()}
            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
              mode === 'KrDark'
                ? 'bg-surface-KrDark-concrete-grey-high text-ink-gold shadow-sm'
                : 'text-secondary-flannel-dim hover:text-on-surface-paper-white'
            }`}
          >
            KrDark
          </button>
          <button
            onClick={() => mode !== 'KrDark' && toggleMode()}
            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
              mode === 'KrDark'
                ? 'bg-surface-KrDark-slate-smoke text-ink-gold shadow-sm'
                : 'text-secondary-flannel-dim hover:text-on-surface-paper-white'
            }`}
          >
            KrDark
          </button>
        </div>

        {/* User / Settings Actions */}
        <KeralaRageButton
          variant="tertiary"
          size="sm"
        >
          Settings
        </KeralaRageButton>
      </div>
    </header>
  );
};
