/**
 * ELECTRIC ALCHEMIST: ALERT DIALOG COMPONENT
 *
 * Alert dialog with design system tokens and framer-motion animations.
 * Uses z-modal for overlay and rounded-[24px] for containers.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/electric';

export interface AlertDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const AlertDialogContext = React.createContext<{ onClose: () => void }>({
  onClose: () => { },
});

export const AlertDialog = React.forwardRef<
  HTMLDivElement,
  AlertDialogProps
>(({ open, onOpenChange, children }, ref) => {
  const handleClose = () => onOpenChange?.(false);

  return (
    <AlertDialogContext.Provider value={{ onClose: handleClose }}>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-modal"
              onClick={handleClose}
            />
            {/* Dialog */}
            <div className="fixed inset-0 z-modal flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                ref={ref}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'relative w-full max-w-md',
                  'bg-surface-container border border-outline-variant',
                  'rounded-[24px] p-6',
                  'shadow-xl pointer-events-auto'
                )}
                onClick={(e) => e.stopPropagation()}
              >
                {children}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </AlertDialogContext.Provider>
  );
});

AlertDialog.displayName = 'AlertDialog';

export interface AlertDialogTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const AlertDialogTrigger = React.forwardRef<
  HTMLButtonElement,
  AlertDialogTriggerProps
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

AlertDialogTrigger.displayName = 'AlertDialogTrigger';

export interface AlertDialogContentProps
  extends React.HTMLAttributes<HTMLDivElement> { }

export const AlertDialogContent = React.forwardRef<
  HTMLDivElement,
  AlertDialogContentProps
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('space-y-4', className)} {...props}>
      {children}
    </div>
  );
});

AlertDialogContent.displayName = 'AlertDialogContent';

export interface AlertDialogHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> { }

export const AlertDialogHeader = React.forwardRef<
  HTMLDivElement,
  AlertDialogHeaderProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-start justify-between', className)}
      {...props}
    />
  );
});

AlertDialogHeader.displayName = 'AlertDialogHeader';

export interface AlertDialogTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> { }

export const AlertDialogTitle = React.forwardRef<
  HTMLHeadingElement,
  AlertDialogTitleProps
>(({ className, ...props }, ref) => {
  return (
    <h2
      ref={ref}
      className={cn('text-hero text-lg font-medium text-on-surface', className)}
      {...props}
    />
  );
});

AlertDialogTitle.displayName = 'AlertDialogTitle';

export interface AlertDialogDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> { }

export const AlertDialogDescription = React.forwardRef<
  HTMLParagraphElement,
  AlertDialogDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn('text-human text-sm text-on-surface-variant', className)}
      {...props}
    />
  );
});

AlertDialogDescription.displayName = 'AlertDialogDescription';

export interface AlertDialogFooterProps
  extends React.HTMLAttributes<HTMLDivElement> { }

export const AlertDialogFooter = React.forwardRef<
  HTMLDivElement,
  AlertDialogFooterProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-center justify-end gap-2', className)}
      {...props}
    />
  );
});

AlertDialogFooter.displayName = 'AlertDialogFooter';

export interface AlertDialogActionProps extends ButtonProps { }

export const AlertDialogAction = React.forwardRef<
  HTMLButtonElement,
  AlertDialogActionProps
>(({ className, children, ...props }, ref) => {
  return (
    <Button ref={ref} variant="default" className={className} {...props}>
      {children}
    </Button>
  );
});

AlertDialogAction.displayName = 'AlertDialogAction';

export interface AlertDialogCancelProps extends ButtonProps { }

export const AlertDialogCancel = React.forwardRef<
  HTMLButtonElement,
  AlertDialogCancelProps
>(({ className, children, ...props }, ref) => {
  return (
    <Button ref={ref} variant="outline" className={className} {...props}>
      {children}
    </Button>
  );
});

AlertDialogCancel.displayName = 'AlertDialogCancel';

export default AlertDialog;



