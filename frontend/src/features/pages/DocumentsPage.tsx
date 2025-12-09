/**
 * ELECTRIC ALCHEMIST: DOCUMENTS PAGE
 *
 * Documents page using Electric Alchemist Design System v4.4.
 */

import React from 'react';
import { Plus, FileText, Filter } from 'lucide-react';
import { Container, Card, Input, Tabs, Grid } from '@/components';
import { Button } from '@/components/ui/button';

export function DocumentsPage() {
  const tabs = [
    {
      id: 'all',
      label: 'All',
      content: (
        <Grid cols={3} gap="md">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} variant="interactive" className="p-6">
              <FileText className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-hero text-lg font-semibold mb-2">Document {i}</h3>
              <p className="text-data text-xs text-on-surface-variant">
                Last modified: 2 days ago
              </p>
            </Card>
          ))}
        </Grid>
      ),
    },
    {
      id: 'resumes',
      label: 'Resumes',
      content: (
        <Grid cols={3} gap="md">
          <Card variant="interactive" className="p-6">
            <FileText className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-hero text-lg font-semibold mb-2">Resume 1</h3>
            <p className="text-data text-xs text-on-surface-variant">
              Last modified: 1 day ago
            </p>
          </Card>
        </Grid>
      ),
    },
    {
      id: 'cover-letters',
      label: 'Cover Letters',
      content: (
        <Grid cols={3} gap="md">
          <Card variant="interactive" className="p-6">
            <FileText className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-hero text-lg font-semibold mb-2">Cover Letter 1</h3>
            <p className="text-data text-xs text-on-surface-variant">
              Last modified: 3 days ago
            </p>
          </Card>
        </Grid>
      ),
    },
    {
      id: 'ksc',
      label: 'KSC',
      content: (
        <Grid cols={3} gap="md">
          <Card variant="interactive" className="p-6">
            <FileText className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-hero text-lg font-semibold mb-2">KSC Document 1</h3>
            <p className="text-data text-xs text-on-surface-variant">
              Last modified: 5 days ago
            </p>
          </Card>
        </Grid>
      ),
    },
  ];

  return (
    <Container size="lg">
      <div className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-hero text-3xl font-semibold">Documents</h1>
          <Button variant="default">
            <Plus className="h-4 w-4 mr-2" />
            New Document
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <Input type="text" placeholder="Search documents..." className="flex-1" />
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        <Tabs tabs={tabs} defaultTab="all" />
      </div>
    </Container>
  );
}

export default DocumentsPage;

