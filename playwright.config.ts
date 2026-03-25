import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración global de Playwright.
 * - projects: separa pruebas API (carpeta 1-Integration_Test) y E2E UI (2-E2E_Test).
 * - trace: se guarda traza en el primer reintento (útil al depurar fallos).
 */
export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'api',
      testDir: './1-Integration_Test',
      testMatch: '**/*.spec.ts',
      use: {
        baseURL: 'https://pokeapi.co',
      },
    },
    {
      name: 'e2e',
      testDir: './2-E2E_Test',
      testMatch: '**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.saucedemo.com',
        launchOptions: {
          slowMo: Number(process.env.SLOW_MO ?? 0),
        },
      },
    },
  ],
});
