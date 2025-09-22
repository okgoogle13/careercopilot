import React from 'react';
import { M3Button, Button, AuroraButton } from './m3-button';

// Test component to verify M3Button works correctly
export const M3ButtonTest = () => {
  return (
    <div className="space-y-4 p-4">
      <h2>M3Button Test</h2>

      {/* Test M3 variants */}
      <div className="space-x-2">
        <M3Button variant="filled">Filled</M3Button>
        <M3Button variant="outlined">Outlined</M3Button>
        <M3Button variant="text">Text</M3Button>
        <M3Button variant="elevated">Elevated</M3Button>
        <M3Button variant="tonal">Tonal</M3Button>
        <M3Button variant="aurora">Aurora</M3Button>
      </div>

      {/* Test legacy variants (should map correctly) */}
      <div className="space-x-2">
        <Button variant="elevation">Default</Button>
        <Button variant="outlined">Destructive</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="text">Ghost</Button>
        <Button variant="link">Link</Button>
        <Button variant="outlined">Outline</Button>
      </div>

      {/* Test Aurora Button */}
      <div className="space-x-2">
        <AuroraButton>Aurora Button</AuroraButton>
      </div>

      {/* Test loading state */}
      <div className="space-x-2">
        <M3Button isLoading>Loading</M3Button>
        <M3Button isLoading loadingText="Please wait...">Loading with text</M3Button>
      </div>

      {/* Test sizes */}
      <div className="space-x-2">
        <M3Button size="small">Small</M3Button>
        <M3Button size="medium">Medium</M3Button>
        <M3Button size="large">Large</M3Button>
      </div>
    </div>
  );
};