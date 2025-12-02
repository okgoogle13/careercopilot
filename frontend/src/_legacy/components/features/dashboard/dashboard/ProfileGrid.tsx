import { Add as Plus, AutoAwesome as Sparkles, TrendingUp } from '@mui/icons-material';
import { Box, Card, Button } from '@mui/material';
import React from 'react';

import { ProfileVariationGrid } from '../../../library/ProfileVariationCard';
import { CreateProfileCard } from '../../profile/CreateProfileCard';
import { ProfileCard } from '../../profile/ProfileCard';

// ... (interface definitions remain the same)

export function ProfileGrid({
  profiles,
  profileVariations,
  onCreateProfile,
  onEditProfile,
  onDeleteProfile,
  onNavigateToCareerGrowth,
}: ProfileGridProps) {
  return (
    <>
      <Card
        sx={{
          padding: 'var(--sys-spacing-6)',
          marginBottom: 'var(--sys-spacing-6)',
          backgroundColor: 'var(--sys-color-surface-container)',
          borderRadius: 'var(--shape-corner-large)',
          boxShadow: 'var(--elevation-level1)',
        }}
      >
        <h2
          style={{
            font: 'var(--sys-type-title-large)',
            color: 'var(--sys-color-on-surface)',
            marginBottom: 'var(--sys-spacing-4)',
          }}
        >
          Your Profile Variations
        </h2>
        <ProfileVariationGrid
          profiles={profileVariations}
          onProfileEdit={(id) => console.log('Edit profile:', id)}
          onProfileDuplicate={(id) => console.log('Duplicate profile:', id)}
          onProfileDelete={(id) => console.log('Delete profile:', id)}
          onProfileSetDefault={(id) => console.log('Set default profile:', id)}
          onProfileClick={(id) => console.log('View profile:', id)}
          emptyState={
            <Box
              sx={{
                textAlign: 'center',
                paddingY: 'var(--sys-spacing-8)',
                border: '1px dashed var(--sys-color-outline-variant)',
                borderRadius: 'var(--shape-corner-medium)',
              }}
            >
              <p
                style={{
                  font: 'var(--sys-type-body-large)',
                  color: 'var(--sys-color-on-surface-variant)',
                  marginBottom: 'var(--sys-spacing-4)',
                }}
              >
                No profile variations yet
              </p>
              <Button
                onClick={() => onCreateProfile?.()}
                variant="contained"
                sx={{
                  backgroundColor: 'var(--sys-color-primary)',
                  color: 'var(--sys-color-on-primary)',
                }}
              >
                <Plus sx={{ marginRight: 'var(--sys-spacing-2)' }} />
                Create Your First Profile
              </Button>
            </Box>
          }
        />
      </Card>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 'var(--sys-spacing-6)',
        }}
      >
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            {...profile}
            onEdit={() => onEditProfile(profile)}
            onDelete={() => onDeleteProfile(profile.id)}
          />
        ))}
        <CreateProfileCard onCreate={() => onCreateProfile?.()} />

        {onNavigateToCareerGrowth && (
          <Card
            sx={{
              padding: 'var(--sys-spacing-6)',
              backgroundColor: 'var(--sys-color-surface-container-high)',
              borderRadius: 'var(--shape-corner-extra-large)',
              boxShadow: 'var(--elevation-level2)',
              transition: `all var(--sys-motion-duration-medium1) var(--sys-motion-easing-standard)`,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 'var(--elevation-level4)',
              },
            }}
          >
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sys-spacing-3)',
                  marginBottom: 'var(--sys-spacing-2)',
                }}
              >
                <Box
                  sx={{
                    padding: 'var(--sys-spacing-2)',
                    backgroundColor: 'var(--sys-color-tertiary-container)',
                    borderRadius: 'var(--shape-corner-medium)',
                  }}
                >
                  <TrendingUp sx={{ color: 'var(--sys-color-on-tertiary-container)' }} />
                </Box>
                <h3
                  style={{
                    font: 'var(--sys-type-title-large)',
                    color: 'var(--sys-color-on-surface)',
                  }}
                >
                  Career Growth
                </h3>
              </Box>
              <p
                style={{
                  font: 'var(--sys-type-body-medium)',
                  color: 'var(--sys-color-on-surface-variant)',
                  marginBottom: 'var(--sys-spacing-4)',
                }}
              >
                Explore AI-powered career insights, job matching, and interview preparation tools.
              </p>
              <Button
                onClick={onNavigateToCareerGrowth}
                variant="outlined"
                sx={{
                  width: '100%',
                  borderColor: 'var(--sys-color-outline)',
                  color: 'var(--sys-color-primary)',
                  '&:hover': {
                    backgroundColor: 'var(--sys-color-primary-container)',
                    borderColor: 'var(--sys-color-primary)',
                  },
                }}
              >
                <Sparkles sx={{ marginRight: 'var(--sys-spacing-2)' }} />
                Explore Career Tools
              </Button>
            </Box>
          </Card>
        )}
      </Box>
    </>
  );
}
