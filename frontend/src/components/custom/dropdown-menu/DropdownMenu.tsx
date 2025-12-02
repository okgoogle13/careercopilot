/**
 * ELECTRIC ALCHEMIST: DROPDOWN MENU COMPONENT
 *
 * Dropdown menu with design system tokens and framer-motion animations.
 * Uses bg-surface-container for dropdown panels and z-modal for overlay.
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface DropdownMenuProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  side?: 'top' | 'bottom';
}

export const DropdownMenu = React.forwardRef<
  HTMLDivElement,
  DropdownMenuProps
>(({ children, trigger, align = 'left', side = 'bottom' }, ref) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        triggerRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  const alignClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  const sideClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
  };

  return (
    <div ref={ref} className="relative inline-block">
      <div
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        className="cursor-pointer"
      >
        {trigger}
      </div>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-modal"
              onClick={() => setOpen(false)}
            />
            {/* Menu */}
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.95, y: side === 'top' ? 10 : -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: side === 'top' ? 10 : -10 }}
              transition={{ duration: 0.15 }}
              className={cn(
                'absolute z-modal',
                alignClasses[align],
                sideClasses[side],
                'min-w-[160px]',
                'bg-surface-container border border-outline-variant',
                'rounded-[24px] p-2',
                'shadow-lg'
              )}
            >
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
});

DropdownMenu.displayName = 'DropdownMenu';

export interface DropdownMenuTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps
>(({ children, asChild, className, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { ...props, ref } as any);
  }

  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center gap-2',
        'px-4 py-2 rounded-[24px]',
        'bg-surface-container border border-outline-variant',
        'text-ai text-sm text-on-surface',
        'hover:bg-surface-container-high',
        'transition-colors duration-150',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4" />
    </button>
  );
});

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

export interface DropdownMenuItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive';
}

export const DropdownMenuItem = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuItemProps
>(({ children, variant = 'default', className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'w-full text-left px-3 py-2 rounded-[8px]',
        'text-ai text-sm',
        'transition-colors duration-150',
        variant === 'default'
          ? 'text-on-surface hover:bg-surface-container-high'
          : 'text-error hover:bg-error-container',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

DropdownMenuItem.displayName = 'DropdownMenuItem';

export const DropdownMenuSeparator = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => {
  return (
    <hr
      ref={ref}
      className={cn('my-2 border-outline-variant', className)}
      {...props}
    />
  );
});

DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

export default DropdownMenu;



