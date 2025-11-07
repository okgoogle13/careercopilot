import { Add as Plus, Person as User, Settings } from '@mui/icons-material';
import { Box } from '@mui/material';
import { Button } from '@mui/material';
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
    <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 8
    }}>
      <div>
        <h1 sx={{
      typography: h4,
      fontWeight: 700,
      "text-foreground": true,
      mb: 2
    }}>{title}</h1>
        {subtitle && <p sx={{
      "text-muted-foreground": true
    }}>{subtitle}</p>}
      </div>
      <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4
    }}>
        {!isEmpty && (
          <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      typography: body1,
      "text-muted-foreground": true
    }}>
            <span>Dashboard</span>
            <span>ATS Analysis</span>
          </div>
        )}
        {showCreateButton && (
          <Button
            onClick={() => onCreateProfile?.()}
            sx={{
      "bg-primary": true,
      '&:hover': { "bg-primary/90": true },
      "text-primary-foreground": true
    }}
          >
            <Plus sx={{
      "w-4": true,
      "h-4": true,
      mr: 2
    }} />
            {isEmpty ? 'Create Your First Document' : 'Create Document'}
          </Button>
        )}
        <Button onClick={onNavigateToSettings} variant="text" size="small">
          <Settings sx={{
      "w-4": true,
      "h-4": true
    }} />
        </Button>
        <div sx={{
      "w-8": true,
      "h-8": true,
      bgcolor: "common.white",
      borderRadius: 9999px,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
          <User sx={{
      "w-4": true,
      "h-4": true,
      color: "common.black"
    }} />
        </div>
      </div>
    </div>
  );
}
