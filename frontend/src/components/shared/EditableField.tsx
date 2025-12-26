import React, { useState } from 'react';
import { Box, TextField, Typography, IconButton, Chip, Stack } from '@mui/material';
import { Edit, Check, Close, AutoAwesome } from '@mui/icons-material';

interface EditableFieldProps {
    label: string;
    value: string;
    suggestion?: string;
    onSave: (newValue: string) => void;
    multiline?: boolean;
    variant?: 'body1' | 'body2' | 'h6';
}

export const EditableField: React.FC<EditableFieldProps> = ({
    label,
    value,
    suggestion,
    onSave,
    multiline = false,
    variant = 'body1',
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);

    const handleSave = () => {
        onSave(editValue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditValue(value);
        setIsEditing(false);
    };

    const handleApplySuggestion = () => {
        if (suggestion) {
            setEditValue(suggestion);
            onSave(suggestion);
        }
    };

    if (isEditing) {
        return (
            <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: 'var(--sys-color-on-surface-variant)', mb: 0.5, display: 'block' }}>
                    {label}
                </Typography>
                <TextField
                    fullWidth
                    multiline={multiline}
                    rows={multiline ? 3 : 1}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            bgcolor: 'var(--sys-color-surface-container)',
                            '& fieldset': {
                                borderColor: 'var(--sys-color-outline-variant)',
                            },
                            '&:hover fieldset': {
                                borderColor: 'var(--sys-color-primary)',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'var(--sys-color-primary)',
                            },
                        },
                    }}
                />
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <IconButton
                        size="small"
                        onClick={handleSave}
                        sx={{
                            bgcolor: 'var(--sys-color-primary-container)',
                            color: 'var(--sys-color-on-primary-container)',
                            '&:hover': { bgcolor: 'var(--sys-color-primary)' },
                        }}
                    >
                        <Check fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={handleCancel}
                        sx={{
                            bgcolor: 'var(--sys-color-surface-container-high)',
                            color: 'var(--sys-color-on-surface)',
                            '&:hover': { bgcolor: 'var(--sys-color-surface-container-highest)' },
                        }}
                    >
                        <Close fontSize="small" />
                    </IconButton>
                    {suggestion && (
                        <Chip
                            icon={<AutoAwesome sx={{ fontSize: 16 }} />}
                            label="Apply AI Suggestion"
                            onClick={handleApplySuggestion}
                            size="small"
                            sx={{
                                bgcolor: 'var(--sys-color-tertiary-container)',
                                color: 'var(--sys-color-on-tertiary-container)',
                                fontWeight: 600,
                                '&:hover': {
                                    bgcolor: 'var(--sys-color-tertiary)',
                                    color: 'var(--sys-color-on-tertiary)',
                                },
                            }}
                        />
                    )}
                </Stack>
                {suggestion && (
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'var(--sys-color-on-surface-variant)',
                            fontStyle: 'italic',
                            mt: 1,
                            display: 'block',
                        }}
                    >
                        💡 Suggestion: {suggestion}
                    </Typography>
                )}
            </Box>
        );
    }

    return (
        <Box
            sx={{
                mb: 2,
                p: 1.5,
                borderRadius: 'var(--sys-shape-corner-small)',
                bgcolor: 'var(--sys-color-surface-container-low)',
                border: '1px solid var(--sys-color-outline-variant)',
                transition: 'all 0.2s var(--sys-motion-easing-standard)',
                '&:hover': {
                    borderColor: 'var(--sys-color-primary)',
                    bgcolor: 'var(--sys-color-surface-container)',
                },
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ color: 'var(--sys-color-on-surface-variant)', mb: 0.5, display: 'block' }}>
                        {label}
                    </Typography>
                    <Typography variant={variant} sx={{ color: 'var(--sys-color-on-surface)' }}>
                        {value || '(Not provided)'}
                    </Typography>
                </Box>
                <IconButton
                    size="small"
                    onClick={() => setIsEditing(true)}
                    sx={{
                        color: 'var(--sys-color-primary)',
                        '&:hover': {
                            bgcolor: 'var(--sys-color-primary-container)',
                        },
                    }}
                >
                    <Edit fontSize="small" />
                </IconButton>
            </Stack>
        </Box>
    );
};
