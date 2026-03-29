import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock framer-motion
(jest as any).unstable_mockModule('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    img: (props: any) => <img {...props} />,
  },
}));

// Mock lucide-react
(jest as any).unstable_mockModule('lucide-react', () => ({
  Archive: () => <div data-testid="icon-archive" />,
  Award: () => <div data-testid="icon-award" />,
  Briefcase: () => <div data-testid="icon-briefcase" />,
  Fingerprint: () => <div data-testid="icon-fingerprint" />,
  Loader2: () => <div data-testid="icon-loader2" />,
}));

// Mock components
(jest as any).unstable_mockModule('@/components/ui', () => ({
  Strike: ({ children }: any) => <button>{children}</button>,
  StatusBadge: ({ label }: any) => <div>{label}</div>,
  Placard: ({ children, className }: any) => (
    <div
      className={className}
      data-testid="placard-container-mock"
    >
      {children}
    </div>
  ),
}));

(jest as any).unstable_mockModule('@/components/ProfileHeader', () => ({
  ProfileHeader: ({ name, bio }: any) => (
    <div data-testid="profile-header">
      <h1>{name}</h1>
      <p>{bio}</p>
    </div>
  ),
}));

(jest as any).unstable_mockModule('@/features/profile/components/ResumeUploader', () => ({
  __esModule: true,
  default: () => <div data-testid="resume-uploader">Mock Resume Uploader</div>,
}));

const { ProfileView } = await import('../../ProfileView');

describe('ProfileView', () => {
  it('renders correctly with default data', () => {
    render(<ProfileView />);

    expect(screen.getByTestId('profile-header')).toBeInTheDocument();
    expect(screen.getByText('Nishant Dougall')).toBeInTheDocument();
    expect(screen.getAllByText(/Senior Full Stack Engineer/i)[0]).toBeInTheDocument();
    expect(screen.getByTestId('resume-uploader')).toBeInTheDocument();

    // Check if initial timeline items are visible
    expect(screen.getByText('Tech Corp Inc.')).toBeInTheDocument();
    expect(screen.getByText('StartUp Studio')).toBeInTheDocument();
  });

  it('displays skill filaments', () => {
    render(<ProfileView />);

    expect(screen.getByText(/Extracted Filaments/i)).toBeInTheDocument();
    expect(screen.getByText('React.tsx')).toBeInTheDocument();
    expect(screen.getByText('Archival.Design')).toBeInTheDocument();
  });

  it('renders validation badges', () => {
    render(<ProfileView />);

    expect(screen.getByText(/Validation Badges/i)).toBeInTheDocument();
    expect(screen.getByText('🚀')).toBeInTheDocument();
    expect(screen.getByText('💻')).toBeInTheDocument();
  });
});
