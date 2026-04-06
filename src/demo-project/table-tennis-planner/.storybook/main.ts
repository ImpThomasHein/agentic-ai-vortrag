import type { StorybookConfig } from '@storybook/nextjs-vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
  ],
  framework: '@storybook/nextjs-vite',
  viteFinal: async (config) => {
    config.resolve = config.resolve ?? {};
    // Use array format for aliases to support both prefix matching and specific overrides
    config.resolve.alias = [
      // Specific override: mock AuthContext for Storybook
      { find: '@/contexts/AuthContext', replacement: path.resolve(__dirname, '../stories/mocks/AuthContext.mock.tsx') },
      // General @/ alias pointing to worktree root
      { find: /^@\//, replacement: path.resolve(__dirname, '..') + '/' },
    ];
    return config;
  },
};

export default config;