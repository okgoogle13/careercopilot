/**
 * ELECTRIC ALCHEMIST: CREATE PROFILE CARD COMPONENT
 *
 * Card for creating new profiles using Electric Alchemist Design System v4.4.
 * Composed of Card and Button atoms.
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
      className="flex flex-col items-center justify-center text-center h-full bg-surface-container-low border-dashed border-2 border-outline hover:bg-surface-container"
    >
      <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary-container text-on-primary-container mb-4">
        <Plus className="h-8 w-8" />
      </div>

      <div className="mb-4">
        <h3 className="text-hero text-lg font-medium text-on-surface mb-2">
          Create New Profile
        </h3>
        <p className="text-human text-sm text-on-surface-variant mb-4">
          Build a tailored profile to optimize your resume for specific job
          applications and track your progress.
        </p>
      </div>

      <Button variant="default" onClick={onCreate}>
        <Plus className="h-4 w-4 mr-2" />
        Create Profile
      </Button>
    </Card>
  );
}

export default CreateProfileCard;

