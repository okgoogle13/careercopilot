/**
 * ELECTRIC ALCHEMIST: POPOVER COMPONENT
 * Click-triggered contextual popup
 */

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/cn';

export interface ElectricPopoverProps {
  trigger: React.ReactElement;
  content: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const ElectricPopover: React.FC<ElectricPopoverProps> = ({
  trigger,
  content,
  side = 'bottom',
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const sideStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative inline-block" ref={popoverRef}>
      {React.cloneElement(trigger, {
        onClick: () => setIsOpen(!isOpen),
      })}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={cn(
              'absolute z-30',
              sideStyles[side],
              className
            )}
            initial={{ opacity: 0, scale: 0.95, y: side === 'top' ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: side === 'top' ? 10 : -10 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
          >
            <div className="bg-surface-container-high border border-outline-variant rounded-card p-4 shadow-xl min-w-[200px]">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

ElectricPopover.displayName = 'ElectricPopover';
