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
      typography: h6,
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
      "text-muted-foreground": true,
      mb: 4
    }}>No profile variations yet</p>
              <Button onClick={() => onCreateProfile?.()}>
                <Plus sx={{
      "w-4": true,
      "h-4": true,
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
      "grid": true,
      "grid-cols-1": true,
      [theme.breakpoints.up('sm')]: { "grid-cols-2": true },
      [theme.breakpoints.up('md')]: { "grid-cols-3": true },
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
      "bg-gradient-to-br": true,
      "from-primary/5": true,
      "to-purple-500/5": true,
      "border-primary/20": true,
      '&:hover': { "border-primary/40": true },
      "transition-colors": true
    }}>
            <div sx={{
      "space-y-4": true
    }}>
              <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3
    }}>
                <div sx={{
      p: 2,
      "bg-primary/10": true,
      borderRadius: 0.5rem
    }}>
                  <TrendingUp sx={{
      "w-5": true,
      "h-5": true,
      "text-primary": true
    }} />
                </div>
                <h3 sx={{
      fontWeight: 600,
      typography: h6
    }}>Career Growth</h3>
              </div>

              <p sx={{
      "text-muted-foreground": true,
      typography: body1
    }}>
                Explore AI-powered career insights, job matching, and interview preparation tools.
              </p>

              <Button
                onClick={onNavigateToCareerGrowth}
                sx={{
      width: "100%",
      "bg-primary/10": true,
      "text-primary": true,
      border: 1,
      "border-primary/30": true,
      '&:hover': { "bg-primary/20": true }
    }}
                variant="outlined"
              >
                <Sparkles sx={{
      "w-4": true,
      "h-4": true,
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
