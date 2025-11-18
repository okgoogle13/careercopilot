// Test file for auto-fix workflow validation
// This file contains intentional issues that should be auto-fixed:
// 1. Unused imports
// 2. Unorganized imports
// 3. Hardcoded colors (M3 violation)
// 4. Hardcoded spacing (M3 violation)
// 5. ESLint issues

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button, Card } from '@mui/material';
import axios from 'axios';
import { Dialog, TextField, IconButton } from '@mui/material';  // Unused: Dialog, TextField, IconButton
import { formatDate } from '../../utils/dateUtils';  // Assume this doesn't exist - unused

// Hardcoded color - M3 violation
const StyledCard = {
  backgroundColor: '#1976d2',  // Should use var(--sys-color-primary)
  color: '#ffffff',  // Should use var(--sys-color-primary-contrast)
  padding: '16px',  // Should use var(--sys-space-_md)
  margin: '8px',  // Should use var(--sys-space-_sm)
  borderRadius: '4px',  // Should use var(--sys-shape-radius-sm)
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',  // Should use var(--sys-elevation-shadow-1)
};

// ESLint issue: unused variable
const unusedVariable = 'This should be removed';

interface TestComponentProps {
  title: string;
  description?: string;
}

export const TestComponent: React.FC<TestComponentProps> = ({ title, description }) => {
  const [count, setCount] = useState(0);

  // ESLint issue: useEffect missing dependency
  useEffect(() => {
    console.log('Component mounted');
    console.log(title);  // title is used but not in deps
  }, []);  // Missing dependency: title

  // Unused callback - should be detected
  const unusedCallback = useCallback(() => {
    console.log('This is never called');
  }, []);

  // No explicit return type - TypeScript warning
  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div style={StyledCard}>
      <h2 style={{
        color: '#333333',  // M3 violation
        fontSize: '24px',  // Should use var(--sys-text-_2xl)
        marginBottom: '12px'  // Should use var(--sys-space-_md)
      }}>
        {title}
      </h2>
      {description && (
        <p style={{
          color: 'rgba(0, 0, 0, 0.6)',  // Should use var(--sys-color-text-secondary)
          fontSize: '14px'  // Should use var(--sys-text-_sm)
        }}>
          {description}
        </p>
      )}
      <Button
        onClick={handleClick}
        style={{
          backgroundColor: '#1976d2',  // M3 violation
          color: 'white',
          padding: '8px 16px',  // M3 violation
          borderRadius: '4px'  // M3 violation
        }}
      >
        Clicked: {count} times
      </Button>
    </div>
  );
};

// Missing default export for stories
export default TestComponent;
