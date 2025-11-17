import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { {{COMPONENT_NAME}} } from '../{{COMPONENT_NAME}}';

// Mock dependencies
{{#if HAS_API_CALLS}}
jest.mock('{{API_MODULE}}', () => ({
  {{API_FUNCTION}}: jest.fn(),
}));
{{/if}}

{{#if HAS_NAVIGATION}}
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
{{/if}}

{{#if HAS_CONTEXT}}
// Mock context provider
const mockContextValue = {
  {{CONTEXT_VALUES}}
};
{{/if}}

const testTheme = createTheme();

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={testTheme}>
      {{#if HAS_CONTEXT}}
      <{{CONTEXT_PROVIDER}} value={mockContextValue}>
        {ui}
      </{{CONTEXT_PROVIDER}}>
      {{else}}
      {ui}
      {{/if}}
    </ThemeProvider>
  );
};

describe('{{COMPONENT_NAME}} - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Complete user flow', () => {
    it('completes the full {{FLOW_NAME}} workflow', async () => {
      const user = userEvent.setup();
      renderWithProviders(<{{COMPONENT_NAME}} />);

      // Step 1: {{STEP_1_DESCRIPTION}}
      const {{STEP_1_ELEMENT}} = screen.getByRole('{{STEP_1_ROLE}}', { name: /{{STEP_1_TEXT}}/i });
      await user.click({{STEP_1_ELEMENT}});

      // Step 2: {{STEP_2_DESCRIPTION}}
      {{#if STEP_2_IS_ASYNC}}
      await waitFor(() => {
        expect(screen.getByRole('{{STEP_2_ROLE}}')).toBeInTheDocument();
      });
      {{else}}
      expect(screen.getByRole('{{STEP_2_ROLE}}')).toBeInTheDocument();
      {{/if}}

      {{#if HAS_STEP_3}}
      // Step 3: {{STEP_3_DESCRIPTION}}
      const {{STEP_3_ELEMENT}} = screen.getByRole('{{STEP_3_ROLE}}');
      await user.{{STEP_3_ACTION}}({{STEP_3_ELEMENT}});
      {{/if}}

      // Assert final state
      await waitFor(() => {
        expect({{FINAL_ASSERTION}}).toBeTruthy();
      });
    });
  });

  {{#if HAS_API_CALLS}}
  describe('API integration', () => {
    it('fetches and displays data from API', async () => {
      const mockData = {{MOCK_API_RESPONSE}};
      ({{API_FUNCTION}} as jest.Mock).mockResolvedValue(mockData);

      renderWithProviders(<{{COMPONENT_NAME}} />);

      await waitFor(() => {
        expect({{API_FUNCTION}}).toHaveBeenCalledWith({{API_CALL_ARGS}});
      });

      await waitFor(() => {
        expect(screen.getByText(mockData.{{DISPLAY_FIELD}})).toBeInTheDocument();
      });
    });

    it('handles API errors gracefully', async () => {
      const mockError = new Error('API Error');
      ({{API_FUNCTION}} as jest.Mock).mockRejectedValue(mockError);

      renderWithProviders(<{{COMPONENT_NAME}} />);

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });

    it('shows loading state while fetching', async () => {
      ({{API_FUNCTION}} as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      renderWithProviders(<{{COMPONENT_NAME}} />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });
    });
  });
  {{/if}}

  {{#if HAS_NAVIGATION}}
  describe('Navigation', () => {
    it('navigates to correct route on {{NAVIGATION_TRIGGER}}', async () => {
      const user = userEvent.setup();
      renderWithProviders(<{{COMPONENT_NAME}} />);

      const navElement = screen.getByRole('{{NAV_ELEMENT_ROLE}}', { name: /{{NAV_ELEMENT_TEXT}}/i });
      await user.click(navElement);

      expect(mockNavigate).toHaveBeenCalledWith('{{EXPECTED_ROUTE}}');
    });
  });
  {{/if}}

  {{#if HAS_FORM_SUBMISSION}}
  describe('Form submission', () => {
    it('submits form with valid data', async () => {
      const user = userEvent.setup();
      const mockSubmit = jest.fn();
      renderWithProviders(<{{COMPONENT_NAME}} onSubmit={mockSubmit} />);

      // Fill form fields
      {{#each FORM_FIELDS}}
      await user.type(
        screen.getByLabelText(/{{this.label}}/i),
        '{{this.testValue}}'
      );
      {{/each}}

      // Submit form
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith({
          {{#each FORM_FIELDS}}
          {{this.name}}: '{{this.testValue}}',
          {{/each}}
        });
      });
    });

    it('validates form fields before submission', async () => {
      const user = userEvent.setup();
      renderWithProviders(<{{COMPONENT_NAME}} />);

      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      // Check for validation errors
      await waitFor(() => {
        expect(screen.getByText(/{{VALIDATION_ERROR_TEXT}}/i)).toBeInTheDocument();
      });
    });
  });
  {{/if}}

  {{#if HAS_STATE_PERSISTENCE}}
  describe('State management', () => {
    it('persists state across re-renders', async () => {
      const user = userEvent.setup();
      const { rerender } = renderWithProviders(<{{COMPONENT_NAME}} />);

      // Make a state change
      const input = screen.getByRole('textbox');
      await user.type(input, 'test value');

      // Re-render component
      rerender(
        <ThemeProvider theme={testTheme}>
          <{{COMPONENT_NAME}} />
        </ThemeProvider>
      );

      // State should persist
      expect(input).toHaveValue('test value');
    });
  });
  {{/if}}

  describe('Error boundaries', () => {
    it('catches and displays errors from child components', () => {
      // Mock console.error to suppress error output in tests
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      // TODO: Implement error boundary test
      expect(true).toBe(true);

      consoleError.mockRestore();
    });
  });

  describe('Performance', () => {
    it('does not cause unnecessary re-renders', async () => {
      const renderSpy = jest.fn();
      // TODO: Add render count tracking
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });
  });
});
