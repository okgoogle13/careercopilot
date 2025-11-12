import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import {
  EmptyState,
  NoResultsFound,
  ErrorState,
  EmptyStateProps,
} from '../EmptyState';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import InfoIcon from '@mui/icons-material/Info';

// Wrapper component to provide Material-UI theme context
const theme = createTheme();
const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {component}
    </ThemeProvider>
  );
};

describe('EmptyState', () => {
  describe('Title Rendering', () => {
    it('renders title correctly', () => {
      const title = 'No items available';
      renderWithTheme(<EmptyState title={title} />);

      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
    });
  });

  describe('Description Rendering', () => {
    it('renders description when provided as string', () => {
      const description = 'Please try again later';
      renderWithTheme(
        <EmptyState title="Empty" description={description} />
      );

      expect(screen.getByText(description)).toBeInTheDocument();
    });

    it('renders description when provided as ReactNode', () => {
      const description = <div>Custom description content</div>;
      renderWithTheme(
        <EmptyState title="Empty" description={description} />
      );

      expect(screen.getByText('Custom description content')).toBeInTheDocument();
    });

    it('does not render description when not provided', () => {
      renderWithTheme(<EmptyState title="Empty" />);

      // Verify no additional paragraph text is rendered
      const headings = screen.queryAllByRole('heading');
      expect(headings).toHaveLength(1); // Only the title
    });
  });

  describe('Icon Rendering', () => {
    it('renders icon when provided', () => {
      renderWithTheme(
        <EmptyState title="Empty" icon={<InfoIcon data-testid="test-icon" />} />
      );

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('does not render icon wrapper when icon is not provided', () => {
      const { container } = renderWithTheme(<EmptyState title="Empty" />);

      // The icon should not be in the document
      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
    });
  });

  describe('Action Button', () => {
    it('renders action button with correct label', () => {
      const actionLabel = 'Try Again';
      const mockClick = jest.fn();

      renderWithTheme(
        <EmptyState
          title="Empty"
          action={{
            label: actionLabel,
            onClick: mockClick,
          }}
        />
      );

      const button = screen.getByRole('button', { name: actionLabel });
      expect(button).toBeInTheDocument();
    });

    it('calls action.onClick when button clicked', async () => {
      const user = userEvent.setup();
      const mockClick = jest.fn();

      renderWithTheme(
        <EmptyState
          title="Empty"
          action={{
            label: 'Click me',
            onClick: mockClick,
          }}
        />
      );

      const button = screen.getByRole('button', { name: 'Click me' });
      await user.click(button);

      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    it('renders action button with text variant', () => {
      const mockClick = jest.fn();

      renderWithTheme(
        <EmptyState
          title="Empty"
          action={{
            label: 'Text Button',
            onClick: mockClick,
            variant: 'text',
          }}
        />
      );

      const button = screen.getByRole('button', { name: 'Text Button' });
      expect(button).toHaveClass('MuiButton-text');
    });

    it('renders action button with outlined variant', () => {
      const mockClick = jest.fn();

      renderWithTheme(
        <EmptyState
          title="Empty"
          action={{
            label: 'Outlined Button',
            onClick: mockClick,
            variant: 'outlined',
          }}
        />
      );

      const button = screen.getByRole('button', { name: 'Outlined Button' });
      expect(button).toHaveClass('MuiButton-outlined');
    });

    it('renders action button with contained variant', () => {
      const mockClick = jest.fn();

      renderWithTheme(
        <EmptyState
          title="Empty"
          action={{
            label: 'Contained Button',
            onClick: mockClick,
            variant: 'contained',
          }}
        />
      );

      const button = screen.getByRole('button', { name: 'Contained Button' });
      expect(button).toHaveClass('MuiButton-contained');
    });

    it('renders action button with primary color', () => {
      const mockClick = jest.fn();

      renderWithTheme(
        <EmptyState
          title="Empty"
          action={{
            label: 'Primary',
            onClick: mockClick,
            color: 'primary',
          }}
        />
      );

      const button = screen.getByRole('button', { name: 'Primary' });
      expect(button).toHaveClass('MuiButton-colorPrimary');
    });

    it('renders action button with secondary color', () => {
      const mockClick = jest.fn();

      renderWithTheme(
        <EmptyState
          title="Empty"
          action={{
            label: 'Secondary',
            onClick: mockClick,
            color: 'secondary',
          }}
        />
      );

      const button = screen.getByRole('button', { name: 'Secondary' });
      expect(button).toHaveClass('MuiButton-colorSecondary');
    });

    it('renders action button with error color', () => {
      const mockClick = jest.fn();

      renderWithTheme(
        <EmptyState
          title="Empty"
          action={{
            label: 'Error',
            onClick: mockClick,
            color: 'error',
          }}
        />
      );

      const button = screen.getByRole('button', { name: 'Error' });
      expect(button).toHaveClass('MuiButton-colorError');
    });

    it('renders action button with startIcon', () => {
      const mockClick = jest.fn();

      renderWithTheme(
        <EmptyState
          title="Empty"
          action={{
            label: 'With Icon',
            onClick: mockClick,
            startIcon: <InfoIcon data-testid="action-icon" />,
          }}
        />
      );

      expect(screen.getByTestId('action-icon')).toBeInTheDocument();
    });

    it('does not render action button when action is not provided', () => {
      renderWithTheme(<EmptyState title="Empty" />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('Component Variant', () => {
    it('renders with plain variant by default', () => {
      const { container } = renderWithTheme(<EmptyState title="Empty" />);

      const box = container.querySelector('[style*="flex"]');
      expect(box).toBeInTheDocument();
    });

    it('renders with outlined variant', () => {
      const { container } = renderWithTheme(
        <EmptyState title="Empty" variant="outlined" />
      );

      // Check that the outlined styles are applied
      const box = container.firstChild as HTMLElement;
      expect(box).toHaveStyle({
        display: 'flex',
        flexDirection: 'column',
      });
    });

    it('renders with contained variant', () => {
      const { container } = renderWithTheme(
        <EmptyState title="Empty" variant="contained" />
      );

      // Check that the component renders with contained variant
      const box = container.firstChild as HTMLElement;
      expect(box).toHaveStyle({
        display: 'flex',
        flexDirection: 'column',
      });
    });
  });

  describe('MaxWidth Constraint', () => {
    it('applies default maxWidth of 400px', () => {
      const { container } = renderWithTheme(<EmptyState title="Empty" />);

      const box = container.firstChild as HTMLElement;
      expect(box).toHaveStyle({ maxWidth: '400px' });
    });

    it('applies custom maxWidth as number', () => {
      const { container } = renderWithTheme(
        <EmptyState title="Empty" maxWidth={600} />
      );

      const box = container.firstChild as HTMLElement;
      expect(box).toHaveStyle({ maxWidth: '600px' });
    });

    it('applies custom maxWidth as string', () => {
      const { container } = renderWithTheme(
        <EmptyState title="Empty" maxWidth="90%" />
      );

      const box = container.firstChild as HTMLElement;
      expect(box).toHaveStyle({ maxWidth: '90%' });
    });
  });

  describe('Children Rendering', () => {
    it('renders children when provided', () => {
      renderWithTheme(
        <EmptyState title="Empty">
          <div data-testid="custom-child">Custom content</div>
        </EmptyState>
      );

      expect(screen.getByTestId('custom-child')).toBeInTheDocument();
      expect(screen.getByText('Custom content')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      renderWithTheme(
        <EmptyState title="Empty">
          <div data-testid="child-1">First child</div>
          <div data-testid="child-2">Second child</div>
        </EmptyState>
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });

    it('does not render children section when children not provided', () => {
      renderWithTheme(<EmptyState title="Empty" />);

      expect(screen.queryByTestId('custom-child')).not.toBeInTheDocument();
    });
  });

  describe('Custom SX Props', () => {
    it('applies custom sx props', () => {
      const { container } = renderWithTheme(
        <EmptyState title="Empty" sx={{ p: 8 }} />
      );

      const box = container.firstChild as HTMLElement;
      expect(box).toHaveStyle({ padding: '64px' }); // MUI spacing scale: 8 * 8px
    });
  });

  describe('NoResultsFound Preset', () => {
    it('renders with default "No items found" when no searchQuery provided', () => {
      renderWithTheme(<NoResultsFound />);

      expect(screen.getByText('No items found')).toBeInTheDocument();
      expect(
        screen.getByText(
          'There are no items to display. Check back later or add a new item.'
        )
      ).toBeInTheDocument();
    });

    it('renders with "No results found" when searchQuery is provided', () => {
      renderWithTheme(<NoResultsFound searchQuery="test query" />);

      expect(screen.getByText('No results found')).toBeInTheDocument();
    });

    it('displays search query in description', () => {
      const searchQuery = 'JavaScript developer';
      renderWithTheme(<NoResultsFound searchQuery={searchQuery} />);

      expect(
        screen.getByText(
          new RegExp(`No items match "${searchQuery}".`, 'i')
        )
      ).toBeInTheDocument();
    });

    it('renders "Clear search" button when onClearSearch is provided', () => {
      const mockClearSearch = jest.fn();

      renderWithTheme(
        <NoResultsFound
          searchQuery="test"
          onClearSearch={mockClearSearch}
        />
      );

      expect(
        screen.getByRole('button', { name: 'Clear search' })
      ).toBeInTheDocument();
    });

    it('calls onClearSearch when "Clear search" button is clicked', async () => {
      const user = userEvent.setup();
      const mockClearSearch = jest.fn();

      renderWithTheme(
        <NoResultsFound
          searchQuery="test"
          onClearSearch={mockClearSearch}
        />
      );

      const button = screen.getByRole('button', { name: 'Clear search' });
      await user.click(button);

      expect(mockClearSearch).toHaveBeenCalledTimes(1);
    });

    it('does not render action button when onClearSearch is not provided', () => {
      renderWithTheme(<NoResultsFound searchQuery="test" />);

      expect(
        screen.queryByRole('button', { name: 'Clear search' })
      ).not.toBeInTheDocument();
    });

    it('applies outlined variant by default', () => {
      const { container } = renderWithTheme(<NoResultsFound />);

      const box = container.firstChild as HTMLElement;
      expect(box).toHaveStyle({
        display: 'flex',
        flexDirection: 'column',
      });
    });

    it('accepts additional props', () => {
      renderWithTheme(
        <NoResultsFound
          searchQuery="test"
          icon={<InfoIcon data-testid="custom-icon" />}
        />
      );

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  describe('ErrorState Preset', () => {
    it('renders with "Something went wrong" title', () => {
      renderWithTheme(<ErrorState />);

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('displays error message from string', () => {
      const errorMessage = 'Network connection failed';
      renderWithTheme(<ErrorState error={errorMessage} />);

      expect(screen.getByText(new RegExp(errorMessage))).toBeInTheDocument();
    });

    it('displays error message from Error object', () => {
      const error = new Error('Database query timeout');
      renderWithTheme(<ErrorState error={error} />);

      expect(
        screen.getByText(new RegExp('Database query timeout'))
      ).toBeInTheDocument();
    });

    it('renders "Retry" button when onRetry is provided', () => {
      const mockRetry = jest.fn();

      renderWithTheme(
        <ErrorState error="Test error" onRetry={mockRetry} />
      );

      expect(
        screen.getByRole('button', { name: 'Retry' })
      ).toBeInTheDocument();
    });

    it('calls onRetry when "Retry" button is clicked', async () => {
      const user = userEvent.setup();
      const mockRetry = jest.fn();

      renderWithTheme(
        <ErrorState error="Test error" onRetry={mockRetry} />
      );

      const button = screen.getByRole('button', { name: 'Retry' });
      await user.click(button);

      expect(mockRetry).toHaveBeenCalledTimes(1);
    });

    it('does not render action button when onRetry is not provided', () => {
      renderWithTheme(<ErrorState error="Test error" />);

      expect(
        screen.queryByRole('button', { name: 'Retry' })
      ).not.toBeInTheDocument();
    });

    it('renders error icon', () => {
      const { container } = renderWithTheme(
        <ErrorState error="Test error" />
      );

      // Check that an SVG icon is rendered
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('displays generic message for unknown error', () => {
      renderWithTheme(<ErrorState error={new Error()} />);

      expect(
        screen.getByText(/An unknown error occurred/)
      ).toBeInTheDocument();
    });

    it('applies outlined variant', () => {
      const { container } = renderWithTheme(
        <ErrorState error="Test error" />
      );

      const box = container.firstChild as HTMLElement;
      expect(box).toHaveStyle({
        display: 'flex',
        flexDirection: 'column',
      });
    });

    it('accepts additional props', () => {
      renderWithTheme(
        <ErrorState
          error="Test error"
          maxWidth={500}
          children={<div data-testid="error-extra">Extra content</div>}
        />
      );

      expect(screen.getByTestId('error-extra')).toBeInTheDocument();
    });
  });

  describe('Integration Tests', () => {
    it('renders complete EmptyState with all features', () => {
      const mockClick = jest.fn();

      renderWithTheme(
        <EmptyState
          title="Complete Example"
          description="This is a description"
          icon={<InfoIcon data-testid="full-icon" />}
          action={{
            label: 'Action',
            onClick: mockClick,
            variant: 'outlined',
            color: 'primary',
            startIcon: <InfoIcon data-testid="action-icon" />,
          }}
          maxWidth={500}
          variant="outlined"
        >
          <div data-testid="additional">Additional content</div>
        </EmptyState>
      );

      expect(screen.getByText('Complete Example')).toBeInTheDocument();
      expect(screen.getByText('This is a description')).toBeInTheDocument();
      expect(screen.getByTestId('full-icon')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
      expect(screen.getByTestId('action-icon')).toBeInTheDocument();
      expect(screen.getByTestId('additional')).toBeInTheDocument();
    });

    it('handles rapid button clicks', async () => {
      const user = userEvent.setup();
      const mockClick = jest.fn();

      renderWithTheme(
        <EmptyState
          title="Empty"
          action={{
            label: 'Click',
            onClick: mockClick,
          }}
        />
      );

      const button = screen.getByRole('button', { name: 'Click' });

      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(mockClick).toHaveBeenCalledTimes(3);
    });

    it('renders multiple EmptyState components independently', () => {
      const { rerender } = renderWithTheme(
        <EmptyState title="First" />
      );

      expect(screen.getByText('First')).toBeInTheDocument();

      rerender(
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <EmptyState title="Second" />
        </ThemeProvider>
      );

      expect(screen.getByText('Second')).toBeInTheDocument();
    });
  });
});
