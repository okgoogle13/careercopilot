import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import { dirname, join } from 'path';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-onboarding'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-coverage'),
    getAbsolutePath('@storybook/addon-styling-webpack'),
    getAbsolutePath('@storybook/addon-themes'),
    getAbsolutePath('@chromatic-com/storybook'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  core: {
    disableTelemetry: true, // Disables telemetry
  },
  typescript: {
    check: true,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
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
      optimizeDeps: {
        include: ['@emotion/react', '@emotion/styled', '@mui/material', '@mui/icons-material'],
      },
      define: {
        'process.env': {},
      },
    });
  },
  docs: {
    autodocs: 'tag', // Enables autodocs for components with the 'autodocs' tag
    defaultName: 'Documentation',
  },
};

export default config;
