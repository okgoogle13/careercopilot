/**
 * Critical tests for ApplicationCard component.
 * Priority: HIGH - 20% coverage, key UI component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ApplicationCard } from '../ApplicationCard';
import { BrowserRouter } from 'react-router-dom';
import { jest, describe, it, expect } from '@jest/globals';

describe('ApplicationCard Component', () => {
  const defaultProps = {
    title: 'Senior Software Engineer',
    company: 'Tech Company',
    location: 'Remote',
    appliedDate: '2026-03-01',
    currentStep: 0,
    steps: ['Applied', 'Screening', 'Interview', 'Offer'],
    onUpdateStatus: jest.fn(),
  };

  it('renders application details correctly', () => {
    render(
      <BrowserRouter>
        <ApplicationCard {...defaultProps} />
      </BrowserRouter>
    );

    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Tech Company')).toBeInTheDocument();
    expect(screen.getByText(/Remote/)).toBeInTheDocument();
    expect(screen.getByText(/Applied 2026-03-01/)).toBeInTheDocument();
  });

  it('calls onUpdateStatus when update button is clicked', () => {
    render(
      <BrowserRouter>
        <ApplicationCard {...defaultProps} />
      </BrowserRouter>
    );

    const updateButton = screen.getByText(/Update Status/i);
    fireEvent.click(updateButton);

    expect(defaultProps.onUpdateStatus).toHaveBeenCalled();
  });

  it('highlights the current step', () => {
    render(
      <BrowserRouter>
        <ApplicationCard
          {...defaultProps}
          currentStep={2}
        />
      </BrowserRouter>
    );

    // The current step 'Interview' should have the primary-container class
    // We use getAllByText because it appears in both status badge and stepper
    const currentStepElement = screen.getAllByText('Interview')[1].parentElement;
    expect(currentStepElement).toHaveClass('bg-primary-container');
  });
});
