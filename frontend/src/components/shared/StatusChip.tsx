import React from 'react';
import { Chip } from '@mui/material';
import { WarningAmber, CheckCircle } from '@mui/icons-material';

interface StatusChipProps {
    needsReview: boolean;
    label?: string;
    size?: 'small' | 'medium';
}

/**
 * StatusChip - M3-Compliant Status Indicator
 * 
 * **M3 Design Token Usage:**
 * - Warning state: Uses M3 `warning-container` semantic tokens
 * - Validated state: Uses M3 `secondary-container` semantic tokens
 * - Typography: M3 font family via CSS variable
 */
export const StatusChip: React.FC<StatusChipProps> = ({
    needsReview,
    label,
    size = 'small',
}) => {
    if (needsReview) {
        return (
            <Chip
                icon={<WarningAmber sx={{ fontSize: size === 'small' ? 16 : 20 }} />}
                label={label || 'Needs Review'}
                size={size}
                sx={{
                    bgcolor: 'var(--sys-color-warning-container)', // ✅ M3 token
                    color: 'var(--sys-color-on-warning-container)', // ✅ M3 token
                    fontFamily: 'var(--sys-type-body-family)',
                    fontWeight: 600,
                    '& .MuiChip-icon': {
                        color: 'var(--sys-color-on-warning-container)',
                    },
                }}
            />
        );
    }

    return (
        <Chip
            icon={<CheckCircle sx={{ fontSize: size === 'small' ? 16 : 20 }} />}
            label={label || 'Validated'}
            size={size}
            sx={{
                bgcolor: 'var(--sys-color-secondary-container)', // ✅ M3 token
                color: 'var(--sys-color-on-secondary-container)', // ✅ M3 token
                fontFamily: 'var(--sys-type-body-family)',
                fontWeight: 600,
                '& .MuiChip-icon': {
                    color: 'var(--sys-color-on-secondary-container)',
                },
            }}
        />
    );
};

