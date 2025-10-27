import { fileURLToPath } from 'node:url';
import path from 'path';

import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv, type UserConfig, PluginOption } from 'vite';
import { checker } from 'vite-plugin-checker';
import { createHtmlPlugin } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';

interface Env {
  VITE_API_URL: string;
  VITE_ENVIRONMENT: 'development' | 'staging' | 'production' | 'test';
  VITE_DEBUG: string;
}

const dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }): UserConfig => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '') as unknown as Env;
  const isProduction = env.VITE_ENVIRONMENT === 'production';
  const isDevelopment = !isProduction;
  const isTest = env.VITE_ENVIRONMENT === 'test';

  const plugins: PluginOption[] = [
    react({
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
          ...(isDevelopment ? ['babel-plugin-styled-components'] : []),
        ],
      },
    }),
    createHtmlPlugin({
      minify: isProduction,
      inject: {
        data: {
          title: 'CareerCopilot',
          description: 'AI-powered career application assistant',
          environment: env.VITE_ENVIRONMENT,
        },
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'CareerCopilot',
        short_name: 'CareerCopilot',
        description: 'AI-powered career application assistant',
        theme_color: '#1976d2',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      devOptions: {
        enabled: isDevelopment,
        type: 'module',
      },
    }),
    // Checker temporarily disabled due to ESLint 9 + eslint-plugin-storybook compatibility issues
    // Re-enable after updating eslint-plugin-storybook to support ESLint 9
    // checker({
    //   typescript: {
    //     tsconfigPath: 'tsconfig.json',
    //   },
    //   eslint: {
    //     lintCommand: 'eslint . --ext .ts,.tsx',
    //   },
    //   overlay: {
    //     initialIsOpen: false,
    //   },
    // }),
  ];

  if (isProduction) {
    plugins.push(
      visualizer({
        open: false,
        filename: 'bundle-analyzer-report.html',
        gzipSize: true,
        brotliSize: true,
      })
    );
  }

  return {
    plugins,

    // Base public path when served in production
    base: isTest ? '' : '/',

    // Resolve configuration
    resolve: {
      alias: {
        '@': path.resolve(dirname, './src'),
        '~': path.resolve(dirname, './'),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    },

    // Development server configuration
    server: {
      port: 3000,
      open: !isTest,
      strictPort: true,
      host: true,
      fs: {
        strict: true,
      },
      proxy: isDevelopment
        ? {
            '/api': {
              target: env.VITE_API_URL,
              changeOrigin: true,
              secure: false,
              rewrite: (path) => path.replace(/^\/api/, ''),
            },
          }
        : undefined,
    },

    // Build configuration
    build: {
      outDir: 'dist',
      sourcemap: isProduction ? 'hidden' : true,
      minify: isProduction ? 'esbuild' : false,
      cssMinify: isProduction,
      reportCompressedSize: isProduction,
      chunkSizeWarningLimit: 1000,
      assetsInlineLimit: 4096,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('@mui/')) {
                return 'vendor-mui';
              }
              if (id.includes('firebase/')) {
                return 'vendor-firebase';
              }
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              return 'vendor-other';
            }
            return undefined;
          },
          chunkFileNames: isProduction ? 'assets/js/[name]-[hash].js' : 'assets/js/[name].js',
          entryFileNames: isProduction ? 'assets/js/[name]-[hash].js' : 'assets/js/[name].js',
          assetFileNames: ({ name }) => {
            if (/\.[a-z0-9]+\.[cm]?js$/.test(name ?? '')) {
              return isProduction
                ? 'assets/js/[name]-[hash][extname]'
                : 'assets/js/[name][extname]';
            }
            if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(name ?? '')) {
              return 'assets/images/[name]-[hash][extname]';
            }
            if (/\.(woff|woff2|eot|ttf|otf)$/i.test(name ?? '')) {
              return 'assets/fonts/[name]-[hash][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true,
      },
    },

    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-dom/client',
        'react-router-dom',
        '@mui/material',
        '@mui/utils',
        '@emotion/react',
        '@emotion/styled',
      ],
      esbuildOptions: {
        // Enable esbuild's tree shaking
        treeShaking: true,
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis',
        },
        // Target ES2020 for better tree-shaking
        target: 'es2020',
        // Enable source maps in development
        sourcemap: isDevelopment,
      },
    },

    // Environment variables
    define: {
      __APP_VERSION__: JSON.stringify(process.env['npm_package_version']),
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.VITE_ENV': JSON.stringify(env.VITE_ENVIRONMENT),
    },

    // CSS configuration
    css: {
      devSourcemap: isDevelopment,
      modules: {
        generateScopedName: isProduction ? '[hash:base64:8]' : '[name]__[local]--[hash:base64:5]',
        localsConvention: 'camelCaseOnly',
      },
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "sass:color";
            @use "sass:math";
            @import "@/styles/_variables.scss";
            @import "@/styles/_mixins.scss";
          `,
        },
      },
    },
  };
});
