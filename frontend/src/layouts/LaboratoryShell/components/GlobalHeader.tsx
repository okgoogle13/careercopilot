import { useMode } from '@/hooks/use-mode';
import React from 'react';
<<<<<<< HEAD
import { NorthcoteButton } from '../../../components/ui/NorthcoteButton';
=======
import { Link } from 'react-router-dom';
import { KeralaRageButton } from '../../../components/ui/KeralaRageButton';

const KR_LOGO_SRC = '/assets/kr-solidarity/ui-kit/svg/KR-LOGO-001-primary.svg';
>>>>>>> restoration-KR-Rage-Figma-v2.0

export const GlobalHeader: React.FC = () => {
  const { mode, toggleMode } = useMode();

  return (
<<<<<<< HEAD
    <header className="h-16 border-b border-surface-laboratory-slate-smoke-highest bg-surface-laboratory-slate-smoke-high flex items-center justify-between px-6 shadow-sm z-20 relative">
      <div className="flex items-center gap-4">
        {/* Branding */}
        <div className="flex flex-col">
          <h1 className="font-proclamation text-xl text-wattle-gold tracking-tight">
            Northcote Curio
          </h1>
          <span className="text-[10px] font-annotation uppercase tracking-widest text-secondary-flannel-dim opacity-70">
            Field Station Alpha
          </span>
        </div>
=======
    <header className="h-16 border-b border-surface-KrDark-slate-smoke-highest bg-surface-KrDark-slate-smoke-high flex items-center justify-between px-6 shadow-sm z-20 relative">
      <div className="flex items-center gap-4">
        <Link
          to="/"
          aria-label="Kerala Rage CareerCopilot"
          className="flex items-center gap-3 rounded-xl px-2 py-1 transition-colors hover:bg-surface-KrDark-slate-smoke-highest/70"
        >
          <img
            src={KR_LOGO_SRC}
            alt="Kerala Rage CareerCopilot"
            className="h-auto max-h-10 w-auto rounded-lg"
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
>>>>>>> restoration-KR-Rage-Figma-v2.0
      </div>

      <div className="flex items-center gap-3">
        {/* Mode Toggle */}
<<<<<<< HEAD
        <div className="flex items-center gap-2 bg-surface-laboratory-slate-smoke-highest p-1 rounded-lg">
          <button
            onClick={() => mode !== 'gallery' && toggleMode()}
            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
              mode === 'gallery'
                ? 'bg-surface-gallery-eucalypt-smoke-high text-wattle-gold shadow-sm'
                : 'text-secondary-flannel-dim hover:text-on-surface-parchment'
            }`}
          >
            Gallery
          </button>
          <button
            onClick={() => mode !== 'laboratory' && toggleMode()}
            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
              mode === 'laboratory'
                ? 'bg-surface-laboratory-slate-smoke text-wattle-gold shadow-sm'
                : 'text-secondary-flannel-dim hover:text-on-surface-parchment'
            }`}
          >
            Laboratory
=======
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
>>>>>>> restoration-KR-Rage-Figma-v2.0
          </button>
        </div>

        {/* User / Settings Actions */}
<<<<<<< HEAD
        <NorthcoteButton
=======
        <KeralaRageButton
>>>>>>> restoration-KR-Rage-Figma-v2.0
          variant="tertiary"
          size="sm"
        >
          Settings
<<<<<<< HEAD
        </NorthcoteButton>
=======
        </KeralaRageButton>
>>>>>>> restoration-KR-Rage-Figma-v2.0
      </div>
    </header>
  );
};
