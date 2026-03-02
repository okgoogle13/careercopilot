import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UnifiedColumn } from '../UnifiedColumn';
import React from 'react';

describe('UnifiedColumn', () => {
  it('renders title and count correctly', () => {
    render(<UnifiedColumn title="IN RECOVERY" count={5}><div>Content</div></UnifiedColumn>);
    expect(screen.getByText('IN RECOVERY')).toBeDefined();
    expect(screen.getByText('5')).toBeDefined();
    expect(screen.getByText('Content')).toBeDefined();
  });

  it('renders headerAction when provided', () => {
    const action = <button data-testid="test-action">Action</button>;
    render(<UnifiedColumn title="TEST" headerAction={action} />);
    expect(screen.getByTestId('test-action')).toBeDefined();
  });
});
