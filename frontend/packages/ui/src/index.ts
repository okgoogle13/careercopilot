// Theme
import ThemeProvider, { type ThemeProviderProps } from './theme/ThemeProvider';
import theme from './theme/theme';

// Components
import Button, { type ButtonProps, type ButtonVariant } from './components/Button/Button';

// Types
export type { ThemeProviderProps, ButtonProps, ButtonVariant };

// Theme
export { ThemeProvider, theme };

// Components
export { Button };

export default {
  ThemeProvider,
  theme,
  Button,
};
