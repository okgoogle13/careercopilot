/**
 * ELECTRIC ALCHEMIST: PROFILE CARD (MUI Replacement)
 *
 * Profile card component using Electric Alchemist Design System v4.4.
 * Refactored to use CSS variables from unified design tokens.
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

const getScoreColor = (score: number): string => {
  if (score >= 85) return 'var(--sys-color-primary)';
  if (score >= 70) return 'var(--sys-color-tertiary)';
  return 'var(--sys-color-error)';
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
      className={cn('h-full flex flex-col transition-all')}
      style={{
        padding: 'var(--sys-space-6)',
        borderRadius: 'var(--sys-shape-radius-card)',
        backgroundColor: isSelected
          ? 'var(--sys-color-primary-container)'
          : 'var(--sys-color-surface-container)',
        border: isSelected
          ? `2px solid var(--sys-color-primary)`
          : `1px solid var(--sys-color-outline-variant)`,
        borderColor: isSelected
          ? 'var(--sys-color-primary)'
          : 'var(--sys-color-outline-variant)',
        transitionDuration: 'var(--sys-motion-duration-medium-2)',
        transitionTimingFunction: 'var(--sys-motion-easing-standard)',
      }}
    >
      <div
        className="flex justify-between items-start"
        style={{ marginBottom: 'var(--sys-space-4)' }}
      >
        <div
          className="flex items-center"
          style={{ gap: 'var(--sys-space-3)' }}
        >
          <Avatar size="md" fallback={initials} className={avatarColor} />
          <div>
            <h3
              style={{
                fontFamily: 'var(--sys-typography-family-hero)',
                fontSize: 'var(--sys-typography-size-headline-md)',
                fontWeight: 600,
                color: isSelected
                  ? 'var(--sys-color-primary-on-container)'
                  : 'var(--sys-color-surface-on)',
                margin: 0,
                marginBottom: 'var(--sys-space-2)',
              }}
            >
              {name}
            </h3>
            <p
              style={{
                fontFamily: 'var(--sys-typography-family-data)',
                fontSize: 'var(--sys-typography-size-body-sm)',
                color: 'var(--sys-color-surface-on-variant)',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {role}
            </p>
          </div>
        </div>
        <Badge
          variant="default"
          className="font-semibold"
          style={{
            color: scoreColor,
            backgroundColor: isSelected
              ? 'var(--sys-color-primary)'
              : 'var(--sys-color-surface-container-high)',
          }}
        >
          {atsScore}%
        </Badge>
      </div>

      <div style={{ marginBottom: 'var(--sys-space-4)' }}>
        <div
          className="flex justify-between items-center"
          style={{ marginBottom: 'var(--sys-space-2)' }}
        >
          <span
            style={{
              fontFamily: 'var(--sys-typography-family-data)',
              fontSize: 'var(--sys-space-2)',
              color: 'var(--sys-color-surface-on-variant)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            ATS Score
          </span>
          <span
            style={{
              fontFamily: 'var(--sys-typography-family-data)',
              fontSize: 'var(--sys-typography-size-body-sm)',
              fontWeight: 600,
              color: scoreColor,
            }}
          >
            {atsScore}%
          </span>
        </div>
        <Progress value={atsScore} />
      </div>

      <div
        className="grid grid-cols-2"
        style={{
          gap: 'var(--sys-space-3)',
          marginBottom: 'var(--sys-space-4)',
        }}
      >
        <Card
          variant="default"
          className="p-3 text-center"
          style={{
            padding: 'var(--sys-space-3)',
            backgroundColor: 'var(--sys-color-surface-container-low)',
            borderRadius: 'var(--sys-shape-corner-medium)',
            border: `1px solid var(--sys-color-outline-variant)`,
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              gap: 'var(--sys-space-1)',
              marginBottom: 'var(--sys-space-1)',
            }}
          >
            <Target
              style={{
                height: 'var(--sys-space-3)',
                width: 'var(--sys-space-3)',
                color: 'var(--sys-color-primary)',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--sys-typography-family-data)',
                fontSize: 'var(--sys-space-2)',
                color: 'var(--sys-color-surface-on-variant)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Applications
            </span>
          </div>
          <p
            style={{
              fontFamily: 'var(--sys-typography-family-hero)',
              fontSize: 'var(--sys-typography-size-body-md)',
              fontWeight: 600,
              color: 'var(--sys-color-primary)',
              margin: 0,
            }}
          >
            {activeApplications}
          </p>
        </Card>
        <Card
          variant="default"
          className="p-3 text-center"
          style={{
            padding: 'var(--sys-space-3)',
            backgroundColor: 'var(--sys-color-surface-container-low)',
            borderRadius: 'var(--sys-shape-corner-medium)',
            border: `1px solid var(--sys-color-outline-variant)`,
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              gap: 'var(--sys-space-1)',
              marginBottom: 'var(--sys-space-1)',
            }}
          >
            <TrendingUp
              style={{
                height: 'var(--sys-space-3)',
                width: 'var(--sys-space-3)',
                color: 'var(--sys-color-primary)',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--sys-typography-family-data)',
                fontSize: 'var(--sys-space-2)',
                color: 'var(--sys-color-surface-on-variant)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Potential
            </span>
          </div>
          <p
            style={{
              fontFamily: 'var(--sys-typography-family-hero)',
              fontSize: 'var(--sys-typography-size-body-md)',
              fontWeight: 600,
              color: 'var(--sys-color-primary)',
              margin: 0,
            }}
          >
            High
          </p>
        </Card>
      </div>

      <div className="flex-1" />

      <p
        style={{
          fontFamily: 'var(--sys-typography-family-data)',
          fontSize: 'var(--sys-space-2)',
          color: 'var(--sys-color-surface-on-variant)',
          textAlign: 'center',
          margin: 0,
          marginBottom: 'var(--sys-space-3)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        Updated {lastUpdated}
      </p>

      <div
        className="flex"
        style={{
          gap: 'var(--sys-space-2)',
          paddingTop: 'var(--sys-space-3)',
          borderTop: `1px solid var(--sys-color-outline-variant)`,
        }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="flex-1"
          style={{
            color: 'var(--sys-color-surface-on)',
          }}
        >
          <Edit
            style={{
              height: 'var(--sys-space-4)',
              width: 'var(--sys-space-4)',
              marginRight: 'var(--sys-space-2)',
            }}
          />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="flex-1"
          style={{
            color: 'var(--sys-color-error)',
          }}
        >
          <Trash2
            style={{
              height: 'var(--sys-space-4)',
              width: 'var(--sys-space-4)',
              marginRight: 'var(--sys-space-2)',
            }}
          />
          Delete
        </Button>
      </div>
    </Card>
  );
};

export default ProfileCardMUI;
