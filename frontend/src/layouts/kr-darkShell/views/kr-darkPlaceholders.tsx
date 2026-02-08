import React from 'react';

export const kr-darkAuth: React.FC = () => <div className="p-8 text-center">Auth View Placeholder</div>;
export const kr-darkOnboarding: React.FC = () => <div className="p-8 text-center">Onboarding View Placeholder</div>;
export const kr-darkDashboard: React.FC = () => <div className="p-8 text-center">Dashboard View Placeholder</div>;
export const kr-darkKanban: React.FC = () => <div className="p-8 text-center">Kanban View Placeholder</div>;

export const kr-darkPlaceholders: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center p-12 text-secondary-flannel-dim">
        <div className="max-w-md text-center space-y-2">
            <h2 className="font-bloom text-2xl text-paper-white">kr-dark Placeholders</h2>
            <p className="text-sm font-field-note">
                Placeholder view awaiting curated kr-motifs and kr-dark content.
            </p>
        </div>
    </div>
);

export default kr-darkPlaceholders;
