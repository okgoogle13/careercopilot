import React from 'react';
import { motion } from 'framer-motion';

export const KrDarkAuth: React.FC = () => {
    return (
        <div className="relative z-20 w-full h-full flex flex-col items-center justify-center p-8 text-center bg-surface-asphalt-black-light/50 backdrop-blur-sm rounded-[var(--radius-stone)] border border-primary-wattle-gold/20 max-w-md mx-auto mt-20">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="font-bloom text-3xl text-wattle-gold mb-4">Authentication</h2>
                <p className="font-field-note text-secondary-concrete-grey opacity-80 mb-6">
                    [Placeholder] Secure entry to the collection.
                </p>
                <div className="p-4 border border-dashed border-secondary-flannel-dim rounded-lg h-24 flex items-center justify-center">
                    Login Form Zone
                </div>
            </motion.div>
        </div>
    );
};
