// Theme
import ThemeProvider, { type ThemeProviderProps } from './theme/ThemeProvider';
import theme from './theme/theme';

// MUI-based Components
import Button, { type ButtonProps, type ButtonVariant } from './components/Button/Button';

// Types
export type { ThemeProviderProps, ButtonProps, ButtonVariant };

// Theme
export { ThemeProvider, theme };

// MUI Components
export { Button };

// ===== Shadcn/Radix Components =====

// Form Elements
export * from './components/input/input';
export * from './components/textarea/textarea';
export * from './components/checkbox/checkbox';
export * from './components/label/label';
export * from './components/select/select';
export * from './components/switch/switch';
export * from './components/slider/slider';
export * from './components/radio-group/radio-group';

// Layout & Structure
export * from './components/card/card';
export * from './components/separator/separator';
export * from './components/skeleton/skeleton';
export * from './components/accordion/accordion';
export * from './components/scroll-area/scroll-area';

// Feedback & Indicators
export * from './components/alert/alert';
export * from './components/badge/badge';
export * from './components/progress/progress';
export * from './components/tooltip/tooltip';

// Navigation & Menus
export * from './components/tabs/tabs';
export * from './components/breadcrumb/breadcrumb';
export * from './components/dropdown-menu/dropdown-menu';

// Overlays & Modals
export * from './components/dialog/dialog';
export * from './components/sheet/sheet';
export * from './components/popover/popover';
export * from './components/hover-card/hover-card';

// Profile & Display
export * from './components/avatar/avatar';
