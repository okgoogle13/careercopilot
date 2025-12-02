/**
 * ELECTRIC ALCHEMIST: TOOLTIP COMPONENT
 * Hover tooltip with no blur effects (solid shapes)
 */

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/cn';

export interface ElectricTooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const ElectricTooltip: React.FC<ElectricTooltipProps> = ({
  content,
  children,
  side = 'top',
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const sideStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={cn(
              'absolute z-30 pointer-events-none',
              sideStyles[side],
              className
            )}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <div className="bg-surface-container-high border border-outline-variant rounded-badge px-3 py-2 text-ai text-sm whitespace-nowrap shadow-xl">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

ElectricTooltip.displayName = 'ElectricTooltip';
