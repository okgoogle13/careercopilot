import React from 'react';
import { motion } from 'framer-motion';

import { NAVIGATION_SCHEMA } from '../../../config/navigation.schema';

interface GalleryDockProps {
    currentView: string;
    onViewChange: (view: string) => void;
}

export const GalleryDock: React.FC<GalleryDockProps> = ({ currentView, onViewChange }) => {
    const navItems = NAVIGATION_SCHEMA.filter(item =>
        item.modeAvailability === 'gallery' || item.modeAvailability === 'both'
    );

    return (
        <motion.nav
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 flex items-center gap-4"
            style={{
                background: 'rgba(44, 39, 35, 0.75)',
                backdropFilter: 'blur(32px)',
                borderRadius: 'var(--radius-pebble)',
                border: '1px solid rgba(212, 168, 75, 0.25)',
            }}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                duration: 0.8,
                delay: 0.5,
                ease: [0.45, 0.05, 0.55, 0.95],
            }}
        >
            {navItems.map((item) => {
                const isActive = currentView === item.id;
                return (
                    <button
                        key={item.id}
                        onClick={() => onViewChange(item.id)}
                        className={`
              px-4 py-2 text-sm font-field-note font-medium rounded-[var(--radius-pebble)] transition-all
              ${isActive
                                ? 'bg-primary-wattle-gold text-surface-specimen-night-base shadow-elevated'
                                : 'text-primary-parchment hover:bg-surface-gallery-eucalypt-smoke-high/50'}
            `}
                    >
                        {item.label}
                    </button>
                );
            })}
        </motion.nav>
    );
};
