/**
 * ELECTRIC ALCHEMIST: TOAST COMPONENT
 *
 * Toast notification with design system tokens and severity variants.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from './Card';

export type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  open: boolean;
  onClose: () => void;
  severity: ToastSeverity;
  title?: string;
  message: string;
  duration?: number;
  position?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
}

const severityConfig = {
  success: {
    icon: CheckCircle2,
    bg: 'bg-primary-container',
    border: 'border-primary-container',
    text: 'text-on-primary-container',
    iconColor: 'text-primary',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-error-container',
    border: 'border-error-container',
    text: 'text-on-error',
    iconColor: 'text-error',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-tertiary-container',
    border: 'border-tertiary-container',
    text: 'text-on-tertiary',
    iconColor: 'text-tertiary',
  },
  info: {
    icon: Info,
    bg: 'bg-surface-container',
    border: 'border-outline-variant',
    text: 'text-on-surface',
    iconColor: 'text-primary',
  },
};

const positionClasses = {
  top: {
    left: 'top-4 left-4',
    center: 'top-4 left-1/2 -translate-x-1/2',
    right: 'top-4 right-4',
  },
  bottom: {
    left: 'bottom-4 left-4',
    center: 'bottom-4 left-1/2 -translate-x-1/2',
    right: 'bottom-4 right-4',
  },
};

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      open,
      onClose,
      severity,
      title,
      message,
      duration = 6000,
      position = { vertical: 'bottom', horizontal: 'right' },
    },
    ref
  ) => {
    const config = severityConfig[severity];
    const Icon = config.icon;

    React.useEffect(() => {
      if (!open || duration <= 0) return;
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }, [open, duration, onClose]);

    return (
      <AnimatePresence>
        {open && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: position.vertical === 'top' ? -20 : 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: position.vertical === 'top' ? -20 : 20, scale: 0.95 }}
            className={cn(
              'fixed z-50 min-w-[320px] max-w-[420px]',
              positionClasses[position.vertical][position.horizontal]
            )}
            role="alert"
          >
            <Card
              className={cn(
                'p-4 flex gap-3 items-start',
                config.bg,
                config.border
              )}
            >
              <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', config.iconColor)} />
              <div className="flex-1 min-w-0">
                {title && (
                  <div className={cn('text-hero text-sm font-medium mb-1', config.text)}>
                    {title}
                  </div>
                )}
                <div className={cn('text-human text-sm', config.text)}>{message}</div>
              </div>
              <motion.button
                onClick={onClose}
                className={cn(
                  'p-1 rounded-full transition-colors',
                  config.text,
                  'hover:bg-black/10'
                )}
                aria-label="Close notification"
                whileHover={{ scale: 0.95 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-4 w-4" />
              </motion.button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

Toast.displayName = 'Toast';

export default Toast;
