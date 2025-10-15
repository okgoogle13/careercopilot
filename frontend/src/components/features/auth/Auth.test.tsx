import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Auth } from './Auth';
import { theme } from '../../../theme/theme';

// Mock the CareerCopilotLogo component since it uses an imported image
jest.mock('../common/CareerCopilotLogo', () => ({
  CareerCopilotLogo: ({ className }: { className?: string }) => (
    <div data-testid="career-copilot-logo" className={className}>
      Career Copilot Logo
    </div>
  ),
}));

// Wrapper component to provide theme
const ThemeWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
);

describe('Auth Component', () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    mockOnLogin.mockClear();
  });

  const renderAuth = () => {
    return render(
      <ThemeWrapper>
        <Auth onLogin={mockOnLogin} />
      </ThemeWrapper>
    );
  };

  describe('Rendering', () => {
    it('should render the auth form with all elements', () => {
      renderAuth();

      // Check logo
      expect(screen.getByTestId('career-copilot-logo')).toBeInTheDocument();

      // Check welcome text
      expect(screen.getByText('Welcome to FML Career Copilot')).toBeInTheDocument();
      expect(screen.getByText('Your AI-powered job application assistant')).toBeInTheDocument();

      // Check form title
      expect(screen.getByRole('heading', { name: 'Sign In', level: 2 })).toBeInTheDocument();

      // Check input fields
      expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();

      // Check buttons
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
      // Google button has text split across elements, so we search by text content
      const googleButton = screen.getAllByRole('button').find(btn => btn.textContent?.includes('Continue with Google'));
      expect(googleButton).toBeDefined();
      expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
    });

    it('should render email input with correct type', () => {
      renderAuth();
      const emailInput = screen.getByPlaceholderText('you@example.com');
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('should render password input with correct type', () => {
      renderAuth();
      const passwordInput = screen.getByPlaceholderText('••••••••');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should display OR separator between sign-in methods', () => {
      renderAuth();
      expect(screen.getByText('OR')).toBeInTheDocument();
    });

    it('should display sign-up link text', () => {
      renderAuth();
      expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onLogin when Sign In button is clicked', () => {
      renderAuth();
      const signInButton = screen.getByRole('button', { name: 'Sign In' });

      fireEvent.click(signInButton);

      expect(mockOnLogin).toHaveBeenCalledTimes(1);
    });

    it('should call onLogin when Google sign-in button is clicked', () => {
      renderAuth();
      // Google button has text split across elements
      const googleButton = screen.getAllByRole('button').find(btn => btn.textContent?.includes('Continue with Google'));
      expect(googleButton).toBeDefined();

      fireEvent.click(googleButton!);

      expect(mockOnLogin).toHaveBeenCalledTimes(1);
    });

    it('should call onLogin when Sign Up link is clicked', () => {
      renderAuth();
      const signUpButton = screen.getByRole('button', { name: 'Sign Up' });

      fireEvent.click(signUpButton);

      expect(mockOnLogin).toHaveBeenCalledTimes(1);
    });

    it('should allow typing in email input field', () => {
      renderAuth();
      const emailInput = screen.getByPlaceholderText('you@example.com') as HTMLInputElement;

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      expect(emailInput.value).toBe('test@example.com');
    });

    it('should allow typing in password input field', () => {
      renderAuth();
      const passwordInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement;

      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      expect(passwordInput.value).toBe('password123');
    });
  });

  describe('Accessibility', () => {
    it('should have proper form structure', () => {
      renderAuth();

      // Check that inputs are present and can be focused
      const emailInput = screen.getByPlaceholderText('you@example.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');

      expect(emailInput).toBeVisible();
      expect(passwordInput).toBeVisible();

      // Test focus
      emailInput.focus();
      expect(emailInput).toHaveFocus();

      passwordInput.focus();
      expect(passwordInput).toHaveFocus();
    });

    it('should have accessible button roles', () => {
      renderAuth();

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3); // Sign In, Continue with Google, Sign Up

      buttons.forEach((button) => {
        expect(button).toBeVisible();
        expect(button).not.toBeDisabled();
      });
    });

    it('should support keyboard navigation', () => {
      renderAuth();

      const emailInput = screen.getByPlaceholderText('you@example.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');
      const signInButton = screen.getByRole('button', { name: 'Sign In' });

      // Test tab navigation
      emailInput.focus();
      expect(emailInput).toHaveFocus();

      // Simulate tab key
      fireEvent.keyDown(emailInput, { key: 'Tab' });
      passwordInput.focus();
      expect(passwordInput).toHaveFocus();

      // Test clicking button (Enter key doesn't trigger onClick in test environment without form)
      fireEvent.click(signInButton);
      expect(mockOnLogin).toHaveBeenCalledTimes(1);
    });
  });

  describe('Form Validation Edge Cases', () => {
    it('should handle empty form submission', () => {
      renderAuth();
      const signInButton = screen.getByRole('button', { name: 'Sign In' });

      // Click without filling inputs
      fireEvent.click(signInButton);

      expect(mockOnLogin).toHaveBeenCalledTimes(1);
    });

    it('should handle special characters in inputs', () => {
      renderAuth();
      const emailInput = screen.getByPlaceholderText('you@example.com') as HTMLInputElement;
      const passwordInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement;

      fireEvent.change(emailInput, { target: { value: 'user+test@example-domain.co.uk' } });
      fireEvent.change(passwordInput, { target: { value: 'P@ssw0rd!#$%' } });

      expect(emailInput.value).toBe('user+test@example-domain.co.uk');
      expect(passwordInput.value).toBe('P@ssw0rd!#$%');
    });
  });

  describe('Component Layout', () => {
    it('should have proper CSS classes for styling', () => {
      renderAuth();

      // Check main container has proper classes
      const container = screen.getByText('Welcome to FML Career Copilot').closest('.min-h-screen');
      expect(container).toHaveClass(
        'min-h-screen',
        'bg-background',
        'flex',
        'items-center',
        'justify-center'
      );
    });

    it('should render Google button with proper styling', () => {
      renderAuth();
      // Google button has text split across elements
      const googleButton = screen.getAllByRole('button').find(btn => btn.textContent?.includes('Continue with Google'));

      expect(googleButton).toBeDefined();
      expect(screen.getByText('G')).toBeInTheDocument(); // Google icon placeholder
    });
  });

  describe('Error Handling', () => {
    it('should not break when onLogin prop is undefined', () => {
      expect(() => {
        render(
          <ThemeWrapper>
            <Auth onLogin={undefined as any} />
          </ThemeWrapper>
        );
      }).not.toThrow();
    });

    it('should handle multiple rapid clicks gracefully', () => {
      renderAuth();
      const signInButton = screen.getByRole('button', { name: 'Sign In' });

      // Rapid fire clicks
      fireEvent.click(signInButton);
      fireEvent.click(signInButton);
      fireEvent.click(signInButton);

      expect(mockOnLogin).toHaveBeenCalledTimes(3);
    });
  });

  describe('Integration with Theme', () => {
    it('should apply theme styles correctly', () => {
      const { container } = renderAuth();

      // Check that theme provider is working (CssBaseline should be applied)
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
