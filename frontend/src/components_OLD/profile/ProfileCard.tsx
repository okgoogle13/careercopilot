/**
 * ELECTRIC ALCHEMIST: PROFILE CARD COMPONENT
 *
 * Profile card component using Electric Alchemist Design System v4.4.
 * Composed of Card, Avatar, Button, and Badge atoms.
 */

import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Card, Button, Avatar } from '@/components';
import { cn } from '@/lib/utils';

export interface ProfileCardProps {
  name: string;
  role: string;
  activeApplications: number;
  atsScore: number;
  lastUpdated: string;
  avatarColor?: string;
  onEdit: () => void;
  onDelete: () => void;
  isSelected?: boolean;
}

export function ProfileCard({
  name,
  role,
  activeApplications,
  atsScore,
  lastUpdated,
  avatarColor,
  onEdit,
  onDelete,
  isSelected = false,
}: ProfileCardProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card
      interactive={true}
      className={cn(
        isSelected && 'bg-primary-container border-primary',
        !isSelected && 'bg-surface-container-low'
      )}
    >
      {/* Header with Avatar */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar
          size="lg"
          fallback={initials}
          className={avatarColor ? `bg-[${avatarColor}]` : undefined}
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-hero text-lg font-medium text-on-surface truncate">
            {name}
          </h3>
          <p className="text-human text-sm text-on-surface-variant truncate">
            {role}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-human text-sm text-on-surface-variant">
            Active Applications:
          </span>
          <span className="text-human text-sm font-medium text-on-surface">
            {activeApplications}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-human text-sm text-on-surface-variant">
            ATS Score Average:
          </span>
          <span className="text-human text-sm font-medium text-on-surface">
            {atsScore}%
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-human text-sm text-on-surface-variant">
            Last Updated:
          </span>
          <span className="text-data text-xs text-on-surface-variant">
            {lastUpdated}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-outline-variant">
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="flex-1"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="flex-1 text-error hover:text-error hover:bg-error-container"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

export default ProfileCard;

