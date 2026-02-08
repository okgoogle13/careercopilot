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
 * Re-routes to StatusBadge for centralized KrSolidarity design system management.
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
