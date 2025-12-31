import React from 'react';
import { Box, Typography } from '@mui/material';

export type StatusBadgeVariant = 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'outline';

export interface StatusBadgeProps {
    /** The text label to display */
    label: string;
    /** Visual style variant */
    variant?: StatusBadgeVariant;
    /** Optional dot indicator */
    showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
    label,
    variant = 'neutral',
    showDot = false,
}) => {
    // Map variants to specific design tokens
    const variantStyles = {
        primary: {
            bgcolor: 'var(--sys-color-primary-container)',
            color: 'var(--sys-color-on-primary-container)',
            border: '1px solid transparent',
            dotColor: 'var(--sys-color-primary)',
        },
        secondary: {
            bgcolor: 'var(--sys-color-secondary-container)',
            color: 'var(--sys-color-on-secondary-container)',
            border: '1px solid transparent',
            dotColor: 'var(--sys-color-secondary)',
        },
        tertiary: {
            bgcolor: 'var(--sys-color-tertiary-container)',
            color: 'var(--sys-color-on-tertiary-container)',
            border: '1px solid transparent',
            dotColor: 'var(--sys-color-tertiary)',
        },
        neutral: {
            bgcolor: 'var(--sys-color-surface-container-high)',
            color: 'var(--sys-color-on-surface)',
            border: '1px solid transparent',
            dotColor: 'var(--sys-color-outline)',
        },
        outline: {
            bgcolor: 'transparent',
            color: 'var(--sys-color-on-surface-variant)',
            border: '1px solid var(--sys-color-outline-variant)',
            dotColor: 'var(--sys-color-primary)',
        },
    };

    const currentStyle = variantStyles[variant];

    return (
        <Box
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                px: '12px',
                py: '4px',
                borderRadius: 'var(--sys-shape-corner-full)',
                ...currentStyle,
                transition: 'all var(--sys-motion-duration-short-2) var(--sys-motion-easing-expressive-spring)',
                '&:hover': {
                    filter: 'brightness(1.1)',
                    transform: 'scale(1.02)',
                },
            }}
        >
            {showDot && (
                <Box
                    sx={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        bgcolor: currentStyle.dotColor,
                    }}
                />
            )}
            <Typography
                variant="body2" // Using body2 as label-small equivalent
                sx={{
                    fontWeight: 'var(--sys-type-weight-medium)',
                    fontSize: '0.8125rem', // ~13px
                    lineHeight: 1,
                    fontFamily: 'var(--sys-type-body-family)',
                }}
            >
                {label}
            </Typography>
        </Box>
    );
};
