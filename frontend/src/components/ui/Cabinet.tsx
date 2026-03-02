import { X } from 'lucide-react';
<<<<<<< HEAD
import React, { useEffect, useRef } from 'react';
=======
import React, { useEffect } from 'react';
>>>>>>> restoration-KR-Rage-Figma-v2.0
import { createPortal } from 'react-dom';
import { Pebble } from './Pebble';
import { Stone } from './Stone';

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

<<<<<<< HEAD
  /** Visual variant -  compatible */
  variant?: 'tech' | 'organic' | 'standard';
}

/**
 * Cabinet -  Modal Component
 *
 * Modal dialog component with Northcote design system styling.
 * Features:
 * - Managed focus and ESC key support
 * - Northcote botanical palette and organic shapes
 * - Stone card wrapper with glassmorphism
=======
  /** Visual variant - KeralaRage KrSolidarity compatible */
  variant?: 'tech' | '[DEPRECATED_STYLE]' | 'standard';
}

/**
 * Cabinet - KeralaRage KrSolidarity Modal Component
 *
 * Modal dialog component with KeralaRage design system styling.
 * Features:
 * - Managed focus and ESC key support
 * - KeralaRage [DEPRECATED_STYLE] palette and [DEPRECATED_STYLE] shapes
 * - Stone card wrapper with KrScreenprint
>>>>>>> restoration-KR-Rage-Figma-v2.0
 * - Portal rendering for proper z-index layering
 */
export const Cabinet: React.FC<CabinetProps> = ({
  open,
  onClose,
  title,
  children,
  maxWidth = 'md',
  variant = 'standard',
}) => {
<<<<<<< HEAD
  const modalRef = useRef<HTMLDivElement>(null);

=======
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <Stone
<<<<<<< HEAD
        mode={variant === 'tech' ? 'laboratory' : 'gallery'}
=======
       
>>>>>>> restoration-KR-Rage-Figma-v2.0
        elevation="floating"
        className={`relative w-full ${maxWidthClasses[maxWidth]} shadow-2xl animate-in zoom-in-95 duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          {title ? (
<<<<<<< HEAD
            <h3 className="font-bloom text-2xl font-bold text-[var(--color-parchment)]">{title}</h3>
=======
            <h3 className="font-bloom text-2xl font-bold text-[var(--color-paper-white)]">{title}</h3>
>>>>>>> restoration-KR-Rage-Figma-v2.0
          ) : (
            <div />
          )}
          <Pebble
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close modal"
            className="h-8 w-8 p-0 hover:rotate-90 transition-transform duration-300"
          >
            <X className="w-5 h-5" />
          </Pebble>
        </div>

        {/* Content */}
        <div className="p-8">{children}</div>
      </Stone>
    </div>,
    document.body
  );
};

// Legacy M3 exports for backward compatibility
export { Cabinet as M3Modal };
<<<<<<< HEAD
export type { CabinetProps as M3ModalProps };
=======
export type { CabinetProps as M3ModalProps };
>>>>>>> restoration-KR-Rage-Figma-v2.0
