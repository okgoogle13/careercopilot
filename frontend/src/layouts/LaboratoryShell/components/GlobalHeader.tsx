import { useMode } from '@/hooks/use-mode';
import React from 'react';
import { kerala-rageButton } from '../../../components/ui/kerala-rageButton';

export const GlobalHeader: React.FC = () => {
  const { mode, toggleMode } = useMode();

  return (
    <header className="h-16 border-b border-surface-kr-dark-slate-smoke-highest bg-surface-kr-dark-slate-smoke-high flex items-center justify-between px-6 shadow-sm z-20 relative">
      <div className="flex items-center gap-4">
        {/* Branding */}
        <div className="flex flex-col">
          <h1 className="font-proclamation text-xl text-wattle-gold tracking-tight">
            kerala-rage kr-solidarity
          </h1>
          <span className="text-[10px] font-annotation uppercase tracking-widest text-secondary-flannel-dim opacity-70">
            Field Station Alpha
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Mode Toggle */}
        <div className="flex items-center gap-2 bg-surface-kr-dark-slate-smoke-highest p-1 rounded-lg">
          <button
            onClick={() => mode !== 'kr-dark' && toggleMode()}
            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
              mode === 'kr-dark'
                ? 'bg-surface-kr-dark-concrete-grey-high text-wattle-gold shadow-sm'
                : 'text-secondary-flannel-dim hover:text-on-surface-paper-white'
            }`}
          >
            kr-dark
          </button>
          <button
            onClick={() => mode !== 'kr-dark' && toggleMode()}
            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
              mode === 'kr-dark'
                ? 'bg-surface-kr-dark-slate-smoke text-wattle-gold shadow-sm'
                : 'text-secondary-flannel-dim hover:text-on-surface-paper-white'
            }`}
          >
            kr-dark
          </button>
        </div>

        {/* User / Settings Actions */}
        <kerala-rageButton
          variant="tertiary"
          size="sm"
        >
          Settings
        </kerala-rageButton>
      </div>
    </header>
  );
};
