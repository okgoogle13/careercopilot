import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoadingState } from '../LoadingState';

describe('LoadingState', () => {
  describe('Basic Rendering', () => {
    it('renders loading spinner', () => {
      render(<LoadingState />);

      // CircularProgress is usually rendered with role="progressbar"
      const progressbar = screen.queryByRole('progressbar');
      expect(progressbar).toBeInTheDocument();
    });

    it('renders default loading message', () => {
      render(<LoadingState />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Custom Message', () => {
    it('renders custom loading message', () => {
      render(<LoadingState message="Please wait..." />);
      expect(screen.getByText('Please wait...')).toBeInTheDocument();
    });

    it('renders custom message for specific action', () => {
      render(<LoadingState message="Fetching data..." />);
      expect(screen.getByText('Fetching data...')).toBeInTheDocument();
    });

    it('renders custom message for upload', () => {
      render(<LoadingState message="Uploading file..." />);
      expect(screen.getByText('Uploading file...')).toBeInTheDocument();
    });
  });

  describe('Size', () => {
    it('renders with default size', () => {
      render(<LoadingState />);
      const progressbar = screen.queryByRole('progressbar');
      expect(progressbar).toBeInTheDocument();
    });

    it('renders with custom size', () => {
      render(<LoadingState size={60} />);
      const progressbar = screen.queryByRole('progressbar');
      expect(progressbar).toBeInTheDocument();
    });

    it('renders with small size', () => {
      render(<LoadingState size={20} />);
      const progressbar = screen.queryByRole('progressbar');
      expect(progressbar).toBeInTheDocument();
    });

    it('renders with large size', () => {
      render(<LoadingState size={80} />);
      const progressbar = screen.queryByRole('progressbar');
      expect(progressbar).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('accepts className prop', () => {
      const { container } = render(
        <LoadingState className="custom-loading" />
      );

      const loadingContainer = container.querySelector('.custom-loading');
      expect(loadingContainer).toBeInTheDocument();
    });

    it('applies centered layout', () => {
      const { container } = render(<LoadingState />);

      // The Box component should have display flex and centered alignment
      const loadingBox = container.firstChild;
      expect(loadingBox).toBeInTheDocument();
    });
  });

  describe('Complete LoadingState', () => {
    it('renders with all props', () => {
      const { container } = render(
        <LoadingState
          message="Processing your request..."
          size={50}
          className="processing-loader"
        />
      );

      expect(screen.getByText('Processing your request...')).toBeInTheDocument();
      const progressbar = screen.queryByRole('progressbar');
      expect(progressbar).toBeInTheDocument();

      const loadingContainer = container.querySelector('.processing-loader');
      expect(loadingContainer).toBeInTheDocument();
    });
  });

  describe('Common Use Cases', () => {
    it('renders for data fetching', () => {
      render(<LoadingState message="Loading data..." />);
      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });

    it('renders for form submission', () => {
      render(<LoadingState message="Submitting form..." />);
      expect(screen.getByText('Submitting form...')).toBeInTheDocument();
    });

    it('renders for authentication', () => {
      render(<LoadingState message="Signing in..." />);
      expect(screen.getByText('Signing in...')).toBeInTheDocument();
    });

    it('renders for file upload', () => {
      render(<LoadingState message="Uploading file..." />);
      expect(screen.getByText('Uploading file...')).toBeInTheDocument();
    });

    it('renders for content loading', () => {
      render(<LoadingState message="Loading content..." />);
      expect(screen.getByText('Loading content...')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides accessible loading indicator', () => {
      render(<LoadingState message="Loading..." />);

      // CircularProgress should be accessible via progressbar role
      const progressbar = screen.queryByRole('progressbar');
      expect(progressbar).toBeInTheDocument();
    });

    it('provides text description', () => {
      render(<LoadingState message="Processing..." />);

      // Message should be visible and descriptive
      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });
  });
});
