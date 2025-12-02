/**
 * ELECTRIC ALCHEMIST: APPLICATIONS VIEW
 *
 * Empty state view for applications using Electric Alchemist Design System v4.4.
 */

import React from 'react';
import { Target, Plus } from 'lucide-react';
import { Container, Card, Button } from '@/components';

export interface ApplicationsViewProps {
  onAddApplication?: () => void;
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({ onAddApplication }) => {
  return (
    <Container size="xl">
      <div className="py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-hero text-3xl font-semibold mb-2">Applications</h1>
            <p className="text-human text-base text-on-surface-variant">
              Track and manage your job applications
            </p>
          </div>
          <Button variant="default" onClick={onAddApplication} className="px-6">
            <Plus className="h-4 w-4 mr-2" />
            Add Application
          </Button>
        </div>
        <Card variant="default" className="p-16 text-center border-2 border-dashed border-primary/30 bg-primary/5">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-4">
              <Target className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-hero text-xl font-semibold mb-2">No Applications Tracked</h2>
            <p className="text-human text-sm text-on-surface-variant">
              Click "Add Application" to start tracking.
            </p>
          </div>
        </Card>
      </div>
    </Container>
  );
};

export default ApplicationsView;

