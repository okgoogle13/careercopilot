import type { StorybookConfig } from '@storybook/react-vite';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)',
    '../src/**/*.mdx',
    '../packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)',
    '../packages/ui/src/**/*.mdx',
  ],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-themes'),
    getAbsolutePath('@storybook/addon-docs'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  features: {
    storyStoreV7: true,
  },
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
          'react-dom'
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
      plugins: [
        ...(config.plugins || []),
      ],
    });
  },
  docs: {
    autodocs: 'tag',
    defaultName: 'Documentation',
    mdxAutodocs: true,
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
      },
    },
  },
};

export default config;
