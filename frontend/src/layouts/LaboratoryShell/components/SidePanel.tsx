import React from 'react';

export const SidePanel: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-surface-KrDark-slate-smoke-highest">
        <h3 className="font-display text-lg text-ink-gold">Context</h3>
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="mb-6 relative">
          <div className="relative rounded-strike overflow-hidden shadow-lg border-2 border-surface-KrDark-slate-smoke-highest bg-surface-KrDark-charcoal-slate max-w-[120px] mx-auto"></div>
        </div>
        <div className="p-4 border border-dashed border-secondary-flannel-dim rounded-pebble text-secondary-flannel-dim text-sm font-mono text-center opacity-60">
          [Context Properties Panel]
        </div>
      </div>
    </div>
  );
};
