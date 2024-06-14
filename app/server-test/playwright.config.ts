import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  use: {
    // Configure options here
    headless: true,
    viewport: { width: 1280, height: 720 },
    screenshot: 'on',
    },
  // Define global setup and teardown, test directory, etc.
  testDir: './tests',
};

export default config;