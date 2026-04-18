import React from 'react';
import { Link } from 'react-router-dom';
import { KeralaRageButton } from '../../../components/ui/KeralaRageButton';

const KR_LOGO_SRC =
  '/assets/kr-solidarity/ui-kit/svg/kr-solidarity__ui-kit__brand--careercopilot-primary-logo--v1.svg';

export const GlobalHeader: React.FC = () => {
  return (
    <header className="h-16 border-b border-[var(--kr-color-charcoal-background-steps-4)] bg-[var(--kr-color-charcoal-background-steps-3)] flex items-center justify-between px-6 shadow-sm z-20 relative">
      <div className="flex items-center gap-4">
        <Link
          to="/"
          aria-label="Kerala Rage CareerCopilot"
          className="flex items-center gap-3 rounded-strike px-2 py-1 transition-colors hover:bg-[var(--kr-color-charcoal-background-steps-4)]/70"
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
            <span className="text-[10px] font-mono uppercase tracking-widest text-secondary-flannel-dim opacity-70">
              Field Station Alpha
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-megaphone bg-[var(--kr-color-charcoal-background-steps-3)] text-ink-gold shadow-sm">
          Solidarity Mode
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
