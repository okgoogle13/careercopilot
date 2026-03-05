import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProfileHeader } from '../index';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: any) => <div className={className}>{children}</div>,
    h1: ({ children, className }: any) => <h1 className={className}>{children}</h1>,
    span: ({ children, className }: any) => <span className={className}>{children}</span>,
  },
}));

describe('ProfileHeader', () => {
  const defaultProps = {
    name: 'OK GOOGLE',
    bio: 'Agent Engineering Lead',
    identityTags: ['Engineer', 'Mentor'],
  };

  it('renders name and bio correctly', () => {
    render(<ProfileHeader {...defaultProps} />);
    expect(screen.getByText('OK GOOGLE')).toBeInTheDocument();
    expect(screen.getByText('Agent Engineering Lead')).toBeInTheDocument();
  });

  it('renders identity tags', () => {
    render(<ProfileHeader {...defaultProps} />);
    expect(screen.getByText('Engineer')).toBeInTheDocument();
    expect(screen.getByText('Mentor')).toBeInTheDocument();
  });

  it('renders avatar image if URL provided', () => {
    render(
      <ProfileHeader
        {...defaultProps}
        avatarUrl="https://example.com/avatar.jpg"
      />
    );
    const img = screen.getByAltText('OK GOOGLE');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('renders fallback initial if no avatar URL', () => {
    render(
      <ProfileHeader
        {...defaultProps}
        avatarUrl={undefined}
      />
    );
    expect(screen.getByText('O')).toBeInTheDocument();
  });

  it('renders land acknowledgment', () => {
    render(
      <ProfileHeader
        {...defaultProps}
        landAcknowledgment="Custom Country"
      />
    );
    expect(screen.getByText('Acknowledging: Custom Country')).toBeInTheDocument();
  });

  it('defaults land acknowledgment if not provided', () => {
    render(<ProfileHeader {...defaultProps} />);
    expect(screen.getByText(/Acknowledging: Wurundjeri/)).toBeInTheDocument();
  });
});
