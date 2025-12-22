import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DocumentsPage } from '@/features/pages/DocumentsPage';
import '@testing-library/jest-dom';

// Mock framer-motion to avoid animation issues in jsdom
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}));

describe('DocumentsPage', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the documents heading and description', () => {
    render(<DocumentsPage />);
    expect(screen.getByRole('heading', { name: /Your Documents/i })).toBeInTheDocument();
    expect(
      screen.getByText(/Manage your career documents and generate tailored versions/i)
    ).toBeInTheDocument();
  });

  it('displays search bar and tabs', () => {
    render(<DocumentsPage />);
    expect(screen.getByPlaceholderText(/Search documents/i)).toBeInTheDocument();

    expect(screen.getByText(/all/i)).toBeInTheDocument();
    expect(screen.getByText(/resumes/i)).toBeInTheDocument();
    expect(screen.getByText('Cover Letters')).toBeInTheDocument();
    expect(screen.getByText('KSC Responses')).toBeInTheDocument();
  });

  it('displays document list', () => {
    render(<DocumentsPage />);
    // Check for some hardcoded mock documents
    expect(screen.getByText(/Software Engineer Resume/i)).toBeInTheDocument();
    expect(screen.getByText(/Cover Letter - TechCorp/i)).toBeInTheDocument();
  });

  it('filters documents when tabs are clicked', async () => {
    const user = userEvent.setup();
    render(<DocumentsPage />);

    // Click Resumes tab
    await user.click(screen.getByText(/resumes/i));

    // Resume should be visible
    expect(screen.getByText(/Software Engineer Resume/i)).toBeInTheDocument();

    // Cover letter should NOT be visible (using queryByText to verify absence)
    expect(screen.queryByText(/Cover Letter - TechCorp/i)).not.toBeInTheDocument();
  });

  it('filters documents when Cover Letter tab is clicked', async () => {
    const user = userEvent.setup();
    render(<DocumentsPage />);

    // Click Cover Letters tab
    await user.click(screen.getByText('Cover Letters'));

    // Cover Letter should be visible
    expect(screen.getByText(/Cover Letter - TechCorp/i)).toBeInTheDocument();

    // Resume should NOT be visible
    expect(screen.queryByText(/Software Engineer Resume/i)).not.toBeInTheDocument();
  });

});
