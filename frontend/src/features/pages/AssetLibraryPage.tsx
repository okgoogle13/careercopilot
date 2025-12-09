/**
 * ELECTRIC ALCHEMIST: ASSET LIBRARY PAGE
 *
 * Asset Library page using Electric Alchemist Design System v4.4.
 */

import React from 'react';
import { Container, Card, Grid } from '@/components';
import { Button } from '@/components/ui/button';
import { FileText, Image, Video } from 'lucide-react';

export function AssetLibraryPage() {
  return (
    <Container size="lg">
      <div className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-hero text-3xl font-semibold">Asset Library</h1>
          <Button variant="default">Upload Asset</Button>
        </div>

        <Grid cols={4} gap="md">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} variant="interactive" className="p-6">
              <FileText className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-hero text-lg font-semibold mb-2">Asset {i}</h3>
              <p className="text-data text-xs text-on-surface-variant">
                Uploaded: {i} days ago
              </p>
            </Card>
          ))}
        </Grid>
      </div>
    </Container>
  );
}

export default AssetLibraryPage;

