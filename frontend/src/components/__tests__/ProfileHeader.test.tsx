import { render, screen } from '@testing-library/react';
import { ProfileHeader } from '../ProfileHeader';
import React from 'react';

describe('ProfileHeader', () => {
  const props = {
    name: 'Nishant Dougall',
    bio: 'Architect',
    identityTags: ['Engineer', 'Auditor']
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

  it('shows the default land acknowledgment and fallback initial when no avatar is provided', () => {
    render(<ProfileHeader {...props} />);

    expect(screen.getByText(/Acknowledging: Wurundjeri Woi-wurrung Country/i)).toBeInTheDocument();
    expect(screen.getByText('N')).toBeInTheDocument();
  });

  it('renders a custom land acknowledgment and avatar image when provided', () => {
    render(
      <ProfileHeader
        {...props}
        avatarUrl="https://example.com/avatar.jpg"
        landAcknowledgment="Boon Wurrung Country"
      />
    );

    expect(screen.getByText(/Acknowledging: Boon Wurrung Country/i)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Nishant Dougall' })).toHaveAttribute(
      'src',
      'https://example.com/avatar.jpg'
    );
  });
});
