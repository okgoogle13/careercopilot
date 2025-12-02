/**
 * ELECTRIC ALCHEMIST: TEST COMPONENT
 *
 * Test component using Electric Alchemist design system.
 * Replaces MUI components and hardcoded values with design system tokens.
 */

import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { cn } from '@/lib/utils';

export interface TestComponentProps {
  title: string;
  description?: string;
}

/**
 * TestComponent
 *
 * Example component demonstrating Electric Alchemist design system usage.
 */
export const TestComponent: React.FC<TestComponentProps> = ({ title, description }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Component mounted');
    console.log(title);
  }, [title]);

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <Card variant="default" className="p-4">
      <h2 className="text-hero text-2xl mb-3 text-on-surface">{title}</h2>
      {description && (
        <p className="text-human text-sm text-on-surface-variant mb-4">{description}</p>
      )}
      <Button variant="default" onClick={handleClick}>
        Clicked: {count} times
      </Button>
    </Card>
  );
};

export default TestComponent;

