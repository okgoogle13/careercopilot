import { toast } from 'sonner';
import React from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

/**
<<<<<<< HEAD
 * m3Toast -  Themed Notifications
 * 
 * A wrapper around sonner that applies Curio design tokens and organic styling.
=======
 * m3Toast - KeralaRage KrSolidarity Themed Notifications
 * 
 * A wrapper around sonner that applies KrSolidarity design tokens and [DEPRECATED_STYLE] styling.
>>>>>>> restoration-KR-Rage-Figma-v2.0
 */
export const m3Toast = {
    success: (message: string, description?: string) => {
        toast.success(message, {
            description,
            icon: <CheckCircle className="w-5 h-5 text-[var(--ref-palette-primary-60)]" />,
<<<<<<< HEAD
            className: 'curio-toast success',
=======
            className: 'KrSolidarity-toast success',
>>>>>>> restoration-KR-Rage-Figma-v2.0
        });
    },
    error: (message: string, description?: string) => {
        toast.error(message, {
            description,
            icon: <AlertCircle className="w-5 h-5 text-[var(--ref-palette-error-60)]" />,
<<<<<<< HEAD
            className: 'curio-toast error',
=======
            className: 'KrSolidarity-toast error',
>>>>>>> restoration-KR-Rage-Figma-v2.0
        });
    },
    warning: (message: string, description?: string) => {
        toast.warning(message, {
            description,
            icon: <AlertTriangle className="w-5 h-5 text-[var(--ref-palette-warning-60)]" />,
<<<<<<< HEAD
            className: 'curio-toast warning',
=======
            className: 'KrSolidarity-toast warning',
>>>>>>> restoration-KR-Rage-Figma-v2.0
        });
    },
    info: (message: string, description?: string) => {
        toast.info(message, {
            description,
            icon: <Info className="w-5 h-5 text-[var(--ref-palette-secondary-60)]" />,
<<<<<<< HEAD
            className: 'curio-toast info',
=======
            className: 'KrSolidarity-toast info',
>>>>>>> restoration-KR-Rage-Figma-v2.0
        });
    },
};
