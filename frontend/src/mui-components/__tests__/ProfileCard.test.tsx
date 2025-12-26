import { render, screen } from '@/test-utils';
import { ProfileCardMUI as ProfileCard } from '@/features/profile/ProfileCardMUI';

describe('ProfileCard', () => {
  const mockProfile = {
    id: '1',
    name: 'John Doe',
    role: 'Senior Developer',
    activeApplications: 12,
    atsScore: 85,
    lastUpdated: '2 days ago',
    avatarColor: 'bg-blue-500',
  };

  const mockProps = {
    ...mockProfile,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  it('renders profile information', () => {
    render(<ProfileCard {...mockProps} />);

    expect(screen.getByText(mockProfile.name)).toBeInTheDocument();
    expect(screen.getByText(mockProfile.role.toUpperCase())).toBeInTheDocument(); // Role is uppercased in component
    expect(screen.getByText(`${mockProfile.atsScore}%`)).toBeInTheDocument();
  });

  it('renders active applications count', () => {
    render(<ProfileCard {...mockProps} />);
    expect(screen.getByText(mockProfile.activeApplications.toString())).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const { user } = render(<ProfileCard {...mockProps} />);
    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);
    expect(mockProps.onEdit).toHaveBeenCalled();
  });

  it('calls onDelete when delete button is clicked', async () => {
    const { user } = render(<ProfileCard {...mockProps} />);
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);
    expect(mockProps.onDelete).toHaveBeenCalled();
  });

  it('applies selected styles', () => {
    const { container } = render(
      <ProfileCard
        {...mockProps}
        isSelected={true}
      />
    );
    // Determine if we can check specific styles or class
    // The component uses inline styles for selection, so we check for the primary color border
    const card = container.firstChild;
    expect(card).toHaveStyle('border: 2px solid var(--sys-color-primary)');
  });
});
