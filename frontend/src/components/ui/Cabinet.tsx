/**
 * @deprecated Cabinet is deprecated as of KR Solidarity v6.0.
 * Use {@link Megaphone} from './Megaphone' instead. See docs/design/01_CANON.md §2.C
 * Will be removed in v7.0.
 */
import { X } from 'lucide-react';
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Strike } from './Strike';
import { Placard } from './Placard';

export interface CabinetProps {
  /** Show/hide modal */
  open: boolean;

  /** Close handler */
  onClose: () => void;

  /** Modal title */
  title?: string;

  /** Modal content */
  children: React.ReactNode;

  /** Max width of the modal */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';

  /** Visual variant - KeralaRage KrSolidarity compatible */
  variant?: 'tech' | '[DEPRECATED_STYLE]' | 'standard';
}

/**
 * @deprecated Use Megaphone instead.
 *
 * Cabinet - KeralaRage KrSolidarity Modal Component (legacy name)
 *
 * Replaced by Megaphone in KR Solidarity v6.0.
 * Archetype was: Cabinet. Now: Megaphone (focal interruption).
 */
export const Cabinet: React.FC<CabinetProps> = ({
  open,
  onClose,
  title,
  children,
  maxWidth = 'md',
  variant: _variant = 'standard',
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  if (!open) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--sys-color-charcoalBackground-base)]/80 backdrop-blur-md animate-in fade-in duration-300">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <Placard
        elevation="floating"
        className={`relative w-full ${maxWidthClasses[maxWidth]} shadow-2xl animate-in zoom-in-95 duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          {title ? (
            <h3 className="font-bloom text-2xl font-bold text-[var(--sys-color-worker-ash-base)]">
              {title}
            </h3>
          ) : (
            <div />
          )}
          <Strike
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close modal"
            className="h-8 w-8 p-0 hover:rotate-90 transition-transform duration-300"
          >
            <X className="w-5 h-5" />
          </Strike>
        </div>

        {/* Content */}
        <div className="p-8">{children}</div>
      </Placard>
    </div>,
    document.body
  );
};
