import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { KscGeneratorPage } from '../kscgeneratorpage';

// Mock the AI services
jest.mock('@/api/aiServices', () => ({
  generateKscResponses: jest.fn(),
  generateSingleKscResponse: jest.fn(),
}));

// Mock the KscCriterionCard component since it might have complex dependencies
jest.mock('@/components/ui/ksccriterioncard', () => ({
  KscCriterionCard: () => <div data-testid="ksc-criterion-card">Mock KSC Card</div>,
}));

describe('KscGeneratorPage', () => {
  it('renders without crashing', () => {
    render(<KscGeneratorPage />);

    // Check that the component renders by looking for the main heading
    const mainHeading = screen.getByText('Key Selection Criteria Generator');
    expect(mainHeading).toBeInTheDocument();
  });

  it('displays the main heading "Key Selection Criteria Generator"', () => {
    render(<KscGeneratorPage />);

    // Check for the exact main heading text
    const mainHeading = screen.getByText('Key Selection Criteria Generator');
    expect(mainHeading).toBeInTheDocument();
  });

  it('contains a Generate button', () => {
    render(<KscGeneratorPage />);

    // Look for the generate button with the new text
    const generateButton = screen.getByRole('button', { name: /Generate Key Selection Criteria Responses/i });
    expect(generateButton).toBeInTheDocument();
  });

  it('render test - component renders without crashing and has required elements', () => {
    render(<KscGeneratorPage />);

    // Foundation render test combining all requirements
    // 1. Renders without crashing (implicit - test would fail if it crashed)
    // 2. Contains main heading
    expect(screen.getByText('Key Selection Criteria Generator')).toBeInTheDocument();

    // 3. Contains Generate button
    expect(screen.getByRole('button', { name: /Generate Key Selection Criteria Responses/i })).toBeInTheDocument();
  });
});
