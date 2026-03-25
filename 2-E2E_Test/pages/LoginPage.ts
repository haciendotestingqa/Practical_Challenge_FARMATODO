import type { Page } from '@playwright/test';

/** Pantalla inicial de Saucedemo: formulario de login. */
export class LoginPage {
  constructor(private readonly page: Page) {}

  /** Abre la raíz del sitio (usa baseURL de Playwright.config.ts). */
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  /** Rellena usuario y contraseña y envía el formulario. */
  async login(username: string, password: string): Promise<void> {
    await this.page.locator('[data-test="username"]').fill(username);
    await this.page.locator('[data-test="password"]').fill(password);
    await this.page.locator('[data-test="login-button"]').click();
  }
}
