import React from 'react';
import { AnalysisAnchor } from './anchors/AnalysisAnchor';
import { DocumentStackAnchor } from './anchors/DocumentStackAnchor';

export const MainCanvas: React.FC = () => {
    return (
        <div className="p-8 w-full h-full overflow-y-auto">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">

                {/* Intro / Breadcrumbs */}
                <div className="mb-4">
<<<<<<< HEAD
                    <h2 className="font-bloom text-2xl text-wattle-gold">Active Analysis</h2>
                    <p className="font-field-note text-secondary-flannel-flower opacity-80">
=======
                    <h2 className="font-bloom text-2xl text-ink-gold">Active Analysis</h2>
                    <p className="font-field-note text-secondary-concrete-grey opacity-80">
>>>>>>> restoration-KR-Rage-Figma-v2.0
                        Session ID: #L-ALPHA-01
                    </p>
                </div>

                {/* Primary Analysis Zone */}
                <section className="flex-1 min-h-[500px]">
                    <AnalysisAnchor />
                </section>

                {/* Supporting Documents Zone */}
                <section className="h-[300px]">
                    <DocumentStackAnchor />
                </section>
            </div>
        </div>
    );
};
