import { useMode } from '@/hooks/use-mode';
import React from 'react';
import { Link } from 'react-router-dom';
import { KeralaRageButton } from '../../../components/ui/KeralaRageButton';

const KR_LOGO_SRC =
  '/assets/kr-solidarity/ui-kit/svg/kr-solidarity__ui-kit__brand--careercopilot-primary-logo--v1.svg';

export const GlobalHeader: React.FC = () => {
  const { mode, toggleMode } = useMode();

  return (
    <header className="h-16 border-b border-surface-KrDark-slate-smoke-highest bg-surface-KrDark-slate-smoke-high flex items-center justify-between px-6 shadow-sm z-20 relative">
      <div className="flex items-center gap-4">
        <Link
          to="/"
          aria-label="Kerala Rage CareerCopilot"
          className="flex items-center gap-3 rounded-strike px-2 py-1 transition-colors hover:bg-surface-KrDark-slate-smoke-highest/70"
        >
          <img
            src={KR_LOGO_SRC}
            alt="Kerala Rage CareerCopilot"
            className="h-auto max-h-10 w-auto rounded-pebble"
          />
          <div className="flex flex-col">
            <h1 className="font-proclamation text-xl text-ink-gold tracking-tight">
              KeralaRage KrSolidarity
            </h1>
            <span className="text-[10px] font-annotation uppercase tracking-widest text-secondary-flannel-dim opacity-70">
              Field Station Alpha
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {/* Mode Toggle */}
        <div className="flex items-center gap-2 bg-surface-KrDark-slate-smoke-highest p-1 rounded-pebble">
          <button
            onClick={() => mode !== 'KrDark' && toggleMode()}
            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-stone transition-all ${
              mode === 'KrDark'
                ? 'bg-surface-KrDark-concrete-grey-high text-ink-gold shadow-sm'
                : 'text-secondary-flannel-dim hover:text-on-surface-paper-white'
            }`}
          >
            KrDark
          </button>
          <button
            onClick={() => mode !== 'KrDark' && toggleMode()}
            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-stone transition-all ${
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
