/**
 * ELECTRIC ALCHEMIST: DRAWER COMPONENT
 * Asymmetric drawer with 0 28px 28px 0 radius
 */

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/cn';

export interface ElectricDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: 'left' | 'right';
  className?: string;
}

export const ElectricDrawer: React.FC<ElectricDrawerProps> = ({
  open,
  onClose,
  title,
  children,
  side = 'left',
  className,
}) => {
  // Prevent body scroll when drawer is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className={cn(
              'fixed top-0 bottom-0 z-40',
              'bg-surface-container',
              'border border-outline-variant',
              'w-80 max-w-[90vw]',
              'overflow-y-auto',
              side === 'left' ? 'left-0 rounded-r-[28px] border-l-0' : 'right-0 rounded-l-[28px] border-r-0',
              className
            )}
            initial={{ x: side === 'left' ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: side === 'left' ? '-100%' : '100%' }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between p-6 border-b border-outline-variant">
                <h2 className="text-hero text-hero-sm">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-outline hover:text-primary transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Content */}
            <div className="p-6 text-human">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

ElectricDrawer.displayName = 'ElectricDrawer';
