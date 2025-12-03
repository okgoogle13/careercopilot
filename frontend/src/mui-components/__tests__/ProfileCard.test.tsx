import { render, screen } from '@/test-utils';
import { ProfileCard } from '@/features/profile/ProfileCardMUI';

describe('ProfileCard', () => {
  const mockProfile = {
    name: 'John Doe',
    title: 'Senior Developer',
    email: 'john@example.com',
    avatar: '/path/to/avatar.jpg',
  };

  it('renders profile information', () => {
    render(<ProfileCard profile={mockProfile} />);
    
    expect(screen.getByText(mockProfile.name)).toBeInTheDocument();
    expect(screen.getByText(mockProfile.title)).toBeInTheDocument();
    expect(screen.getByText(mockProfile.email)).toBeInTheDocument();
    
    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('alt', mockProfile.name);
    expect(avatar).toHaveAttribute('src', mockProfile.avatar);
  });

  it('handles missing optional props', () => {
    render(<ProfileCard profile={{ name: 'Test User' }} />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    // Check that title and email are not rendered when not provided
    expect(screen.queryByText('Title:')).not.toBeInTheDocument();
    expect(screen.queryByText('Email:')).not.toBeInTheDocument();
  });

  it('applies custom class names', () => {
    const { container } = render(
      <ProfileCard 
        profile={mockProfile} 
        className="custom-class" 
      />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
