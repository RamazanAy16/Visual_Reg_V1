const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 120000,
  expect: {
    timeout: 15000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.05,  // %5 fark tolere edilir (dinamik içerik için)
      animations: 'disabled',   // CSS animasyonlarını durdur
    },
  },
  use: {
    viewport: { width: 1440, height: 900 },
    headless: true,
  },
  reporter: [['list'], ['./reporter.js']],
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
  snapshotPathTemplate: '{testDir}/__snapshots__/{testName}/{arg}{ext}',
});
