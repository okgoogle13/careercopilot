import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KanbanBoard } from '../KanbanBoard';
import React from 'react';

describe('KanbanBoard', () => {
  it('renders children correctly', () => {
    render(
      <KanbanBoard>
        <div data-testid="col-1">Column 1</div>
        <div data-testid="col-2">Column 2</div>
      </KanbanBoard>
    );
    expect(screen.getByTestId('col-1')).toBeDefined();
    expect(screen.getByTestId('col-2')).toBeDefined();
  });

  it('applies overflow-x-auto by default', () => {
    const { container } = render(<KanbanBoard>Content</KanbanBoard>);
    expect(container.firstChild).toHaveClass('overflow-x-auto');
  });
});
