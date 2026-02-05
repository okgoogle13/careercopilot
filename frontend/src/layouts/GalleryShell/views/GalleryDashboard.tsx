import React from 'react';
import { motion } from 'framer-motion';

export const GalleryDashboard: React.FC = () => {
    return (
        <div className="relative z-20 w-full h-full p-8 max-w-6xl mx-auto mt-4">
            <h2 className="font-proclamation text-3xl text-paper-white mb-6">Command Center</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="aspect-square bg-surface-asphalt-black-light border border-secondary-flannel-dim/10 rounded-[var(--radius-pebble)] p-6 flex flex-col justify-between hover:border-primary-wattle-gold/50 transition-colors"
                    >
                        <span className="font-annotation text-xs text-secondary-flannel-dim">METRIC_0{i}</span>
                        <div className="text-4xl font-bloom text-wattle-gold">0{i * 2}%</div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
