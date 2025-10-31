import { Add as Plus, Person as User, Settings } from '@mui/icons-material';
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
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        {!isEmpty && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Dashboard</span>
            <span>ATS Analysis</span>
          </div>
        )}
        {showCreateButton && (
          <Button
            onClick={() => onCreateProfile?.()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isEmpty ? 'Create Your First Document' : 'Create Document'}
          </Button>
        )}
        <Button onClick={onNavigateToSettings} variant="text" size="small">
          <Settings className="w-4 h-4" />
        </Button>
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-black" />
        </div>
      </div>
    </div>
  );
}
