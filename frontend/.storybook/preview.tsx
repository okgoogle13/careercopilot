import type { Preview } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '../src/theme/theme';
import '../src/index.css';

// Define environment interface
interface EnvironmentConfig {
  API_URL: string;
  FRONTEND_URLS: string[];
  FRONTEND_URL: string;
}

// Environment variables
const ENV: Record<string, EnvironmentConfig> = {
  STAGING: {
    API_URL: 'https://us-central1-careercopilot-staging.cloudfunctions.net/api',
    FRONTEND_URLS: [
      'https://careercopilot-staging.web.app',
      'https://careercopilot-staging.firebaseapp.com'
    ],
    FRONTEND_URL: 'https://careercopilot-staging.web.app', // Default staging URL
  },
  PRODUCTION: {
    API_URL: 'https://us-central1-careercopilot-468811.cloudfunctions.net/api',
    FRONTEND_URLS: [
      'https://careercopilot-468811.web.app',
      'https://careercopilot-468811.firebaseapp.com'
    ],
    FRONTEND_URL: 'https://careercopilot-468811.web.app', // Default production URL
  },
  DEVELOPMENT: {
    API_URL: 'http://localhost:5001/api',
    FRONTEND_URLS: ['http://localhost:3000'],
    FRONTEND_URL: 'http://localhost:3000',
  },
};

// Set the environment based on STORYBOOK_ENV or default to development
const ENV_NAME = (process.env.STORYBOOK_ENV || 'development') as keyof typeof ENV;
const ENV_CONFIG = ENV[ENV_NAME] || ENV.DEVELOPMENT;

// Set environment variables for stories
process.env.VITE_API_URL = ENV_CONFIG.API_URL;
process.env.VITE_FRONTEND_URL = ENV_CONFIG.FRONTEND_URL;

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
      expanded: true,
    },
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'responsive',
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f8f9fa' },
        { name: 'dark', value: '#212529' },
      ],
    },
    options: {
      storySort: {
        order: ['Documentation', 'Components', 'Features', 'Pages', '*'],
      },
    },
    chromatic: {
      disable: process.env.NODE_ENV !== 'production',
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    )
  ],
};

export default preview;
