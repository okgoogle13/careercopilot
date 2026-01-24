import { X } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { M3IconButton } from './Pebble';
import { Stone as M3Card } from './Stone';

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

    /** Visual variant - Northcote Curio compatible */
    variant?: 'tech' | 'organic' | 'standard';
}

/**
 * M3Modal - Material 3 Compliant Modal (Cabinet)
 *
 * Features:
 * - Managed focus and ESC key support
 * - M3 design tokens for shape, color, and elevation
 * - Northcote Curio design variants
 */
export const M3Modal: React.FC<CabinetProps> = ({
    open,
    onClose,
    title,
    children,
    maxWidth = 'md',
    variant = 'standard',
}) => {
    const modalRef = useRef<HTMLDivElement>(null);

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
            <M3Card
                variant={variant === 'tech' ? 'tech' : 'pebble'}
                elevation={4}
                padding="none"
                className={`relative w-full ${maxWidthClasses[maxWidth]} shadow-2xl animate-in zoom-in-95 duration-300`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    {title ? (
                        <h3 className="font-bloom text-2xl font-bold text-[var(--color-parchment)]">
                            {title}
                        </h3>
                    ) : <div />}
                    <M3IconButton
                        icon={<X className="w-5 h-5" />}
                        ariaLabel="Close modal"
                        onClick={onClose}
                        size="medium"
                        className="hover:rotate-90 transition-transform duration-300"
                    />
                </div>

                {/* Content */}
                <div className="p-8">
                    {children}
                </div>
            </M3Card>
        </div>,
        document.body
    );
};

export { M3Modal as Cabinet };
