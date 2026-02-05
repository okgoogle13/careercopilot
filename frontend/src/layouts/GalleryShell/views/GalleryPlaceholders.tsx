import React from 'react';

export const GalleryAuth: React.FC = () => <div className="p-8 text-center">Auth View Placeholder</div>;
export const GalleryOnboarding: React.FC = () => <div className="p-8 text-center">Onboarding View Placeholder</div>;
export const GalleryDashboard: React.FC = () => <div className="p-8 text-center">Dashboard View Placeholder</div>;
export const GalleryKanban: React.FC = () => <div className="p-8 text-center">Kanban View Placeholder</div>;

export const GalleryPlaceholders: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center p-12 text-secondary-flannel-dim">
        <div className="max-w-md text-center space-y-2">
            <h2 className="font-bloom text-2xl text-paper-white">Gallery Placeholders</h2>
            <p className="text-sm font-field-note">
                Placeholder view awaiting curated specimens and gallery content.
            </p>
        </div>
    </div>
);

export default GalleryPlaceholders;
