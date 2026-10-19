import { defineConfig, devices } from "@playwright/test";

const authEmulator =
  process.env.PLAYWRIGHT_AUTH_EMULATOR === "true" ||
  process.argv.includes("--project=auth-emulator");
if (authEmulator) process.env.PLAYWRIGHT_AUTH_EMULATOR = "true";

export default defineConfig({
  testDir: "./tests",
  // tests/unit holds Vitest files, which Playwright's default match would also pick up.
  testMatch: authEmulator ? "**/firebase-auth.spec.ts" : "**/*.spec.ts",
  testIgnore: authEmulator ? undefined : "**/firebase-auth.spec.ts",
  fullyParallel: !authEmulator,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  // Hosted runners have 2 vCPUs; more workers only add flakiness.
  workers: authEmulator ? 1 : process.env.CI ? 2 : undefined,
  timeout: 30_000,
  // Keeps a hung run well below the 20-minute job limit in CI.
  globalTimeout: process.env.CI ? 12 * 60_000 : undefined,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  expect: {
    // Visual baselines are committed per platform (`-chromium-win32.png`).
    toHaveScreenshot: { maxDiffPixelRatio: 0.01 },
  },
  use: {
    baseURL: authEmulator ? "http://127.0.0.1:3100" : "http://127.0.0.1:3000",
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: authEmulator ? "auth-emulator" : "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: authEmulator
    ? {
        command: "pnpm dev --hostname 127.0.0.1 --port 3100",
        url: "http://127.0.0.1:3100",
        reuseExistingServer: false,
        timeout: 120_000,
        env: {
          NEXT_PUBLIC_FIREBASE_API_KEY: "emulator-only",
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "demo-auth-e2e.firebaseapp.com",
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: "demo-auth-e2e",
          NEXT_PUBLIC_FIREBASE_APP_ID: "emulator-only",
          NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR: "true",
          NEXT_PUBLIC_FIREBASE_GOOGLE_ENABLED: "true",
        },
      }
    : {
        command: "pnpm build && pnpm start",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        url: "http://127.0.0.1:3000",
      },
});
