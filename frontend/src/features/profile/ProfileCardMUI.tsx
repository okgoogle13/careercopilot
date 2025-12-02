/**
 * ELECTRIC ALCHEMIST: PROFILE CARD (MUI Replacement)
 *
 * Profile card component using Electric Alchemist Design System v4.4.
 * This replaces the MUI ProfileCardMUI component.
 */

import React from 'react';
import { Edit, Trash2, Target, TrendingUp } from 'lucide-react';
import { Card, Button, Badge, Avatar, Progress } from '@/components';
import { cn } from '@/lib/utils';

export interface Profile {
  id: string;
  name: string;
  role: string;
  activeApplications: number;
  atsScore: number;
  lastUpdated: string;
  avatarColor?: string;
}

export interface ProfileCardMUIProps extends Profile {
  onEdit: () => void;
  onDelete: () => void;
  isSelected?: boolean;
  decorImage?: string;
  variant?: 'default' | 'illustrated';
}

const getScoreColor = (score: number) => {
  if (score >= 85) return 'text-primary';
  if (score >= 70) return 'text-tertiary';
  return 'text-error';
};

export const ProfileCardMUI: React.FC<ProfileCardMUIProps> = ({
  name,
  role,
  activeApplications,
  atsScore,
  lastUpdated,
  avatarColor,
  onEdit,
  onDelete,
  isSelected = false,
  variant = 'default',
}) => {
  const scoreColor = getScoreColor(atsScore);
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card
      variant={isSelected ? 'hero' : 'default'}
      className={cn(
        'h-full flex flex-col p-6 transition-all duration-300',
        isSelected && 'border-2 border-primary',
        'hover:border-primary/50'
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <Avatar size="md" initials={initials} className={avatarColor} />
          <div>
            <h3 className="text-hero text-lg font-semibold">{name}</h3>
            <p className="text-data text-sm text-on-surface-variant">{role}</p>
          </div>
        </div>
        <Badge variant="default" className={cn('font-semibold', scoreColor)}>
          {atsScore}%
        </Badge>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-data text-xs text-on-surface-variant">ATS Score</span>
          <span className={cn('text-data text-sm font-semibold', scoreColor)}>{atsScore}%</span>
        </div>
        <Progress value={atsScore} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card variant="default" className="p-3 text-center bg-surface-container-low">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Target className="h-3 w-3 text-primary" />
            <span className="text-data text-xs text-on-surface-variant">Applications</span>
          </div>
          <p className="text-hero text-base font-semibold text-primary">{activeApplications}</p>
        </Card>
        <Card variant="default" className="p-3 text-center bg-surface-container-low">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="h-3 w-3 text-primary" />
            <span className="text-data text-xs text-on-surface-variant">Potential</span>
          </div>
          <p className="text-hero text-base font-semibold text-primary">High</p>
        </Card>
      </div>

      <div className="flex-1" />

      <p className="text-data text-xs text-on-surface-variant text-center mb-3">
        Updated {lastUpdated}
      </p>

      <div className="flex gap-2 pt-3 border-t border-outline-variant">
        <Button variant="ghost" size="sm" onClick={onEdit} className="flex-1">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete} className="flex-1 text-error">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
    </Card>
  );
};

export default ProfileCardMUI;

