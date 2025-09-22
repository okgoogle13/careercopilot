import React from 'react';
import { M3Card, M3CardHeader, M3CardTitle, M3CardDescription, M3CardContent, M3CardFooter, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './m3-card';
import { M3Button } from './m3-button';

// Test component to verify M3Card works correctly
export const M3CardTest = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <h2 className="col-span-full text-2xl font-bold mb-4">M3Card Test</h2>

      {/* Test M3 variants */}
      <M3Card variant="default">
        <M3CardHeader>
          <M3CardTitle>Default Card</M3CardTitle>
          <M3CardDescription>Standard M3 card with default styling</M3CardDescription>
        </M3CardHeader>
        <M3CardContent>
          <p>This is the content of a default M3 card.</p>
        </M3CardContent>
        <M3CardFooter>
          <M3Button variant="filled">Action</M3Button>
        </M3CardFooter>
      </M3Card>

      <M3Card variant="interactive">
        <M3CardHeader>
          <M3CardTitle>Interactive Card</M3CardTitle>
          <M3CardDescription>Card with hover effects</M3CardDescription>
        </M3CardHeader>
        <M3CardContent>
          <p>This card has interactive hover states.</p>
        </M3CardContent>
      </M3Card>

      <M3Card variant="selected">
        <M3CardHeader>
          <M3CardTitle>Selected Card</M3CardTitle>
          <M3CardDescription>Card in selected state</M3CardDescription>
        </M3CardHeader>
        <M3CardContent>
          <p>This card appears selected.</p>
        </M3CardContent>
      </M3Card>

      <M3Card variant="loading">
        <M3CardHeader>
          <M3CardTitle>Loading Card</M3CardTitle>
          <M3CardDescription>Card in loading state</M3CardDescription>
        </M3CardHeader>
        <M3CardContent>
          <p>This card is in loading state.</p>
        </M3CardContent>
      </M3Card>

      <M3Card variant="error">
        <M3CardHeader>
          <M3CardTitle>Error Card</M3CardTitle>
          <M3CardDescription>Card showing error state</M3CardDescription>
        </M3CardHeader>
        <M3CardContent>
          <p>This card indicates an error.</p>
        </M3CardContent>
      </M3Card>

      {/* Test Aurora variant */}
      <M3Card aurora>
        <M3CardHeader>
          <M3CardTitle>Aurora Card</M3CardTitle>
          <M3CardDescription>Card with Aurora gradient effects</M3CardDescription>
        </M3CardHeader>
        <M3CardContent>
          <p>This card has beautiful Aurora styling with glass morphism and glow effects.</p>
        </M3CardContent>
        <M3CardFooter>
          <M3Button variant="aurora">Aurora Action</M3Button>
        </M3CardFooter>
      </M3Card>

      {/* Test Legacy Card (should work the same) */}
      <Card variant="interactive">
        <CardHeader>
          <CardTitle>Legacy Card</CardTitle>
          <CardDescription>Legacy Card component alias</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This uses the legacy Card component but should render with M3 styling.</p>
        </CardContent>
        <CardFooter>
          <M3Button variant="outlined">Legacy Button</M3Button>
        </CardFooter>
      </Card>

      {/* Test Elevation levels */}
      <M3Card elevation={0}>
        <M3CardHeader>
          <M3CardTitle>Elevation 0</M3CardTitle>
          <M3CardDescription>No shadow</M3CardDescription>
        </M3CardHeader>
      </M3Card>

      <M3Card elevation={3}>
        <M3CardHeader>
          <M3CardTitle>Elevation 3</M3CardTitle>
          <M3CardDescription>Medium shadow</M3CardDescription>
        </M3CardHeader>
      </M3Card>

      <M3Card elevation={5}>
        <M3CardHeader>
          <M3CardTitle>Elevation 5</M3CardTitle>
          <M3CardDescription>High shadow</M3CardDescription>
        </M3CardHeader>
      </M3Card>
    </div>
  );
};