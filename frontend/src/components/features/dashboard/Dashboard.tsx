import { Add as AddIcon, Article as ArticleIcon } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { useState } from 'react';

import type { DashboardTab } from '../../../types';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { DashboardStats } from './dashboard/DashboardStats';
import { ProfileGrid } from './dashboard/DashboardGrid';

// ... (mock data and interfaces remain the same)

export function Dashboard({
  onCreateProfile,
  onCreateDocument,
  onEditProfile,
  onNavigateToCareerGrowth,
  onNavigateToSettings,
  isEmpty = false,
}: DashboardProps) {
  const [profiles, setProfiles] = useState(isEmpty ? [] : mockProfiles);

  const handleDeleteProfile = (id: string) => {
    setProfiles(profiles.filter((p) => p.id !== id));
  };

  if (isEmpty || profiles.length === 0) {
    return (
      <Box sx={{ flex: 1, padding: 'var(--sys-spacing-8)' }}>
        <DashboardHeader
          title="Welcome to Career Copilot"
          onNavigateToSettings={onNavigateToSettings}
          onCreateProfile={onCreateProfile}
          showCreateButton={false}
          isEmpty={true}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            backgroundColor: 'var(--sys-color-surface-container)',
            borderRadius: 'var(--shape-corner-extra-large)',
            padding: 'var(--sys-spacing-8)',
          }}
        >
          <Box
            sx={{
              backgroundColor: 'var(--sys-color-primary-container)',
              borderRadius: 'var(--shape-corner-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--sys-spacing-4)',
              marginBottom: 'var(--sys-spacing-6)',
            }}
          >
            <ArticleIcon sx={{ fontSize: 48, color: 'var(--sys-color-on-primary-container)' }} />
          </Box>
          <h2
            style={{
              font: 'var(--sys-type-headline-medium)',
              color: 'var(--sys-color-on-surface)',
              marginBottom: 'var(--sys-spacing-3)',
            }}
          >
            Your Dashboard is Empty
          </h2>
          <p
            style={{
              font: 'var(--sys-type-title-medium)',
              color: 'var(--sys-color-on-surface-variant)',
              marginBottom: 'var(--sys-spacing-8)',
              maxWidth: '600px',
            }}
          >
            Create your first document to get started with AI-powered job applications.
          </p>
          <Button
            onClick={() => onCreateProfile?.()}
            variant="contained"
            size="large"
            sx={{
              backgroundColor: 'var(--sys-color-primary)',
              color: 'var(--sys-color-on-primary)',
              borderRadius: 'var(--shape-corner-full)',
              padding: 'var(--sys-spacing-3) var(--sys-spacing-8)',
              font: 'var(--sys-type-label-large)',
            }}
          >
            <AddIcon sx={{ marginRight: 'var(--sys-spacing-2)' }} />
            Create Your First Document
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, padding: 'var(--sys-spacing-8)', backgroundColor: 'var(--sys-color-surface)' }}>
      <DashboardHeader
        title="Your Job Seeker Profiles"
        onCreateProfile={onCreateProfile}
        onNavigateToSettings={onNavigateToSettings}
        isEmpty={false}
      />
      <DashboardStats />
      <ProfileGrid
        profiles={profiles}
        profileVariations={profileVariations}
        onCreateProfile={onCreateProfile}
        onEditProfile={onEditProfile}
        onDeleteProfile={handleDeleteProfile}
        onNavigateToCareerGrowth={onNavigateToCareerGrowth}
      />
    </Box>
  );
}
