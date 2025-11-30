import { Add as Plus, Person as User, Settings } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import React from 'react';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  onCreateProfile?: () => void;
  onNavigateToSettings?: () => void;
  showCreateButton?: boolean;
  isEmpty?: boolean;
}

export function DashboardHeader({
  title,
  subtitle,
  onCreateProfile,
  onNavigateToSettings,
  showCreateButton = true,
  isEmpty = false,
}: DashboardHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'var(--sys-spacing-8)',
      }}
    >
      <Box>
        <h1
          style={{
            font: 'var(--sys-type-headline-large)',
            marginBottom: 'var(--sys-spacing-2)',
            color: 'var(--sys-color-on-surface)',
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              font: 'var(--sys-type-body-medium)',
              color: 'var(--sys-color-on-surface-variant)',
            }}
          >
            {subtitle}
          </p>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-spacing-4)' }}>
        {!isEmpty && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--sys-spacing-2)',
              font: 'var(--sys-type-body-large)',
              color: 'var(--sys-color-on-surface-variant)',
            }}
          >
            <span>Dashboard</span>
            <span>ATS Analysis</span>
          </Box>
        )}
        {showCreateButton && (
          <Button
            onClick={() => onCreateProfile?.()}
            variant="contained"
            sx={{
              backgroundColor: 'var(--sys-color-primary)',
              color: 'var(--sys-color-on-primary)',
              borderRadius: 'var(--shape-corner-full)',
              padding: 'var(--sys-spacing-2) var(--sys-spacing-4)',
              '&:hover': {
                backgroundColor: 'var(--sys-color-primary-dark)',
              },
            }}
          >
            <Plus sx={{ marginRight: 'var(--sys-spacing-2)' }} />
            {isEmpty ? 'Create Your First Document' : 'Create Document'}
          </Button>
        )}
        <Button
          onClick={onNavigateToSettings}
          variant="text"
          size="small"
          sx={{ color: 'var(--sys-color-on-surface-variant)' }}
        >
          <Settings />
        </Button>
        <Box
          sx={{
            backgroundColor: 'var(--sys-color-surface-container-highest)',
            borderRadius: 'var(--shape-corner-full)',
            padding: 'var(--sys-spacing-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--elevation-level1)',
          }}
        >
          <User sx={{ color: 'var(--sys-color-on-surface)' }} />
        </Box>
      </Box>
    </Box>
  );
}
