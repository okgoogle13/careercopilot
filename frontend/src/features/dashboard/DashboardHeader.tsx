/**
 * ELECTRIC ALCHEMIST: DASHBOARD HEADER FEATURE
 *
 * Dashboard header with welcome message and quick actions.
 */

import React from 'react';
import { Plus, FileText, Briefcase } from 'lucide-react';
import { Button } from '@/components/electric/button';
import { Card } from '@/components';

interface DashboardHeaderProps {
  userName?: string;
  onCreateDocument?: () => void;
  onCreateApplication?: () => void;
}

export function DashboardHeader({
  userName = 'User',
  onCreateDocument,
  onCreateApplication,
}: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-hero text-4xl font-bold text-on-surface mb-2">
            Welcome back, {userName}
          </h1>
          <p className="text-human text-lg text-on-surface-variant">
            Let's get your next application ready
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={onCreateDocument} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            New Document
          </Button>
          <Button onClick={onCreateApplication}>
            <Plus className="h-4 w-4 mr-2" />
            New Application
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6" variant="interactive">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-container rounded-[16px]">
              <FileText className="h-6 w-6 text-on-primary-container" />
            </div>
            <div>
              <p className="text-data text-sm text-on-surface-variant mb-1">Documents</p>
              <p className="text-hero text-2xl font-bold text-on-surface">12</p>
            </div>
          </div>
        </Card>

        <Card className="p-6" variant="interactive">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary-container rounded-[16px]">
              <Briefcase className="h-6 w-6 text-on-secondary" />
            </div>
            <div>
              <p className="text-data text-sm text-on-surface-variant mb-1">Applications</p>
              <p className="text-hero text-2xl font-bold text-on-surface">8</p>
            </div>
          </div>
        </Card>

        <Card className="p-6" variant="interactive">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-tertiary-container rounded-[16px]">
              <Briefcase className="h-6 w-6 text-on-tertiary" />
            </div>
            <div>
              <p className="text-data text-sm text-on-surface-variant mb-1">Match Score</p>
              <p className="text-hero text-2xl font-bold text-primary">94%</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default DashboardHeader;

