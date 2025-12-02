/**
 * ELECTRIC ALCHEMIST: PROFILE VARIATION CARD COMPONENT
 *
 * Profile variation card with menu actions using Electric Alchemist Design System v4.4.
 * Composed of Card, Badge, Button, Progress, and Menu atoms.
 */

import React, { useState } from 'react';
import {
  Calendar,
  Copy,
  Delete,
  Edit,
  MoreVertical,
  Star,
  Tag,
} from 'lucide-react';
import { format } from 'date-fns';
import { Card } from '@/components';
import { Badge } from '@/components/electric';
import { Button } from '@/components/electric/button';
import { Progress } from '@/components/electric';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/electric/DropdownMenu';
import { cn } from '@/lib/utils';

export interface ProfileVariationCardProps {
  profile_name: string;
  keyword_count: number;
  last_modified: Date;
  is_default?: boolean;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onSetDefault?: () => void;
  onClick?: () => void;
}

export function ProfileVariationCard({
  profile_name,
  keyword_count,
  last_modified,
  is_default = false,
  onEdit,
  onDuplicate,
  onDelete,
  onSetDefault,
  onClick,
}: ProfileVariationCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return 'Today';
    } else if (diffInHours < 48) {
      return 'Yesterday';
    }
    return format(date, 'MMM d');
  };

  const optimizationPercentage = Math.min(
    100,
    Math.round((keyword_count / 15) * 100)
  );

  return (
    <Card
      variant="interactive"
      className="relative cursor-pointer overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Default Badge */}
      {is_default && (
        <div className="absolute top-4 left-4 z-10">
          <Badge
            variant="default"
            className="bg-primary-container text-on-primary-container shadow-lg font-semibold"
          >
            <Star className="h-3 w-3 mr-1 fill-current" />
            Default
          </Badge>
        </div>
      )}

      {/* Actions Menu */}
      <div className="absolute top-4 right-4 z-10">
        <DropdownMenu
          trigger={
            <button
              className={cn(
                'w-8 h-8 p-0 rounded-[8px]',
                'bg-surface-container border border-outline-variant',
                'text-on-surface-variant hover:text-on-surface',
                'opacity-0 transition-opacity duration-150',
                isHovered && 'opacity-100',
                'flex items-center justify-center'
              )}
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          }
        >
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDuplicate}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </DropdownMenuItem>
          {!is_default && (
            <>
              <DropdownMenuItem onClick={onSetDefault}>
                <Star className="h-4 w-4 mr-2" />
                Set as Default
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={onDelete}>
                <Delete className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-hero text-lg font-semibold text-on-surface">
            {profile_name}
          </h3>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-on-surface-variant" />
            <div>
              <div className="text-human text-base font-semibold text-on-surface">
                {keyword_count}
              </div>
              <div className="text-human text-xs text-on-surface-variant">
                Keywords
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-on-surface-variant" />
            <div>
              <div className="text-human text-base font-semibold text-on-surface">
                {formatDate(last_modified)}
              </div>
              <div className="text-human text-xs text-on-surface-variant">
                Modified
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-human text-sm text-on-surface">
              Optimization
            </span>
            <span className="text-human text-sm font-semibold text-on-surface">
              {optimizationPercentage}%
            </span>
          </div>
          <Progress value={optimizationPercentage} showLabel={false} />
        </div>

        {/* Action Button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>
    </Card>
  );
}

export interface ProfileVariationGridProps {
  profiles: Array<{
    id: string;
    profile_name: string;
    keyword_count: number;
    last_modified: Date;
    is_default?: boolean;
  }>;
  onProfileEdit?: (id: string) => void;
  onProfileDuplicate?: (id: string) => void;
  onProfileDelete?: (id: string) => void;
  onProfileSetDefault?: (id: string) => void;
  onProfileClick?: (id: string) => void;
  emptyState?: React.ReactNode;
}

export function ProfileVariationGrid({
  profiles,
  onProfileEdit,
  onProfileDuplicate,
  onProfileDelete,
  onProfileSetDefault,
  onProfileClick,
  emptyState,
}: ProfileVariationGridProps) {
  if (profiles.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {profiles.map((profile) => (
        <ProfileVariationCard
          key={profile.id}
          profile_name={profile.profile_name}
          keyword_count={profile.keyword_count}
          last_modified={profile.last_modified}
          is_default={profile.is_default}
          onEdit={() => onProfileEdit?.(profile.id)}
          onDuplicate={() => onProfileDuplicate?.(profile.id)}
          onDelete={() => onProfileDelete?.(profile.id)}
          onSetDefault={() => onProfileSetDefault?.(profile.id)}
          onClick={() => onProfileClick?.(profile.id)}
        />
      ))}
    </div>
  );
}

export default ProfileVariationCard;

