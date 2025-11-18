import { Add as Plus, TrendingUp, AutoAwesome as Sparkles } from '@mui/icons-material';
import { Box } from '@mui/material';
import { Card, Button } from '@mui/material';
import React from 'react';

import { ProfileVariationGrid } from '../../../library/ProfileVariationCard';
import { CreateProfileCard } from '../../profile/CreateProfileCard';
import { ProfileCard } from '../../profile/ProfileCard';

interface Profile {
  id: string;
  name: string;
  role: string;
  activeApplications: number;
  atsScore: number;
  lastUpdated: string;
  avatarColor: string;
}

interface ProfileVariation {
  id: string;
  profile_name: string;
  keyword_count: number;
  last_modified: Date;
  is_default: boolean;
}

interface ProfileGridProps {
  profiles: Profile[];
  profileVariations: ProfileVariation[];
  onCreateProfile?: () => void;
  onEditProfile: (profile: Profile) => void;
  onDeleteProfile: (id: string) => void;
  onNavigateToCareerGrowth?: () => void;
}

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
      {/* Profile Variations Section */}
      <Card sx={{
      p: 6,
      mb: 6
    }}>
        <h2 sx={{
      typography: "h6",
      fontWeight: 600,
      mb: 4
    }}>Your Profile Variations</h2>
        <ProfileVariationGrid
          profiles={profileVariations}
          onProfileEdit={(id) => console.log('Edit profile:', id)}
          onProfileDuplicate={(id) => console.log('Duplicate profile:', id)}
          onProfileDelete={(id) => console.log('Delete profile:', id)}
          onProfileSetDefault={(id) => console.log('Set default profile:', id)}
          onProfileClick={(id) => console.log('View profile:', id)}
          emptyState={
            <div sx={{
      textAlign: "center",
      py: 8
    }}>
              <p sx={{
      mb: 4
    }}>No profile variations yet</p>
              <Button onClick={() => onCreateProfile?.()}>
                <Plus sx={{
      mr: 2
    }} />
                Create Your First Profile
              </Button>
            </div>
          }
        />
      </Card>

      {/* Profile Cards Grid */}
      <div sx={{
      [theme.breakpoints.up('sm')]: {},
      [theme.breakpoints.up('md')]: {},
      gap: 6
    }}>
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            name={profile.name}
            role={profile.role}
            activeApplications={profile.activeApplications}
            atsScore={profile.atsScore}
            lastUpdated={profile.lastUpdated}
            avatarColor={profile.avatarColor}
            onEdit={() => onEditProfile(profile)}
            onDelete={() => onDeleteProfile(profile.id)}
          />
        ))}
        <CreateProfileCard onCreate={() => onCreateProfile?.()} />

        {/* Career Growth Card */}
        {onNavigateToCareerGrowth && (
          <Card sx={{
      p: 6,
      '&:hover': {},}}>
            <div sx={{}}>
              <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3
    }}>
                <div sx={{
      p: 2,
      borderRadius: "0.5rem"
    }}>
                  <TrendingUp sx={{}} />
                </div>
                <h3 sx={{
      fontWeight: 600,
      typography: "h6"
    }}>Career Growth</h3>
              </div>

              <p sx={{
      typography: "body1"
    }}>
                Explore AI-powered career insights, job matching, and interview preparation tools.
              </p>

              <Button
                onClick={onNavigateToCareerGrowth}
                sx={{
      width: "100%",
      border: 1,
      '&:hover': {}
    }}
                variant="outlined"
              >
                <Sparkles sx={{
      mr: 2
    }} />
                Explore Career Tools
              </Button>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
