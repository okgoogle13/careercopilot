/**
 * ELECTRIC ALCHEMIST: DOCUMENTS VIEW
 *
 * Empty state view for documents using Electric Alchemist Design System v4.4.
 */

import React from 'react';
import { FileText, Plus } from 'lucide-react';
import { Container, Card, Button } from '@/components/ui';

export interface DocumentsViewProps {
  onCreateDocument?: () => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ onCreateDocument }) => {
  return (
    <Container size="lg">
      <div className="py-16">
        <Card variant="default" className="max-w-lg mx-auto p-12 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-container/20 mb-4">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-hero text-2xl font-semibold mb-2">No Documents Yet</h2>
            <p className="text-human text-base text-on-surface-variant">
              Click "New Document" to get started.
            </p>
          </div>
          <Button variant="default" size="lg" onClick={onCreateDocument} className="px-8">
            <Plus className="h-5 w-5 mr-2" />
            New Document
          </Button>
        </Card>
      </div>
    </Container>
  );
};

export default DocumentsView;

