/**
 * ELECTRIC ALCHEMIST: CREATE PROFILE CARD COMPONENT
 *
 * Card for creating new profiles using Electric Alchemist Design System v4.4.
 * Refactored to use CSS variables from unified design tokens.
 */

import React from 'react';
import { Plus } from 'lucide-react';
import { Card } from '@/components';
import { Button } from '@/components';

export interface CreateProfileCardProps {
  onCreate: () => void;
}

export function CreateProfileCard({ onCreate }: CreateProfileCardProps) {
  return (
    <Card
      variant="interactive"
      className="flex flex-col items-center justify-center text-center h-full"
      style={{
        backgroundColor: 'var(--sys-color-surface-container-low)',
        border: `2px dashed var(--sys-color-outline)`,
        borderRadius: 'var(--sys-shape-radius-card)',
        padding: 'var(--sys-space-card-padding)',
        paddingTop: 'var(--sys-space-card-padding-top)',
        transitionDuration: 'var(--sys-motion-duration-medium-2)',
        transitionTimingFunction: 'var(--sys-motion-easing-standard)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--sys-color-surface-container)';
        e.currentTarget.style.borderColor = 'var(--sys-color-primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--sys-color-surface-container-low)';
        e.currentTarget.style.borderColor = 'var(--sys-color-outline)';
      }}
    >
      <div 
        style={{
          width: '64px',
          height: '64px',
          borderRadius: 'var(--sys-shape-corner-full)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--sys-color-primary-container)',
          color: 'var(--sys-color-primary-on-container)',
          marginBottom: 'var(--sys-space-4)',
        }}
      >
        <Plus 
          style={{ 
            height: 'var(--sys-space-8)',
            width: 'var(--sys-space-8)',
          }} 
        />
      </div>

      <div style={{ marginBottom: 'var(--sys-space-4)' }}>
        <h3 
          style={{
            fontFamily: 'var(--sys-typography-family-hero)',
            fontSize: 'var(--sys-typography-size-headline-md)',
            fontWeight: 500,
            color: 'var(--sys-color-surface-on)',
            margin: 0,
            marginBottom: 'var(--sys-space-2)',
            textTransform: 'uppercase',
          }}
        >
          Create New Profile
        </h3>
        <p 
          style={{
            fontFamily: 'var(--sys-typography-family-human)',
            fontSize: 'var(--sys-typography-size-body-sm)',
            color: 'var(--sys-color-surface-on-variant)',
            margin: 0,
            marginBottom: 'var(--sys-space-4)',
            lineHeight: 1.6,
          }}
        >
          Build a tailored profile to optimize your resume for specific job
          applications and track your progress.
        </p>
      </div>

      <Button 
        variant="default" 
        onClick={onCreate}
        style={{
          borderRadius: 'var(--sys-shape-radius-button)',
        }}
      >
        <Plus 
          style={{ 
            height: 'var(--sys-space-4)',
            width: 'var(--sys-space-4)',
            marginRight: 'var(--sys-space-2)',
          }} 
        />
        Create Profile
      </Button>
    </Card>
  );
}

export default CreateProfileCard;
