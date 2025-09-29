import React from 'react';
import { Card, Button } from '@mui/material';
import { Add as Plus, TrendingUp, AutoAwesome as Sparkles } from '@mui/icons-material';
import { ProfileCard } from '../../profile/ProfileCard';
import { CreateProfileCard } from '../../profile/CreateProfileCard';
import { ProfileVariationGrid } from '../../../library/ProfileVariationCard';

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
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Your Profile Variations</h2>
        <ProfileVariationGrid
          profiles={profileVariations}
          onProfileEdit={(id) => console.log('Edit profile:', id)}
          onProfileDuplicate={(id) => console.log('Duplicate profile:', id)}
          onProfileDelete={(id) => console.log('Delete profile:', id)}
          onProfileSetDefault={(id) => console.log('Set default profile:', id)}
          onProfileClick={(id) => console.log('View profile:', id)}
          emptyState={
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No profile variations yet</p>
              <Button onClick={() => onCreateProfile?.()}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Profile
              </Button>
            </div>
          }
        />
      </Card>

      {/* Profile Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20 hover:border-primary/40 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Career Growth</h3>
              </div>

              <p className="text-muted-foreground text-sm">
                Explore AI-powered career insights, job matching, and interview preparation tools.
              </p>

              <Button
                onClick={onNavigateToCareerGrowth}
                className="w-full bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20"
                variant="outlined"
              >
                <AutoAwesome as Sparkles className="w-4 h-4 mr-2" />
                Explore Career Tools
              </Button>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
