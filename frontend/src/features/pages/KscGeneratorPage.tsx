/**
 * ELECTRIC ALCHEMIST: KSC GENERATOR PAGE
 *
 * KSC Generator page using Electric Alchemist Design System v4.4.
 */

import React from 'react';
import { Container, Card, Button, Textarea } from '@/components';

export function KscGeneratorPage() {
  return (
    <Container size="lg">
      <div className="py-8">
        <h1 className="text-hero text-3xl font-semibold mb-6">KSC Generator</h1>
        <Card variant="default" className="p-6">
          <div className="space-y-4">
            <Textarea
              label="Selection Criteria"
              placeholder="Enter the selection criteria here..."
              rows={10}
            />
            <Button variant="default">Generate Response</Button>
          </div>
        </Card>
      </div>
    </Container>
  );
}

export default KscGeneratorPage;

