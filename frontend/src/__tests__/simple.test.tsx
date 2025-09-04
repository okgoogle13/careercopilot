import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Simple Test', () => {
  it('renders a div with text', () => {
    // Arrange
    render(<div data-testid='test-div'>Test Content</div>);

    // Act
    const element = screen.getByTestId('test-div');

    // Assert
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Test Content');
  });
});
