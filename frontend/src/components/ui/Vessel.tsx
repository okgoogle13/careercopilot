import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';

export interface VesselProps {
    title: React.ReactNode;
    icon?: React.ReactNode;
    children: React.ReactNode;
    defaultExpanded?: boolean;
    className?: string;
}

export const M3Accordion: React.FC<VesselProps> = ({
    title,
    icon,
    children,
    defaultExpanded = false,
    className = "",
}) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    return (
<<<<<<< HEAD
        <div className={`border border-[var(--color-eucalypt-smoke-base)]/20 rounded-[var(--radius-pebble)] overflow-hidden mb-4 bg-white/5 transition-all duration-300 ${className}`}>
=======
        <div className={`border border-[var(--color-concrete-grey-base)]/20 rounded-[var(--radius-pebble)] overflow-hidden mb-4 bg-white/5 transition-all duration-300 ${className}`}>
>>>>>>> restoration-KR-Rage-Figma-v2.0
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors focus:outline-none"
            >
                <div className="flex items-center gap-4">
<<<<<<< HEAD
                    {icon && <div className="text-[var(--color-wattle-gold)]">{icon}</div>}
                    <h3 className="font-bloom text-lg font-bold text-[var(--color-parchment)]">{title}</h3>
                </div>
                <ChevronDown
                    className={`w-5 h-5 text-[var(--color-flannel-flower-dark)] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
=======
                    {icon && <div className="text-[var(--color-ink-gold)]">{icon}</div>}
                    <h3 className="font-bloom text-lg font-bold text-[var(--color-paper-white)]">{title}</h3>
                </div>
                <ChevronDown
                    className={`w-5 h-5 text-[var(--color-concrete-grey-dark)] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
>>>>>>> restoration-KR-Rage-Figma-v2.0
                />
            </button>
            <div
                className={`
                    transition-[max-height,opacity] duration-500 var(--ease-viscous-breeze) overflow-hidden
                    ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
                `}
            >
                <div className="p-6 pt-0 border-t border-white/5">
                    {children}
                </div>
            </div>
        </div>
    );
};

export { M3Accordion as Vessel };

<<<<<<< HEAD
M3Accordion.displayName = 'Vessel';
=======
M3Accordion.displayName = 'Vessel';
>>>>>>> restoration-KR-Rage-Figma-v2.0
