import type { StorybookConfig } from '@storybook/react-vite';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { mergeConfig } from 'vite';

// Get the directory name in ESM
const __dirname = dirname(fileURLToPath(import.meta.url));

// For ESM + Vite we can reference addon package names directly.

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)',
    '../src/**/*.mdx',
    '../packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)',
    '../packages/ui/src/**/*.mdx',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  features: {},
  core: {
    disableTelemetry: true,
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      compilerOptions: {
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
      },
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules\/(?!@mui)/.test(prop.parent.fileName) : true,
    },
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      // Custom Vite configuration
      resolve: {
        alias: {
          // Add any necessary aliases here
          '@': resolve(__dirname, '../src'),
        },
      },
      optimizeDeps: {
        include: [
          '@emotion/react',
          '@emotion/styled',
          '@mui/material',
          '@mui/icons-material',
          '@storybook/mdx2-csf',
          '@mdx-js/react',
          'react',
          'react-dom',
        ],
        esbuildOptions: {
          // Node.js global to browser globalThis
          define: {
            global: 'globalThis',
          },
        },
      },
      define: {
        'process.env': {},
        global: 'window',
      },
      // Add MDX plugin
      plugins: [...(config.plugins || [])],
    });
  },
  docs: {
    autodocs: 'tag',
    defaultName: 'Documentation',
  },
};

export default config;
