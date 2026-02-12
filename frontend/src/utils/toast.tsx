import { toast } from 'sonner';
import React from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

/**
 * m3Toast - KeralaRage KrSolidarity Themed Notifications
 * 
 * A wrapper around sonner that applies KrSolidarity design tokens and [DEPRECATED_STYLE] styling.
 */
export const m3Toast = {
    success: (message: string, description?: string) => {
        toast.success(message, {
            description,
            icon: <CheckCircle className="w-5 h-5 text-[var(--ref-palette-primary-60)]" />,
            className: 'KrSolidarity-toast success',
        });
    },
    error: (message: string, description?: string) => {
        toast.error(message, {
            description,
            icon: <AlertCircle className="w-5 h-5 text-[var(--ref-palette-error-60)]" />,
            className: 'KrSolidarity-toast error',
        });
    },
    warning: (message: string, description?: string) => {
        toast.warning(message, {
            description,
            icon: <AlertTriangle className="w-5 h-5 text-[var(--ref-palette-warning-60)]" />,
            className: 'KrSolidarity-toast warning',
        });
    },
    info: (message: string, description?: string) => {
        toast.info(message, {
            description,
            icon: <Info className="w-5 h-5 text-[var(--ref-palette-secondary-60)]" />,
            className: 'KrSolidarity-toast info',
        });
    },
};
