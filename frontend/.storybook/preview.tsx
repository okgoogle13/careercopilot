import type { Preview } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React from 'react';
import { lightTheme, darkTheme } from '../src/theme/theme';

// Import global styles
import '../src/styles/theme-tokens.css';
import '../src/styles/enhanced-theme.css';
import '../src/styles/theme-utility-classes.css';

// Custom viewport configurations
const customViewports = {
  mobileS: {
    name: 'Mobile S',
    styles: {
      width: '320px',
      height: '568px',
    },
  },
  mobileM: {
    name: 'Mobile M',
    styles: {
      width: '375px',
      height: '667px',
    },
  },
  mobileL: {
    name: 'Mobile L',
    styles: {
      width: '425px',
      height: '812px',
    },
  },
  tablet: {
    name: 'Tablet',
    styles: {
      width: '768px',
      height: '1024px',
    },
  },
  laptop: {
    name: 'Laptop',
    styles: {
      width: '1024px',
      height: '768px',
    },
  },
  desktop: {
    name: 'Desktop',
    styles: {
      width: '1440px',
      height: '1024px',
    },
  },
};

const preview: Preview = {
  parameters: {
    // Global parameters
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
      sort: 'requiredFirst',
    },
    // Documentation
    docs: {
      toc: true,
      source: {
        state: 'open', // Default state for source code panel
      },
    },
    // Viewport
    viewport: {
      viewports: customViewports,
      defaultViewport: 'responsive',
    },
    // Backgrounds
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: lightTheme.palette.background.default },
        { name: 'dark', value: darkTheme.palette.background.default },
        { name: 'paper', value: lightTheme.palette.background.paper },
      ],
    },
    // Layout
    layout: 'centered',
    // A11y
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
      test: 'todo',
    },
    // Performance
    options: {
      storySort: {
        order: ['Introduction', 'Documentation', 'Components', 'Pages', 'Features'],
        method: 'alphabetical',
      },
    },
  },
  // Global decorators
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme === 'dark' ? darkTheme : lightTheme;

      return React.createElement(
        ThemeProvider,
        { theme },
        React.createElement(CssBaseline),
        React.createElement(Story)
      );
    },
  ],
  // Global types
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
