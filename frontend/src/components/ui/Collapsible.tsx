/**
 * ELECTRIC ALCHEMIST: COLLAPSIBLE COMPONENT
 *
 * Collapsible component with design system tokens and framer-motion animations.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CollapsibleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  (
    {
      defaultOpen = false,
      open: controlledOpen,
      onOpenChange,
      trigger,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    const handleToggle = () => {
      const newOpen = !open;
      if (!isControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    };

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div
          onClick={handleToggle}
          className="cursor-pointer flex items-center justify-between"
        >
          {trigger}
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-5 w-5 text-on-surface-variant" />
          </motion.div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="pt-4">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Collapsible.displayName = 'Collapsible';

export interface CollapsibleTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  CollapsibleTriggerProps
>(({ children, asChild, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { ...props, ref } as any);
  }
  return (
    <button ref={ref} {...props}>
      {children}
    </button>
  );
});

CollapsibleTrigger.displayName = 'CollapsibleTrigger';

export interface CollapsibleContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  CollapsibleContentProps
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  );
});

CollapsibleContent.displayName = 'CollapsibleContent';

export default Collapsible;



