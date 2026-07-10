import { defineConfig } from "@playwright/test";

const port = 4173;

export default defineConfig({
  testDir: "test",
  testMatch: "compat-pages.spec.ts",
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    headless: true,
  },
  webServer: {
    command: `npx serve examples/compat -l ${port}`,
    url: `http://127.0.0.1:${port}/vue3.html`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
