import type { Preview } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React from 'react';
import { lightTheme, darkTheme } from '../src/theme/theme';

// Import global styles
import '../src/styles/theme-tokens.css';
import '../src/styles/enhanced-theme.css';
import '../src/styles/theme-utility-classes.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    docs: {
      toc: true,
    },

    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#FFFBFE',
        },
        {
          name: 'dark',
          value: '#1C1B1F',
        },
      ],
    },

    viewport: {
      viewports: {
        mobile1: {
          name: 'Mobile S',
          styles: {
            width: '320px',
            height: '568px',
          },
        },
        mobile2: {
          name: 'Mobile M',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        mobile3: {
          name: 'Mobile L',
          styles: {
            width: '414px',
            height: '896px',
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
            height: '900px',
          },
        },
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
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
};

export default preview;
