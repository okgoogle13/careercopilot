import React from 'react';
import { Chip } from '@mui/material';
import { WarningAmber, CheckCircle } from '@mui/icons-material';

interface StatusChipProps {
    needsReview: boolean;
    label?: string;
    size?: 'small' | 'medium';
}

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
                    bgcolor: '#fbbf24', // Amber warning
                    color: '#78350f', // Dark amber text
                    fontWeight: 600,
                    '& .MuiChip-icon': {
                        color: '#78350f',
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
                bgcolor: 'var(--sys-color-secondary-container)', // Green/Teal
                color: 'var(--sys-color-on-secondary-container)',
                fontWeight: 600,
                '& .MuiChip-icon': {
                    color: 'var(--sys-color-on-secondary-container)',
                },
            }}
        />
    );
};
