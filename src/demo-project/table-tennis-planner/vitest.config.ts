import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

import { playwright } from '@vitest/browser-playwright';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
      {
        test: {
          name: 'unit',
          include: ['components/**/*.test.ts', 'lib/**/*.test.ts', 'import/**/*.test.ts', 'hooks/**/*.test.ts'],
          environment: 'node',
          alias: {
            '@/lib/types': path.join(dirname, 'lib/types.ts'),
            '@/lib/constants': path.join(dirname, 'lib/constants.ts'),
            '@/import': path.join(dirname, 'import'),
            '@/components': path.join(dirname, 'components'),
          },
        },
      },
      {
        esbuild: {
          jsx: 'automatic',
        },
        test: {
          name: 'components',
          include: ['tests/components/**/*.test.tsx'],
          environment: 'jsdom',
          setupFiles: ['tests/components/setup.ts'],
          alias: {
            '@/components': path.join(dirname, 'components'),
            '@/hooks': path.join(dirname, 'hooks'),
            '@/lib/types': path.join(dirname, 'lib/types.ts'),
            '@/lib/constants': path.join(dirname, 'lib/constants.ts'),
          },
        },
      },
      {
        test: {
          name: 'api',
          include: ['app/api/**/*.test.ts'],
          environment: 'node',
          fileParallelism: false,
          globalSetup: ['./scripts/api-test-setup.mjs'],
          env: {
            DATABASE_URL: 'file:./prisma/dev.db',
          },
          alias: {
            '@/app': path.join(dirname, 'app'),
            '@/lib/db': path.join(dirname, 'lib/db.ts'),
            '@/lib/session': path.join(dirname, 'lib/session.ts'),
            '@/lib/types': path.join(dirname, 'lib/types.ts'),
            '@/lib/constants': path.join(dirname, 'lib/constants.ts'),
            '@/lib/push': path.join(dirname, 'lib/push.ts'),
            '@/lib/exercise-mapper': path.join(dirname, 'lib/exercise-mapper.ts'),
            '@/lib/resolveClickTtTeamName': path.join(dirname, 'lib/resolveClickTtTeamName.ts'),
            '@/lib/auth-utils': path.join(dirname, 'lib/auth-utils.ts'),
            '@/import': path.join(dirname, 'import'),
          },
        },
      },
    ],
  },
});
