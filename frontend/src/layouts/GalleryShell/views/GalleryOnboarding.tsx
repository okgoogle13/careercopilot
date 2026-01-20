import React from 'react';
import { motion } from 'framer-motion';

export const GalleryOnboarding: React.FC = () => {
    return (
        <div className="relative z-20 w-full h-full flex flex-col items-center justify-center p-12 text-center">
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl bg-surface-specimen-night-light p-8 rounded-[var(--radius-leaf)] border border-primary-wattle-gold/10"
            >
                <h2 className="font-proclamation text-4xl text-primary-parchment mb-4">Welcome, Naturalist.</h2>
                <p className="font-field-note text-secondary-flannel-flower text-lg mb-8 leading-relaxed">
                    [Placeholder] Guided onboarding flow to initialize your collection parameters.
                </p>
                <div className="grid grid-cols-3 gap-4">
                    <div className="h-32 bg-surface-specimen-night-dark rounded-lg flex items-center justify-center text-sm border border-dashed border-secondary-flannel-dim opacity-50">Step 1</div>
                    <div className="h-32 bg-surface-specimen-night-dark rounded-lg flex items-center justify-center text-sm border border-dashed border-secondary-flannel-dim opacity-50">Step 2</div>
                    <div className="h-32 bg-surface-specimen-night-dark rounded-lg flex items-center justify-center text-sm border border-dashed border-secondary-flannel-dim opacity-50">Step 3</div>
                </div>
            </motion.div>
        </div>
    );
};
