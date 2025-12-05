/**
 * ELECTRIC ALCHEMIST: TOOLTIP COMPONENT
 *
 * Tooltip with design system tokens and framer-motion animations.
 * Uses z-tooltip for overlay and animate-in fade-in zoom-in-95.
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delayMs?: number;
  children: React.ReactNode;
}

const sideClasses = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
};

const arrowClasses = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-surface-container border-l-transparent border-r-transparent border-b-transparent',
  right: 'right-full top-1/2 -translate-y-1/2 border-r-surface-container border-t-transparent border-b-transparent border-l-transparent',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-surface-container border-l-transparent border-r-transparent border-t-transparent',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-surface-container border-t-transparent border-b-transparent border-r-transparent',
};

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  (
    { title, side = 'top', delayMs = 200, children, className, ...props },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout>();

    const handleMouseEnter = () => {
      timeoutRef.current = setTimeout(() => setOpen(true), delayMs);
    };

    const handleMouseLeave = () => {
      clearTimeout(timeoutRef.current);
      setOpen(false);
    };

    useEffect(() => {
      return () => clearTimeout(timeoutRef.current);
    }, []);

    return (
      <div
        ref={ref}
        className={cn('relative inline-block', className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={cn(
                'absolute z-tooltip',
                sideClasses[side],
                'px-3 py-1.5',
                'bg-surface-container border border-outline-variant',
                'rounded-[8px]',
                'text-ai text-xs text-on-surface',
                'shadow-lg',
                'pointer-events-none'
              )}
              role="tooltip"
            >
              {title}
              {/* Arrow */}
              <div
                className={cn(
                  'absolute w-0 h-0 border-4',
                  arrowClasses[side]
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Tooltip.displayName = 'Tooltip';

export interface TooltipTriggerProps
  extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

export const TooltipTrigger = React.forwardRef<
  HTMLElement,
  TooltipTriggerProps
>(({ children, asChild, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { ...props, ref } as any);
  }
  return (
    <div ref={ref as React.Ref<HTMLDivElement>} {...props}>
      {children}
    </div>
  );
});

TooltipTrigger.displayName = 'TooltipTrigger';

export interface TooltipContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export const TooltipContent = React.forwardRef<
  HTMLDivElement,
  TooltipContentProps
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));

TooltipContent.displayName = 'TooltipContent';

export interface TooltipProviderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const TooltipProvider = React.forwardRef<
  HTMLDivElement,
  TooltipProviderProps
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));

TooltipProvider.displayName = 'TooltipProvider';

export default Tooltip;






