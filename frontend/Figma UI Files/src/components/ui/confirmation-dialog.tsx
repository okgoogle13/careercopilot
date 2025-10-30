import React, { forwardRef } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './dialog';

export interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: 'default' | 'destructive';
  icon?: React.ReactNode;
  loading?: boolean;
}

export const ConfirmationDialog = forwardRef<HTMLDivElement, ConfirmationDialogProps>(
  ({ 
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    variant = 'default',
    icon,
    loading = false
  }, ref) => {
    const handleConfirm = () => {
      onConfirm();
      if (!loading) {
        onOpenChange(false);
      }
    };

    const handleCancel = () => {
      onCancel?.();
      onOpenChange(false);
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent 
          ref={ref}
          className="
            max-w-md
            bg-[var(--surface-container-high)] backdrop-blur-[var(--glass-blur)]
            border-2 border-[var(--glass-border)]
            rounded-[var(--radius-lg)]
            shadow-[var(--shadow-glow-aurora)]
            p-0
          "
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className={`
                p-3 rounded-full flex-shrink-0
                ${variant === 'destructive'
                  ? 'bg-red-500/20 border border-red-500/30'
                  : 'bg-gradient-to-br from-[var(--primary)]/20 to-[var(--tertiary)]/20 border border-[var(--primary)]/30'
                }
              `}>
                {icon ? icon : variant === 'destructive' ? (
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-[var(--primary)]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg text-[var(--on-surface)] mb-2">
                  {title}
                </h3>
                {description && (
                  <p className="text-sm text-[var(--on-surface-variant)]">
                    {description}
                  </p>
                )}
              </div>

              <button
                onClick={handleCancel}
                className="text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancel}
                disabled={loading}
                className="
                  px-6 py-2.5 rounded-[var(--radius-lg)]
                  bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]
                  border-2 border-[var(--glass-border)]
                  text-[var(--on-surface)]
                  transition-all duration-300
                  hover:border-[var(--glass-border-hover)] hover:shadow-[var(--shadow-glow-aurora)] hover:-translate-y-0.5
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {cancelLabel}
              </button>

              <button
                onClick={handleConfirm}
                disabled={loading}
                className={`
                  px-6 py-2.5 rounded-[var(--radius-lg)]
                  border-2 border-transparent
                  text-white
                  transition-all duration-300
                  hover:shadow-[var(--shadow-glow-aurora)] hover:-translate-y-0.5
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${variant === 'destructive'
                    ? 'bg-gradient-to-r from-red-500 to-red-600'
                    : 'bg-gradient-to-r from-[var(--primary)] to-[var(--tertiary)]'
                  }
                  ${loading && 'animate-pulse'}
                `}
              >
                {loading ? 'Processing...' : confirmLabel}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

ConfirmationDialog.displayName = 'ConfirmationDialog';
