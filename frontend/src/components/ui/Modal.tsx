// Accessible modal component with focus management
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap, useEscapeKey } from '../../hooks/useFocusTrap';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  size = 'md',
  closeOnBackdropClick = true,
  closeOnEscape = true,
}) => {
  const focusTrapRef = useFocusTrap({
    active: isOpen,
    initialFocus: true,
    restoreFocus: true,
  });

  // Handle escape key
  useEscapeKey(onClose, closeOnEscape && isOpen);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className='fixed inset-0 z-50 overflow-y-auto'
      role='dialog'
      aria-modal='true'
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className='flex min-h-screen items-center justify-center p-4 text-center'
        onClick={handleBackdropClick}
      >
        {/* Backdrop */}
        <div
          className='fixed inset-0 bg-background/80 backdrop-blur-sm transition-all duration-300'
          aria-hidden='true'
        />

        {/* Modal Content */}
        <div
          ref={focusTrapRef}
          className={`
            relative inline-block w-full ${sizeClasses[size]} transform rounded-lg
            bg-card border border-border px-6 py-6 text-left shadow-lg transition-all
            animate-scale-in
            ${className}
          `}
          role='document'
        >
          {/* Close Button */}
          <button
            type='button'
            onClick={onClose}
            className='absolute right-4 top-4 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card rounded-md p-1 transition-colors'
            aria-label='Close modal'
          >
            <svg
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              aria-hidden='true'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>

          {/* Title */}
          {title && (
            <h2
              id='modal-title'
              className='text-lg font-medium leading-6 text-card-foreground mb-4 pr-8'
            >
              {title}
            </h2>
          )}

          {/* Content */}
          <div className='modal-content text-card-foreground'>{children}</div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
