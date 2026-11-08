/// <reference types="node" />

import { existsSync } from "fs";
import { defineConfig , devices } from "@playwright/test";

if (existsSync(".env")) {
  process.loadEnvFile();
}

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: process.env.CI ? 2 : undefined,
  retries: process.env.CI ? 2 : undefined,
  use: {
    screenshot: "on",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
 
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "reports" }],
    ["json", { outputFile: 'reports/results.json' }],
    ["allure-playwright", { outputFolder: 'allure-results' }],
  ],
});
