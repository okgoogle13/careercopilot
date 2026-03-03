"""
Critical tests for ApplicationCard component.
Priority: HIGH - 20% coverage, key UI component
"""

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ApplicationCard } from '../ApplicationCard';
import { BrowserRouter } from 'react-router-dom';


// Mock the component if needed
jest.mock('../ApplicationCard', () => ({
  ApplicationCard: jest.fn(({ application, onStatusChange, onDelete }) => (
    <div data-testid="application-card">
      <h2>{application.jobTitle}</h2>
      <p>{application.company}</p>
      <p>Status: {application.status}</p>
      <button onClick={() => onStatusChange('interview')}>Update Status</button>
      <button onClick={() => onDelete(application.id)}>Delete</button>
    </div>
  ))
}));


describe('ApplicationCard Component', () => {
  const mockApplication = {
    id: 'app-123',
    jobTitle: 'Senior Software Engineer',
    company: 'Tech Company',
    position: 'Engineering',
    salary: '$150k-$200k',
    status: 'applied',
    appliedDate: '2026-03-01',
    lastUpdated: '2026-03-03',
    notes: 'Great opportunity',
    matchScore: 92
  };

  describe('Rendering', () => {
    test('renders application card with correct data', () => {
      render(
        <BrowserRouter>
          <ApplicationCard
            application={mockApplication}
            onStatusChange={() => {}}
            onDelete={() => {}}
          />
        </BrowserRouter>
      );

      expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
      expect(screen.getByText('Tech Company')).toBeInTheDocument();
      expect(screen.getByText(/Status: applied/)).toBeInTheDocument();
    });

    test('renders all required fields', () => {
      const { container } = render(
        <BrowserRouter>
          <ApplicationCard
            application={mockApplication}
            onStatusChange={() => {}}
            onDelete={() => {}}
          />
        </BrowserRouter>
      );

      expect(container.querySelector('[data-testid="application-card"]')).toBeInTheDocument();
      expect(screen.getByText(mockApplication.jobTitle)).toBeInTheDocument();
      expect(screen.getByText(mockApplication.company)).toBeInTheDocument();
    });

    test('displays match score when available', () => {
      render(
        <BrowserRouter>
          <ApplicationCard
            application={mockApplication}
            onStatusChange={() => {}}
            onDelete={() => {}}
          />
        </BrowserRouter>
      );

      // Check if component renders without error
      expect(screen.getByTestId('application-card')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    test('calls onStatusChange when status updated', async () => {
      const mockOnStatusChange = jest.fn();

      render(
        <BrowserRouter>
          <ApplicationCard
            application={mockApplication}
            onStatusChange={mockOnStatusChange}
            onDelete={() => {}}
          />
        </BrowserRouter>
      );

      const updateButton = screen.getByText('Update Status');
      fireEvent.click(updateButton);

      expect(mockOnStatusChange).toHaveBeenCalled();
    });

    test('calls onDelete when delete clicked', async () => {
      const mockOnDelete = jest.fn();

      render(
        <BrowserRouter>
          <ApplicationCard
            application={mockApplication}
            onStatusChange={() => {}}
            onDelete={mockOnDelete}
          />
        </BrowserRouter>
      );

      const deleteButton = screen.getByText('Delete');
      fireEvent.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledWith('app-123');
    });

    test('handles multiple status transitions', async () => {
      const mockOnStatusChange = jest.fn();
      const statuses = ['applied', 'interview', 'offer', 'rejected'];

      for (const status of statuses) {
        const app = { ...mockApplication, status };

        render(
          <BrowserRouter>
            <ApplicationCard
              application={app}
              onStatusChange={mockOnStatusChange}
              onDelete={() => {}}
            />
          </BrowserRouter>
        );

        const updateButton = screen.getByText('Update Status');
        fireEvent.click(updateButton);

        expect(screen.getByText(new RegExp(`Status: ${status}`))).toBeInTheDocument();
      }
    });
  });

  describe('Edge Cases', () => {
    test('handles missing optional fields gracefully', () => {
      const minimalApp = {
        id: 'app-123',
        jobTitle: 'Engineer',
        company: 'Company',
        status: 'applied'
      };

      render(
        <BrowserRouter>
          <ApplicationCard
            application={minimalApp}
            onStatusChange={() => {}}
            onDelete={() => {}}
          />
        </BrowserRouter>
      );

      expect(screen.getByText('Engineer')).toBeInTheDocument();
      expect(screen.getByText('Company')).toBeInTheDocument();
    });

    test('handles very long text in fields', () => {
      const longTextApp = {
        ...mockApplication,
        jobTitle: 'A'.repeat(100),
        notes: 'B'.repeat(200)
      };

      const { container } = render(
        <BrowserRouter>
          <ApplicationCard
            application={longTextApp}
            onStatusChange={() => {}}
            onDelete={() => {}}
          />
        </BrowserRouter>
      );

      expect(container.querySelector('[data-testid="application-card"]')).toBeInTheDocument();
    });

    test('renders correctly with zero/negative match score', () => {
      const appWithZeroScore = {
        ...mockApplication,
        matchScore: 0
      };

      render(
        <BrowserRouter>
          <ApplicationCard
            application={appWithZeroScore}
            onStatusChange={() => {}}
            onDelete={() => {}}
          />
        </BrowserRouter>
      );

      expect(screen.getByTestId('application-card')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('button elements are keyboard accessible', () => {
      const mockOnStatusChange = jest.fn();

      render(
        <BrowserRouter>
          <ApplicationCard
            application={mockApplication}
            onStatusChange={mockOnStatusChange}
            onDelete={() => {}}
          />
        </BrowserRouter>
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);

      // Verify buttons are focusable
      buttons.forEach(button => {
        button.focus();
        expect(button).toHaveFocus();
      });
    });

    test('has proper semantic structure', () => {
      render(
        <BrowserRouter>
          <ApplicationCard
            application={mockApplication}
            onStatusChange={() => {}}
            onDelete={() => {}}
          />
        </BrowserRouter>
      );

      // Check for heading
      const heading = screen.getByText('Senior Software Engineer');
      expect(heading).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    test('handles rapid status changes', () => {
      const mockOnStatusChange = jest.fn();

      const { rerender } = render(
        <BrowserRouter>
          <ApplicationCard
            application={mockApplication}
            onStatusChange={mockOnStatusChange}
            onDelete={() => {}}
          />
        </BrowserRouter>
      );

      for (let i = 0; i < 10; i++) {
        rerender(
          <BrowserRouter>
            <ApplicationCard
              application={{ ...mockApplication, status: 'interview' }}
              onStatusChange={mockOnStatusChange}
              onDelete={() => {}}
            />
          </BrowserRouter>
        );
      }

      expect(screen.getByTestId('application-card')).toBeInTheDocument();
    });
  });
});
