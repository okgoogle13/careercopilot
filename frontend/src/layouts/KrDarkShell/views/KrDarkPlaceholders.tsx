import React from 'react';

export const KrDarkAuth: React.FC = () => (
  <div className="p-8 text-center">Auth View Placeholder</div>
);
export const KrDarkOnboarding: React.FC = () => (
  <div className="p-8 text-center">Onboarding View Placeholder</div>
);
export const KrDarkDashboard: React.FC = () => (
  <div className="p-8 text-center">Dashboard View Placeholder</div>
);
export const KrDarkKanban: React.FC = () => (
  <div className="p-8 text-center">Kanban View Placeholder</div>
);

export const KrDarkPlaceholders: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center p-12 text-secondary-flannel-dim">
    <div className="max-w-md text-center space-y-2">
      <h2 className="font-display text-2xl text-paper-white">KrDark Placeholders</h2>
      <p className="text-sm font-primary">
        Placeholder view awaiting curated content and finalized layouts.
      </p>
    </div>
  </div>
);

export default KrDarkPlaceholders;
