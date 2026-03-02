import React from 'react';
import { StatusBadge } from '../ui/StatusBadge/StatusBadge';

interface StatusChipProps {
    needsReview: boolean;
    label?: string;
    size?: 'small' | 'medium';
}

/**
 * StatusChip - Unified Status Indicator
 * 
<<<<<<< HEAD
 * Re-routes to StatusBadge for centralized Curio design system management.
=======
 * Re-routes to StatusBadge for centralized KrSolidarity design system management.
>>>>>>> restoration-KR-Rage-Figma-v2.0
 */
export const StatusChip: React.FC<StatusChipProps> = ({
    needsReview,
    label,
    size = 'small',
}) => {
    return (
        <StatusBadge
            label={label || (needsReview ? 'Needs Review' : 'Validated')}
            variant={needsReview ? 'warning' : 'success'}
            showDot
            className={size === 'small' ? 'scale-90 origin-left' : ''}
        />
    );
};
<<<<<<< HEAD

=======
>>>>>>> restoration-KR-Rage-Figma-v2.0
