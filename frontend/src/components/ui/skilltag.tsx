import React from 'react';
import { Box, Button, IconButton } from '@mui/material';
import { Check, X } from '@mui/icons-material';

interface SkillTagProps {
  text: string;
  status?: 'suggested' | 'accepted' | 'rejected';
  onAccept?: () => void;
  onReject?: () => void;
}

export const SkillTag: React.FC<SkillTagProps> = ({
  text,
  status = 'suggested',
  onAccept,
  onReject,
}) => {
  const statusConfig = {
    suggested: {
      sx: {
        backgroundColor: 'rgba(var(--md-sys-color-primary), 0.1)',
        borderColor: 'rgba(var(--md-sys-color-primary), 0.3)',
        color: 'primary.main',
        borderStyle: 'dashed'
      },
      icon: null,
    },
    accepted: {
      sx: {
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderColor: 'rgba(76, 175, 80, 0.3)',
        color: '#4caf50'
      },
      icon: <Check fontSize="small" />,
    },
    rejected: {
      sx: {
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        borderColor: 'rgba(244, 67, 54, 0.3)',
        color: '#f44336'
      },
      icon: <X fontSize="small" />,
    },
  };

  const config = statusConfig[status];

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        px: 1.5,
        py: 0.5,
        borderRadius: '1rem',
        border: '1px solid',
        transition: 'all 0.2s ease-in-out',
        fontSize: '0.875rem',
        fontWeight: 500,
        '&:hover .action-buttons': {
          opacity: 1
        },
        ...config.sx
      }}
    >
      {config.icon && <Box sx={{ display: 'flex', flexShrink: 0 }}>{config.icon}</Box>}

      <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</Box>

      {status === 'suggested' && (
        <Box className="action-buttons" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 0.5, opacity: 0, transition: 'opacity 0.2s ease-in-out' }}>
          {onAccept && (
            <IconButton
              size="small"
              sx={{
                width: 24,
                height: 24,
                p: 0,
                color: '#4caf50',
                '&:hover': {
                  backgroundColor: 'rgba(76, 175, 80, 0.2)',
                  color: '#4caf50'
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                onAccept();
              }}
            >
              <Check fontSize="small" />
            </IconButton>
          )}

          {onReject && (
            <IconButton
              size="small"
              sx={{
                width: 24,
                height: 24,
                p: 0,
                color: '#f44336',
                '&:hover': {
                  backgroundColor: 'rgba(244, 67, 54, 0.2)',
                  color: '#f44336'
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                onReject();
              }}
            >
              <X fontSize="small" />
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  );
};
