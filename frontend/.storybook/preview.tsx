import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import type { Preview } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../src/context/AuthContext';
import '../src/index.css';
import '../src/theme/kerala-rage.css';

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
      default: 'dark',
      values: [
        { name: 'light', value: '#f8f9fa' },
        { name: 'dark', value: '#121212' },
      ],
    },
    options: {
      storySort: {
        order: ['Documentation', 'Components', 'Features', 'Pages', '*'],
      },
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
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <AuthProvider>
          <div
            style={{
              backgroundColor: '#121212',
              minHeight: '100vh',
              padding: '20px',
              color: '#E6E1E5',
            }}
          >
            <Story />
          </div>
        </AuthProvider>
      </BrowserRouter>
    ),
  ],
};

export default preview;
