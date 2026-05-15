import React from 'react';
import { motion } from 'framer-motion';

import { NAVIGATION_SCHEMA } from '../../../config/navigation.schema';

interface KrDarkDockProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const KrDarkDock: React.FC<KrDarkDockProps> = ({ currentView, onViewChange }) => {
  const navItems = NAVIGATION_SCHEMA.filter(
    (item) => item.modeAvailability === 'KrDark' || item.modeAvailability === 'both'
  );

  return (
    <motion.nav
      className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-[var(--radius-march-open)] border border-ink-gold/25 bg-[var(--kr-color-charcoal-background-steps-3)]/80 px-6 py-3 backdrop-blur-3xl"
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
              px-4 py-2 text-sm font-primary font-medium rounded-[var(--radius-march-open)] transition-all
              ${
                isActive
                  ? 'bg-ink-gold text-surface-asphalt-black-base shadow-elevated'
                  : 'text-paper-white hover:bg-[var(--kr-color-charcoal-background-steps-3)]/50'
              }
            `}
          >
            {item.label}
          </button>
        );
      })}
    </motion.nav>
  );
};
