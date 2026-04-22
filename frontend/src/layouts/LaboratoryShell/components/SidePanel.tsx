import React from 'react';

export const SidePanel: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-[var(--kr-color-charcoal-background-steps-4)]">
        <h3 className="font-display text-lg text-ink-gold">Context</h3>
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="mb-6 relative">
          <div className="relative rounded-strike overflow-hidden shadow-lg border-2 border-[var(--kr-color-charcoal-background-steps-4)] bg-[var(--kr-color-charcoal-background-steps-1)] max-w-[120px] mx-auto"></div>
        </div>
        <div className="p-4 border border-dashed border-secondary-flannel-dim rounded-march text-secondary-flannel-dim text-sm font-mono text-center opacity-60">
          [Context Properties Panel]
        </div>
      </div>
    </div>
  );
};
