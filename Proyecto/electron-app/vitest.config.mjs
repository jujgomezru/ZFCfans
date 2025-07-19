import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    projects: [
      {
        name: 'backend',
        testMatch: ['src/main/**/*.test.{js,ts}'],
        environment: 'node',
      },
      {
        name: 'frontend',
        testMatch: ['src/renderer/**/*.test.{js,ts,jsx,tsx}'],
        environment: 'jsdom',
      },
    ],
  },
});
