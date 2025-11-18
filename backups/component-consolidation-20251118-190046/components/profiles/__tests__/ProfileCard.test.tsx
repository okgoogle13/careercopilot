import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Button, Chip } from '@mui/material';

// Mock ProfileCard component
const ProfileCard = ({
  name,
  title,
  atsScore,
  tags,
  onEdit,
  onDelete,
  isActive,
}: {
  name: string;
  title: string;
  atsScore: number;
  tags?: string[];
  onEdit?: () => void;
  onDelete?: () => void;
  isActive?: boolean;
}) => (
  <Card>
    <CardContent>
      <Typography variant="h6">{name}</Typography>
      <Typography variant="subtitle2">{title}</Typography>
      <Typography>ATS Score: {atsScore}%</Typography>
      {isActive && <Chip label="Active" color="primary" size="small" />}
      {tags && tags.map((tag) => <Chip key={tag} label={tag} size="small" />)}
      <Button onClick={onEdit}>Edit</Button>
      <Button onClick={onDelete} color="error">Delete</Button>
    </CardContent>
  </Card>
);

const mockTheme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('ProfileCard', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const defaultProps = {
    name: 'John Doe',
    title: 'Senior Software Engineer',
    atsScore: 92,
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
  };

  beforeEach(() => {
    mockOnEdit.mockClear();
    mockOnDelete.mockClear();
  });

  it('renders without errors', () => {
    renderWithTheme(<ProfileCard {...defaultProps} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('displays the profile name', () => {
    renderWithTheme(<ProfileCard {...defaultProps} name="Jane Smith" />);
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('displays the profile title', () => {
    renderWithTheme(<ProfileCard {...defaultProps} title="Product Manager" />);
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
  });

  it('displays ATS score', () => {
    renderWithTheme(<ProfileCard {...defaultProps} atsScore={88} />);
    expect(screen.getByText('ATS Score: 88%')).toBeInTheDocument();
  });

  it('shows Active badge when isActive is true', () => {
    renderWithTheme(<ProfileCard {...defaultProps} isActive={true} />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('does not show Active badge when isActive is false', () => {
    renderWithTheme(<ProfileCard {...defaultProps} isActive={false} />);
    expect(screen.queryByText('Active')).not.toBeInTheDocument();
  });

  it('displays tags when provided', () => {
    const tags = ['React', 'TypeScript', 'Node.js'];
    renderWithTheme(<ProfileCard {...defaultProps} tags={tags} />);

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  it('calls onEdit when Edit button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ProfileCard {...defaultProps} />);

    const editButton = screen.getByText('Edit');
    await user.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when Delete button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ProfileCard {...defaultProps} />);

    const deleteButton = screen.getByText('Delete');
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('renders Edit and Delete buttons', () => {
    renderWithTheme(<ProfileCard {...defaultProps} />);
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  // TODO: Add visual tests
  it.todo('highlights card when active');

  // TODO: Add accessibility tests
  it.todo('is accessible via keyboard navigation');

  // TODO: Add edge case tests
  it.todo('handles very long names and titles');
  it.todo('handles large number of tags');
});
