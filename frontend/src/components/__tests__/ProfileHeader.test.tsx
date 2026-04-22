import { render, screen } from '@testing-library/react';
import { ProfileHeader } from '../ProfileHeader';
import React from 'react';

describe('ProfileHeader', () => {
  const props = {
    name: 'Nishant Dougall',
    bio: 'Architect',
    identityTags: ['Engineer', 'Auditor'],
  };

  it('renders name and bio', () => {
    render(<ProfileHeader {...props} />);
    expect(screen.getByText('Nishant Dougall')).toBeDefined();
    expect(screen.getByText('Architect')).toBeDefined();
  });

  it('renders identity tags', () => {
    render(<ProfileHeader {...props} />);
    expect(screen.getByText('Engineer')).toBeDefined();
    expect(screen.getByText('Auditor')).toBeDefined();
  });

  it('renders a custom land acknowledgment when provided', () => {
    render(
      <ProfileHeader
        {...props}
        landAcknowledgment="Boon Wurrung Country"
      />
    );

    expect(screen.getByText(/Boon Wurrung Country/i)).toBeInTheDocument();
  });

  it('does not render land acknowledgment when not provided', () => {
    render(<ProfileHeader {...props} />);
    expect(screen.queryByText(/Country/i)).not.toBeInTheDocument();
  });
});
