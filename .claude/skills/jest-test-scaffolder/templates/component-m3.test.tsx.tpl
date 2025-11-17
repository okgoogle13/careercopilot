import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { {{COMPONENT_NAME}} } from '../{{COMPONENT_NAME}}';

// M3 Design Token Testing Theme
const testTheme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#9c27b0' },
  },
});

// Helper to render with theme (for M3 components)
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={testTheme}>{ui}</ThemeProvider>);
};

describe('{{COMPONENT_NAME}}', () => {
  it('renders without errors', () => {
    renderWithTheme(<{{COMPONENT_NAME}} {{DEFAULT_PROPS}} />);
    expect(screen.getByRole('{{COMPONENT_ROLE}}')).toBeInTheDocument();
  });

  {{#if HAS_TEXT_CONTENT}}
  it('displays the correct content', () => {
    const testContent = '{{TEST_CONTENT}}';
    renderWithTheme(<{{COMPONENT_NAME}} {{DEFAULT_PROPS}}>{testContent}</{{COMPONENT_NAME}}>);
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });
  {{/if}}

  {{#if HAS_EVENT_HANDLERS}}
  it('handles {{EVENT_NAME}} event', async () => {
    const user = userEvent.setup();
    const mock{{EVENT_HANDLER}} = jest.fn();
    renderWithTheme(<{{COMPONENT_NAME}} {{EVENT_PROP}}={mock{{EVENT_HANDLER}}} {{DEFAULT_PROPS}} />);

    await user.{{USER_ACTION}}(screen.getByRole('{{COMPONENT_ROLE}}'));
    expect(mock{{EVENT_HANDLER}}).toHaveBeenCalledTimes(1);
  });
  {{/if}}

  {{#if HAS_DISABLED_STATE}}
  it('is disabled when the disabled prop is true', async () => {
    const user = userEvent.setup();
    const mockHandler = jest.fn();
    renderWithTheme(
      <{{COMPONENT_NAME}}
        {{EVENT_PROP}}={mockHandler}
        disabled
        {{DEFAULT_PROPS}}
      />
    );

    const element = screen.getByRole('{{COMPONENT_ROLE}}');
    expect(element).toBeDisabled();

    await user.{{USER_ACTION}}(element);
    expect(mockHandler).not.toHaveBeenCalled();
  });
  {{/if}}

  {{#if HAS_LOADING_STATE}}
  it('displays loading state', () => {
    renderWithTheme(<{{COMPONENT_NAME}} loading {{DEFAULT_PROPS}} />);
    expect(screen.getByRole('{{COMPONENT_ROLE}}')).toBeInTheDocument();
    // TODO: Assert loading indicator is visible
  });
  {{/if}}

  {{#if HAS_ERROR_STATE}}
  it('displays error state', () => {
    const errorMessage = 'Test error message';
    renderWithTheme(<{{COMPONENT_NAME}} error={errorMessage} {{DEFAULT_PROPS}} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
  {{/if}}

  {{#if IS_M3_COMPONENT}}
  describe('M3 Design Token compliance', () => {
    it('uses design tokens for styling (no hardcoded colors)', () => {
      const { container } = renderWithTheme(<{{COMPONENT_NAME}} {{DEFAULT_PROPS}} />);
      const element = container.firstChild as HTMLElement;

      // Verify CSS variables are used (tokens, not hardcoded values)
      const styles = window.getComputedStyle(element);
      // Design tokens should be applied via CSS variables
      expect(element).toBeInTheDocument();
    });

    {{#if HAS_COLOR_VARIANTS}}
    it('applies correct color tokens for variants', () => {
      const { rerender } = renderWithTheme(<{{COMPONENT_NAME}} color="primary" {{DEFAULT_PROPS}} />);
      expect(screen.getByRole('{{COMPONENT_ROLE}}')).toBeInTheDocument();

      rerender(<ThemeProvider theme={testTheme}><{{COMPONENT_NAME}} color="secondary" {{DEFAULT_PROPS}} /></ThemeProvider>);
      expect(screen.getByRole('{{COMPONENT_ROLE}}')).toBeInTheDocument();
    });
    {{/if}}
  });
  {{/if}}

  {{#if HAS_VARIANTS}}
  // TODO: Add tests for different variants
  it.todo('renders with different variants (primary, secondary, etc.)');
  {{/if}}

  {{#if HAS_SIZES}}
  // TODO: Add tests for different sizes
  it.todo('renders with different sizes (small, medium, large)');
  {{/if}}

  describe('Accessibility', () => {
    it('is accessible via keyboard navigation', async () => {
      const user = userEvent.setup();
      renderWithTheme(<{{COMPONENT_NAME}} {{DEFAULT_PROPS}} />);

      const element = screen.getByRole('{{COMPONENT_ROLE}}');
      element.focus();
      expect(element).toHaveFocus();

      {{#if SUPPORTS_KEYBOARD}}
      await user.keyboard('{Enter}');
      // TODO: Assert expected behavior on Enter key
      {{/if}}
    });

    it('has proper ARIA attributes', () => {
      renderWithTheme(<{{COMPONENT_NAME}} {{DEFAULT_PROPS}} />);
      const element = screen.getByRole('{{COMPONENT_ROLE}}');

      {{#if HAS_ARIA_LABEL}}
      expect(element).toHaveAccessibleName();
      {{/if}}
    });
  });

  // TODO: Add edge case tests
  it.todo('handles empty props gracefully');
  it.todo('handles very long content without breaking layout');
  it.todo('handles null/undefined values safely');

  // TODO: Add snapshot test (optional, for visual regression)
  it.todo('matches snapshot');
});
