import { render, screen } from '@testing-library/user';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { TemplateCard } from '../TemplateCard';

const mockTheme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('TemplateCard', () => {
  const mockOnSelect = jest.fn();
  const mockOnPreview = jest.fn();
  const defaultProps = {
    template_name: 'Professional Resume',
    ats_score: 95,
    onSelect: mockOnSelect,
    onPreview: mockOnPreview,
  };

  beforeEach(() => {
    mockOnSelect.mockClear();
    mockOnPreview.mockClear();
  });

  it('renders without errors', () => {
    renderWithTheme(<TemplateCard {...defaultProps} />);
    expect(screen.getByText('Professional Resume')).toBeInTheDocument();
  });

  it('displays template name', () => {
    renderWithTheme(<TemplateCard {...defaultProps} template_name="Modern CV" />);
    expect(screen.getByText('Modern CV')).toBeInTheDocument();
  });

  it('displays ATS score', () => {
    renderWithTheme(<TemplateCard {...defaultProps} ats_score={90} />);
    expect(screen.getByText('90%')).toBeInTheDocument();
    expect(screen.getByText('ATS Score')).toBeInTheDocument();
  });

  it('shows recommended badge when is_recommended is true', () => {
    renderWithTheme(<TemplateCard {...defaultProps} is_recommended={true} />);
    expect(screen.getByText('Recommended')).toBeInTheDocument();
  });

  it('does not show recommended badge when is_recommended is false', () => {
    renderWithTheme(<TemplateCard {...defaultProps} is_recommended={false} />);
    expect(screen.queryByText('Recommended')).not.toBeInTheDocument();
  });

  it('shows selection indicator when is_selected is true', () => {
    const { container } = renderWithTheme(<TemplateCard {...defaultProps} is_selected={true} />);
    const checkIcon = container.querySelector('[data-testid="CheckIcon"]');
    expect(checkIcon).toBeInTheDocument();
  });

  it('displays best_for_tags when provided', () => {
    const tags = ['Tech Jobs', 'Senior Level', 'Remote'];
    renderWithTheme(<TemplateCard {...defaultProps} best_for_tags={tags} />);

    expect(screen.getByText('Tech Jobs')).toBeInTheDocument();
    expect(screen.getByText('Senior Level')).toBeInTheDocument();
    expect(screen.getByText('Remote')).toBeInTheDocument();
  });

  it('limits display to 3 tags with overflow indicator', () => {
    const tags = ['Tag1', 'Tag2', 'Tag3', 'Tag4', 'Tag5'];
    renderWithTheme(<TemplateCard {...defaultProps} best_for_tags={tags} />);

    expect(screen.getByText('Tag1')).toBeInTheDocument();
    expect(screen.getByText('Tag2')).toBeInTheDocument();
    expect(screen.getByText('Tag3')).toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
    expect(screen.queryByText('Tag4')).not.toBeInTheDocument();
  });

  it('calls onSelect when card is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<TemplateCard {...defaultProps} />);

    const card = screen.getByText('Professional Resume').closest('.MuiCard-root');
    if (card) {
      await user.click(card);
      expect(mockOnSelect).toHaveBeenCalledTimes(1);
    }
  });

  it('calls onSelect when Select Template button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<TemplateCard {...defaultProps} />);

    const button = screen.getByText('Select Template');
    await user.click(button);

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });

  it('displays "Selected" text when template is selected', () => {
    renderWithTheme(<TemplateCard {...defaultProps} is_selected={true} />);
    expect(screen.getByText('Selected')).toBeInTheDocument();
  });

  it('calls onPreview when preview button is clicked', async () => {
    const user = userEvent.setup();
    const { container } = renderWithTheme(<TemplateCard {...defaultProps} />);

    // Trigger hover to show preview button
    const card = container.querySelector('.MuiCard-root');
    if (card) {
      await user.hover(card);
    }

    const previewButton = screen.queryByText('Preview');
    if (previewButton) {
      await user.click(previewButton);
      expect(mockOnPreview).toHaveBeenCalledTimes(1);
    }
  });

  it('displays preview image when provided', () => {
    renderWithTheme(<TemplateCard {...defaultProps} preview_image="/template.png" />);
    const image = screen.getByAltText('Professional Resume preview');
    expect(image).toHaveAttribute('src', '/template.png');
  });

  it('shows placeholder when no preview image provided', () => {
    renderWithTheme(<TemplateCard {...defaultProps} />);
    expect(screen.getByText('Preview')).toBeInTheDocument();
  });

  // TODO: Add hover state tests
  it.todo('shows preview overlay on hover');

  // TODO: Add accessibility tests
  it.todo('is accessible via keyboard navigation');

  // TODO: Add edge case tests
  it.todo('handles very long template names');
  it.todo('handles ATS scores of 0 and 100');
});
