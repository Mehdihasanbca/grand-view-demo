/**
 * GRAND VIEW — Playwright configuration (dev-only test tooling).
 *
 * - Tests the GENERATED static site in dist/ (rebuilt by tests/global-setup.js).
 * - Starts a temporary zero-dependency local server (tools/serve.mjs) on
 *   127.0.0.1:8931, waits until it responds, and stops ONLY the server process
 *   it started. An already-running user server on the same port is reused and
 *   never terminated (reuseExistingServer).
 * - Headless Chromium only. ESM config (package.json has "type": "module").
 * - Local development only. Never publishes anything.
 */
import { defineConfig } from '@playwright/test';

const PORT = Number(process.env.GV_TEST_PORT || '8931');

export default defineConfig({
  testDir: 'tests',
  timeout: 60_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      animations: 'disabled',
      maxDiffPixelRatio: 0.005,
    },
  },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'test-results/report' }],
  ],
  outputDir: 'test-results/artifacts',
  globalSetup: 'tests/global-setup.js',
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: `node tools/serve.mjs --dir dist --port ${PORT}`,
    url: `http://127.0.0.1:${PORT}/index.html`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
