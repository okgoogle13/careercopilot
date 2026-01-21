import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { M3IconButton } from './M3Button';
import { M3Card } from './M3Card';

export interface M3ModalProps {
    /** Show/hide modal */
    open: boolean;
    /** Close handler */
    onClose: () => void;
    /** Modal title */
    title?: string;
    /** Modal content */
    children: React.ReactNode;
    /** Max width class (Tailwind) */
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    /** organic variant */
    variant?: 'pebble' | 'tech' | 'leaf';
    /** Content padding */
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * M3Modal - Northcote Curio Overlay
 * 
 * A semantic modal using M3Card logic and viscous motion.
 */
export const M3Modal: React.FC<M3ModalProps> = ({
    open,
    onClose,
    title,
    children,
    maxWidth = 'md',
    variant = 'tech',
    padding = 'lg',
}) => {
    const overlayRef = useRef<HTMLDivElement>(null);

    // Handle ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (open) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
            return () => {
                document.removeEventListener('keydown', handleEsc);
                document.body.style.overflow = 'unset';
            };
        }
    }, [open, onClose]);

    if (!open) return null;

    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        full: 'max-w-[95vw]',
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300"
            role="presentation"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[var(--color-specimen-night)]/80 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Container */}
            <div className={`relative w-full ${maxWidthClasses[maxWidth]} animate-in zoom-in-95 slide-in-from-bottom-4 duration-300`}>
                <M3Card
                    variant={variant}
                    padding="none"
                    elevation={5}
                    className="overflow-visible"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                        {title && (
                            <h2 className="font-bloom text-2xl font-bold text-[var(--color-parchment)]">
                                {title}
                            </h2>
                        )}
                        <M3IconButton
                            icon={<X className="w-5 h-5" />}
                            onClick={onClose}
                            ariaLabel="Close Modal"
                            variant="text"
                        />
                    </div>

                    {/* Content */}
                    <div className={`max-h-[80vh] overflow-y-auto ${padding === 'none' ? '' : 'p-6'}`}>
                        {children}
                    </div>
                </M3Card>
            </div>
        </div>,
        document.body
    );
};
