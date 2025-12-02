/**
 * ELECTRIC ALCHEMIST: OPPORTUNITIES VIEW
 *
 * Empty state view for opportunities using Electric Alchemist Design System v4.4.
 */

import React from 'react';
import { Briefcase, Search } from 'lucide-react';
import { Container, Card, Button } from '@/components';

export interface OpportunitiesViewProps {
  onAnalyzeJob?: () => void;
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({ onAnalyzeJob }) => {
  return (
    <Container size="xl">
      <div className="py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-hero text-3xl font-semibold mb-2">Opportunities</h1>
            <p className="text-human text-base text-on-surface-variant">
              Discover and analyze job opportunities that match your profile
            </p>
          </div>
          <Button variant="secondary" onClick={onAnalyzeJob} className="px-6">
            <Search className="h-4 w-4 mr-2" />
            Analyze Job
          </Button>
        </div>
        <Card variant="default" className="p-16 text-center border-2 border-dashed border-secondary/30 bg-secondary/5">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/20 mb-4">
              <Briefcase className="h-12 w-12 text-secondary" />
            </div>
            <h2 className="text-hero text-xl font-semibold mb-2">Find Your Next Role</h2>
            <p className="text-human text-sm text-on-surface-variant">
              Use the "Analyze Job" feature to get started.
            </p>
          </div>
        </Card>
      </div>
    </Container>
  );
};

export default OpportunitiesView;

