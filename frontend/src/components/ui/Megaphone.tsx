import { X } from 'lucide-react';
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Strike } from './Strike';
import { Placard } from './Placard';

export interface MegaphoneProps {
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
}

/**
 * **THE MEGAPHONE**
 *
 * Archetype: Megaphone — Announcement, focal interruption, urgency.
 * Shape palette: `shape.megaphoneBase01` (base) → ambient `shape.blob01` on background
 * Motion coupling: `typeSpringSlam` (600ms) on entrance
 *
 * KR Shape Token: Uses `Placard` (shape.placardBase01) as the inner container.
 * The Megaphone cuts through the noise. It demands attention.
 * It does not ask — it announces.
 *
 * @example
 * <Megaphone open={isOpen} onClose={close} title="VERIFIED">
 *   {content}
 * </Megaphone>
 */
export const Megaphone: React.FC<MegaphoneProps> = ({
  open,
  onClose,
  title,
  children,
  maxWidth = 'md',
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
    <div
      data-archetype="megaphone"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--kr-color-charcoal-background-base)]/80 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <Placard
        elevation="floating"
        className={`relative w-full ${maxWidthClasses[maxWidth]} shadow-2xl animate-in zoom-in-95`}
        style={{
          animationDuration: 'var(--kr-archetypes-megaphone-motion-duration)',
          animationTimingFunction: 'var(--kr-archetypes-megaphone-motion-easing)',
          WebkitClipPath: 'var(--kr-archetypes-megaphone-shape-base)',
          clipPath: 'var(--kr-archetypes-megaphone-shape-base)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          {title ? (
            <h3
              className="font-display text-2xl font-bold text-[var(--kr-color-worker-ash-base)]"
              style={{ fontFamily: 'var(--kr-typography-family-display)' }}
            >
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
