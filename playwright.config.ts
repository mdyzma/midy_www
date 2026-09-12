import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://127.0.0.1:4321' },
  webServer: { command: 'node tests/preview.mjs', url: 'http://127.0.0.1:4321', reuseExistingServer: !process.env.CI },
  projects: [
    { name: 'functions', testMatch: 'contact-function.spec.ts' },
    { name: 'desktop', testMatch: 'site.spec.ts', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', testMatch: 'site.spec.ts', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
});
