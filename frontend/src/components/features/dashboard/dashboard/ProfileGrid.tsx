/**
 * ELECTRIC ALCHEMIST: PROFILE GRID COMPONENT
 *
 * A grid of profile cards with actions for managing profiles.
 */

import React from 'react';
import { Card, Button, Avatar } from '@/components';
import { cn } from '@/lib/utils';

export interface Profile {
  id: string;
  name: string;
  role: string;
  activeApplications: number;
  atsScore: number;
  lastUpdated: string;
  // Add more profile properties as needed
}

interface ProfileGridProps {
  profiles: Profile[];
  onCreateProfile?: () => void;
  onEditProfile?: (id: string) => void;
  onDeleteProfile?: (id: string) => void;
  onNavigateToCareerGrowth?: (id: string) => void;
  className?: string;
}

export function ProfileGrid({
  profiles = [],
  onCreateProfile,
  onEditProfile,
  onDeleteProfile,
  onNavigateToCareerGrowth,
  className,
}: ProfileGridProps) {
  // If no profiles, show empty state
  if (profiles.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center p-8', className)}>
        <div className="text-center">
          <h3 className="text-lg font-medium text-on-surface">No profiles yet</h3>
          <p className="mt-2 text-sm text-on-surface-variant">
            Create your first profile to get started
          </p>
          {onCreateProfile && (
            <Button className="mt-4" onClick={onCreateProfile}>
              Create Profile
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
      {profiles.map((profile) => (
        <Card key={profile.id} className="p-4">
          <div className="flex items-start space-x-4">
            <Avatar className="h-12 w-12">
              {profile.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium text-on-surface">{profile.name}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {profile.atsScore}% Match
                </span>
              </div>
              <p className="text-sm text-on-surface-variant">{profile.role}</p>
              <div className="mt-2 flex items-center text-sm text-on-surface-variant">
                <span>{profile.activeApplications} active applications</span>
                <span className="mx-2">•</span>
                <span>Updated {profile.lastUpdated}</span>
              </div>
              <div className="mt-4 flex space-x-2">
                {onEditProfile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditProfile(profile.id)}
                  >
                    Edit
                  </Button>
                )}
                {onDeleteProfile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteProfile(profile.id)}
                  >
                    Delete
                  </Button>
                )}
                {onNavigateToCareerGrowth && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigateToCareerGrowth(profile.id)}
                  >
                    Career Growth
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default ProfileGrid;
