import { render, screen } from '@testing-library/react';
import { ResumeAuditPage } from '../ResumeAuditPage';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Mock child components
jest.mock('../../components/resume/ResumeAuditor', () => ({
  ResumeAuditor: () => <div data-testid="resume-auditor" />,
}));
jest.mock('../../components/resume/AuditResults', () => ({
  AuditResults: () => <div data-testid="audit-results" />,
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ResumeAuditPage', () => {
  it('renders the page header and child components', () => {
    renderWithRouter(<ResumeAuditPage />);
    expect(screen.getByText(/Resume Knowledge Library/i)).toBeInTheDocument();
    expect(screen.getByTestId('resume-auditor')).toBeInTheDocument();
    expect(screen.getByTestId('audit-results')).toBeInTheDocument();
  });

  it('renders the footer information', () => {
    renderWithRouter(<ResumeAuditPage />);
    expect(screen.getByText(/CareerCopilot RKL Engine/i)).toBeInTheDocument();
  });
});
